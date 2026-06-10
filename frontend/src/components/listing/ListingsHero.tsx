// components/listing/ListingsHero.tsx
import { Box, Typography } from "@mui/material";
import { TrendingUp as TrendingUpIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { gradients, colors } from "../../theme/gradients";

interface Props {
    count: number;
}

export default function ListingsHero({ count }: Props) {
    const { t } = useTranslation();

    return (
        <Box sx={{ mb: 4, textAlign: "center" }}>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                <Box sx={{ background: colors.primaryAlpha10, p: 1.5, px: 3, borderRadius: "100px", display: "flex", alignItems: "center", gap: 2, border: `1px solid ${colors.primaryAlpha25}`, boxShadow: `0 0 20px ${colors.primaryAlpha10}` }}>
                    <TrendingUpIcon sx={{ color: "primary.main", fontSize: 24 }} />
                    <Typography sx={{ color: "text.primary", fontWeight: 700, fontSize: "14px" }}>
                        {count} {t("listings.active")}
                    </Typography>
                </Box>
            </Box>
            <Typography variant="h2" sx={{ fontWeight: 900, mb: 2, fontSize: { xs: "36px", md: "56px" }, letterSpacing: "-1.5px" }}>
                {t("listings.title")}{" "}
                <Box component="span" sx={{ background: gradients.textPrimary, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    {t("listings.titleSpan")}
                </Box>
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, maxWidth: "600px", mx: "auto" }}>
                {t("listings.subtitle")}
            </Typography>
        </Box>
    );
}
