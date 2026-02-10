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
    Home as HomeIcon,
    FavoriteBorder as FavoriteBorderIcon,
    Favorite as FavoriteIcon,
    TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import { useState } from "react";
import {apartments} from "../mockdata/apartments.ts";
import type {Apartment} from "../types/apartment.types.ts";
import {users} from "../mockdata/users.ts";

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

    const getUserName = (owner_id: number): string => {
        const owner = users.find(obj => obj.Id_User === owner_id);
        return owner ? owner.Name : "Proprietar necunoscut";
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #f8f9fa 0%, #f0f4ff 100%)",
                py: { xs: 3, md: 5 },
                mt: 10,
                position: "relative",
                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "300px",
                    background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 50%, #7c3aed 100%)",
                    opacity: 0.05,
                    zIndex: 0,
                }
            }}
        >
            <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
                {/* Hero Header */}
                <Box sx={{ mb: 8, textAlign: "center" }}>
                    <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                        <Box
                            sx={{
                                background: "linear-gradient(135deg, #2563eb, #4f46e5, #7c3aed)",
                                p: 2,
                                borderRadius: 2,
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                            }}
                        >
                            <TrendingUpIcon sx={{ color: "white", fontSize: 28 }} />
                            <Typography sx={{ color: "white", fontWeight: 600 }}>
                                {filteredApartments.length} apartamente disponibile
                            </Typography>
                        </Box>
                    </Box>
                    <Typography
                        variant="h2"
                        sx={{
                            fontWeight: 900,
                            mb: 2,
                            background: "linear-gradient(90deg, #2563eb, #4f46e5, #7c3aed)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            fontSize: { xs: "32px", md: "48px" },
                        }}
                    >
                        Descoperă apartamentele tale
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            color: "#6b7280",
                            fontWeight: 400,
                            maxWidth: "600px",
                            mx: "auto",
                        }}
                    >
                        Găsește locuința perfectă din cea mai mare colecție de proprietăți
                    </Typography>
                </Box>

                {/* Search Bar - Premium Style */}
                <Paper
                    elevation={0}
                    sx={{
                        background: "white",
                        border: "2px solid #e5e7eb",
                        borderRadius: 4,
                        p: 3,
                        mb: 8,
                        transition: "all 0.3s ease",
                        boxShadow: "0 10px 30px rgba(37, 99, 235, 0.08)",
                        "&:hover, &:focus-within": {
                            borderColor: "#2563eb",
                            boxShadow: "0 20px 40px rgba(37, 99, 235, 0.15)",
                        },
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
                                    <SearchIcon sx={{ color: "#2563eb", fontSize: 28 }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            "& .MuiInput-underline:before": { borderBottom: "none" },
                            "& .MuiInput-underline:hover:before": { borderBottom: "none" },
                            "& .MuiInput-underline:after": { borderBottom: "none" },
                            "& input": {
                                fontSize: "16px",
                                fontWeight: 500,
                                "&::placeholder": {
                                    color: "#9ca3af",
                                    opacity: 0.7,
                                },
                            },
                        }}
                    />
                </Paper>

                {/* No Results Message */}
                {filteredApartments.length === 0 && (
                    <Box sx={{ textAlign: "center", py: 12 }}>
                        <Box
                            sx={{
                                width: "100px",
                                height: "100px",
                                margin: "0 auto 2rem",
                                background: "linear-gradient(135deg, #2563eb, #4f46e5)",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <HomeIcon sx={{ fontSize: 50, color: "white" }} />
                        </Box>
                        <Typography
                            variant="h4"
                            sx={{ color: "#1f2937", mb: 1, fontWeight: 700 }}
                        >
                            Nu am găsit apartamente
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{ color: "#6b7280", mb: 3 }}
                        >
                            Încearcă să modifici criteriile de căutare
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={() => setSearchQuery("")}
                            sx={{
                                background: "linear-gradient(90deg, #2563eb, #4f46e5)",
                                textTransform: "none",
                                fontWeight: 600,
                                px: 4,
                                py: 1.5,
                            }}
                        >
                            Resetare căutare
                        </Button>
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
                            gap: 4,
                        }}
                    >
                        {filteredApartments.map((apartment, index) => (
                            <Box
                                key={apartment.Id_Apartment}
                                sx={{
                                    animation: `fadeInUp 0.5s ease ${index * 0.1}s both`,
                                    "@keyframes fadeInUp": {
                                        from: {
                                            opacity: 0,
                                            transform: "translateY(30px)",
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
                            </Box>
                        ))}
                    </Box>
                )}

                {/* Pagination */}
                {filteredApartments.length > 0 && (
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 10 }}>
                        <Button
                            variant="outlined"
                            sx={{
                                borderColor: "#2563eb",
                                color: "#2563eb",
                                fontWeight: 600,
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    background: "rgba(37, 99, 235, 0.08)",
                                },
                            }}
                        >
                            ← Anterior
                        </Button>
                        <Button
                            variant="contained"
                            sx={{
                                background: "linear-gradient(135deg, #2563eb, #4f46e5, #7c3aed)",
                                color: "white",
                                fontWeight: 700,
                                minWidth: "50px",
                            }}
                        >
                            1
                        </Button>
                        <Button
                            variant="outlined"
                            sx={{
                                borderColor: "#2563eb",
                                color: "#2563eb",
                                fontWeight: 600,
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    background: "rgba(37, 99, 235, 0.08)",
                                },
                            }}
                        >
                            Următor →
                        </Button>
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default Listings;