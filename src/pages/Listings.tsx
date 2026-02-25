import { Box, Container, Typography, Button } from "@mui/material";
import { Home as HomeIcon, TrendingUp as TrendingUpIcon } from "@mui/icons-material";
import { useCallback, useMemo, useState } from "react";
import { apartments } from "../mockdata/apartments.ts";
import type { Apartment } from "../types/apartment.types.ts";
import { users } from "../mockdata/users.ts";
import ApartmentCard from "../components/ApartmentCard.tsx";
import SearchBar from "../components/SearchBar.tsx";
import { gradients, colors } from "../theme/gradients.ts";

const Listings = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [favorites, setFavorites] = useState<number[]>([]);

    const filteredApartments = useMemo(() => {
        if (!searchQuery) return apartments;
        const q = searchQuery.toLowerCase();
        return apartments.filter(
            (apt) => apt.Address.toLowerCase().includes(q) || apt.Cost_per_interval.toString().includes(searchQuery)
        );
    }, [searchQuery]);

    const toggleFavorite = (id: number) =>
        setFavorites((prev) => prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]);

    const getStatus = (apartment: Apartment) => (apartment.Id_Renter !== null ? "Ocupat" : "Disponibil");

    const usersMap = useMemo(() => Object.fromEntries(users.map((u) => [u.Id_User, u.Name])), []);
    const getUserName = useCallback((id: number) => usersMap[id] ?? "Proprietar necunoscut", [usersMap]);

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: { xs: 4, md: 8 }, pt: 10 }}>
            <Container
                maxWidth={false}
                sx={{
                    width:  "100%",
                    px:     { xs: 2, sm: 3, md: 6, lg: 10 },
                    zIndex: 1,
                    display:"flex",
                    alignItems: "center",
                    flexDirection: "column",
                    mt: 10,
                }}
            >
                {/* Hero Header */}
                <Box sx={{ mb: 3, textAlign: "center" }}>
                    <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                        <Box
                            sx={{
                                background:  colors.primaryAlpha10,
                                p:           1.5,
                                px:          3,
                                borderRadius:"100px",
                                display:     "flex",
                                alignItems:  "center",
                                gap:         2,
                                border:      `1px solid ${colors.primaryAlpha25}`,
                                boxShadow:   `0 0 20px ${colors.primaryAlpha10}`,
                            }}
                        >
                            <TrendingUpIcon sx={{ color: "primary.main", fontSize: 24 }} />
                            <Typography sx={{ color: "text.primary", fontWeight: 700, fontSize: "14px" }}>
                                {filteredApartments.length} Proprietăți Active
                            </Typography>
                        </Box>
                    </Box>

                    <Typography
                        variant="h2"
                        sx={{ fontWeight: 900, mb: 2, fontSize: { xs: "36px", md: "56px" }, letterSpacing: "-1.5px" }}
                    >
                        Colecția de{" "}
                        <Box
                            component="span"
                            sx={{ background: gradients.textPrimary, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                        >
                            Imobiliare
                        </Box>
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, maxWidth: "600px", mx: "auto" }}>
                        Descoperă spații care inspiră, atent selecționate pentru standardele tale de viață.
                    </Typography>
                </Box>

                {/* Search */}
                <Box sx={{ width: "100%", mb: 4 }}>
                    <SearchBar onSearch={setSearchQuery} />
                </Box>

                {/* No results */}
                {filteredApartments.length === 0 && (
                    <Box sx={{ textAlign: "center", py: 15 }}>
                        <Box
                            sx={{
                                width:        "110px",
                                height:       "110px",
                                margin:       "0 auto 2.5rem",
                                background:   colors.primaryAlpha06,
                                borderRadius: "36px",
                                display:      "flex",
                                alignItems:   "center",
                                justifyContent: "center",
                                border:       `1px solid ${colors.primaryAlpha15}`,
                                color:        "primary.main",
                            }}
                        >
                            <HomeIcon sx={{ fontSize: 55 }} />
                        </Box>
                        <Typography variant="h4" sx={{ mb: 2, fontWeight: 800 }}>Niciun rezultat găsit</Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 5, maxWidth: "400px", mx: "auto" }}>
                            Nu am găsit nicio proprietate care să corespundă criteriilor tale de căutare.
                        </Typography>
                        <Button variant="contained" onClick={() => setSearchQuery("")} sx={{ px: 6, py: 1.8, borderRadius: 2.5 }}>
                            Resetează Căutarea
                        </Button>
                    </Box>
                )}

                {/* Grid */}
                {filteredApartments.length > 0 && (
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "1fr 1fr 1fr" },
                            gap:   5,
                            width: "100%",
                        }}
                    >
                        {filteredApartments.map((apartment, index) => (
                            <Box
                                key={apartment.Id_Apartment}
                                sx={{
                                    animation: `fadeInUp 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) ${index * 0.08}s both`,
                                    "@keyframes fadeInUp": {
                                        from: { opacity: 0, transform: "translateY(28px)" },
                                        to:   { opacity: 1, transform: "translateY(0)" },
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
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 12 }}>
                        <Button variant="outlined" sx={{ px: 3, borderRadius: 1.5 }}>← Anterior</Button>
                        <Button
                            variant="contained"
                            sx={{ minWidth: "50px", height: "50px", borderRadius: 1.5, fontWeight: 900 }}
                        >
                            1
                        </Button>
                        <Button variant="outlined" sx={{ px: 3, borderRadius: 1.5 }}>Următor →</Button>
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default Listings;