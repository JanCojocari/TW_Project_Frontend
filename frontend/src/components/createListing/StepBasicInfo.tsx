// src/components/createListing/StepBasicInfo.tsx
import { memo }                     from "react";
import { Box, Typography, ToggleButtonGroup, ToggleButton } from "@mui/material";
import { Home as HomeIcon }  from "@mui/icons-material";
import { useTranslation }    from "react-i18next";
import Section               from "./Section.tsx";
import DebouncedTextField    from "../common/DebouncedTextField.tsx";
import type { FormState, Errors } from "../../types/CreateListingTypes.ts";
import { toggleSx }          from "../../types/CreateListingTypes.ts";
import type { Currency, RentInterval } from "../../types/apartment.types";

interface Props {
    address:    string;
    cost:       string;
    currency:   Currency;
    interval:   RentInterval;
    errors:     Errors;
    set:        <K extends keyof FormState>(key: K, value: FormState[K]) => void;
    clearError: (key: string) => void;
}

const icon = <HomeIcon sx={{ fontSize: 24 }} />;

const StepBasicInfo = memo(({ address, cost, currency, interval, errors, set, clearError }: Props) => {
    const { t } = useTranslation();
    return (
        <Section icon={icon}
                 title={t("createListing.steps.basic.title")}
                 subtitle={t("createListing.steps.basic.subtitle")}
                 step={1}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <DebouncedTextField
                    label={t("components.steps.basic.addressLabel")}
                    placeholder={t("components.steps.basic.addressPlaceholder")}
                    value={address}
                    onChange={(v) => { set("address", v as any); clearError("address"); }}
                    error={!!errors.address} helperText={errors.address}
                    fullWidth
                />
                <Box>
                    <Typography variant="body2" fontWeight={700} color="text.secondary" sx={{ mb: 1.5 }}>
                        {t("components.steps.basic.priceInterval")}
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
                        <DebouncedTextField
                            label={t("components.steps.basic.price")} type="number" sx={{ flex: 2 }}
                            value={cost} inputProps={{ min: 0, onWheel: (e: any) => e.currentTarget.blur() }}
                            onChange={(v) => { set("cost", v as any); clearError("cost"); }}
                            error={!!errors.cost} helperText={errors.cost}
                        />
                        <Box sx={{ flex: 3 }}>
                            <ToggleButtonGroup value={currency} exclusive
                                               onChange={(_, v) => { if (v) set("currency", v); }}
                                               sx={{ ...toggleSx, height: 56, "& .MuiToggleButton-root": { ...toggleSx["& .MuiToggleButton-root"], flex: 1 } }}>
                                {(["USD", "EUR", "MDL"] as Currency[]).map(c => (
                                    <ToggleButton key={c} value={c}>{c}</ToggleButton>
                                ))}
                            </ToggleButtonGroup>
                        </Box>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: "block", mb: 1 }}>
                            {t("components.steps.basic.rentalInterval")}
                        </Typography>
                        <ToggleButtonGroup value={interval} exclusive
                                           onChange={(_, v) => { if (v) set("interval", v); }}
                                           sx={toggleSx}>
                            {([
                                { value: "hour",  label: t("components.steps.basic.perHour")  },
                                { value: "day",   label: t("components.steps.basic.perDay")   },
                                { value: "month", label: t("components.steps.basic.perMonth") },
                            ] as { value: RentInterval; label: string }[]).map(opt => (
                                <ToggleButton key={opt.value} value={opt.value}>{opt.label}</ToggleButton>
                            ))}
                        </ToggleButtonGroup>
                    </Box>
                </Box>
            </Box>
        </Section>
    );
});

StepBasicInfo.displayName = "StepBasicInfo";
export default StepBasicInfo;