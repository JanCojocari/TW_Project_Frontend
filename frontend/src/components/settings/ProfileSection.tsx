// src/components/settings/ProfileSection.tsx
import { Button, Grid, MenuItem, TextField } from "@mui/material";
import { DatePicker }           from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs }         from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs                    from "dayjs";
import { useTranslation }       from "react-i18next";
import SettingsSectionWrapper   from "./SettingsSectionWraper.tsx";
import DebouncedTextField       from "../common/DebouncedTextField.tsx";
import type { UserSettingsDto } from "../../mockdata/settingsMock";

interface Props {
    profile:  UserSettingsDto;
    saving:   boolean;
    onUpdate: (field: keyof UserSettingsDto, value: string) => void;
    onSave:   () => void;
}

export default function ProfileSection({ profile, saving, onUpdate, onSave }: Props) {
    const { t } = useTranslation();

    const LEGACY_MAP: Record<string, string> = {
        "Masculin":          "male",
        "Feminin":           "female",
        "Altul":             "other",
        "Prefer să nu spun": "prefer_not_say",
    };

    const genderOptions: { value: string; label: string }[] = [
        { value: "male",           label: t("settings.profile.genderOptions.0") },
        { value: "female",         label: t("settings.profile.genderOptions.1") },
        { value: "other",          label: t("settings.profile.genderOptions.2") },
        { value: "prefer_not_say", label: t("settings.profile.genderOptions.3") },
    ];

    const normalizedGender = LEGACY_MAP[profile.gender] ?? profile.gender ?? "male";

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <SettingsSectionWrapper
                title={t("settings.profile.title")}
                description={t("settings.profile.description")}
            >
                <Grid container spacing={2.5}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <DebouncedTextField fullWidth label={t("settings.profile.name")} size="small"
                                            value={profile.name}
                                            onChange={(v) => onUpdate("name", v)}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <DebouncedTextField fullWidth label={t("settings.profile.surname")} size="small"
                                            value={profile.surname}
                                            onChange={(v) => onUpdate("surname", v)}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <DebouncedTextField fullWidth label={t("settings.profile.phone")} size="small"
                                            value={profile.phone}
                                            onChange={(v) => onUpdate("phone", v)}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <DatePicker
                            label={t("settings.profile.birthday")}
                            value={profile.birthday ? dayjs(profile.birthday) : null}
                            onChange={(d) => onUpdate("birthday", d ? d.format("YYYY-MM-DD") : "")}
                            slotProps={{
                                textField: { size: "small", fullWidth: true },
                                popper:    { sx: { zIndex: 1400 } },
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField fullWidth select label={t("settings.profile.gender")} size="small"
                                   value={normalizedGender}
                                   onChange={(e) => onUpdate("gender", e.target.value)}
                        >
                            {genderOptions.map((g) => (
                                <MenuItem key={g.value} value={g.value}>{g.label}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }} />
                    <Grid size={12}>
                        <Button variant="contained" disabled={saving} onClick={onSave}
                                sx={{ borderRadius: 2, px: 4 }}
                        >
                            {saving ? t("settings.profile.saving") : t("settings.profile.save")}
                        </Button>
                    </Grid>
                </Grid>
            </SettingsSectionWrapper>
        </LocalizationProvider>
    );
}
