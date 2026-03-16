// components/createListing/StepLocation.tsx
import { Box, TextField, Typography, Button, Chip } from "@mui/material";
import { LocationOn as LocationOnIcon, Add as AddIcon } from "@mui/icons-material";
import { useTranslation }    from "react-i18next";
import Section               from "./Section.tsx";
import type { FormState, Errors } from "./types.ts";
import { colors }            from "../../theme/gradients.ts";

interface Props {
    form: FormState; errors: Errors;
    set: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
    clearError: (key: string) => void;
    onAddLandmark: () => void; onRemoveLandmark: (i: number) => void;
}

const StepLocation = ({ form, errors, set, clearError, onAddLandmark, onRemoveLandmark }: Props) => {
    const { t } = useTranslation();
    return (
        <Section icon={<LocationOnIcon sx={{ fontSize: 24 }} />}
                 title={t("createListing.steps.location.title")}
                 subtitle={t("createListing.steps.location.subtitle")}
                 step={3}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" }, gap: 2 }}>
                    <TextField label={t("components.steps.location.city")} value={form.city}
                               onChange={e => { set("city", e.target.value); clearError("city"); }}
                               error={!!errors.city} helperText={errors.city} />
                    <TextField label={t("components.steps.location.region")} value={form.region}
                               onChange={e => set("region", e.target.value)}
                               placeholder={t("components.steps.location.regionPlaceholder")} />
                    <TextField label={t("components.steps.location.postal")} value={form.postalCode}
                               onChange={e => set("postalCode", e.target.value)}
                               placeholder={t("components.steps.location.postalPlaceholder")} />
                </Box>
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                    <TextField label={t("components.steps.location.lat")} value={form.latitude} type="number"
                               onChange={e => set("latitude", e.target.value)}
                               placeholder={t("components.steps.location.latPlaceholder")}
                               inputProps={{ onWheel: (e: any) => e.currentTarget.blur() }} />
                    <TextField label={t("components.steps.location.lng")} value={form.longitude} type="number"
                               onChange={e => set("longitude", e.target.value)}
                               placeholder={t("components.steps.location.lngPlaceholder")}
                               inputProps={{ onWheel: (e: any) => e.currentTarget.blur() }} />
                </Box>
                <Box>
                    <Typography variant="body2" fontWeight={700} color="text.secondary" sx={{ mb: 1 }}>
                        {t("components.steps.location.landmarks")}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, mb: 1.5 }}>
                        <TextField size="small" fullWidth
                                   placeholder={t("components.steps.location.landmarkPlaceholder")}
                                   value={form.landmarkInput}
                                   onChange={e => set("landmarkInput", e.target.value)}
                                   onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); onAddLandmark(); } }} />
                        <Button variant="outlined" onClick={onAddLandmark} sx={{ minWidth: 48, px: 2 }}>
                            <AddIcon />
                        </Button>
                    </Box>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {form.landmarks.map((lm, i) => (
                            <Chip key={i} label={lm} size="small" onDelete={() => onRemoveLandmark(i)}
                                  sx={{ bgcolor: colors.primaryAlpha10, color: colors.primaryDark, fontWeight: 600 }} />
                        ))}
                    </Box>
                </Box>
            </Box>
        </Section>
    );
};

export default StepLocation;