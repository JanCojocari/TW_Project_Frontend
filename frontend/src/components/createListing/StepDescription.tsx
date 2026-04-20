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

const DESCRIPTION_MAX = 1000;
const RULES_MAX       = 500;

const icon = <MoneyIcon sx={{ fontSize: 24 }} />;

const StepDescription = memo(({ description, houseRules, cancellationPolicy, errors, set, clearError }: Props) => {
    const { t } = useTranslation();

    const policies: {
        value: AdditionalInfo["cancellationPolicy"];
        color: string;
        icon: React.ReactNode;
    }[] = [
        { value: "flexible", color: colors.success,   icon: <CheckIcon /> },
        { value: "moderate", color: colors.secondary, icon: <CheckIcon /> },
        { value: "strict",   color: colors.error,     icon: <CancelIcon /> },
    ];

    return (
        <Section
            icon={icon}
            title={t("createListing.steps.description.title")}
            subtitle={t("createListing.steps.description.subtitle")}
            step={6}
        >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3.5 }}>

                {/* Description with character counter */}
                <Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", mb: 1 }}>
                        <Typography variant="caption" fontWeight={700} color="text.secondary"
                                    sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
                            {t("components.steps.description.descLabel")}
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                fontWeight: 700,
                                color: description.length > DESCRIPTION_MAX * 0.9
                                    ? colors.error
                                    : description.length > 0
                                        ? colors.primaryDark
                                        : "text.disabled",
                            }}
                        >
                            {description.length}/{DESCRIPTION_MAX}
                        </Typography>
                    </Box>
                    <DebouncedTextField
                        multiline
                        rows={5}
                        fullWidth
                        placeholder={t("components.steps.description.descPlaceholder")}
                        value={description}
                        onChange={(v) => {
                            const str = v as string;
                            if (str.length <= DESCRIPTION_MAX) {
                                set("description", str as FormState["description"]);
                                clearError("description");
                            }
                        }}
                        error={!!errors.description}
                        helperText={errors.description}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
                    />
                </Box>

                {/* House rules with char counter */}
                <Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", mb: 1 }}>
                        <Typography variant="caption" fontWeight={700} color="text.secondary"
                                    sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
                            {t("components.steps.description.rulesLabel")}
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                fontWeight: 700,
                                color: houseRules.length > RULES_MAX * 0.9 ? colors.error : houseRules.length > 0 ? colors.primaryDark : "text.disabled",
                            }}
                        >
                            {houseRules.length}/{RULES_MAX}
                        </Typography>
                    </Box>
                    <DebouncedTextField
                        multiline
                        rows={3}
                        fullWidth
                        placeholder={t("components.steps.description.rulesPlaceholder")}
                        value={houseRules}
                        onChange={(v) => {
                            const str = v as string;
                            if (str.length <= RULES_MAX) set("houseRules", str as FormState["houseRules"]);
                        }}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
                    />
                </Box>

                {/* Cancellation policy — visual cards */}
                <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                        <CancelIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                        <Typography variant="caption" fontWeight={700} color="text.secondary"
                                    sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
                            {t("components.steps.description.cancellationTitle")}
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
                        {policies.map((opt) => {
                            const active = cancellationPolicy === opt.value;
                            const key    = opt.value as "flexible" | "moderate" | "strict";
                            return (
                                <Box
                                    key={opt.value}
                                    onClick={() => set("cancellationPolicy", opt.value)}
                                    sx={{
                                        flex: 1, p: 2.5, borderRadius: 3, cursor: "pointer",
                                        border: `2px solid ${active ? opt.color : colors.border}`,
                                        bgcolor: active ? `${opt.color}12` : "background.paper",
                                        transition: "all 0.15s ease",
                                        "&:hover": { borderColor: opt.color, bgcolor: `${opt.color}08` },
                                        position: "relative",
                                    }}
                                >
                                    {/* Color swatch */}
                                    <Box sx={{
                                        width: 32, height: 32, borderRadius: 2,
                                        bgcolor: `${opt.color}20`,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        color: opt.color, mb: 1.5,
                                        "& svg": { fontSize: 18 },
                                    }}>
                                        {opt.icon}
                                    </Box>
                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.5 }}>
                                        <Typography variant="body2" fontWeight={800} sx={{ color: active ? opt.color : "text.primary" }}>
                                            {t(`components.steps.description.policies.${key}.label`)}
                                        </Typography>
                                        {active && <CheckIcon sx={{ fontSize: 16, color: opt.color }} />}
                                    </Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.5 }}>
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