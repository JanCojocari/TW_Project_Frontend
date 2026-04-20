// components/settings/ContactSection.tsx
import { useState, useMemo }   from "react";
import { Button, Grid, InputAdornment, Typography } from "@mui/material";
import { useTranslation }      from "react-i18next";
import SettingsSectionWrapper  from "./SettingsSectionWraper.tsx";
import DebouncedTextField      from "../common/DebouncedTextField.tsx";
import type { UserSettingsDto } from "../../hooks/useSettingsForm";

const PREFIX      = "+373";
const MAX_DIGITS  = 8; // cifre dupa prefix

/** Extrage doar cifrele locale din numarul stocat in backend (ex: "+37369050220" -> "69050220") */
function stripPrefix(phone: string): string {
    if (phone.startsWith(PREFIX)) return phone.slice(PREFIX.length);
    // daca nu are prefix, returnam ce avem (max MAX_DIGITS)
    return phone.replace(/\D/g, "").slice(0, MAX_DIGITS);
}

interface Props {
    profile:  UserSettingsDto;
    saving:   boolean;
    onUpdate: (field: keyof UserSettingsDto, value: string) => void;
    onSave:   () => void;
}

export default function ContactSection({ profile, saving, onUpdate, onSave }: Props) {
    const { t } = useTranslation();

    const [emailError, setEmailError] = useState("");
    const [phoneError, setPhoneError] = useState("");

    // cifrele locale (fara prefix) derivate din profile.phone
    const localDigits = useMemo(() => stripPrefix(profile.phone ?? ""), [profile.phone]);

    const handlePhoneDigits = (v: string) => {
        // permite doar cifre
        const digits = v.replace(/\D/g, "");
        if (digits.length > MAX_DIGITS) {
            setPhoneError(t("settings.contact.phoneMax"));
            return;
        }
        setPhoneError("");
        // stocam in state numarul complet cu prefix
        onUpdate("phone", PREFIX + digits);
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
                {/* Telefon cu prefix fix */}
                <Grid size={{ xs: 12, sm: 6 }}>
                    <DebouncedTextField
                        fullWidth
                        label={t("settings.contact.phone")}
                        size="small"
                        value={localDigits}
                        onChange={handlePhoneDigits}
                        error={!!phoneError}
                        helperText={phoneError || t("settings.contact.phoneHint")}
                        inputProps={{ maxLength: MAX_DIGITS, inputMode: "numeric" }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary", userSelect: "none" }}>
                                        {PREFIX}
                                    </Typography>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>

                {/* Email */}
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