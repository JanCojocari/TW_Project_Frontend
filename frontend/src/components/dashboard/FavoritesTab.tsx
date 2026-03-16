// components/dashboard/FavoritesTab.tsx
import { Box, Typography }  from "@mui/material";
import { useTranslation }   from "react-i18next";
import { users }            from "../../mockdata/users";
import ApartmentCard        from "../listing/ApartmentCard";
import type { Apartment }   from "../../types/apartment.types";
import type { User }        from "../../types/user.types";

interface Props {
    favoriteApartments: Apartment[];
    favoriteIds:        number[];
    onToggleFavorite:   (id: number) => void;
}

export default function FavoritesTab({ favoriteApartments, favoriteIds, onToggleFavorite }: Props) {
    const { t } = useTranslation();

    if (favoriteApartments.length === 0) return (
        <Box sx={{ textAlign: "center", py: 10 }}>
            <Typography color="text.disabled" sx={{ fontSize: "18px", fontStyle: "italic" }}>
                {t("dashboard.favorites.empty")}
            </Typography>
        </Box>
    );

    return (
        <Box sx={{ display: "grid", gap: 4, gridTemplateColumns: { xs: "1fr", sm: "repeat(2,1fr)", md: "repeat(3,1fr)" } }}>
            {favoriteApartments.map((apt) => (
                <ApartmentCard
                    key={apt.Id_Apartment}
                    apartment={apt}
                    favorites={favoriteIds}
                    toggleFavorite={onToggleFavorite}
                    getUserName={(id) => users.find((u: User) => u.Id_User === id)?.Name || "User"}
                    getStatus={(apartment: Apartment) => apartment.Id_Renter
                        ? t("listings.occupied")
                        : t("listings.available")}
                />
            ))}
        </Box>
    );
}