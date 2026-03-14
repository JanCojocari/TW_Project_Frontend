// components/settings/DangerZoneSection.tsx
import {
    Button, Dialog, DialogActions, DialogContent,
    DialogContentText, DialogTitle, TextField, Typography,
} from "@mui/material";
import { useState } from "react";
import SettingsSectionWrapper from "./SettingsSectionWraper.tsx";

interface Props {
    email:    string;
    saving:   boolean;
    onDelete: () => void;
}

export default function DangerZoneSection({ email, saving, onDelete }: Props) {
    const [open, setOpen]         = useState(false);
    const [confirm, setConfirm]   = useState("");

    const isMatch = confirm === email;

    function handleConfirm() {
        if (!isMatch) return;
        setOpen(false);
        setConfirm("");
        onDelete();
    }

    return (
        <SettingsSectionWrapper
            title="Zonă periculoasă"
            description="Acțiuni ireversibile asupra contului tău."
            danger
        >
            <Typography fontSize={13} color="text.secondary" mb={2}>
                Ștergerea contului este permanentă. Toate datele, rezervările și istoricul
                de plăți vor fi eliminate definitiv.
            </Typography>
            <Button variant="outlined" color="error"
                    onClick={() => setOpen(true)}
                    sx={{ borderRadius: 2, px: 3 }}
            >
                Șterge contul
            </Button>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle fontWeight={800}>Confirmare ștergere cont</DialogTitle>
                <DialogContent>
                    <DialogContentText fontSize={13} mb={2}>
                        Scrie adresa ta de email <strong>{email}</strong> pentru a confirma.
                    </DialogContentText>
                    <TextField fullWidth size="small" label="Email"
                               value={confirm}
                               onChange={(e) => setConfirm(e.target.value)}
                               error={!!confirm && !isMatch}
                               helperText={!!confirm && !isMatch ? "Email-ul nu corespunde" : ""}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setOpen(false)} sx={{ borderRadius: 2 }}>
                        Anulează
                    </Button>
                    <Button variant="contained" color="error" disabled={!isMatch || saving}
                            onClick={handleConfirm} sx={{ borderRadius: 2 }}
                    >
                        {saving ? "Se șterge..." : "Șterge definitiv"}
                    </Button>
                </DialogActions>
            </Dialog>
        </SettingsSectionWrapper>
    );
}