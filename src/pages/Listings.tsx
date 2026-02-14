import {
    Box,
    Container,
    Typography,
    Button,
} from "@mui/material";
import {
    Home as HomeIcon,
    TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import {useCallback, useMemo, useState} from "react";
import {apartments} from "../mockdata/apartments.ts";
import type {Apartment} from "../types/apartment.types.ts";
import {users} from "../mockdata/users.ts";
import ApartmentCard from "../components/ApartmentCard.tsx";
import SearchBar from "../components/SearchBar.tsx";

const Listings = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [favorites, setFavorites] = useState<number[]>([]);

    // Filter apartments
    const filteredApartments = useMemo(() => {
        if (!searchQuery) return apartments;

        const query = searchQuery.toLowerCase();

        return apartments.filter((apt) =>
            apt.Address.toLowerCase().includes(query) ||
            apt.Cost_per_interval.toString().includes(searchQuery)
        );
    }, [searchQuery]);

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

    const usersMap = useMemo(() => {
        return Object.fromEntries(
            users.map(user => [user.Id_User, user.Name])
        );
    }, []);


    const getUserName = useCallback((owner_id: number): string => {
        return usersMap[owner_id] ?? "Proprietar necunoscut";
    }, [usersMap]);


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
            <Container
                maxWidth={false}
                sx={{
                    width: "100%",
                    px: { xs: 2, sm: 3, md: 6, lg: 10 },
                    position: "relative",
                    zIndex: 1,
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                }}

            >
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
                <SearchBar onSearch={setSearchQuery} />



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
                                }}
                            >
                                <ApartmentCard
                                    apartment={apartment}
                                    toggleFavorite={toggleFavorite}
                                    favorites={favorites}
                                    getStatus={getStatus}
                                    getUserName={getUserName}
                                    getIntervalLabel={getIntervalLabel}
                                />
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