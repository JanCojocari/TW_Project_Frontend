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
import { useCallback, useMemo, useState } from "react";
import { apartments } from "../mockdata/apartments.ts";
import type { Apartment } from "../types/apartment.types.ts";
import { users } from "../mockdata/users.ts";
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
                background: "#071A1D",
                py: { xs: 4, md: 8 },
                pt:10,
                position: "relative",
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
                    mt:10,
                }}
            >
                {/* Hero Header */}
                <Box sx={{ mb: 10, textAlign: "center" }}>
                    <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                        <Box
                            sx={{
                                background: "rgba(0, 224, 198, 0.08)",
                                p: 1.5,
                                px: 3,
                                borderRadius: "100px",
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                border: "1px solid rgba(0, 224, 198, 0.2)",
                                boxShadow: "0 0 20px rgba(0, 224, 198, 0.1)",
                            }}
                        >
                            <TrendingUpIcon sx={{ color: "#00E0C6", fontSize: 24 }} />
                            <Typography sx={{ color: "#E6F7F5", fontWeight: 700, fontSize: "14px" }}>
                                {filteredApartments.length} Proprietăți Active
                            </Typography>
                        </Box>
                    </Box>
                    <Typography
                        variant="h2"
                        sx={{
                            fontWeight: 900,
                            mb: 2,
                            color: "#E6F7F5",
                            fontSize: { xs: "36px", md: "56px" },
                            letterSpacing: "-1.5px",
                        }}
                    >
                        Colecția de <Box component="span" sx={{ color: "#00E0C6" }}>Imobiliare</Box>
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            color: "#8FB5B1",
                            fontWeight: 400,
                            maxWidth: "600px",
                            mx: "auto",
                        }}
                    >
                        Descoperă spații care inspiră, atent selecționate pentru standardele tale de viață.
                    </Typography>
                </Box>

                {/* Search Bar Wrapper */}
                <Box sx={{ width: "100%", mb: 8 }}>
                    <SearchBar onSearch={setSearchQuery} />
                </Box>

                {/* No Results Message */}
                {filteredApartments.length === 0 && (
                    <Box sx={{ textAlign: "center", py: 15 }}>
                        <Box
                            sx={{
                                width: "120px",
                                height: "120px",
                                margin: "0 auto 2.5rem",
                                background: "rgba(0, 224, 198, 0.05)",
                                borderRadius: "40px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: "1px solid rgba(0, 224, 198, 0.1)",
                                color: "#00E0C6",
                            }}
                        >
                            <HomeIcon sx={{ fontSize: 60 }} />
                        </Box>
                        <Typography
                            variant="h4"
                            sx={{ color: "#E6F7F5", mb: 2, fontWeight: 800 }}
                        >
                            Niciun rezultat găsit
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{ color: "#8FB5B1", mb: 5, maxWidth: "400px", mx: "auto" }}
                        >
                            Nu am găsit nicio proprietate care să corespundă criteriilor tale de căutare.
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={() => setSearchQuery("")}
                            sx={{
                                background: "linear-gradient(90deg, #00E0C6, #00BFA6)",
                                color: "#071A1D",
                                textTransform: "none",
                                fontWeight: 800,
                                px: 6,
                                py: 2,
                                borderRadius: 2,
                                boxShadow: "0 0 15px rgba(0, 224, 198, 0.3)",
                                "&:hover": {
                                    background: "linear-gradient(90deg, #00FFF0, #00E0C6)",
                                    boxShadow: "0 0 25px rgba(0, 224, 198, 0.4)",
                                },
                            }}
                        >
                            Resetează Căutarea
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
                            gap: 5,
                            width: "100%",
                        }}
                    >
                        {filteredApartments.map((apartment, index) => (
                            <Box
                                key={apartment.Id_Apartment}
                                sx={{
                                    animation: `fadeInUp 0.6s cubic-bezier(0.165, 0.84, 0.44, 1) ${index * 0.1}s both`,
                                    "@keyframes fadeInUp": {
                                        from: { opacity: 0, transform: "translateY(30px)" },
                                        to: { opacity: 1, transform: "translateY(0)" },
                                    },
                                }}
                            >
                                <ApartmentCard
                                    apartment={apartment}
                                    toggleFavorite={toggleFavorite}
                                    favorites={favorites}
                                    getStatus={getStatus}
                                    getUserName={getUserName}
                                />
                            </Box>
                        ))}
                    </Box>
                )}

                {/* Pagination */}
                {filteredApartments.length > 0 && (
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 3, mt: 12 }}>
                        <Button
                            variant="outlined"
                            sx={{
                                borderColor: "#12383D",
                                color: "#8FB5B1",
                                fontWeight: 700,
                                px: 3,
                                borderRadius: 1.5,
                                "&:hover": {
                                    borderColor: "#00E0C6",
                                    background: "rgba(0, 224, 198, 0.05)",
                                    color: "#E6F7F5",
                                },
                            }}
                        >
                            ← Anterior
                        </Button>
                        <Button
                            variant="contained"
                            sx={{
                                background: "#00E0C6",
                                color: "#071A1D",
                                fontWeight: 900,
                                minWidth: "50px",
                                height: "50px",
                                borderRadius: 1.5,
                                boxShadow: "0 0 15px rgba(0, 224, 198, 0.3)",
                                "&:hover": {
                                    background: "#00FFF0",
                                    boxShadow: "0 0 25px rgba(0, 224, 198, 0.5)",
                                },
                            }}
                        >
                            1
                        </Button>
                        <Button
                            variant="outlined"
                            sx={{
                                borderColor: "#12383D",
                                color: "#8FB5B1",
                                fontWeight: 700,
                                px: 3,
                                borderRadius: 1.5,
                                "&:hover": {
                                    borderColor: "#00E0C6",
                                    background: "rgba(0, 224, 198, 0.05)",
                                    color: "#E6F7F5",
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