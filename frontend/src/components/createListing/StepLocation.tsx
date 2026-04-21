// src/components/createListing/StepLocation.tsx
import React, { memo }       from "react";
import { Box, Typography, IconButton, Chip } from "@mui/material";
import { LocationOn as LocationOnIcon, Add as AddIcon, MyLocation as PinIcon } from "@mui/icons-material";
import { useTranslation }    from "react-i18next";
import Section               from "./Section.tsx";
import DebouncedTextField    from "../common/DebouncedTextField.tsx";
import type { FormState, Errors } from "../../types/CreateListingTypes.ts";
import { colors }            from "../../theme/gradients.ts";

interface Props {
    city:             string;
    region:           string;
    postalCode:       string;
    latitude:         string;
    longitude:        string;
    landmarks:        string[];
    landmarkInput:    string;
    errors:           Errors;
    set:              <K extends keyof FormState>(key: K, value: FormState[K]) => void;
    clearError:       (key: string) => void;
    onAddLandmark:    () => void;
    onRemoveLandmark: (i: number) => void;
}

const icon = <LocationOnIcon sx={{ fontSize: 24 }} />;

const StepLocation = memo(({
                               city, region, postalCode, latitude, longitude,
                               landmarks, landmarkInput, errors,
                               set, clearError, onAddLandmark, onRemoveLandmark,
                           }: Props) => {
    const { t } = useTranslation();

    return (
        <Section
            icon={icon}
            title={t("createListing.steps.location.title")}
            subtitle={t("createListing.steps.location.subtitle")}
            step={3}
        >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>

                {/* City — prominent at top */}
                <Box>
                    <Typography variant="caption" fontWeight={700} color="text.secondary"
                                sx={{ textTransform: "uppercase", letterSpacing: 1, display: "block", mb: 1 }}>
                        {t("components.steps.location.city")}
                    </Typography>
                    <DebouncedTextField
                        placeholder={t("components.steps.location.city")}
                        value={city}
                        onChange={(v) => { set("city", v as FormState["city"]); clearError("city"); }}
                        error={!!errors.city}
                        helperText={errors.city}
                        fullWidth
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                fontSize: 16,
                                fontWeight: 600,
                                borderRadius: 2.5,
                            },
                        }}
                    />
                </Box>

                {/* Region + Postal */}
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                    <DebouncedTextField
                        label={t("components.steps.location.region")}
                        value={region}
                        onChange={(v) => { set("region", v as FormState["region"]); clearError("region"); }}
                        placeholder={t("components.steps.location.regionPlaceholder")}
                        error={!!errors.region}
                        helperText={errors.region}
                    />
                    <DebouncedTextField
                        label={t("components.steps.location.postal")}
                        value={postalCode}
                        onChange={(v) => { set("postalCode", v as FormState["postalCode"]); clearError("postalCode"); }}
                        placeholder={t("components.steps.location.postalPlaceholder")}
                        error={!!errors.postalCode}
                        helperText={errors.postalCode}
                    />
                </Box>

                {/* Lat / Lng — compact with pin icon */}
                <Box sx={{
                    p: 2.5, borderRadius: 3,
                    bgcolor: colors.primaryAlpha06,
                    border: `1px solid ${colors.primaryAlpha25}`,
                }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                        <PinIcon sx={{ fontSize: 16, color: colors.primaryDark }} />
                        <Typography variant="caption" fontWeight={700} color="text.secondary"
                                    sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
                            {t("components.steps.location.lat")} / {t("components.steps.location.lng")}
                        </Typography>
                    </Box>
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                        <DebouncedTextField
                            label={t("components.steps.location.lat")}
                            value={latitude}
                            type="number"
                            size="small"
                            onChange={(v) => set("latitude", v as FormState["latitude"])}
                            placeholder={t("components.steps.location.latPlaceholder")}
                            inputProps={{ onWheel: (e: React.WheelEvent<HTMLInputElement>) => e.currentTarget.blur() }}
                        />
                        <DebouncedTextField
                            label={t("components.steps.location.lng")}
                            value={longitude}
                            type="number"
                            size="small"
                            onChange={(v) => set("longitude", v as FormState["longitude"])}
                            placeholder={t("components.steps.location.lngPlaceholder")}
                            inputProps={{ onWheel: (e: React.WheelEvent<HTMLInputElement>) => e.currentTarget.blur() }}
                        />
                    </Box>
                </Box>

                {/* Landmarks as pill tags */}
                <Box>
                    <Typography variant="caption" fontWeight={700} color="text.secondary"
                                sx={{ textTransform: "uppercase", letterSpacing: 1, display: "block", mb: 1.5 }}>
                        {t("components.steps.location.landmarks")}
                    </Typography>

                    {/* Input + add */}
                    <Box sx={{ display: "flex", gap: 1, mb: 1.5 }}>
                        <DebouncedTextField
                            size="small"
                            fullWidth
                            placeholder={t("components.steps.location.landmarkPlaceholder")}
                            value={landmarkInput}
                            onChange={(v) => set("landmarkInput", v as FormState["landmarkInput"])}
                            onKeyDown={(e: React.KeyboardEvent) => {
                                if (e.key === "Enter") { e.preventDefault(); onAddLandmark(); }
                            }}
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                        />
                        <IconButton
                            onClick={onAddLandmark}
                            sx={{
                                bgcolor: colors.primaryAlpha10,
                                color: colors.primaryDark,
                                borderRadius: 2,
                                px: 2,
                                border: `1px solid ${colors.primaryAlpha25}`,
                                "&:hover": { bgcolor: colors.primaryAlpha25 },
                            }}
                        >
                            <AddIcon />
                        </IconButton>
                    </Box>

                    {/* Pills */}
                    {landmarks.length > 0 && (
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                            {landmarks.map((lm, i) => (
                                <Chip
                                    key={i}
                                    label={lm}
                                    size="small"
                                    onDelete={() => onRemoveLandmark(i)}
                                    sx={{
                                        bgcolor: colors.primaryAlpha10,
                                        color: colors.primaryDark,
                                        fontWeight: 600,
                                        border: `1px solid ${colors.primaryAlpha25}`,
                                        "& .MuiChip-deleteIcon": { color: colors.primaryDark, opacity: 0.6, "&:hover": { opacity: 1 } },
                                    }}
                                />
                            ))}
                        </Box>
                    )}
                </Box>
            </Box>
        </Section>
    );
});

StepLocation.displayName = "StepLocation";
export default StepLocation;