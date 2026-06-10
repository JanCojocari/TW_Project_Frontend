// components/listing/ListingsEmptyState.tsx
import { Box, Typography, Button } from "@mui/material";
import { Home as HomeIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { colors } from "../../theme/gradients";

interface Props {
    onReset: () => void;
}

export default function ListingsEmptyState({ onReset }: Props) {
    const { t } = useTranslation();

    return (
        <Box sx={{ textAlign: "center", py: 15 }}>
            <Box sx={{ width: "110px", height: "110px", margin: "0 auto 2.5rem", background: colors.primaryAlpha06, borderRadius: "36px", display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${colors.primaryAlpha15}`, color: "primary.main" }}>
                <HomeIcon sx={{ fontSize: 55 }} />
            </Box>
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 800 }}>
                {t("listings.noResults")}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 5, maxWidth: "400px", mx: "auto" }}>
                {t("listings.noResultsDesc")}
            </Typography>
            <Button variant="contained" onClick={onReset} sx={{ px: 6, py: 1.8, borderRadius: 2.5 }}>
                {t("listings.resetAll")}
            </Button>
        </Box>
    );
}
