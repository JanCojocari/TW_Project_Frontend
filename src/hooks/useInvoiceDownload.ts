// hooks/useInvoiceDownload.ts
// Hook cu trei scenarii:
//   1. Payment.invoiceUrl există → download direct din URL (fără generare)
//   2. Prima descărcare → generează PDF + upload la backend + salvează URL local
//   3. Eroare upload → PDF descărcat local oricum, eroare notificată

import { useState, useCallback } from "react";
import type { PaymentDto }              from "../utils/pdf/buildInvoiceData";
import { buildInvoiceData }              from "../utils/pdf/buildInvoiceData";
import {
    generateInvoicePdf,
    generateAndUploadInvoicePdf,
} from "../utils/pdf/pdfGenerator";

interface UseInvoiceDownloadReturn {
    downloadInvoice: (payment: PaymentDto) => Promise<void>;
    loadingId:       number | null;   // id-ul payment-ului în curs de procesare
    error:           string | null;
    clearError:      () => void;
}

interface UseInvoiceDownloadOptions {
    token: string;                        // JWT din AuthContext
    // Cache local invoiceUrl per paymentId — evită re-upload la același payment
    urlCache?: React.MutableRefObject<Map<number, string>>;
}

export function useInvoiceDownload(
    options: UseInvoiceDownloadOptions,
): UseInvoiceDownloadReturn {
    const { token } = options;

    const [loadingId, setLoadingId] = useState<number | null>(null);
    const [error, setError]         = useState<string | null>(null);

    // Cache în memorie: paymentId → invoiceUrl deja uploadat în sesiunea curentă
    const [urlCache] = useState(() => new Map<number, string>());

    const downloadInvoice = useCallback(
        async (payment: PaymentDto) => {
            setLoadingId(payment.id);
            setError(null);

            try {
                // ── Scenariu 1: URL deja stocat pe server (din API sau cache) ──
                const cachedUrl = payment.invoiceUrl ?? urlCache.get(payment.id);
                if (cachedUrl) {
                    window.open(cachedUrl, "_blank");
                    return;
                }

                const invoiceData = buildInvoiceData(payment);

                // ── Scenariu 2: Prima descărcare — generează + upload ──
                if (token) {
                    try {
                        const invoiceUrl = await generateAndUploadInvoicePdf(
                            invoiceData,
                            payment.id,
                            token,
                        );
                        // Salvează în cache local pentru sesiunea curentă
                        urlCache.set(payment.id, invoiceUrl);
                        return;
                    } catch (uploadErr) {
                        // ── Scenariu 3: Upload eșuat — PDF descărcat local oricum ──
                        console.warn("[Rentora] Upload factură eșuat, fallback local:", uploadErr);
                        await generateInvoicePdf(invoiceData);
                        setError("Factura a fost descărcată local, dar nu a putut fi salvată pe server.");
                        return;
                    }
                }

                // Fără token (guest) — doar download local
                await generateInvoicePdf(invoiceData);

            } catch (err) {
                console.error("[Rentora] Eroare generare factură:", err);
                setError("Nu s-a putut genera factura. Încearcă din nou.");
            } finally {
                setLoadingId(null);
            }
        },
        [token, urlCache],
    );

    return {
        downloadInvoice,
        loadingId,
        error,
        clearError: () => setError(null),
    };
}