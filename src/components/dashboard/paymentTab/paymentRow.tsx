// components/dashboard/payments/PaymentRow.tsx
import { Box, Chip, Paper, Tooltip, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { colors }          from "../../../theme/gradients";
import DownloadButton      from "./DownloadButton";
import type { PaymentDto } from "../../../utils/pdf/buildInvoiceData";

interface Props {
    payment:     PaymentDto;
    isLoading:   boolean;
    onDownload:  (p: PaymentDto) => void;
}

export default function PaymentRow({ payment, isLoading, onDownload }: Props) {
    const hasServerUrl = !!payment.invoiceUrl;

    const dateLabel = new Date(payment.createdAt).toLocaleDateString("ro-RO", {
        month: "long",
        year:  "numeric",
    });

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3, borderRadius: 3, bgcolor: "background.default",
                border: `1px solid ${colors.border}`,
                display: "flex", justifyContent: "space-between", alignItems: "center",
                transition: "all 0.3s ease",
                "&:hover": {
                    borderColor: "primary.main",
                    boxShadow:   `0 4px 16px ${colors.primaryAlpha10}`,
                },
            }}
        >
            <Box>
                <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", mb: 0.5 }}>
                    <Typography fontWeight={800} sx={{ fontSize: "16px" }}>
                        Chirie Apartament #{payment.apartmentId}
                    </Typography>
                    <Chip label="Succes" color="success" size="small" />
                    {hasServerUrl && (
                        <Tooltip title="Factură stocată pe server">
                            <CheckCircleIcon sx={{ fontSize: 16, color: "success.main" }} />
                        </Tooltip>
                    )}
                </Box>
                <Typography color="text.secondary" sx={{ fontSize: "14px" }}>
                    {payment.totalCost} {payment.currency} • {dateLabel} • {payment.apartmentAddress}
                </Typography>
            </Box>

            <DownloadButton
                payment={payment}
                isLoading={isLoading}
                hasServerUrl={hasServerUrl}
                onDownload={onDownload}
            />
        </Paper>
    );
}