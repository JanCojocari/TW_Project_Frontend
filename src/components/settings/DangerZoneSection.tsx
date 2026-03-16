// components/settings/DangerZoneSection.tsx
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography } from "@mui/material";
import { useState }            from "react";
import { useTranslation }      from "react-i18next";
import SettingsSectionWrapper  from "./SettingsSectionWraper.tsx";

interface Props { email: string; saving: boolean; onDelete: () => void; }

export default function DangerZoneSection({ email, saving, onDelete }: Props) {
    const { t }                   = useTranslation();
    const [open, setOpen]         = useState(false);
    const [confirm, setConfirm]   = useState("");
    const isMatch = confirm === email;

    function handleConfirm() {
        if (!isMatch) return;
        setOpen(false); setConfirm(""); onDelete();
    }

    return (
        <SettingsSectionWrapper
            title={t("settings.danger.title")}
            description={t("settings.danger.description")}
            danger
        >
            <Typography fontSize={13} color="text.secondary" mb={2}>
                {t("settings.danger.warning")}
            </Typography>
            <Button variant="outlined" color="error" onClick={() => setOpen(true)} sx={{ borderRadius: 2, px: 3 }}>
                {t("settings.danger.delete")}
            </Button>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle fontWeight={800}>{t("settings.danger.confirmTitle")}</DialogTitle>
                <DialogContent>
                    <DialogContentText fontSize={13} mb={2}>
                        {t("settings.danger.confirmDesc")} <strong>{email}</strong>
                    </DialogContentText>
                    <TextField fullWidth size="small" label={t("settings.danger.emailLabel")}
                               value={confirm} onChange={(e) => setConfirm(e.target.value)}
                               error={!!confirm && !isMatch}
                               helperText={!!confirm && !isMatch ? t("settings.danger.mismatch") : ""} />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setOpen(false)} sx={{ borderRadius: 2 }}>{t("settings.danger.cancel")}</Button>
                    <Button variant="contained" color="error" disabled={!isMatch || saving}
                            onClick={handleConfirm} sx={{ borderRadius: 2 }}>
                        {saving ? t("settings.danger.deleting") : t("settings.danger.confirm")}
                    </Button>
                </DialogActions>
            </Dialog>
        </SettingsSectionWrapper>
    );
}