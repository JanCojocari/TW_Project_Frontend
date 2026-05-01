// components/dashboard/FavoritesTab.tsx
import { Box, Typography }  from "@mui/material";
import { useTranslation }   from "react-i18next";
import ApartmentCard        from "../listing/ApartmentCard";
import type { Apartment }   from "../../types/apartment.types";

interface Props {
    favoriteApartments: Apartment[];
    favoriteIds:        number[];
    onToggleFavorite:   (id: number) => void;
    getUserName:        (id: number) => string;
}

export default function FavoritesTab({ favoriteApartments, favoriteIds, onToggleFavorite, getUserName }: Props) {
    const { t } = useTranslation();

    if (favoriteApartments.length === 0) return (
        <Box sx={{ textAlign: "center", py: 10 }}>
            <Typography color="text.disabled" sx={{ fontSize: "18px", fontStyle: "italic" }}>
                {t("dashboard.favorites.empty")}
            </Typography>
        </Box>
    );

    return (
        <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", sm: "repeat(2,1fr)", md: "repeat(3,1fr)", xl: "repeat(4,1fr)" } }}>
            {favoriteApartments.map((apt) => (
                <ApartmentCard
                    key={apt.Id_Apartment}
                    apartment={apt}
                    favorites={favoriteIds}
                    toggleFavorite={onToggleFavorite}
                    getUserName={getUserName}
                    getStatus={(apartment: Apartment) => apartment.Id_Renter
                        ? t("listings.occupied")
                        : t("listings.available")}
                />
            ))}
        </Box>
    );
}