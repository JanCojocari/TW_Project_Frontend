// src/components/settings/SecuritySection.tsx
import { Button, Grid } from "@mui/material";
import { useTranslation }          from "react-i18next";
import SettingsSectionWrapper      from "./SettingsSectionWraper.tsx";
import DebouncedTextField          from "../common/DebouncedTextField.tsx";
import type { PasswordForm }       from "../../hooks/useSettingsForm";

interface Props {
    password: PasswordForm;
    saving:   boolean;
    onUpdate: (field: keyof PasswordForm, value: string) => void;
    onSave:   () => void;
}

export default function SecuritySection({ password, saving, onUpdate, onSave }: Props) {
    const { t } = useTranslation();

    return (
        <SettingsSectionWrapper
            title={t("settings.security.title")}
            description={t("settings.security.description")}
        >
            <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <DebouncedTextField fullWidth label={t("settings.security.current")} size="small"
                                        type="password"
                                        value={password.oldPassword}
                                        onChange={(v) => onUpdate("oldPassword", v)}
                    />
                </Grid>
                <Grid size={12} />
                <Grid size={{ xs: 12, sm: 6 }}>
                    <DebouncedTextField fullWidth label={t("settings.security.new")} size="small"
                                        type="password"
                                        value={password.newPassword}
                                        onChange={(v) => onUpdate("newPassword", v)}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <DebouncedTextField fullWidth label={t("settings.security.confirm")} size="small"
                                        type="password"
                                        value={password.confirmPassword}
                                        onChange={(v) => onUpdate("confirmPassword", v)}
                                        error={!!password.confirmPassword && password.newPassword !== password.confirmPassword}
                                        helperText={
                                            !!password.confirmPassword && password.newPassword !== password.confirmPassword
                                                ? t("settings.security.mismatch")
                                                : ""
                                        }
                    />
                </Grid>
                <Grid size={12}>
                    <Button variant="contained" disabled={saving} onClick={onSave}
                            sx={{ borderRadius: 2, px: 4 }}
                    >
                        {saving ? t("settings.security.saving") : t("settings.security.save")}
                    </Button>
                </Grid>
            </Grid>
        </SettingsSectionWrapper>
    );
}
