// components/createListing/Section.tsx
import { Box, Paper, Typography, Chip, Divider } from "@mui/material";
import { useTranslation }    from "react-i18next";
import { gradients, colors } from "../../theme/gradients.ts";

interface Props {
    icon:      React.ReactNode;
    title:     string;
    subtitle?: string;
    step:      number;
    children:  React.ReactNode;
}

const Section = ({ icon, title, subtitle, step, children }: Props) => {
    const { t } = useTranslation();
    return (
        <Paper elevation={1} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 4, border: `1px solid ${colors.border}`, mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 3 }}>
                <Box sx={{ background: gradients.primary, p: 1.5, borderRadius: 2, display: "flex", color: "white", flexShrink: 0, boxShadow: `0 4px 12px ${colors.primaryAlpha25}` }}>
                    {icon}
                </Box>
                <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Typography variant="h6" fontWeight={800}>{title}</Typography>
                        <Chip label={`${t("components.section.step")} ${step}`} size="small"
                              sx={{ bgcolor: colors.primaryAlpha10, color: colors.primaryDark, fontWeight: 700, fontSize: 11 }} />
                    </Box>
                    {subtitle && <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{subtitle}</Typography>}
                </Box>
            </Box>
            <Divider sx={{ mb: 3 }} />
            {children}
        </Paper>
    );
};

export default Section;