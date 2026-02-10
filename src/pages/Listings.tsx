import {
    Box,
    Container,
    Typography,
    Card,
    TextField,
    Button,
    Chip,
    InputAdornment,
    Paper,
    // Rating,
} from "@mui/material";
import {
    Search as SearchIcon,
    LocationOn as LocationOnIcon,
    MonetizationOn as MonetizationOnIcon,
    Home as HomeIcon,
    FavoriteBorder as FavoriteBorderIcon,
    Favorite as FavoriteIcon,
} from "@mui/icons-material";
import { useState } from "react";
import {apartments} from "../mockdata/apartments.ts";
import type {Apartment} from "../types/apartment.types.ts";

const Listings = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [favorites, setFavorites] = useState<number[]>([]);


    // Filter apartments
    const filteredApartments = apartments.filter((apt) => {
        const matchesSearch =
            apt.Address.toLowerCase().includes(searchQuery.toLowerCase()) ||
            apt.Cost_per_interval.toString().includes(searchQuery);

        return matchesSearch;
    });

    const toggleFavorite = (id: number) => {
        setFavorites((prev) =>
            prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
        );
    };

    // Helper function pentru interval name în română
    const getIntervalLabel = (interval: string): string => {
        const intervals: { [key: string]: string } = {
            hour: "ora",
            day: "zi",
            month: "lună",
        };
        return intervals[interval] || interval;
    };

    // Helper function pentru status
    const getStatus = (apartment: Apartment): string => {
        return apartment.Id_Renter !== null ? "Ocupat" : "Disponibil";
    };

    return (
        <Box sx={{ minHeight: "100vh", background: "#f8f9fa", py: { xs: 3, md: 5 },mt:10 }}>
            <Container maxWidth="lg">
                {/* Header */}
                <Box sx={{ mb: 6 }}>
                    <Typography
                        variant="h3"
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            fontWeight: 900,
                            mb: 2,
                            background: "linear-gradient(90deg, #2563eb, #4f46e5, #7c3aed)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        Anunțuri Imobiliare
                    </Typography>
                </Box>

                {/* Search Bar */}
                <Paper
                    elevation={0}
                    sx={{
                        background: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: 10,
                        p: 3,
                        mb: 4,
                    }}
                >
                    <TextField
                        placeholder="Caută după adresă sau preț..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: "#9ca3af" }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Paper>

                {/* No Results Message */}
                {filteredApartments.length === 0 && (
                    <Box sx={{ textAlign: "center", py: 8 }}>
                        <HomeIcon sx={{ fontSize: 60, color: "#d1d5db", mb: 2 }} />
                        <Typography variant="h5" sx={{ color: "#6b7280", mb: 1 }}>
                            Nu am găsit apartamente
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#9ca3af" }}>
                            Încearcă să modifici criteriile de căutare
                        </Typography>
                    </Box>
                )}

                {/* Apartments Grid */}
                {filteredApartments.length > 0 && (
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                sm: "1fr 1fr",
                                lg: "1fr 1fr 1fr",
                            },
                            gap: 3,
                        }}
                    >
                        {filteredApartments.map((apartment) => (
                            <Box
                                key={apartment.Id_Apartment}
                                sx={{
                                    animation: "fadeInUp 0.5s ease",
                                    "@keyframes fadeInUp": {
                                        from: {
                                            opacity: 0,
                                            transform: "translateY(20px)",
                                        },
                                        to: {
                                            opacity: 1,
                                            transform: "translateY(0)",
                                        },
                                    },
                                }}
                            >
                                <Card
                                    sx={{
                                        background: "white",
                                        borderRadius: 3,
                                        overflow: "hidden",
                                        border: "1px solid #e5e7eb",
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        transition: "all 0.3s ease",
                                        "&:hover": {
                                            transform: "translateY(-12px)",
                                            boxShadow: "0 24px 48px rgba(37, 99, 235, 0.15)",
                                            borderColor: "#2563eb",
                                        },
                                    }}
                                >
                                    {/* Image Container */}
                                    <Box
                                        sx={{
                                            position: "relative",
                                            height: "240px",
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
                                                transition: "transform 0.3s ease",
                                            }}
                                        />

                                        {/* Favorite Button */}
                                        <Button
                                            onClick={() => toggleFavorite(apartment.Id_Apartment)}
                                            sx={{
                                                position: "absolute",
                                                top: 12,
                                                right: 12,
                                                background: "rgba(255, 255, 255, 0.95)",
                                                minWidth: "auto",
                                                width: 44,
                                                height: 44,
                                                borderRadius: "50%",
                                                p: 0,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                transition: "all 0.3s ease",
                                                "&:hover": {
                                                    transform: "scale(1.1)",
                                                    background: "white",
                                                },
                                            }}
                                        >
                                            {favorites.includes(apartment.Id_Apartment) ? (
                                                <FavoriteIcon sx={{ color: "#ef4444", fontSize: 24 }} />
                                            ) : (
                                                <FavoriteBorderIcon sx={{ color: "#6b7280", fontSize: 24 }} />
                                            )}
                                        </Button>

                                        {/* Status Badge */}
                                        <Chip
                                            label={getStatus(apartment)}
                                            sx={{
                                                position: "absolute",
                                                bottom: 12,
                                                left: 12,
                                                background:
                                                    apartment.Id_Renter !== null
                                                        ? "#ef4444"
                                                        : "linear-gradient(90deg, #10b981, #059669)",
                                                color: "white",
                                                fontWeight: 600,
                                            }}
                                        />
                                    </Box>

                                    {/* Content */}
                                    <Box sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                                        {/* Address */}
                                        <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
                                            <LocationOnIcon
                                                sx={{
                                                    color: "#2563eb",
                                                    fontSize: 20,
                                                    mt: 0.5,
                                                    flexShrink: 0,
                                                }}
                                            />
                                            <Typography
                                                sx={{
                                                    fontWeight: 600,
                                                    color: "#1f2937",
                                                    fontSize: 15,
                                                }}
                                            >
                                                {apartment.Address}
                                            </Typography>
                                        </Box>

                                        {/* Rating */}
                                        {/*{apartment.rating && (*/}
                                        {/*    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>*/}
                                        {/*        <Rating*/}
                                        {/*            value={apartment.rating}*/}
                                        {/*            readOnly*/}
                                        {/*            size="small"*/}
                                        {/*            sx={{*/}
                                        {/*                "& .MuiRating-iconFilled": {*/}
                                        {/*                    color: "#fbbf24",*/}
                                        {/*                },*/}
                                        {/*            }}*/}
                                        {/*        />*/}
                                        {/*        <Typography*/}
                                        {/*            variant="body2"*/}
                                        {/*            sx={{*/}
                                        {/*                color: "#6b7280",*/}
                                        {/*                fontSize: "12px",*/}
                                        {/*            }}*/}
                                        {/*        >*/}
                                        {/*            ({apartment.reviews} recenzii)*/}
                                        {/*        </Typography>*/}
                                        {/*    </Box>*/}
                                        {/*)}*/}

                                        {/* Owner and Renter Info */}
                                        <Box sx={{ display: "flex", gap: 2, fontSize: "12px" }}>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: "#6b7280",
                                                }}
                                            >
                                                Proprietar ID: <strong>{apartment.Id_Owner}</strong>
                                            </Typography>
                                            {apartment.Id_Renter && (
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: "#6b7280",
                                                    }}
                                                >
                                                    Chiriaș ID: <strong>{apartment.Id_Renter}</strong>
                                                </Typography>
                                            )}
                                        </Box>

                                        {/* Price */}
                                        <Box
                                            sx={{
                                                mt: "auto",
                                                pt: 2,
                                                borderTop: "1px solid #e5e7eb",
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
                                                <MonetizationOnIcon
                                                    sx={{
                                                        color: "#10b981",
                                                        fontSize: 20,
                                                    }}
                                                />
                                                <Typography
                                                    sx={{
                                                        fontWeight: 700,
                                                        color: "#1f2937",
                                                        fontSize: 16,
                                                    }}
                                                >
                                                    {apartment.Cost_per_interval}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: "#6b7280",
                                                    }}
                                                >
                                                    {apartment.Currency}/{getIntervalLabel(apartment.Interval)}
                                                </Typography>
                                            </Box>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                disabled={apartment.Id_Renter !== null}
                                                sx={{
                                                    background:
                                                        apartment.Id_Renter !== null
                                                            ? "#d1d5db"
                                                            : "linear-gradient(90deg, #2563eb, #4f46e5)",
                                                    fontWeight: 600,
                                                    textTransform: "none",
                                                    fontSize: 13,
                                                    px: 2,
                                                    transition: "all 0.3s ease",
                                                    "&:hover": {
                                                        transform: apartment.Id_Renter === null ? "translateY(-2px)" : "none",
                                                        boxShadow:
                                                            apartment.Id_Renter === null
                                                                ? "0 8px 16px rgba(37, 99, 235, 0.3)"
                                                                : "none",
                                                    },
                                                }}
                                            >
                                                {apartment.Id_Renter !== null ? "Ocupat" : "Detalii"}
                                            </Button>
                                        </Box>
                                    </Box>
                                </Card>
                            </Box>
                        ))}
                    </Box>
                )}

                {/* Pagination */}
                {filteredApartments.length > 0 && (
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 6 }}>
                        <Button variant="outlined" sx={{ borderColor: "#2563eb", color: "#2563eb" }}>
                            Anterior
                        </Button>
                        <Button
                            variant="contained"
                            sx={{
                                background: "linear-gradient(90deg, #2563eb, #4f46e5)",
                                color: "white",
                            }}
                        >
                            1
                        </Button>
                        <Button variant="outlined" sx={{ borderColor: "#2563eb", color: "#2563eb" }}>
                            Următor
                        </Button>
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default Listings;