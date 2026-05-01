// components/dashboard/payments/paymentRow.tsx
import { Box, Chip, Paper, Typography } from "@mui/material";
import { formatDateMonth }  from '../../../utils/formatDate';
import { useTranslation }   from "react-i18next";
import { colors }           from "../../../theme/gradients";
import DownloadButton       from "./downloadButton";
import type { PaymentDto }  from "../../../utils/pdf/buildInvoiceData";

interface Props {
    payment:    PaymentDto;
    isLoading:  boolean;
    onDownload: (p: PaymentDto) => void;
}

export default function PaymentRow({ payment, isLoading, onDownload }: Props) {
    const { t } = useTranslation();

    const dateLabel    = formatDateMonth(payment.createdAt);
    const displayTitle = payment.apartmentAddress || `#${payment.apartmentId}`;

    return (
        <Paper elevation={0} sx={{
            p: 3, borderRadius: 3,
            bgcolor: "background.default",
            border: `1px solid ${colors.border}`,
            display: "flex", justifyContent: "space-between", alignItems: "center",
            transition: "all 0.3s ease",
            "&:hover": { borderColor: "primary.main", boxShadow: `0 4px 16px ${colors.primaryAlpha10}` },
        }}>
            <Box>
                <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", mb: 0.5 }}>
                    <Typography fontWeight={800} sx={{ fontSize: "16px" }}>
                        {t("dashboard.payments.rentLabel")} — {displayTitle}
                    </Typography>
                    <Chip label={t("dashboard.payments.success")} color="success" size="small" />
                </Box>
                <Typography color="text.secondary" sx={{ fontSize: "14px" }}>
                    {payment.totalCost} {payment.currency} • {dateLabel}
                </Typography>
            </Box>

            <DownloadButton
                payment={payment}
                isLoading={isLoading}
                hasServerUrl={false}
                onDownload={onDownload}
            />
        </Paper>
    );
}