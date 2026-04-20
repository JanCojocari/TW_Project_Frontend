// components/settings/ContactSection.tsx
import { useState }            from "react";
import { Button, Grid }        from "@mui/material";
import { useTranslation }      from "react-i18next";
import SettingsSectionWrapper  from "./SettingsSectionWraper.tsx";
import DebouncedTextField      from "../common/DebouncedTextField.tsx";
import type { UserSettingsDto } from "../../hooks/useSettingsForm";

interface Props {
    profile:  UserSettingsDto;
    saving:   boolean;
    onUpdate: (field: keyof UserSettingsDto, value: string) => void;
    onSave:   () => void;
}

// max 9 cifre, optional prefix + sau 00
const PHONE_REGEX = /^\+?[0-9]{0,9}$/;

export default function ContactSection({ profile, saving, onUpdate, onSave }: Props) {
    const { t } = useTranslation();

    const [phoneError, setPhoneError] = useState("");
    const [emailError, setEmailError] = useState("");

    const handlePhone = (v: string) => {
        // permite doar cifre, optionala + la inceput
        if (v !== "" && !/^\+?[0-9]*$/.test(v)) return;
        if (v.replace(/^\+/, "").length > 9) {
            setPhoneError(t("settings.contact.phoneMax"));
            return;
        }
        setPhoneError("");
        onUpdate("phone", v);
    };

    const handleEmail = (v: string) => {
        setEmailError(
            v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
                ? t("settings.contact.emailInvalid")
                : ""
        );
        onUpdate("email", v);
    };

    const handleSave = () => {
        if (phoneError || emailError) return;
        onSave();
    };

    return (
        <SettingsSectionWrapper
            title={t("settings.contact.title")}
            description={t("settings.contact.description")}
        >
            <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <DebouncedTextField
                        fullWidth
                        label={t("settings.contact.phone")}
                        size="small"
                        value={profile.phone}
                        onChange={handlePhone}
                        error={!!phoneError}
                        helperText={phoneError}
                        inputProps={{ maxLength: 10 }}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <DebouncedTextField
                        fullWidth
                        label={t("settings.contact.email")}
                        size="small"
                        type="email"
                        value={profile.email}
                        onChange={handleEmail}
                        error={!!emailError}
                        helperText={emailError}
                    />
                </Grid>
                <Grid size={12}>
                    <Button
                        variant="contained"
                        disabled={saving || !!phoneError || !!emailError}
                        onClick={handleSave}
                        sx={{ borderRadius: 2, px: 4 }}
                    >
                        {saving ? t("settings.contact.saving") : t("settings.contact.save")}
                    </Button>
                </Grid>
            </Grid>
        </SettingsSectionWrapper>
    );
}