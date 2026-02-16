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
    getIntervalLabel: (interval: string) => string;
    getStatus: (apartment:Apartment) => string;
}

const ApartmentCard= ({apartment,favorites,toggleFavorite,getUserName,getIntervalLabel,getStatus}: Props) => {

    const navigate = useNavigate();

    const handleViewDetails = () => {
        navigate(paths.apartmentDetail(apartment.Id_Apartment));
    };
    
    return (
        <Card
            sx={{
                background: "white",
                borderRadius: 4,
                overflow: "hidden",
                border: "1px solid #e5e7eb",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                position: "relative",
                "&:hover": {
                    transform: "translateY(-16px)",
                    boxShadow: "0 30px 60px rgba(37, 99, 235, 0.2)",
                    borderColor: "#2563eb",
                    "& .image-overlay": {
                        opacity: 1,
                    },
                    "& img": {
                        transform: "scale(1.05)",
                    },
                },
            }}
        >
            {/* Image Container */}
            <Box
                sx={{
                    position: "relative",
                    height: "260px",
                    overflow: "hidden",
                    background: "#f0f0f0",
                }}
            >
                <img
                    src={apartment.image_url}
                    alt={apartment.Address}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
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
                        background: "linear-gradient(135deg, rgba(37, 99, 235, 0.2), rgba(124, 58, 237, 0.2))",
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
                        background: "rgba(255, 255, 255, 0.95)",
                        minWidth: "auto",
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        p: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.3s ease",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255, 255, 255, 0.5)",
                        "&:hover": {
                            transform: "scale(1.15)",
                            background: "white",
                            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
                        },
                    }}
                >
                    {favorites.includes(apartment.Id_Apartment) ? (
                        <FavoriteIcon sx={{ color: "#ef4444", fontSize: 26 }} />
                    ) : (
                        <FavoriteBorderIcon sx={{ color: "#6b7280", fontSize: 26 }} />
                    )}
                </Button>

                {/* Status Badge */}
                <Box
                    sx={{
                        position: "absolute",
                        bottom: 16,
                        left: 16,
                        display: "flex",
                        gap: 1,
                        flexWrap: "wrap",
                    }}
                >
                    <Chip
                        label={getStatus(apartment)}
                        sx={{
                            background:
                                apartment.Id_Renter !== null
                                    ? "linear-gradient(135deg, #ef4444, #dc2626)"
                                    : "linear-gradient(135deg, #10b981, #059669)",
                            color: "white",
                            fontWeight: 700,
                            fontSize: "12px",
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(255, 255, 255, 0.3)",
                        }}
                    />
                </Box>
            </Box>

            {/* Content */}
            <Box sx={{ p: 4, flex: 1, display: "flex", flexDirection: "column", gap: 3}}>
                {/* Address */}
                <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                    <Box
                        sx={{
                            background: "linear-gradient(135deg, #2563eb, #4f46e5)",
                            p: 1.5,
                            borderRadius: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <LocationOnIcon
                            sx={{
                                color: "white",
                                fontSize: 20,
                            }}
                        />
                    </Box>
                    <Box>
                        <Typography
                            sx={{
                                fontWeight: 700,
                                color: "#1f2937",
                                fontSize: 15,
                                lineHeight: 1.4,
                            }}
                        >
                            {apartment.Address}
                        </Typography>
                    </Box>
                </Box>
                {/*Aici punem rating*/}
                {/* Owner and Renter Info */}
                <Box
                    sx={{
                        display: "flex",
                        gap: 1.5,
                        padding: "12px",
                        background: "#f3f4f6",
                        borderRadius: 2,
                        fontSize: "13px",
                    }}
                >
                    <Box>
                        <Typography
                            variant="body2"
                            sx={{
                                color: "#6b7280",
                                fontSize: "11px",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                                fontWeight: 600,
                            }}
                        >
                            Proprietar
                        </Typography>
                        <Typography
                            sx={{
                                color: "#1f2937",
                                fontWeight: 700,
                                fontSize: "14px",
                            }}
                        >
                            Nume: {getUserName(apartment.Id_Owner)}
                        </Typography>
                    </Box>
                    {apartment.Id_Renter && (
                        <>
                            <Box sx={{ width: "1px", background: "#d1d5db" }} />
                            <Box>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: "#6b7280",
                                        fontSize: "11px",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.5px",
                                        fontWeight: 600,
                                    }}
                                >
                                    Chiriaș
                                </Typography>
                                <Typography
                                    sx={{
                                        color: "#1f2937",
                                        fontWeight: 700,
                                        fontSize: "14px",
                                    }}
                                >
                                    Nume: {getUserName(apartment.Id_Owner)}
                                </Typography>
                            </Box>
                        </>
                    )}
                </Box>

                {/* Price Section */}
                <Box
                    sx={{
                        mt: "auto",
                        pt: 2,
                        borderTop: "1px solid #e5e7eb",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-end",
                        gap: 2,
                    }}
                >
                    <Box>
                        <Typography
                            variant="body2"
                            sx={{
                                color: "#6b7280",
                                fontSize: "12px",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                                fontWeight: 600,
                                mb: 0.5,
                            }}
                        >
                            Preț
                        </Typography>
                        <Box sx={{ display: "flex", gap: 0.5, alignItems: "baseline" }}>
                            <Typography
                                sx={{
                                    fontWeight: 900,
                                    color: "#2563eb",
                                    fontSize: 24,
                                }}
                            >
                                {apartment.Cost_per_interval}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "#6b7280",
                                    fontWeight: 600,
                                }}
                            >
                                {apartment.Currency}/{getIntervalLabel(apartment.Interval)}
                            </Typography>
                        </Box>
                    </Box>
                    <Button
                        variant="contained"
                        disabled={apartment.Id_Renter !== null}
                        onClick={handleViewDetails}
                        sx={{
                            background:
                                apartment.Id_Renter !== null
                                    ? "#d1d5db"
                                    : "linear-gradient(135deg, #2563eb, #4f46e5, #7c3aed)",
                            fontWeight: 700,
                            textTransform: "none",
                            fontSize: 14,
                            px: 3,
                            py: 1.2,
                            borderRadius: 2,
                            transition: "all 0.3s ease",
                            "&:hover": {
                                transform: apartment.Id_Renter === null ? "translateY(-2px)" : "none",
                                boxShadow:
                                    apartment.Id_Renter === null
                                        ? "0 12px 24px rgba(37, 99, 235, 0.4)"
                                        : "none",
                            },
                        }}
                    >
                        {apartment.Id_Renter !== null ? "Ocupat" : "Vezi detalii"}
                    </Button>
                </Box>
            </Box>
        </Card>
    );
};

export default memo(ApartmentCard);
