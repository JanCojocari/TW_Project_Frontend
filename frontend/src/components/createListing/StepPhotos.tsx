// src/components/createListing/StepPhotos.tsx
import { memo, useRef, useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import {
    CloudUpload as UploadIcon, Close as CloseIcon,
    Add as AddIcon, PhotoCamera as CameraIcon,
} from "@mui/icons-material";
import { useTranslation }    from "react-i18next";
import Section               from "./Section.tsx";
import type { Errors }       from "../../types/CreateListingTypes.ts";
import { colors }            from "../../theme/gradients.ts";

interface Props {
    images:           File[];
    imagePreviewUrls: string[];
    errors:           Errors;
    onAddImages:      (files: FileList | null) => void;
    onRemoveImage:    (idx: number) => void;
}

const icon = <CameraIcon sx={{ fontSize: 24 }} />;

const StepPhotos = memo(({ images, imagePreviewUrls, errors, onAddImages, onRemoveImage }: Props) => {
    const { t }        = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const hasError = !!errors.images;

    return (
        <Section
            icon={icon}
            title={t("createListing.steps.photos.title")}
            subtitle={t("createListing.steps.photos.subtitle")}
            step={2}
        >
            {/* Drop zone */}
            <Box
                onClick={() => fileInputRef.current?.click()}
                onDragEnter={() => setIsDragging(true)}
                onDragLeave={() => setIsDragging(false)}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    onAddImages(e.dataTransfer.files);
                }}
                sx={{
                    position: "relative",
                    borderRadius: 3,
                    p: { xs: 4, sm: 6 },
                    textAlign: "center",
                    cursor: "pointer",
                    overflow: "hidden",
                    // animated dashed border via outline
                    outline: `2px dashed ${hasError ? "#ef4444" : isDragging ? colors.primaryDark : colors.border}`,
                    outlineOffset: isDragging ? 4 : 0,
                    bgcolor: isDragging
                        ? colors.primaryAlpha10
                        : hasError
                            ? "rgba(239,68,68,0.03)"
                            : colors.primaryAlpha06,
                    transition: "all 0.2s ease",
                    "&:hover": {
                        outlineColor: colors.primaryDark,
                        bgcolor: colors.primaryAlpha10,
                        "& .upload-icon": { transform: "translateY(-4px)" },
                    },
                    mb: 3,
                }}
            >
                <Box className="upload-icon" sx={{ transition: "transform 0.2s ease", mb: 2 }}>
                    <UploadIcon sx={{ fontSize: 48, color: hasError ? "#ef4444" : colors.primaryDark, opacity: isDragging ? 1 : 0.7 }} />
                </Box>
                <Typography variant="body1" fontWeight={700} sx={{ mb: 0.5 }}>
                    {t("components.steps.photos.dragText")}{" "}
                    <Box component="span" sx={{ color: "primary.main", textDecoration: "underline" }}>
                        {t("components.steps.photos.chooseFiles")}
                    </Box>
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    {t("components.steps.photos.hint")}
                    {" · "}
                    <Box component="span" sx={{ fontWeight: 700, color: images.length > 0 ? colors.primaryDark : "text.secondary" }}>
                        {images.length}/8 {t("components.steps.photos.added")}
                    </Box>
                </Typography>
                {hasError && (
                    <Typography variant="caption" color="error" sx={{ display: "block", mt: 1, fontWeight: 600 }}>
                        {errors.images}
                    </Typography>
                )}
            </Box>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: "none" }}
                onChange={(e) => onAddImages(e.target.files)}
            />

            {/* Photo grid */}
            {imagePreviewUrls.length > 0 && (
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 2 }}>
                    {imagePreviewUrls.map((url, idx) => (
                        <Box
                            key={idx}
                            sx={{
                                position: "relative",
                                borderRadius: 2.5,
                                overflow: "hidden",
                                aspectRatio: "4/3",
                                border: idx === 0 ? `2px solid ${colors.primaryDark}` : `1px solid ${colors.border}`,
                                boxShadow: idx === 0 ? `0 0 0 3px ${colors.primaryAlpha25}` : "none",
                                transition: "transform 0.15s",
                                "&:hover": { transform: "scale(1.02)" },
                                "&:hover .remove-btn": { opacity: 1 },
                            }}
                        >
                            <img
                                src={url}
                                alt={`preview-${idx}`}
                                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                            />

                            {/* Cover badge */}
                            {idx === 0 && (
                                <Box sx={{
                                    position: "absolute", bottom: 0, left: 0, right: 0,
                                    background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)",
                                    px: 1.5, py: 1,
                                }}>
                                    <Typography sx={{
                                        fontSize: 10, fontWeight: 800,
                                        color: "#fff", textTransform: "uppercase",
                                        letterSpacing: 0.8,
                                    }}>
                                        {t("components.steps.photos.cover")}
                                    </Typography>
                                </Box>
                            )}

                            {/* Remove button */}
                            <IconButton
                                className="remove-btn"
                                onClick={() => onRemoveImage(idx)}
                                size="small"
                                sx={{
                                    position: "absolute", top: 5, right: 5,
                                    opacity: 0,
                                    bgcolor: "rgba(0,0,0,0.6)",
                                    color: "white",
                                    width: 24, height: 24,
                                    transition: "opacity 0.15s, background 0.15s",
                                    "&:hover": { bgcolor: "rgba(239,68,68,0.85)" },
                                }}
                            >
                                <CloseIcon sx={{ fontSize: 14 }} />
                            </IconButton>
                        </Box>
                    ))}

                    {/* Add more button */}
                    {images.length < 8 && (
                        <Box
                            onClick={() => fileInputRef.current?.click()}
                            sx={{
                                aspectRatio: "4/3",
                                borderRadius: 2.5,
                                border: `2px dashed ${colors.border}`,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                color: "text.disabled",
                                gap: 0.5,
                                transition: "all 0.15s ease",
                                "&:hover": { borderColor: colors.primaryDark, color: colors.primaryDark, bgcolor: colors.primaryAlpha06 },
                            }}
                        >
                            <AddIcon sx={{ fontSize: 28 }} />
                            <Typography variant="caption" fontWeight={600}>
                                {t("components.steps.photos.add")}
                            </Typography>
                        </Box>
                    )}
                </Box>
            )}
        </Section>
    );
});

StepPhotos.displayName = "StepPhotos";
export default StepPhotos;