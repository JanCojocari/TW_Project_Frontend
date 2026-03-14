// components/settings/ProfileSection.tsx
import { Button, Grid, MenuItem, TextField } from "@mui/material";
import SettingsSectionWrapper from "./SettingsSectionWraper.tsx";
import type { UserSettingsDto } from "../../mockdata/settingsMock";

const GENDER_OPTIONS = ["Masculin", "Feminin", "Altul", "Prefer să nu spun"];

interface Props {
    profile:       UserSettingsDto;
    saving:        boolean;
    onUpdate:      (field: keyof UserSettingsDto, value: string) => void;
    onSave:        () => void;
}

export default function ProfileSection({ profile, saving, onUpdate, onSave }: Props) {
    return (
        <SettingsSectionWrapper
            title="Profil personal"
            description="Informațiile tale vizibile pe platformă."
        >
            <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Nume" size="small"
                               value={profile.name}
                               onChange={(e) => onUpdate("name", e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Prenume" size="small"
                               value={profile.surname}
                               onChange={(e) => onUpdate("surname", e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Telefon" size="small"
                               value={profile.phone}
                               onChange={(e) => onUpdate("phone", e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Data nașterii" size="small"
                               type="date"
                               value={profile.birthday}
                               onChange={(e) => onUpdate("birthday", e.target.value)}
                               InputLabelProps={{ shrink: true }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField fullWidth select label="Gen" size="small"
                               value={profile.gender}
                               onChange={(e) => onUpdate("gender", e.target.value)}
                    >
                        {GENDER_OPTIONS.map((g) => (
                            <MenuItem key={g} value={g}>{g}</MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" disabled={saving} onClick={onSave}
                            sx={{ borderRadius: 2, px: 4 }}
                    >
                        {saving ? "Se salvează..." : "Salvează modificările"}
                    </Button>
                </Grid>
            </Grid>
        </SettingsSectionWrapper>
    );
}