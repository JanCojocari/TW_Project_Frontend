// src/components/createListing/Section.tsx
import React, { memo }       from "react";
import { Box, Typography, Chip } from "@mui/material";
import { useTranslation }    from "react-i18next";
import { gradients, colors } from "../../theme/gradients.ts";

interface Props {
    icon:      React.ReactNode;
    title:     string;
    subtitle?: string;
    step:      number;
    children:  React.ReactNode;
}

const Section = memo(({ icon, title, subtitle, step, children }: Props) => {
    const { t } = useTranslation();
    return (
        <Box sx={{
            position: "relative",
            bgcolor: "background.paper",
            border: `1px solid ${colors.border}`,
            borderRadius: 4,
            overflow: "hidden",
            mb: 3,
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
            transition: "box-shadow 0.2s",
            "&:hover": { boxShadow: "0 4px 24px rgba(0,0,0,0.07)" },
        }}>
            {/* Left accent bar */}
            <Box sx={{
                position: "absolute",
                left: 0, top: 0, bottom: 0,
                width: 4,
                background: gradients.primary,
                borderRadius: "4px 0 0 4px",
            }} />

            {/* Header */}
            <Box sx={{
                display: "flex", alignItems: "flex-start", gap: 2,
                px: { xs: 3, sm: 4 }, pt: { xs: 3, sm: 4 }, pb: 2.5,
                pl: { xs: 4, sm: 5 }, // extra left padding to clear accent bar
                borderBottom: `1px solid ${colors.border}`,
            }}>
                <Box sx={{
                    background: gradients.primary,
                    p: 1.25, borderRadius: 2,
                    display: "flex", color: "white",
                    flexShrink: 0,
                    boxShadow: `0 4px 12px ${colors.primaryAlpha25}`,
                }}>
                    {icon}
                </Box>
                <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
                        <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: "-0.3px" }}>
                            {title}
                        </Typography>
                        <Chip
                            label={`${t("components.section.step")} ${step}`}
                            size="small"
                            sx={{
                                bgcolor: colors.primaryAlpha10,
                                color: colors.primaryDark,
                                fontWeight: 700,
                                fontSize: 11,
                                height: 22,
                            }}
                        />
                    </Box>
                    {subtitle && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.4 }}>
                            {subtitle}
                        </Typography>
                    )}
                </Box>
            </Box>

            {/* Body */}
            <Box sx={{ px: { xs: 3, sm: 4 }, pl: { xs: 4, sm: 5 }, py: 3 }}>
                {children}
            </Box>
        </Box>
    );
});

Section.displayName = "Section";
export default Section;