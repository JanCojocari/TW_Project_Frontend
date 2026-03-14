// components/dashboard/payments/PaymentsTab.tsx
import { Alert, Snackbar, Stack, Typography } from "@mui/material";
import { useInvoiceDownload } from "../../../hooks/useInvoiceDownload";
import { MOCK_PAYMENTS }      from "../../../mockdata/payments.ts";
import PaymentRow             from "./paymentRow.tsx";

export default function PaymentsTab() {
    // TODO: înlocuiește cu date reale → const payments = await userService.getPayments()
    const payments = MOCK_PAYMENTS;

    const { downloadInvoice, loadingId, error, clearError } = useInvoiceDownload({
        token: localStorage.getItem("token") ?? "",
    });

    return (
        <Stack spacing={4}>
            <Typography variant="h5" fontWeight={900} sx={{ mb: 2 }}>
                Arhivă Plăți & Facturi
            </Typography>

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

            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={clearError}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert severity="warning" variant="filled" onClose={clearError}>
                    {error}
                </Alert>
            </Snackbar>
        </Stack>
    );
}