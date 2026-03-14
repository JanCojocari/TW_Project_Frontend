// components/dashboard/payments/DownloadButton.tsx
import { Button, CircularProgress, Tooltip } from "@mui/material";
import DownloadIcon       from "@mui/icons-material/Download";
import { useTranslation } from "react-i18next";
import type { PaymentDto } from "../../../utils/pdf/buildInvoiceData";

interface Props {
    payment:      PaymentDto;
    isLoading:    boolean;
    hasServerUrl: boolean;
    onDownload:   (p: PaymentDto) => void;
}

export default function DownloadButton({ payment, isLoading, hasServerUrl, onDownload }: Props) {
    const { t } = useTranslation();

    const tooltipText = hasServerUrl
        ? t("dashboard.payments.serverStored")
        : t("dashboard.payments.firstDownload");

    return (
        <Tooltip title={tooltipText}>
            <span>
                <Button variant="outlined" size="small"
                        startIcon={isLoading ? <CircularProgress size={14} color="inherit" /> : <DownloadIcon />}
                        disabled={isLoading}
                        onClick={() => onDownload(payment)}
                        sx={{ borderRadius: 2, px: 3, minWidth: 140 }}>
                    {isLoading ? t("dashboard.payments.generating") : t("dashboard.payments.download")}
                </Button>
            </span>
        </Tooltip>
    );
}