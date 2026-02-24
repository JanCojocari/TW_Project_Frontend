import {
    Box,
    Card,
    Typography,
    Button,
    Chip,
} from "@mui/material";
import {
    LocationOn as LocationOnIcon,
    FavoriteBorder as FavoriteBorderIcon,
    Favorite as FavoriteIcon,
} from "@mui/icons-material";
import { memo } from "react";
import type { Apartment } from "../types/apartment.types";
import { useNavigate } from "react-router-dom";
import { paths } from "../app/paths.ts";
import { gradients, colors } from "../theme/gradients.ts";


interface Props {
    apartment: Apartment;
    favorites: number[];
    toggleFavorite: (id: number) => void;
    getUserName: (id: number) => string;
    getStatus: (apartment: Apartment) => string;
}

const ApartmentCard = ({ apartment, favorites, toggleFavorite, getUserName, getStatus }: Props) => {

    const navigate = useNavigate();
    const isFav      = favorites.includes(apartment.Id_Apartment);
    const isOccupied = apartment.Id_Renter !== null;

    return (
        <Card
            sx={{
                borderRadius: 4,
                overflow: "hidden",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                "&:hover": { transform: "translateY(-10px)" },
            }}
        >
            {/* Image Container */}
            <Box
                sx={{ position: "relative",
                    height: 240,
                    overflow: "hidden",
                    bgcolor: "background.default" }}

            >
                <img
                    src={apartment.image_url}
                    alt={apartment.Address}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)",
                    }}
                />

                {/* Favorite Button */}
                <Button
                    onClick={() => toggleFavorite(apartment.Id_Apartment)}
                    sx={{
                        position: "absolute",
                        top: 14,
                        right: 14,
                        minWidth: "auto",
                        width: 42,
                        height: 42,
                        borderRadius: "50%",
                        bgcolor: "background.paper",
                        color: isFav ? "error.main" : "text.secondary",
                        border: `1px solid ${colors.border}`,
                        backdropFilter: "blur(8px)",
                        boxShadow: 1,
                        "&:hover": {
                            bgcolor: "background.paper",
                            color: "error.main",
                            transform: "scale(1.1)",
                            boxShadow: 2,
                        },
                    }}
                >
                    
                {isFav ? <FavoriteIcon sx={{ fontSize: 22 }} /> : <FavoriteBorderIcon sx={{ fontSize: 22 }} />}

                </Button>

                {/* Status Badge */}
                <Box
                    sx={{
                        position: "absolute",
                        bottom: 16,
                        left: 16,
                    }}
                >
                    <Chip
                        label={getStatus(apartment)}
                        color={isOccupied ? "error" : "success"}
                        size="small"
                        sx={{ fontWeight: 800, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px", backdropFilter: "blur(8px)" }}
                    />
                </Box>
            </Box>

            {/* Content */}
            <Box sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column", gap: 2.5 }}>
                {/* Address */}
                <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                    <Box
                        sx={{
                            background: colors.primaryAlpha10,
                            p: 1.2,
                            borderRadius: 1.5,
                            border: `1px solid ${colors.primaryAlpha25}`,
                        }}
                    >
                        <LocationOnIcon sx={{ color: "primary.main", fontSize: 20 }} />
                    </Box>
                    <Typography
                        sx={{ fontWeight: 700, 
                            color: "text.primary", 
                            fontSize: "15px", 
                            lineHeight: 1.4 
                    }}
                    >
                        {apartment.Address}
                    </Typography>
                </Box>

                {/* Owner Info */}
                <Box
                    sx={{
                        display: "flex", flexDirection: "column", gap: 1.5,
                        p: 2, bgcolor: "background.default",
                        borderRadius: 2, border: `1px solid ${colors.border}`,
                    }}
                >
                    <Box>
                        <Typography
                            sx={{
                                color: "text.disabled",
                                fontSize: "10px",
                                textTransform: "uppercase",
                                fontWeight: 800,
                                letterSpacing: "1px",
                                mb: 0.5,
                            }}
                        >
                            Proprietar
                        </Typography>
                        <Typography sx={{ color: "text.primary", fontWeight: 700, fontSize: "14px" }}>
                            {getUserName(apartment.Id_Owner)}
                        </Typography>
                    </Box>
                    {apartment.Id_Renter && (
                        <Box sx={{ pt: 1, borderTop: `1px solid ${colors.border}` }}>
                            <Typography
                                sx={{
                                    color: "#text.disabled",
                                    fontSize: "10px",
                                    textTransform: "uppercase",
                                    fontWeight: 800,
                                    letterSpacing: "1px",
                                    mb: 0.5,
                                }}
                            >
                                Chiriaș
                            </Typography>
                            <Typography sx={{ color: "text.primary", fontWeight: 700, fontSize: "14px" }}>
                                {getUserName(apartment.Id_Renter)}
                            </Typography>
                        </Box>
                    )}
                </Box>

                {/* Price Section */}
                <Box
                    sx={{
                        mt: "auto",
                        pt: 2,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Box>
                        <Typography
                            sx={{
                                color: "text.disabled",
                                fontSize: "10px",
                                textTransform: "uppercase",
                                fontWeight: 800,
                                letterSpacing: "1px",
                            }}
                        >
                            Cost lunar
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
                            <Typography sx={{ color: "primary.main", fontWeight: 900, fontSize: "24px" }}>
                                {apartment.Cost_per_interval}
                            </Typography>
                            <Typography sx={{ color: "text.secondary", fontWeight: 700, fontSize: "14px" }}>
                                {apartment.Currency}
                            </Typography>
                        </Box>
                    </Box>
                    <Button
                        variant="contained"
                        disabled={isOccupied}
                        onClick={() => navigate(paths.apartmentDetail(apartment.Id_Apartment))}
                        sx={{ px: 3 }}
                        sx={{
                            color: apartment.Id_Renter !== null ? "#5C7A77" : "#071A1D",
                            fontWeight: 800,
                            textTransform: "none",
                            borderRadius: 2,
                            px: 3,
                            boxShadow: apartment.Id_Renter !== null ? "none" : "0 0 12px rgba(0, 224, 198, 0.3)",
                            "&:hover": {
                                boxShadow: "0 0 20px rgba(0, 224, 198, 0.4)",
                            },
                        }}
                    >
                        {apartment.Id_Renter !== null ? "Ocupat" : "Detalii"}
                    </Button>
                </Box>
            </Box>
        </Card>
    );
};

export default memo(ApartmentCard);
