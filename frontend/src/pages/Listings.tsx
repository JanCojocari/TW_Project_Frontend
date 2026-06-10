// pages/Listings.tsx
import { Box, Container } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useNavigate }    from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { Apartment } from "../types/apartment.types.ts";
import ApartmentCard         from "../components/listing/ApartmentCard.tsx";
import FilterDrawer          from "../components/filter/FilterDrawer.tsx";
import ListingsHero          from "../components/listing/ListingsHero.tsx";
import ListingsSearchBar     from "../components/listing/ListingsSearchBar.tsx";
import ListingsEmptyState    from "../components/listing/ListingsEmptyState.tsx";
import ListingsPagination    from "../components/listing/ListingsPagination.tsx";
import ListingsDeleteDialog  from "../components/listing/ListingsDeleteDialog.tsx";
import { defaultFilters, type FilterState } from "../types//filterTypes.ts";
import { apartmentService }      from "../services/apartmentService.ts";
import { paymentHistoryService } from "../services/paymentHistoryService.ts";
import { favoriteService }       from "../services/favoriteService.ts";
import { useAuth }               from "../auth/AuthContext";
import { paths }                 from "../app/paths.ts";

const LISTINGS_PER_PAGE = 24;

const Listings = () => {
    const { t } = useTranslation();
    const navigate        = useNavigate();
    const { currentUser } = useAuth();

    const [apartments, setApartments]         = useState<Apartment[]>([]);
    const [searchQuery, setSearchQuery]       = useState("");
    const [favorites, setFavorites]           = useState<number[]>([]);
    const [drawerOpen, setDrawerOpen]         = useState(false);
    const [pendingFilters, setPendingFilters]  = useState<FilterState>(defaultFilters);
    const [appliedFilters, setAppliedFilters]  = useState<FilterState>(defaultFilters);
    const [currentPage, setCurrentPage]       = useState(1);
    const [bookedApartmentIds, setBookedApartmentIds] = useState<Set<number>>(new Set());

    const [deleteTarget, setDeleteTarget] = useState<Apartment | null>(null);
    const [deleteBusy, setDeleteBusy]     = useState(false);
    const [snack, setSnack]               = useState<{ msg: string; sev: "success" | "error" } | null>(null);

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
        setFavorites(prev => isFav ? prev.filter(x => x !== id) : [...prev, id]);
        try {
            isFav
                ? await favoriteService.remove(currentUser.id, id)
                : await favoriteService.add(currentUser.id, id);
        } catch {
            setFavorites(prev => isFav ? [...prev, id] : prev.filter(x => x !== id));
        }
    };

    const getStatus = (apt: Apartment) =>
        apt.Id_Renter !== null ? t("listings.occupied") : t("listings.available");

    const activeFilterCount = useMemo(() => {
        const f = appliedFilters;
        let count = 0;
        if (f.currency !== "ALL") count++;
        if (f.interval !== "ALL") count++;
        if (f.city)               count++;
        if (f.checkIn)            count++;
        if (f.checkOut)           count++;
        if (f.minRating  !== null) count++;
        if (f.minReviews !== null) count++;
        const defaultRangeByCurrency: Record<string, number[]> = { ALL: [0, 50000], USD: [0, 10000], EUR: [0, 10000], MDL: [0, 50000] };
        const [defaultMin, defaultMax] = defaultRangeByCurrency[f.currency] ?? [0, 2000];
        if (f.priceRange[0] !== defaultMin || f.priceRange[1] !== defaultMax) count++;
        count += Object.values(f.facilities).filter(Boolean).length;
        return count;
    }, [appliedFilters]);

    const filteredApartments = useMemo(() => {
        const f = appliedFilters;
        return apartments.filter(apt => {
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                if (!apt.Address.toLowerCase().includes(q) && !apt.Cost_per_interval.toString().includes(searchQuery)) return false;
            }
            if (f.currency !== "ALL" && apt.Currency !== f.currency) return false;
            if (f.interval !== "ALL" && apt.Interval !== f.interval) return false;
            if (apt.Cost_per_interval < f.priceRange[0] || apt.Cost_per_interval > f.priceRange[1]) return false;
            if (f.city) {
                const cq = f.city.toLowerCase();
                if (!apt.location?.city?.toLowerCase().includes(cq) && !apt.Address.toLowerCase().includes(cq)) return false;
            }
            const activeFacilities = Object.entries(f.facilities).filter(([, v]) => v);
            if (activeFacilities.length > 0) {
                if (!activeFacilities.every(([key]) => apt.facilities[key as keyof typeof apt.facilities])) return false;
            }
            if (f.minReviews !== null && apt.reviewCount < f.minReviews) return false;
            if (f.minRating  !== null) {
                if (apt.reviewCount === 0)          return false;
                if (apt.avgRating < f.minRating)    return false;
            }
            if (bookedApartmentIds.size > 0 && bookedApartmentIds.has(apt.Id_Apartment)) return false;
            return true;
        });
    }, [searchQuery, appliedFilters, apartments, bookedApartmentIds]);

    // ── Pagination ────────────────────────────────────────────────────────────
    const totalPages = Math.ceil(filteredApartments.length / LISTINGS_PER_PAGE);

    const visibleApartments = useMemo(() => {
        const start = (currentPage - 1) * LISTINGS_PER_PAGE;
        return filteredApartments.slice(start, start + LISTINGS_PER_PAGE);
    }, [filteredApartments, currentPage]);

    const pageNumbers = useMemo(() => Array.from({ length: totalPages }, (_, i) => i + 1), [totalPages]);

    const goToPage    = (page: number) => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: "smooth" }); };
    const goToPrev    = () => { if (currentPage > 1) goToPage(currentPage - 1); };
    const goToNext    = () => { if (currentPage < totalPages) goToPage(currentPage + 1); };
    const resetToPage1 = () => setCurrentPage(1);

    const handleSearch = (query: string) => { setSearchQuery(query); resetToPage1(); };

    const handleApply = async () => {
        setAppliedFilters(pendingFilters);
        resetToPage1();

        if (pendingFilters.checkIn && pendingFilters.checkOut) {
            const checkIn  = new Date(pendingFilters.checkIn);
            const checkOut = new Date(pendingFilters.checkOut);
            const results  = await Promise.allSettled(
                apartments.map(async apt => {
                    const payments = await paymentHistoryService.getByApartment(apt.Id_Apartment);
                    const isBooked = payments.some(p => {
                        if (!p.rentedFrom || !p.rentedTo) return false;
                        return new Date(p.rentedFrom) < checkOut && new Date(p.rentedTo) > checkIn;
                    });
                    return { id: apt.Id_Apartment, isBooked };
                })
            );
            const booked = new Set<number>();
            results.forEach(r => { if (r.status === "fulfilled" && r.value.isBooked) booked.add(r.value.id); });
            setBookedApartmentIds(booked);
        } else {
            setBookedApartmentIds(new Set());
        }
    };

    const handleReset    = () => { setPendingFilters(defaultFilters); setAppliedFilters(defaultFilters); resetToPage1(); };
    const handleResetAll = () => { setSearchQuery(""); setAppliedFilters(defaultFilters); setPendingFilters(defaultFilters); resetToPage1(); };

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        setDeleteBusy(true);
        try {
            await apartmentService.delete(deleteTarget.Id_Apartment);
            setApartments(prev => prev.filter(a => a.Id_Apartment !== deleteTarget.Id_Apartment));
            setSnack({ msg: t("listings.deleteSuccess"), sev: "success" });
        } catch {
            setSnack({ msg: t("listings.deleteError"), sev: "error" });
        } finally {
            setDeleteBusy(false);
            setDeleteTarget(null);
        }
    };

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
                <ListingsHero count={filteredApartments.length} />

                <ListingsSearchBar
                    activeFilterCount={activeFilterCount}
                    onSearch={handleSearch}
                    onOpenFilter={() => setDrawerOpen(true)}
                />

                {filteredApartments.length === 0 && <ListingsEmptyState onReset={handleResetAll} />}

                {filteredApartments.length > 0 && (
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr", xl: "1fr 1fr 1fr 1fr" }, gap: 3, width: "100%" }}>
                        {visibleApartments.map((apt, idx) => (
                            <Box key={apt.Id_Apartment} sx={{ animation: `fadeInUp 0.5s cubic-bezier(0.165,0.84,0.44,1) ${idx * 0.08}s both`, "@keyframes fadeInUp": { from: { opacity: 0, transform: "translateY(28px)" }, to: { opacity: 1, transform: "translateY(0)" } } }}>
                                <ApartmentCard
                                    apartment={apt}
                                    toggleFavorite={toggleFavorite}
                                    favorites={favorites}
                                    getStatus={getStatus}
                                    isOwner={currentUser?.id === apt.Id_Owner}
                                    onEdit={a => navigate(paths.editListing, { state: { apartment: a } })}
                                    onDelete={setDeleteTarget}
                                />
                            </Box>
                        ))}
                    </Box>
                )}

                {totalPages > 1 && (
                    <ListingsPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        pageNumbers={pageNumbers}
                        onGoToPage={goToPage}
                        onPrev={goToPrev}
                        onNext={goToNext}
                    />
                )}
            </Container>

            <ListingsDeleteDialog
                target={deleteTarget}
                busy={deleteBusy}
                snack={snack}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDeleteConfirm}
                onSnackClose={() => setSnack(null)}
            />
        </Box>
    );
};

export default Listings;
