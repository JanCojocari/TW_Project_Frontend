// pages/Listings.tsx
import { Box, Container, Typography, Button, Badge, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Snackbar, Alert } from "@mui/material";
import { Home as HomeIcon, TrendingUp as TrendingUpIcon, FilterList as FilterListIcon } from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";
import { useNavigate }    from "react-router-dom";
import { useTranslation }    from "react-i18next";
import type { Apartment }    from "../types/apartment.types.ts";
import ApartmentCard         from "../components/listing/ApartmentCard.tsx";
import SearchBar             from "../components/listing/SearchBar.tsx";
import FilterDrawer          from "../components/filter/FilterDrawer.tsx";
import { defaultFilters, type FilterState } from "../types//filterTypes.ts";
import { gradients, colors } from "../theme/gradients.ts";
import { apartmentService }       from "../services/apartmentService.ts";
import { paymentHistoryService }   from "../services/paymentHistoryService.ts";
import { favoriteService }    from "../services/favoriteService.ts";
import { useAuth }            from "../auth/AuthContext";
import { paths }              from "../app/paths.ts";

const LISTINGS_PER_PAGE = 24;

const Listings = () => {
    const { t } = useTranslation();
    const navigate        = useNavigate();
    const { currentUser } = useAuth();

    const [deleteTarget, setDeleteTarget] = useState<Apartment | null>(null);
    const [deleteBusy, setDeleteBusy]     = useState(false);
    const [snack, setSnack]               = useState<{ msg: string; sev: "success" | "error" } | null>(null);

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        setDeleteBusy(true);
        try {
            await apartmentService.delete(deleteTarget.Id_Apartment);
            setApartments(prev => prev.filter(a => a.Id_Apartment !== deleteTarget.Id_Apartment));
            setSnack({ msg: "Anunțul a fost șters.", sev: "success" });
        } catch {
            setSnack({ msg: "Eroare la ștergere. Încearcă din nou.", sev: "error" });
        } finally {
            setDeleteBusy(false);
            setDeleteTarget(null);
        }
    };
    const [apartments, setApartments]         = useState<Apartment[]>([]);
    const [searchQuery, setSearchQuery]      = useState("");
    const [favorites, setFavorites]          = useState<number[]>([]);
    const [drawerOpen, setDrawerOpen]        = useState(false);
    const [pendingFilters, setPendingFilters] = useState<FilterState>(defaultFilters);
    const [appliedFilters, setAppliedFilters] = useState<FilterState>(defaultFilters);
    const [currentPage, setCurrentPage]      = useState(1);
    // Set cu ID-urile apartamentelor ocupate in intervalul checkIn-checkOut selectat
    const [bookedApartmentIds, setBookedApartmentIds] = useState<Set<number>>(new Set());

    useEffect(() => {
        apartmentService.getAll().then(setApartments).catch(() => setApartments([]));
    }, []);

    useEffect(() => {
        if (currentUser?.id) {
            favoriteService.getByUser(currentUser.id)
                .then(favs => setFavorites(favs.map(f => f.apartmentId)))
                .catch(() => {});
        }
    }, [currentUser?.id]);

    const toggleFavorite = async (id: number) => {
        if (!currentUser?.id) return;
        const isFav = favorites.includes(id);
        // optimistic update
        setFavorites(prev => isFav ? prev.filter(x => x !== id) : [...prev, id]);
        try {
            isFav
                ? await favoriteService.remove(currentUser.id, id)
                : await favoriteService.add(currentUser.id, id);
        } catch {
            // rollback on error
            setFavorites(prev => isFav ? [...prev, id] : prev.filter(x => x !== id));
        }
    };

    const getStatus   = (apt: Apartment) => apt.Id_Renter !== null ? t("listings.occupied") : t("listings.available");

    const activeFilterCount = useMemo(() => {
        const filters = appliedFilters;
        let count = 0;
        if (filters.currency !== "ALL")     count++;
        if (filters.interval !== "ALL")     count++;
        if (filters.city)                   count++;
        if (filters.checkIn)                count++;
        if (filters.checkOut)               count++;
        if (filters.minRating !== null)     count++;
        if (filters.minReviews !== null)    count++;
        const defaultRangeByCurrency: Record<string, number[]> = {
            ALL: [0, 50000],
            USD: [0, 10000],
            EUR: [0, 10000],
            MDL: [0, 50000],
        };
        const [defaultMin, defaultMax] = defaultRangeByCurrency[filters.currency] ?? [0, 2000];
        if (filters.priceRange[0] !== defaultMin || filters.priceRange[1] !== defaultMax) count++;
        count += Object.values(filters.facilities).filter(Boolean).length;
        return count;
    }, [appliedFilters]);

    const filteredApartments = useMemo(() => {
        const filters = appliedFilters;
        return apartments.filter((apt) => {
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                if (!apt.Address.toLowerCase().includes(query) && !apt.Cost_per_interval.toString().includes(searchQuery)) return false;
            }
            if (filters.currency !== "ALL" && apt.Currency !== filters.currency) return false;
            if (filters.interval !== "ALL" && apt.Interval !== filters.interval) return false;
            if (apt.Cost_per_interval < filters.priceRange[0] || apt.Cost_per_interval > filters.priceRange[1]) return false;
            if (filters.city) {
                const cityQuery = filters.city.toLowerCase();
                if (!apt.location?.city?.toLowerCase().includes(cityQuery) && !apt.Address.toLowerCase().includes(cityQuery)) return false;
            }
            const activeFacilities = Object.entries(filters.facilities).filter(([, isActive]) => isActive);
            if (activeFacilities.length > 0) {
                if (!activeFacilities.every(([key]) => apt.facilities[key as keyof typeof apt.facilities])) return false;
            }
            if (filters.minReviews !== null && apt.reviewCount < filters.minReviews) return false;
            if (filters.minRating  !== null) {
                if (apt.reviewCount === 0)         return false;
                if (apt.avgRating < filters.minRating) return false;
            }
            // Filtrare pe interval date: exclude apartamentele cu payments suprapuse
            if (bookedApartmentIds.size > 0 && bookedApartmentIds.has(apt.Id_Apartment)) return false;
            return true;
        });
    }, [searchQuery, appliedFilters, apartments, bookedApartmentIds]);

    // ── Pagination ───────────────────────────────────────────────────────────
    const totalPages = Math.ceil(filteredApartments.length / LISTINGS_PER_PAGE);

    const visibleApartments = useMemo(() => {
        const startIndex = (currentPage - 1) * LISTINGS_PER_PAGE;
        const endIndex   = startIndex + LISTINGS_PER_PAGE;
        return filteredApartments.slice(startIndex, endIndex);
    }, [filteredApartments, currentPage]);

    const pageNumbers = useMemo(() =>
            Array.from({ length: totalPages }, (_, index) => index + 1),
        [totalPages]);

    const goToPage = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const goToPrevPage = () => { if (currentPage > 1) goToPage(currentPage - 1); };
    const goToNextPage = () => { if (currentPage < totalPages) goToPage(currentPage + 1); };

    const resetToFirstPage = () => setCurrentPage(1);

    const handleSearch = (query: string) => { setSearchQuery(query); resetToFirstPage(); };
    const handleApply = async () => {
        setAppliedFilters(pendingFilters);
        resetToFirstPage();

        // Daca sunt date selectate, verifica ce apartamente sunt ocupate in acel interval
        if (pendingFilters.checkIn && pendingFilters.checkOut) {
            const checkIn  = new Date(pendingFilters.checkIn);
            const checkOut = new Date(pendingFilters.checkOut);

            // Fetch payments pentru fiecare apartament si verifica suprapunerea
            const results = await Promise.allSettled(
                apartments.map(async (apt) => {
                    const payments = await paymentHistoryService.getByApartment(apt.Id_Apartment);
                    const isBooked = payments.some((p) => {
                        if (!p.rentedFrom || !p.rentedTo) return false;
                        const pStart = new Date(p.rentedFrom);
                        const pEnd   = new Date(p.rentedTo);
                        // suprapunere: intervalele se intersecteaza
                        return pStart < checkOut && pEnd > checkIn;
                    });
                    return { id: apt.Id_Apartment, isBooked };
                })
            );

            const booked = new Set<number>();
            results.forEach((r) => {
                if (r.status === "fulfilled" && r.value.isBooked) booked.add(r.value.id);
            });
            setBookedApartmentIds(booked);
        } else {
            // Fara filtru de date — reseteaza setul
            setBookedApartmentIds(new Set());
        }
    };
    const handleReset  = () => { setPendingFilters(defaultFilters); setAppliedFilters(defaultFilters); resetToFirstPage(); };
    const handleResetAll = () => { setSearchQuery(""); setAppliedFilters(defaultFilters); setPendingFilters(defaultFilters); resetToFirstPage(); };

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: { xs: 4, md: 8 }, pt: 10 }}>
            <FilterDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                filters={pendingFilters}
                onChange={setPendingFilters}
                onApply={handleApply}
                onReset={handleReset}
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

                {/* Search + Filters */}
                <Box sx={{ width: "100%", mb: 4, display: "flex", gap: 2, alignItems: "center" }}>
                    <Box sx={{ flex: 1 }}>
                        <SearchBar onSearch={handleSearch} />
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
                        <Button variant="contained" onClick={handleResetAll} sx={{ px: 6, py: 1.8, borderRadius: 2.5 }}>
                            {t("listings.resetAll")}
                        </Button>
                    </Box>
                )}

                {/* Grid */}
                {filteredApartments.length > 0 && (
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr", xl: "1fr 1fr 1fr 1fr" }, gap: 3, width: "100%" }}>
                        {visibleApartments.map((apt, idx) => (
                            <Box key={apt.Id_Apartment} sx={{ animation: `fadeInUp 0.5s cubic-bezier(0.165,0.84,0.44,1) ${idx * 0.08}s both`, "@keyframes fadeInUp": { from: { opacity: 0, transform: "translateY(28px)" }, to: { opacity: 1, transform: "translateY(0)" } } }}>
                                <ApartmentCard
                                    apartment={apt}
                                    toggleFavorite={toggleFavorite}
                                    favorites={favorites}
                                    getStatus={getStatus}
                                    getUserName={(id: number) => `User #${id}`}
                                    isOwner={currentUser?.id === apt.Id_Owner}
                                    onEdit={(a) => navigate(paths.editListing, { state: { apartment: a } })}
                                    onDelete={(a) => setDeleteTarget(a)}
                                />
                            </Box>
                        ))}
                    </Box>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1, mt: 12 }}>
                        <Button
                            variant="outlined"
                            onClick={goToPrevPage}
                            disabled={currentPage === 1}
                            sx={{ px: 3, borderRadius: 1.5 }}
                        >
                            {t("listings.prev")}
                        </Button>

                        {pageNumbers.map((pageNumber) => (
                            <Button
                                key={pageNumber}
                                variant={pageNumber === currentPage ? "contained" : "outlined"}
                                onClick={() => goToPage(pageNumber)}
                                sx={{ minWidth: "50px", height: "50px", borderRadius: 1.5, fontWeight: pageNumber === currentPage ? 900 : 400 }}
                            >
                                {pageNumber}
                            </Button>
                        ))}

                        <Button
                            variant="outlined"
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages}
                            sx={{ px: 3, borderRadius: 1.5 }}
                        >
                            {t("listings.next")}
                        </Button>
                    </Box>
                )}
            </Container>

            {/* ── Dialog confirmare delete ─────────────────────────────── */}
            <Dialog open={!!deleteTarget} onClose={() => !deleteBusy && setDeleteTarget(null)}>
                <DialogTitle fontWeight={700}>Stergi anuntul?</DialogTitle>
                <DialogContent>
                    <Typography>
                        Esti sigur ca vrei sa stergi anuntul <strong>{deleteTarget?.Address}</strong>? Aceasta actiune este ireversibila.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteTarget(null)} disabled={deleteBusy}>
                        Anuleaza
                    </Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained" disabled={deleteBusy}>
                        {deleteBusy ? <CircularProgress size={16} /> : "Sterge"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ── Snackbar notificare ──────────────────────────────────── */}
            <Snackbar
                open={!!snack}
                autoHideDuration={4000}
                onClose={() => setSnack(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert severity={snack?.sev ?? "success"} onClose={() => setSnack(null)} sx={{ fontWeight: 600 }}>
                    {snack?.msg}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Listings;