// components/settings/SecuritySection.tsx
import { Button, Grid, TextField } from "@mui/material";
import { useTranslation }          from "react-i18next";
import SettingsSectionWrapper      from "./SettingsSectionWraper.tsx";
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
                <Grid item xs={12} sm={6}>
                    <TextField fullWidth label={t("settings.security.current")} size="small"
                               type="password"
                               value={password.oldPassword}
                               onChange={(e) => onUpdate("oldPassword", e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} />
                <Grid item xs={12} sm={6}>
                    <TextField fullWidth label={t("settings.security.new")} size="small"
                               type="password"
                               value={password.newPassword}
                               onChange={(e) => onUpdate("newPassword", e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField fullWidth label={t("settings.security.confirm")} size="small"
                               type="password"
                               value={password.confirmPassword}
                               onChange={(e) => onUpdate("confirmPassword", e.target.value)}
                               error={!!password.confirmPassword && password.newPassword !== password.confirmPassword}
                               helperText={
                                   !!password.confirmPassword && password.newPassword !== password.confirmPassword
                                       ? t("settings.security.mismatch")
                                       : ""
                               }
                    />
                </Grid>
                <Grid item xs={12}>
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