// pages/Listings.tsx
import { Box, Container, Typography, Button, Badge } from "@mui/material";
import { Home as HomeIcon, TrendingUp as TrendingUpIcon, FilterList as FilterListIcon } from "@mui/icons-material";
import { useCallback, useMemo, useState } from "react";
import { useTranslation }    from "react-i18next";
import { apartments }        from "../mockdata/apartments.ts";
import type { Apartment }    from "../types/apartment.types.ts";
import { users }             from "../mockdata/users.ts";
import ApartmentCard         from "../components/listing/ApartmentCard.tsx";
import SearchBar             from "../components/listing/SearchBar.tsx";
import FilterDrawer          from "../components/filter/FilterDrawer.tsx";
import { defaultFilters, type FilterState } from "../types//filterTypes.ts";
import { gradients, colors } from "../theme/gradients.ts";
import { getApartmentFacilities, getApartmentReviews, getApartmentLocation } from "../mockdata/Apartmentdetails.ts";

const Listings = () => {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery]      = useState("");
    const [favorites, setFavorites]          = useState<number[]>([]);
    const [drawerOpen, setDrawerOpen]        = useState(false);
    const [pendingFilters, setPendingFilters] = useState<FilterState>(defaultFilters);
    const [appliedFilters, setAppliedFilters] = useState<FilterState>(defaultFilters);

    const toggleFavorite = (id: number) =>
        setFavorites((prev) => prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]);

    const getStatus   = (apt: Apartment) => apt.Id_Renter !== null ? t("listings.occupied") : t("listings.available");
    const usersMap    = useMemo(() => Object.fromEntries(users.map((u) => [u.Id_User, u.Name])), []);
    const getUserName = useCallback((id: number) => usersMap[id] ?? t("listings.available"), [usersMap, t]);

    const activeFilterCount = useMemo(() => {
        const f = appliedFilters;
        let n = 0;
        if (f.currency !== "ALL")     n++;
        if (f.interval !== "ALL")     n++;
        if (f.availability !== "ALL") n++;
        if (f.city)                   n++;
        if (f.checkIn)                n++;
        if (f.checkOut)               n++;
        if (f.minRating !== null)     n++;
        if (f.minReviews !== null)    n++;
        const cfg: Record<string, number[]> = { ALL: [0,2000], USD: [0,1000], EUR: [0,1000], MDL: [0,5000] };
        const [min, max] = cfg[f.currency] ?? [0, 2000];
        if (f.priceRange[0] !== min || f.priceRange[1] !== max) n++;
        n += Object.values(f.facilities).filter(Boolean).length;
        return n;
    }, [appliedFilters]);

    const filteredApartments = useMemo(() => {
        const f = appliedFilters;
        return apartments.filter((apt) => {
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                if (!apt.Address.toLowerCase().includes(q) && !apt.Cost_per_interval.toString().includes(searchQuery)) return false;
            }
            if (f.availability === "available" && apt.Id_Renter !== null) return false;
            if (f.availability === "occupied"  && apt.Id_Renter === null)  return false;
            if (f.currency !== "ALL" && apt.Currency !== f.currency)       return false;
            if (f.interval !== "ALL" && apt.Interval !== f.interval)       return false;
            if (apt.Cost_per_interval < f.priceRange[0] || apt.Cost_per_interval > f.priceRange[1]) return false;
            if (f.city) {
                const loc   = getApartmentLocation(apt.Id_Apartment);
                const query = f.city.toLowerCase();
                if (!loc.city.toLowerCase().includes(query) && !(loc.region?.toLowerCase().includes(query)) && !apt.Address.toLowerCase().includes(query)) return false;
            }
            const activeFac = Object.entries(f.facilities).filter(([, v]) => v);
            if (activeFac.length > 0) {
                const fac = getApartmentFacilities(apt.Id_Apartment);
                if (!activeFac.every(([k]) => fac[k as keyof typeof fac])) return false;
            }
            if (f.minRating !== null || f.minReviews !== null) {
                const reviews = getApartmentReviews(apt.Id_Apartment);
                if (f.minReviews !== null && reviews.length < f.minReviews) return false;
                if (f.minRating !== null) {
                    if (!reviews.length) return false;
                    const avg = reviews.reduce((s, r) => s + r.ratings.overall, 0) / reviews.length;
                    if (avg < f.minRating) return false;
                }
            }
            return true;
        });
    }, [searchQuery, appliedFilters]);

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: { xs: 4, md: 8 }, pt: 10 }}>
            <FilterDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                filters={pendingFilters}
                onChange={setPendingFilters}
                onApply={() => setAppliedFilters(pendingFilters)}
                onReset={() => { setPendingFilters(defaultFilters); setAppliedFilters(defaultFilters); }}
            />

            <Container maxWidth={false} sx={{ width: "100%", px: { xs: 2, sm: 3, md: 6, lg: 10 }, display: "flex", alignItems: "center", flexDirection: "column", mt: 10 }}>
                {/* Hero */}
                <Box sx={{ mb: 4, textAlign: "center" }}>
                    <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                        <Box sx={{ background: colors.primaryAlpha10, p: 1.5, px: 3, borderRadius: "100px", display: "flex", alignItems: "center", gap: 2, border: `1px solid ${colors.primaryAlpha25}`, boxShadow: `0 0 20px ${colors.primaryAlpha10}` }}>
                            <TrendingUpIcon sx={{ color: "primary.main", fontSize: 24 }} />
                            <Typography sx={{ color: "text.primary", fontWeight: 700, fontSize: "14px" }}>
                                {filteredApartments.length} {t("listings.active")}
                            </Typography>
                        </Box>
                    </Box>
                    <Typography variant="h2" sx={{ fontWeight: 900, mb: 2, fontSize: { xs: "36px", md: "56px" }, letterSpacing: "-1.5px" }}>
                        {t("listings.title")}{" "}
                        <Box component="span" sx={{ background: gradients.textPrimary, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                            {t("listings.titleSpan")}
                        </Box>
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, maxWidth: "600px", mx: "auto" }}>
                        {t("listings.subtitle")}
                    </Typography>
                </Box>

                {/* Search + Filtre */}
                <Box sx={{ width: "100%", mb: 4, display: "flex", gap: 2, alignItems: "center" }}>
                    <Box sx={{ flex: 1 }}>
                        <SearchBar onSearch={setSearchQuery} />
                    </Box>
                    <Badge badgeContent={activeFilterCount} color="primary" overlap="circular">
                        <Button
                            variant={activeFilterCount > 0 ? "contained" : "outlined"}
                            onClick={() => setDrawerOpen(true)}
                            startIcon={<FilterListIcon />}
                            sx={{ px: 3, borderRadius: 2.5, fontWeight: 700, whiteSpace: "nowrap" }}
                        >
                            {t("listings.filters")}
                        </Button>
                    </Badge>
                </Box>

                {/* No results */}
                {filteredApartments.length === 0 && (
                    <Box sx={{ textAlign: "center", py: 15 }}>
                        <Box sx={{ width: "110px", height: "110px", margin: "0 auto 2.5rem", background: colors.primaryAlpha06, borderRadius: "36px", display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${colors.primaryAlpha15}`, color: "primary.main" }}>
                            <HomeIcon sx={{ fontSize: 55 }} />
                        </Box>
                        <Typography variant="h4" sx={{ mb: 2, fontWeight: 800 }}>{t("listings.noResults")}</Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 5, maxWidth: "400px", mx: "auto" }}>
                            {t("listings.noResultsDesc")}
                        </Typography>
                        <Button variant="contained" onClick={() => { setSearchQuery(""); setAppliedFilters(defaultFilters); setPendingFilters(defaultFilters); }} sx={{ px: 6, py: 1.8, borderRadius: 2.5 }}>
                            {t("listings.resetAll")}
                        </Button>
                    </Box>
                )}

                {/* Grid */}
                {filteredApartments.length > 0 && (
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "1fr 1fr 1fr" }, gap: 5, width: "100%" }}>
                        {filteredApartments.map((apt, idx) => (
                            <Box key={apt.Id_Apartment} sx={{ animation: `fadeInUp 0.5s cubic-bezier(0.165,0.84,0.44,1) ${idx * 0.08}s both`, "@keyframes fadeInUp": { from: { opacity: 0, transform: "translateY(28px)" }, to: { opacity: 1, transform: "translateY(0)" } } }}>
                                <ApartmentCard apartment={apt} toggleFavorite={toggleFavorite} favorites={favorites} getStatus={getStatus} getUserName={getUserName} />
                            </Box>
                        ))}
                    </Box>
                )}

                {/* Paginare */}
                {filteredApartments.length > 0 && (
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 12 }}>
                        <Button variant="outlined" sx={{ px: 3, borderRadius: 1.5 }}>{t("listings.prev")}</Button>
                        <Button variant="contained" sx={{ minWidth: "50px", height: "50px", borderRadius: 1.5, fontWeight: 900 }}>1</Button>
                        <Button variant="outlined" sx={{ px: 3, borderRadius: 1.5 }}>{t("listings.next")}</Button>
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default Listings;