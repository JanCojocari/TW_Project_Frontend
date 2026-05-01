// components/dashboard/MyListingsTab.tsx
import { Box, Typography }  from "@mui/material";
import { useTranslation }   from "react-i18next";
import ApartmentCard        from "../listing/ApartmentCard.tsx";
import type { Apartment }   from "../../types/apartment.types";

interface Props {
    myListings:       Apartment[];
    favoriteIds:      number[];
    onToggleFavorite: (id: number) => void;
    getUserName:      (id: number) => string;
    onEdit:           (apartment: Apartment) => void;
    onDelete:         (apartment: Apartment) => void;
}

export default function MyListingsTab({ myListings, favoriteIds, onToggleFavorite, getUserName, onEdit, onDelete }: Props) {
    const { t } = useTranslation();

    if (myListings.length === 0) return (
        <Box sx={{ textAlign: "center", py: 10 }}>
            <Typography color="text.disabled" sx={{ fontSize: "18px", fontStyle: "italic" }}>
                {t("dashboard.myListings.empty")}
            </Typography>
        </Box>
    );

    return (
        <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", sm: "repeat(2,1fr)", md: "repeat(3,1fr)", xl: "repeat(4,1fr)" } }}>
            {myListings.map((apt) => (
                <ApartmentCard
                    key={apt.Id_Apartment}
                    apartment={apt}
                    favorites={favoriteIds}
                    toggleFavorite={onToggleFavorite}
                    getUserName={getUserName}
                    isOwner
                    onEdit={onEdit}
                    onDelete={onDelete}
                    getStatus={(a) => {
                        if (a.status === "pending")  return t("dashboard.myListings.status.pending");
                        if (a.status === "declined") return t("dashboard.myListings.status.declined");
                        return a.Id_Renter ? t("listings.occupied") : t("listings.available");
                    }}
                />
            ))}
        </Box>
    );
}