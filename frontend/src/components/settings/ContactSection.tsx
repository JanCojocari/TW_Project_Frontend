// components/settings/ContactSection.tsx
import { useState, useMemo }   from "react";
import { Button, Grid, InputAdornment, Typography, Select, MenuItem, FormControl } from "@mui/material";
import { useTranslation }      from "react-i18next";
import SettingsSectionWrapper  from "./SettingsSectionWraper.tsx";
import DebouncedTextField      from "../common/DebouncedTextField.tsx";
import type { UserSettingsDto } from "../../hooks/useSettingsForm";

// coduri de tara comune
const COUNTRY_CODES = [
    { code: "+373", label: "🇲🇩 +373" },
    { code: "+40",  label: "🇷🇴 +40"  },
    { code: "+380", label: "🇺🇦 +380" },
    { code: "+7",   label: "🇷🇺 +7"   },
    { code: "+49",  label: "🇩🇪 +49"  },
    { code: "+33",  label: "🇫🇷 +33"  },
    { code: "+44",  label: "🇬🇧 +44"  },
    { code: "+1",   label: "🇺🇸 +1"   },
    { code: "+39",  label: "🇮🇹 +39"  },
    { code: "+34",  label: "🇪🇸 +34"  },
];

/** Detecteaza codul de tara din numarul stocat si returneaza { prefix, local } */
function splitPhone(phone: string): { prefix: string; local: string } {
    for (const { code } of [...COUNTRY_CODES].sort((a, b) => b.code.length - a.code.length)) {
        if (phone.startsWith(code)) {
            return { prefix: code, local: phone.slice(code.length) };
        }
    }
    // fallback: niciun prefix recunoscut
    return { prefix: "+373", local: phone.replace(/\D/g, "") };
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

    // initializeaza prefix si cifre locale din profile.phone
    const { prefix: initPrefix, local: initLocal } = useMemo(
        () => splitPhone(profile.phone ?? ""),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [] // doar la mount
    );

    const [countryCode, setCountryCode] = useState(initPrefix);

    const localDigits = useMemo(() => {
        const { prefix, local } = splitPhone(profile.phone ?? "");
        // daca prefixul curent e diferit de ce s-a ales in UI, recalculeaza
        return prefix === countryCode ? local : splitPhone(profile.phone ?? "").local;
    }, [profile.phone, countryCode]);

    const handleCountryCode = (newCode: string) => {
        setCountryCode(newCode);
        // reconstruim numarul cu noul prefix
        const digits = splitPhone(profile.phone ?? "").local;
        onUpdate("phone", newCode + digits);
    };

    const handlePhoneDigits = (v: string) => {
        const digits = v.replace(/\D/g, "");
        setPhoneError("");
        onUpdate("phone", countryCode + digits);
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
                {/* Telefon cu selector cod de tara */}
                <Grid size={{ xs: 12, sm: 6 }}>
                    <DebouncedTextField
                        fullWidth
                        label={t("settings.contact.phone")}
                        size="small"
                        value={localDigits}
                        onChange={handlePhoneDigits}
                        error={!!phoneError}
                        inputProps={{ inputMode: "numeric" }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <FormControl variant="standard" sx={{ minWidth: 90 }}>
                                        <Select
                                            value={countryCode}
                                            onChange={e => handleCountryCode(e.target.value as string)}
                                            disableUnderline
                                            sx={{ fontSize: "0.875rem", fontWeight: 600 }}
                                        >
                                            {COUNTRY_CODES.map(c => (
                                                <MenuItem key={c.code} value={c.code}>{c.label}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
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