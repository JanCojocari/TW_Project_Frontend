// components/dashboard/paymentTab/PaymentsTab.tsx
import { useEffect, useState }    from "react";
import { Alert, Box, Snackbar, Stack, Typography } from "@mui/material";
import { useTranslation }          from "react-i18next";
import { useAuth }                 from "../../../auth/AuthContext";
import { useInvoiceDownload }      from "../../../hooks/useInvoiceDownload";
import { paymentHistoryService }   from "../../../services/paymentHistoryService";
import type { PaymentDto }         from "../../../utils/pdf/buildInvoiceData";
import PaymentRow                  from "./paymentRow.tsx";

export default function PaymentsTab() {
    const { t }           = useTranslation();
    const { currentUser } = useAuth();
    const [payments, setPayments]   = useState<PaymentDto[]>([]);
    const [loading, setLoading]     = useState(true);

    useEffect(() => {
        const userId = currentUser?.id ?? 1;
        paymentHistoryService.getByUser(userId)
            .then(setPayments)
            .catch(() => setPayments([]))
            .finally(() => setLoading(false));
    }, [currentUser]);

    const { downloadInvoice, loadingId, error, clearError } = useInvoiceDownload({
        token: localStorage.getItem("token") ?? "",
    });

    return (
        <Stack spacing={4}>
            <Typography variant="h5" fontWeight={900} sx={{ mb: 2 }}>
                {t("dashboard.payments.title")}
            </Typography>

            {loading && (
                <Typography color="text.secondary">{t("common.loading") ?? "Se încarcă..."}</Typography>
            )}

            {!loading && payments.length === 0 && (
                <Box sx={{ textAlign: "center", py: 10 }}>
                    <Typography color="text.disabled" sx={{ fontSize: "18px", fontStyle: "italic" }}>
                        {t("dashboard.payments.empty") ?? "Nu există plăți înregistrate."}
                    </Typography>
                </Box>
            )}

            <Stack spacing={2.5}>
                {payments.map((p) => (
                    <PaymentRow
                        key={p.id}
                        payment={p}
                        isLoading={loadingId === p.id}
                        onDownload={downloadInvoice}
                    />
                ))}
            </Stack>

            <Snackbar open={!!error} autoHideDuration={6000} onClose={clearError}
                      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                <Alert severity="warning" variant="filled" onClose={clearError}>
                    {error}
                </Alert>
            </Snackbar>
        </Stack>
    );
}
