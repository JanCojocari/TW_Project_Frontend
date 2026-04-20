// src/components/createListing/StepBasicInfo.tsx
import { memo }              from "react";
import { Box, Typography }   from "@mui/material";
import { Home as HomeIcon }  from "@mui/icons-material";
import { useTranslation }    from "react-i18next";
import Section               from "./Section.tsx";
import DebouncedTextField    from "../common/DebouncedTextField.tsx";
import type { FormState, Errors } from "../../types/CreateListingTypes.ts";
import type { Currency, RentInterval } from "../../types/apartment.types";
import { colors }            from "../../theme/gradients.ts";

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

/* ── ToggleCard — visual select card ─────────────────────────────────── */
function ToggleCard<T extends string>({
                                          value, current, label, sublabel, onSelect,
                                      }: {
    value: T; current: T; label: string; sublabel?: string; onSelect: (v: T) => void;
}) {
    const isActive = value === current;
    return (
        <Box
            onClick={() => onSelect(value)}
            sx={{
                flex: 1, px: 2, py: 1.5,
                borderRadius: 2.5,
                border: `2px solid ${isActive ? colors.primaryDark : colors.border}`,
                bgcolor: isActive ? colors.primaryAlpha10 : "background.paper",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.15s ease",
                "&:hover": {
                    borderColor: colors.primaryDark,
                    bgcolor: colors.primaryAlpha06,
                },
            }}
        >
            <Typography
                variant="body2"
                fontWeight={isActive ? 800 : 500}
                sx={{ color: isActive ? colors.primaryDark : "text.primary", lineHeight: 1.2 }}
            >
                {label}
            </Typography>
            {sublabel && (
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.2 }}>
                    {sublabel}
                </Typography>
            )}
        </Box>
    );
}

const StepBasicInfo = memo(({ address, cost, currency, interval, errors, set, clearError }: Props) => {
    const { t } = useTranslation();

    const currencies: Currency[]    = ["USD", "EUR", "MDL"];
    const intervals: { value: RentInterval; label: string; sub: string }[] = [
        { value: "hour",  label: t("components.steps.basic.perHour"),  sub: "/ hr"  },
        { value: "day",   label: t("components.steps.basic.perDay"),   sub: "/ day" },
        { value: "month", label: t("components.steps.basic.perMonth"), sub: "/ mo"  },
    ];

    return (
        <Section
            icon={icon}
            title={t("createListing.steps.basic.title")}
            subtitle={t("createListing.steps.basic.subtitle")}
            step={1}
        >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3.5 }}>

                {/* Hero address input */}
                <Box>
                    <Typography variant="caption" fontWeight={700} color="text.secondary"
                                sx={{ textTransform: "uppercase", letterSpacing: 1, display: "block", mb: 1 }}>
                        {t("components.steps.basic.addressLabel")}
                    </Typography>
                    <DebouncedTextField
                        placeholder={t("components.steps.basic.addressPlaceholder")}
                        value={address}
                        onChange={(v) => { set("address", v as FormState["address"]); clearError("address"); }}
                        error={!!errors.address}
                        helperText={errors.address}
                        fullWidth
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                fontSize: 17,
                                fontWeight: 600,
                                borderRadius: 2.5,
                                bgcolor: "background.paper",
                            },
                        }}
                    />
                </Box>

                {/* Price + currency */}
                <Box>
                    <Typography variant="caption" fontWeight={700} color="text.secondary"
                                sx={{ textTransform: "uppercase", letterSpacing: 1, display: "block", mb: 1 }}>
                        {t("components.steps.basic.priceInterval")}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                        <DebouncedTextField
                            label={t("components.steps.basic.price")}
                            type="number"
                            value={cost}
                            onChange={(v) => { set("cost", v as FormState["cost"]); clearError("cost"); }}
                            error={!!errors.cost}
                            helperText={errors.cost}
                            inputProps={{ min: 0, onWheel: (e: React.WheelEvent<HTMLInputElement>) => e.currentTarget.blur() }}
                            sx={{ flex: "0 0 140px" }}
                        />
                        {/* Currency cards */}
                        <Box sx={{ display: "flex", gap: 1, flex: 1, pt: "4px" }}>
                            {currencies.map(c => (
                                <ToggleCard<Currency>
                                    key={c}
                                    value={c}
                                    current={currency}
                                    label={c}
                                    onSelect={(v) => set("currency", v)}
                                />
                            ))}
                        </Box>
                    </Box>
                </Box>

                {/* Interval cards */}
                <Box>
                    <Typography variant="caption" fontWeight={700} color="text.secondary"
                                sx={{ textTransform: "uppercase", letterSpacing: 1, display: "block", mb: 1 }}>
                        {t("components.steps.basic.rentalInterval")}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1.5 }}>
                        {intervals.map(opt => (
                            <ToggleCard<RentInterval>
                                key={opt.value}
                                value={opt.value}
                                current={interval}
                                label={opt.label}
                                sublabel={opt.sub}
                                onSelect={(v) => set("interval", v)}
                            />
                        ))}
                    </Box>
                </Box>

            </Box>
        </Section>
    );
});

StepBasicInfo.displayName = "StepBasicInfo";
export default StepBasicInfo;