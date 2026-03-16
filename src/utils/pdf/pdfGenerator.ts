// utils/pdf/pdfGenerator.ts
// Generare PDF local (jsPDF + html2canvas) + upload blob la backend.
// Instalare: npm install jspdf html2canvas

import type { InvoiceData } from "./invoiceTypes";
import { buildInvoiceHtml } from "./invoiceTemplate";

// ── Helpers ──────────────────────────────────────────────────────────────────

async function renderToCanvas(html: string): Promise<HTMLCanvasElement> {
    const { default: html2canvas } = await import("html2canvas");

    const container = document.createElement("div");
    container.style.cssText = `
        position: fixed; top: -9999px; left: -9999px;
        width: 794px; background: white; z-index: -1;
    `;
    container.innerHTML = html;
    document.body.appendChild(container);

    try {
        await new Promise((r) => requestAnimationFrame(r));
        return await html2canvas(container, {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
            logging: false,
        });
    } finally {
        document.body.removeChild(container);
    }
}

async function buildPdfBlob(data: InvoiceData): Promise<{ blob: Blob; filename: string }> {
    const { default: jsPDF } = await import("jspdf");

    const canvas = await renderToCanvas(buildInvoiceHtml(data));
    const pdf    = new jsPDF("p", "mm", "a4");
    const pageW  = pdf.internal.pageSize.getWidth();
    const pageH  = pdf.internal.pageSize.getHeight();
    const imgW   = pageW;
    const imgH   = (canvas.height * imgW) / canvas.width;
    const img    = canvas.toDataURL("image/png");

    if (imgH <= pageH) {
        pdf.addImage(img, "PNG", 0, 0, imgW, imgH);
    } else {
        let y = 0;
        while (y < imgH) {
            pdf.addImage(img, "PNG", 0, -y, imgW, imgH);
            y += pageH;
            if (y < imgH) pdf.addPage();
        }
    }

    return {
        blob:     pdf.output("blob"),
        filename: `${data.invoiceNumber}.pdf`,
    };
}

// ── API publică ───────────────────────────────────────────────────────────────

/**
 * Generează PDF și îl descarcă local în browser.
 */
export async function generateInvoicePdf(data: InvoiceData): Promise<void> {
    const { blob, filename } = await buildPdfBlob(data);
    const url = URL.createObjectURL(blob);
    const a   = document.createElement("a");
    a.href     = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

/**
 * Generează PDF, îl descarcă local ȘI îl trimite la backend pentru stocare.
 * Returnează invoiceUrl primit de la server.
 */
export async function generateAndUploadInvoicePdf(
    data:      InvoiceData,
    paymentId: number,
    token:     string,
): Promise<string> {
    const { blob, filename } = await buildPdfBlob(data);

    // Descarcă local
    const localUrl = URL.createObjectURL(blob);
    const a        = document.createElement("a");
    a.href          = localUrl;
    a.download      = filename;
    a.click();
    URL.revokeObjectURL(localUrl);

    // Upload la backend
    const formData = new FormData();
    formData.append("file", blob, filename);

    const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:5000";
    const res    = await fetch(`${apiUrl}/api/payments/${paymentId}/invoice`, {
        method:  "POST",
        headers: { Authorization: `Bearer ${token}` },
        body:    formData,
    });

    if (!res.ok) {
        throw new Error(`Upload factură eșuat: ${res.status}`);
    }

    const { invoiceUrl } = await res.json() as { invoiceUrl: string };
    return invoiceUrl;
}