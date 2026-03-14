import { Box, Typography } from "@mui/material";
import { users }        from "../../mockdata/users";
import ApartmentCard    from "../listing/ApartmentCard";
import type { Apartment } from "../../types/apartment.types";
import type { User }      from "../../types/user.types";

interface Props {
    favoriteApartments: Apartment[];
    favoriteIds:        number[];
    onToggleFavorite:   (id: number) => void;
}

export default function FavoritesTab({ favoriteApartments, favoriteIds, onToggleFavorite }: Props) {
    if (favoriteApartments.length === 0) return (
        <Box sx={{ textAlign: "center", py: 10 }}>
            <Typography color="text.disabled" sx={{ fontSize: "18px", fontStyle: "italic" }}>
                Lista ta de favorite este goală.
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
                    getStatus={(apartment: Apartment) => apartment.Id_Renter ? "Ocupat" : "Disponibil"}
                />
            ))}
        </Box>
    );
}