// components/createListing/StepPhotos.tsx
import { useRef }            from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { CloudUpload as UploadIcon, Close as CloseIcon, Add as AddIcon, PhotoCamera as CameraIcon } from "@mui/icons-material";
import { useTranslation }    from "react-i18next";
import Section               from "./Section.tsx";
import type { FormState, Errors } from "./types.ts";
import { colors }            from "../../theme/gradients.ts";

interface Props {
    form: FormState; errors: Errors;
    onAddImages:   (files: FileList | null) => void;
    onRemoveImage: (idx: number) => void;
}

const StepPhotos = ({ form, errors, onAddImages, onRemoveImage }: Props) => {
    const { t }       = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <Section icon={<CameraIcon sx={{ fontSize: 24 }} />}
                 title={t("createListing.steps.photos.title")}
                 subtitle={t("createListing.steps.photos.subtitle")}
                 step={2}>
            <Box onClick={() => fileInputRef.current?.click()}
                 onDragOver={e => e.preventDefault()}
                 onDrop={e => { e.preventDefault(); onAddImages(e.dataTransfer.files); }}
                 sx={{ border: `2px dashed ${errors.images ? "#ef4444" : colors.border}`, borderRadius: 3, p: 4, textAlign: "center", cursor: "pointer", bgcolor: errors.images ? "rgba(239,68,68,0.03)" : colors.primaryAlpha06, "&:hover": { borderColor: colors.primaryDark, bgcolor: colors.primaryAlpha10 }, mb: 2 }}>
                <UploadIcon sx={{ fontSize: 40, color: errors.images ? "#ef4444" : colors.primaryDark, mb: 1 }} />
                <Typography variant="body1" fontWeight={700}>
                    {t("components.steps.photos.dragText")}{" "}
                    <Box component="span" sx={{ color: "primary.main" }}>{t("components.steps.photos.chooseFiles")}</Box>
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    {t("components.steps.photos.hint")} • {form.images.length}/8 {t("components.steps.photos.added")}
                </Typography>
                {errors.images && <Typography variant="caption" color="error" sx={{ display: "block", mt: 0.5 }}>{errors.images}</Typography>}
            </Box>

            <input ref={fileInputRef} type="file" accept="image/*" multiple
                   style={{ display: "none" }} onChange={e => onAddImages(e.target.files)} />

            {form.imagePreviewUrls.length > 0 && (
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 2 }}>
                    {form.imagePreviewUrls.map((url, idx) => (
                        <Box key={idx} sx={{ position: "relative", borderRadius: 2, overflow: "hidden", aspectRatio: "4/3" }}>
                            <img src={url} alt={`preview-${idx}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                            {idx === 0 && (
                                <Box sx={{ position: "absolute", bottom: 6, left: 6, bgcolor: "rgba(0,0,0,0.6)", color: "white", px: 1, py: 0.3, borderRadius: 1, fontSize: 11, fontWeight: 700 }}>
                                    {t("components.steps.photos.cover")}
                                </Box>
                            )}
                            <IconButton onClick={() => onRemoveImage(idx)} size="small" sx={{ position: "absolute", top: 4, right: 4, bgcolor: "rgba(0,0,0,0.55)", color: "white", width: 24, height: 24, "&:hover": { bgcolor: "rgba(239,68,68,0.85)" } }}>
                                <CloseIcon sx={{ fontSize: 14 }} />
                            </IconButton>
                        </Box>
                    ))}
                    {form.images.length < 8 && (
                        <Box onClick={() => fileInputRef.current?.click()} sx={{ aspectRatio: "4/3", borderRadius: 2, border: `2px dashed ${colors.border}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", color: colors.textSecondary, "&:hover": { borderColor: colors.primaryDark, color: colors.primaryDark }, transition: "all 0.2s ease" }}>
                            <AddIcon sx={{ fontSize: 28 }} />
                            <Typography variant="caption" fontWeight={600}>{t("components.steps.photos.add")}</Typography>
                        </Box>
                    )}
                </Box>
            )}
        </Section>
    );
};

export default StepPhotos;