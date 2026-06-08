import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, CircularProgress, Snackbar, Alert, Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import type { Apartment } from "../../types/apartment.types";

interface Props {
    target:       Apartment | null;
    busy:         boolean;
    snack:        { msg: string; sev: "success" | "error" } | null;
    onClose:      () => void;
    onConfirm:    () => void;
    onSnackClose: () => void;
}

export default function DeleteListingDialog({ target, busy, snack, onClose, onConfirm, onSnackClose }: Props) {
    const { t } = useTranslation();
    return (
        <>
            <Dialog open={!!target} onClose={() => !busy && onClose()}>
                <DialogTitle fontWeight={700}>
                    {t("dashboard.myListings.deleteDialog.title")}
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        {t("dashboard.myListings.deleteDialog.body", { address: target?.Address ?? "" })}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} disabled={busy}>
                        {t("dashboard.myListings.deleteDialog.cancel")}
                    </Button>
                    <Button onClick={onConfirm} color="error" variant="contained" disabled={busy}>
                        {busy ? <CircularProgress size={16} /> : t("dashboard.myListings.deleteDialog.confirm")}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={!!snack}
                autoHideDuration={4000}
                onClose={onSnackClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert severity={snack?.sev ?? "success"} onClose={onSnackClose} sx={{ fontWeight: 600 }}>
                    {snack?.msg}
                </Alert>
            </Snackbar>
        </>
    );
}
