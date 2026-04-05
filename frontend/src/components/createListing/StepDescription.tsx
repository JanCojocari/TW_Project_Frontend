// src/components/createListing/StepDescription.tsx
import { memo }              from "react";
import { Box, Typography }   from "@mui/material";
import { AttachMoney as MoneyIcon, Cancel as CancelIcon, CheckCircle as CheckIcon } from "@mui/icons-material";
import { useTranslation }    from "react-i18next";
import Section               from "./Section.tsx";
import DebouncedTextField    from "../common/DebouncedTextField.tsx";
import type { FormState, Errors } from "../../types/CreateListingTypes.ts";
import { colors }            from "../../theme/gradients.ts";
import type { AdditionalInfo } from "../../types/apartment.types";

interface Props {
    description:        string;
    houseRules:         string;
    cancellationPolicy: AdditionalInfo["cancellationPolicy"];
    errors:             Errors;
    set:                <K extends keyof FormState>(key: K, value: FormState[K]) => void;
    clearError:         (key: string) => void;
}

const icon = <MoneyIcon sx={{ fontSize: 24 }} />;

const StepDescription = memo(({ description, houseRules, cancellationPolicy, errors, set, clearError }: Props) => {
    const { t } = useTranslation();

    const policies: { value: AdditionalInfo["cancellationPolicy"]; color: string }[] = [
        { value: "flexible", color: "#16a34a" },
        { value: "moderate", color: "#F59E0B" },
        { value: "strict",   color: "#dc2626" },
    ];

    return (
        <Section icon={icon}
                 title={t("createListing.steps.description.title")}
                 subtitle={t("createListing.steps.description.subtitle")}
                 step={6}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <DebouncedTextField
                    label={t("components.steps.description.descLabel")} multiline rows={4} fullWidth
                    placeholder={t("components.steps.description.descPlaceholder")}
                    value={description}
                    onChange={(v) => { set("description", v as any); clearError("description"); }}
                    error={!!errors.description} helperText={errors.description}
                />
                <DebouncedTextField
                    label={t("components.steps.description.rulesLabel")} multiline rows={3} fullWidth
                    placeholder={t("components.steps.description.rulesPlaceholder")}
                    value={houseRules}
                    onChange={(v) => set("houseRules", v as any)}
                />
                <Box>
                    <Typography variant="body2" fontWeight={700} color="text.secondary" sx={{ mb: 1.5 }}>
                        <CancelIcon sx={{ verticalAlign: "middle", mr: 1, fontSize: 18 }} />
                        {t("components.steps.description.cancellationTitle")}
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
                        {policies.map(opt => {
                            const active = cancellationPolicy === opt.value;
                            const key    = opt.value as "flexible" | "moderate" | "strict";
                            return (
                                <Box key={opt.value} onClick={() => set("cancellationPolicy", opt.value)} sx={{
                                    flex: 1, p: 2, borderRadius: 2.5, cursor: "pointer",
                                    border: `2px solid ${active ? opt.color : colors.border}`,
                                    bgcolor: active ? `${opt.color}12` : "transparent",
                                    transition: "all 0.15s ease",
                                    "&:hover": { borderColor: opt.color, bgcolor: `${opt.color}08` },
                                }}>
                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.5 }}>
                                        <Typography variant="body2" fontWeight={800} sx={{ color: active ? opt.color : "text.primary" }}>
                                            {t(`components.steps.description.policies.${key}.label`)}
                                        </Typography>
                                        {active && <CheckIcon sx={{ fontSize: 16, color: opt.color }} />}
                                    </Box>
                                    <Typography variant="caption" color="text.secondary">
                                        {t(`components.steps.description.policies.${key}.desc`)}
                                    </Typography>
                                </Box>
                            );
                        })}
                    </Box>
                </Box>
            </Box>
        </Section>
    );
});

StepDescription.displayName = "StepDescription";
export default StepDescription;