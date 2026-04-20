// components/settings/SecuritySection.tsx
import { Button, Grid }           from "@mui/material";
import { useTranslation }         from "react-i18next";
import SettingsSectionWrapper     from "./SettingsSectionWraper.tsx";
import DebouncedTextField         from "../common/DebouncedTextField.tsx";
import type { PasswordForm }      from "../../hooks/useSettingsForm";

interface Props {
    password: PasswordForm;
    saving:   boolean;
    onUpdate: (field: keyof PasswordForm, value: string) => void;
    onSave:   () => void;
}

export default function SecuritySection({ password, saving, onUpdate, onSave }: Props) {
    const { t } = useTranslation();

    const mismatch = !!password.confirmPassword &&
        password.newPassword !== password.confirmPassword;

    return (
        <SettingsSectionWrapper
            title={t("settings.security.title")}
            description={t("settings.security.description")}
        >
            <Grid container spacing={2.5}>
                {/* Parola curenta — rand propriu */}
                <Grid size={{ xs: 12, sm: 6 }}>
                    <DebouncedTextField
                        fullWidth label={t("settings.security.current")} size="small"
                        type="password"
                        value={password.oldPassword}
                        onChange={(v) => onUpdate("oldPassword", v)}
                    />
                </Grid>

                {/* Spatiu gol pentru a impinge urmatoarele pe rand nou */}
                <Grid size={{ xs: 12, sm: 6 }} />

                {/* Parola noua */}
                <Grid size={{ xs: 12, sm: 6 }}>
                    <DebouncedTextField
                        fullWidth label={t("settings.security.new")} size="small"
                        type="password"
                        value={password.newPassword}
                        onChange={(v) => onUpdate("newPassword", v)}
                    />
                </Grid>

                {/* Spatiu gol — confirma parola trebuie pe randul urmator */}
                <Grid size={{ xs: 12, sm: 6 }} />

                {/* Confirma parola noua — SUB parola noua */}
                <Grid size={{ xs: 12, sm: 6 }}>
                    <DebouncedTextField
                        fullWidth label={t("settings.security.confirm")} size="small"
                        type="password"
                        value={password.confirmPassword}
                        onChange={(v) => onUpdate("confirmPassword", v)}
                        error={mismatch}
                        helperText={mismatch ? t("settings.security.mismatch") : ""}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }} />

                <Grid size={12}>
                    <Button
                        variant="contained"
                        disabled={saving || mismatch}
                        onClick={onSave}
                        sx={{ borderRadius: 2, px: 4 }}
                    >
                        {saving ? t("settings.security.saving") : t("settings.security.save")}
                    </Button>
                </Grid>
            </Grid>
        </SettingsSectionWrapper>
    );
}