// components/dashboard/payments/DownloadButton.tsx
import { Button, CircularProgress } from "@mui/material";
import DownloadIcon       from "@mui/icons-material/Download";
import { useTranslation } from "react-i18next";
import type { PaymentDto } from "../../../utils/pdf/buildInvoiceData";

interface Props {
    payment:      PaymentDto;
    isLoading:    boolean;
    hasServerUrl: boolean; // pastrat in interfata pentru compatibilitate, neutilizat
    onDownload:   (p: PaymentDto) => void;
}

export default function DownloadButton({ payment, isLoading, onDownload }: Props) {
    const { t } = useTranslation();

    return (
        <Button
            variant="outlined"
            size="small"
            startIcon={isLoading ? <CircularProgress size={14} color="inherit" /> : <DownloadIcon />}
            disabled={isLoading}
            onClick={() => onDownload(payment)}
            sx={{ borderRadius: 2, px: 3, minWidth: 140 }}
        >
            {isLoading ? t("dashboard.payments.generating") : t("dashboard.payments.download")}
        </Button>
    );
}