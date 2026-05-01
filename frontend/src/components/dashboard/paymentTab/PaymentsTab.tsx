// components/dashboard/paymentTab/PaymentsTab.tsx
import { useEffect, useState }     from "react";
import {
    Alert, Backdrop, Box, CircularProgress,
    Snackbar, Stack, ToggleButton, ToggleButtonGroup, Typography,
} from "@mui/material";
import CallMadeIcon     from "@mui/icons-material/CallMade";
import CallReceivedIcon from "@mui/icons-material/CallReceived";
import { useTranslation }          from "react-i18next";
import { useAuth }                 from "../../../auth/AuthContext";
import { useInvoiceDownload }      from "../../../hooks/useInvoiceDownload";
import { paymentHistoryService }   from "../../../services/paymentHistoryService";
import type { PaymentDto }         from "../../../utils/pdf/buildInvoiceData";
import PaymentRow                  from "./paymentRow.tsx";

const RENTER_ROLE = 2;
type PaymentView = "sent" | "received";

export default function PaymentsTab() {
    const { t }           = useTranslation();
    const { currentUser } = useAuth();

    const isRenter = currentUser?.role === RENTER_ROLE;

    const [view, setView]               = useState<PaymentView>("sent");
    const [allPayments, setAllPayments] = useState<PaymentDto[]>([]);
    const [loading, setLoading]         = useState(true);

    useEffect(() => {
        const userId = currentUser?.id ?? 0;
        if (!userId) return;

        setLoading(true);
        paymentHistoryService.getByUser(userId)
            .then(setAllPayments)
            .catch(() => setAllPayments([]))
            .finally(() => setLoading(false));
    }, [currentUser]);

    const userId = currentUser?.id ?? 0;

    const payments: PaymentDto[] = isRenter
        ? allPayments.filter(p => p.renterId === userId)
        : view === "sent"
            ? allPayments.filter(p => p.renterId === userId)
            : allPayments.filter(p => p.ownerId  === userId);

    const { downloadInvoice, loadingId, error, clearError } = useInvoiceDownload({
        token: localStorage.getItem("token") ?? "",
    });

    const isGenerating = loadingId !== null;

    return (
        <Stack spacing={4}>

            {/* Overlay peste tot ecranul cat timp se genereaza PDF-ul */}
            <Backdrop
                open={isGenerating}
                sx={{ zIndex: 9999, flexDirection: "column", gap: 2, color: "#fff" }}
            >
                <CircularProgress color="inherit" size={48} />
                <Typography fontWeight={700} sx={{ fontSize: 16 }}>
                    {t("dashboard.payments.generating")}...
                </Typography>
            </Backdrop>

            <Box sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 2,
                mb: 1,
            }}>
                <Typography variant="h5" fontWeight={900}>
                    {t("dashboard.payments.title")}
                </Typography>

                {!isRenter && (
                    <ToggleButtonGroup
                        value={view}
                        exclusive
                        onChange={(_, val) => { if (val) setView(val); }}
                        size="small"
                        sx={{ bgcolor: "background.paper" }}
                    >
                        <ToggleButton value="sent" sx={{ px: 2, gap: 0.8, fontWeight: 700, fontSize: 13 }}>
                            <CallMadeIcon sx={{ fontSize: 16 }} />
                            {t("dashboard.payments.sent")}
                        </ToggleButton>
                        <ToggleButton value="received" sx={{ px: 2, gap: 0.8, fontWeight: 700, fontSize: 13 }}>
                            <CallReceivedIcon sx={{ fontSize: 16 }} />
                            {t("dashboard.payments.received")}
                        </ToggleButton>
                    </ToggleButtonGroup>
                )}
            </Box>

            {loading && (
                <Typography color="text.secondary">
                    {t("common.loading") ?? "Se încarcă..."}
                </Typography>
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