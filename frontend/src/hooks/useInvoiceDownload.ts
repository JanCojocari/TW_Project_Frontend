// hooks/useInvoiceDownload.ts
// Genereaza PDF local si il descarca direct in browser — fara upload la backend.

import { useState, useCallback } from "react";
import type { PaymentDto }  from "../utils/pdf/buildInvoiceData";
import { buildInvoiceData } from "../utils/pdf/buildInvoiceData";
import { generateInvoicePdf } from "../utils/pdf/pdfGenerator";

interface UseInvoiceDownloadReturn {
    downloadInvoice: (payment: PaymentDto) => Promise<void>;
    loadingId:       number | null;
    error:           string | null;
    clearError:      () => void;
}

interface UseInvoiceDownloadOptions {
    token: string;
}

export function useInvoiceDownload(
    _options: UseInvoiceDownloadOptions,
): UseInvoiceDownloadReturn {
    const [loadingId, setLoadingId] = useState<number | null>(null);
    const [error, setError]         = useState<string | null>(null);

    const downloadInvoice = useCallback(async (payment: PaymentDto) => {
        setLoadingId(payment.id);
        setError(null);

        try {
            const invoiceData = buildInvoiceData(payment);
            await generateInvoicePdf(invoiceData);
        } catch (err) {
            console.error("[Rentora] Eroare generare factura:", err);
            setError("Nu s-a putut genera factura. Incearca din nou.");
        } finally {
            setLoadingId(null);
        }
    }, []);

    return {
        downloadInvoice,
        loadingId,
        error,
        clearError: () => setError(null),
    };
}