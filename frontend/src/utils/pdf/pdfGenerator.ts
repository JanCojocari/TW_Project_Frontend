// utils/pdf/pdfGenerator.ts
// Generare PDF local (jsPDF + html2canvas) — fara upload la backend.

import type { InvoiceData } from "./invoiceTypes";
import { buildInvoiceHtml } from "./invoiceTemplate";

async function renderToCanvas(html: string): Promise<HTMLCanvasElement> {
    const { default: html2canvas } = await import("html2canvas");

    // iframe izolat — nu atinge DOM-ul paginii, nu impinge niciun element
    const iframe = document.createElement("iframe");
    iframe.style.cssText = `
        position: absolute; top: 0; left: -9999px;
        width: 794px; height: 1123px;
        border: none; visibility: hidden;
    `;
    document.documentElement.appendChild(iframe);

    try {
        const iframeDoc = iframe.contentDocument!;
        iframeDoc.open();
        iframeDoc.write(html);
        iframeDoc.close();

        // asteptam ca iframe-ul sa termine render-ul
        await new Promise((r) => setTimeout(r, 300));

        return await html2canvas(iframeDoc.body, {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
            logging: false,
            windowWidth: 794,
        });
    } finally {
        document.documentElement.removeChild(iframe);
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

export async function generateInvoicePdf(data: InvoiceData): Promise<void> {
    const { blob, filename } = await buildPdfBlob(data);
    const url = URL.createObjectURL(blob);
    const a   = document.createElement("a");
    a.href     = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}