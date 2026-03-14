// components/dashboard/payments/DownloadButton.tsx
import { Button, CircularProgress, Tooltip } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import type { PaymentDto } from "../../../utils/pdf/buildInvoiceData";

interface Props {
    payment:     PaymentDto;
    isLoading:   boolean;
    hasServerUrl: boolean;
    onDownload:  (p: PaymentDto) => void;
}

export default function DownloadButton({ payment, isLoading, hasServerUrl, onDownload }: Props) {
    const tooltipText = hasServerUrl
        ? "Factura este stocată pe server — se deschide direct"
        : "Prima descărcare — PDF generat și salvat pe server";

    return (
        <Tooltip title={tooltipText}>
            <span>
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={
                        isLoading
                            ? <CircularProgress size={14} color="inherit" />
                            : <DownloadIcon />
                    }
                    disabled={isLoading}
                    onClick={() => onDownload(payment)}
                    sx={{ borderRadius: 2, px: 3, minWidth: 140 }}
                >
                    {isLoading ? "Se generează..." : "Descarcă PDF"}
                </Button>
            </span>
        </Tooltip>
    );
}