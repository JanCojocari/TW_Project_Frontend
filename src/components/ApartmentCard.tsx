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

interface Props {
    apartment: Apartment;
    favorites: number[];
    toggleFavorite: (id: number) => void;
    getUserName: (id: number) => string;
    getStatus: (apartment: Apartment) => string;
}

const ApartmentCard = ({ apartment, favorites, toggleFavorite, getUserName, getStatus }: Props) => {

    const navigate = useNavigate();

    const handleViewDetails = () => {
        navigate(paths.apartmentDetail(apartment.Id_Apartment));
    };

    return (
        <Card
            sx={{
                background: "#0F2F34",
                borderRadius: 4,
                overflow: "hidden",
                border: "1px solid #12383D",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)",
                position: "relative",
                "&:hover": {
                    transform: "translateY(-12px)",
                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 224, 198, 0.1)",
                    borderColor: "#00E0C6",
                    "& .image-overlay": { opacity: 1 },
                    "& img": { transform: "scale(1.08)" },
                },
            }}
        >
            {/* Image Container */}
            <Box
                sx={{
                    position: "relative",
                    height: "260px",
                    overflow: "hidden",
                    background: "#071A1D",
                }}
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

                {/* Image Overlay */}
                <Box
                    className="image-overlay"
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "linear-gradient(to top, rgba(7, 26, 29, 0.8), transparent)",
                        opacity: 0,
                        transition: "opacity 0.3s ease",
                    }}
                />

                {/* Favorite Button */}
                <Button
                    onClick={() => toggleFavorite(apartment.Id_Apartment)}
                    sx={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        background: "rgba(12, 37, 41, 0.8)",
                        minWidth: "auto",
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backdropFilter: "blur(8px)",
                        border: "1px solid #12383D",
                        color: favorites.includes(apartment.Id_Apartment) ? "#FF4D6D" : "#8FB5B1",
                        "&:hover": {
                            background: "#0F2F34",
                            borderColor: "#00E0C6",
                            color: "#FF4D6D",
                            transform: "scale(1.1)",
                        },
                    }}
                >
                    {favorites.includes(apartment.Id_Apartment) ? (
                        <FavoriteIcon sx={{ fontSize: 24 }} />
                    ) : (
                        <FavoriteBorderIcon sx={{ fontSize: 24 }} />
                    )}
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
                        sx={{
                            background:
                                apartment.Id_Renter !== null
                                    ? "rgba(255, 77, 109, 0.2)"
                                    : "rgba(34, 227, 164, 0.2)",
                            color: apartment.Id_Renter !== null ? "#FF4D6D" : "#22E3A4",
                            backdropFilter: "blur(8px)",
                            border: `1px solid ${apartment.Id_Renter !== null ? "rgba(255, 77, 109, 0.3)" : "rgba(34, 227, 164, 0.3)"}`,
                            fontWeight: 800,
                            letterSpacing: "0.5px",
                            fontSize: "11px",
                            textTransform: "uppercase",
                        }}
                    />
                </Box>
            </Box>

            {/* Content */}
            <Box sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column", gap: 2.5 }}>
                {/* Address */}
                <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                    <Box
                        sx={{
                            background: "rgba(0, 224, 198, 0.1)",
                            p: 1.2,
                            borderRadius: 1.5,
                            border: "1px solid rgba(0, 224, 198, 0.2)",
                        }}
                    >
                        <LocationOnIcon sx={{ color: "#00E0C6", fontSize: 20 }} />
                    </Box>
                    <Typography
                        sx={{
                            fontWeight: 700,
                            color: "#E6F7F5",
                            fontSize: "15px",
                            lineHeight: 1.4,
                        }}
                    >
                        {apartment.Address}
                    </Typography>
                </Box>

                {/* Owner Info */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.5,
                        p: 2,
                        background: "#0C2529",
                        borderRadius: 2,
                        border: "1px solid #12383D",
                    }}
                >
                    <Box>
                        <Typography
                            sx={{
                                color: "#5C7A77",
                                fontSize: "10px",
                                textTransform: "uppercase",
                                fontWeight: 800,
                                letterSpacing: "1px",
                                mb: 0.5,
                            }}
                        >
                            Proprietar
                        </Typography>
                        <Typography sx={{ color: "#E6F7F5", fontWeight: 700, fontSize: "14px" }}>
                            {getUserName(apartment.Id_Owner)}
                        </Typography>
                    </Box>
                    {apartment.Id_Renter && (
                        <Box sx={{ pt: 1, borderTop: "1px solid #12383D" }}>
                            <Typography
                                sx={{
                                    color: "#5C7A77",
                                    fontSize: "10px",
                                    textTransform: "uppercase",
                                    fontWeight: 800,
                                    letterSpacing: "1px",
                                    mb: 0.5,
                                }}
                            >
                                Chiriaș
                            </Typography>
                            <Typography sx={{ color: "#E6F7F5", fontWeight: 700, fontSize: "14px" }}>
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
                                color: "#5C7A77",
                                fontSize: "10px",
                                textTransform: "uppercase",
                                fontWeight: 800,
                                letterSpacing: "1px",
                            }}
                        >
                            Cost lunar
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
                            <Typography sx={{ color: "#00E0C6", fontWeight: 900, fontSize: "24px" }}>
                                {apartment.Cost_per_interval}
                            </Typography>
                            <Typography sx={{ color: "#8FB5B1", fontWeight: 700, fontSize: "14px" }}>
                                {apartment.Currency}
                            </Typography>
                        </Box>
                    </Box>
                    <Button
                        variant="contained"
                        disabled={apartment.Id_Renter !== null}
                        onClick={handleViewDetails}
                        sx={{
                            background: apartment.Id_Renter !== null ? "rgba(255, 255, 255, 0.05)" : "linear-gradient(90deg, #00E0C6, #00BFA6)",
                            color: apartment.Id_Renter !== null ? "#5C7A77" : "#071A1D",
                            fontWeight: 800,
                            textTransform: "none",
                            borderRadius: 2,
                            px: 3,
                            boxShadow: apartment.Id_Renter !== null ? "none" : "0 0 12px rgba(0, 224, 198, 0.3)",
                            "&:hover": {
                                background: "linear-gradient(90deg, #00FFF0, #00E0C6)",
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
