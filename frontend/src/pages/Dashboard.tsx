// pages/Dashboard.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation }     from "react-router-dom";
import { useTranslation }               from "react-i18next";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import type { Apartment }               from "../types/apartment.types";
import { useAuth }                      from "../auth/AuthContext";
import { apartmentService }             from "../services/apartmentService";
import { favoriteService }              from "../services/favoriteService";
import { paymentHistoryService }        from "../services/paymentHistoryService";
import { paths }                        from "../app/paths";
import { useNotifications }             from "../context/NotificationContext";
import { ownerNotifications }           from "../services/notificationService";
import { ALL_NAV, type NavKey }         from "../components/dashboard/SidebarItem";
import PageHeading           from "../components/dashboard/PageHeading";
import DeleteListingDialog   from "../components/dashboard/DeleteListingDialog";
import DashboardSidebar      from "../components/dashboard/DashboardSidebar";
import DashboardMobileHeader from "../components/dashboard/DashboardMobileHeader";
import DashboardBottomNav    from "../components/dashboard/DashboardBottomNav";
import ProfileTab       from "../components/dashboard/ProfileTab";
import MyListingsTab    from "../components/dashboard/MyListingsTab";
import PaymentsTab      from "../components/dashboard/paymentTab/PaymentsTab";
import FavoritesTab     from "../components/dashboard/FavoritesTab";
import UpcomingStaysTab from "../components/dashboard/UpcomingStaysTab";
import PreviousStaysTab from "../components/dashboard/PreviousStaysTab";
import RecentViewTab    from "../components/dashboard/RecentViewTab";

const NAVBAR_H     = 64;
const BOTTOM_NAV_H = 64;
const RENTER_ROLE  = 2;

export default function Dashboard() {
    const { t }           = useTranslation();
    const { currentUser } = useAuth();
    const theme           = useTheme();
    const isMobile        = useMediaQuery(theme.breakpoints.down("md"));
    const navigate        = useNavigate();
    const location        = useLocation();
    const { addNotification } = useNotifications();

    const isRenter = currentUser?.role === RENTER_ROLE;
    const NAV      = isRenter ? ALL_NAV.filter(item => item.key !== "listings") : ALL_NAV;

    const [active, setActive] = useState<NavKey>(() => {
        const saved = localStorage.getItem("rentora_dash_tab") as NavKey | null;
        if (saved === "listings" && isRenter) return "profile";
        return saved ?? "profile";
    });

    const currentUserId = currentUser?.id ?? 0;

    const [myListings,    setMyListings]    = useState<Apartment[]>([]);
    const [allApartments, setAllApartments] = useState<Apartment[]>([]);
    const [favoriteIds,   setFavoriteIds]   = useState<number[]>([]);

    const fetchListings = () => {
        if (!currentUserId) return;
        if (!isRenter)
            apartmentService.getByOwner(currentUserId).then(setMyListings).catch(() => setMyListings([]));
        apartmentService.getAll().then(setAllApartments).catch(() => setAllApartments([]));
        favoriteService.getByUser(currentUserId)
            .then(favs => setFavoriteIds(favs.map(f => f.apartmentId)))
            .catch(() => setFavoriteIds([]));
    };

    useEffect(() => { fetchListings(); }, [currentUserId]);
    useEffect(() => { if (isRenter && active === "listings") setActive("profile"); }, [isRenter]);
    useEffect(() => {
        if ((location.state as { refreshListings?: boolean } | null)?.refreshListings) {
            fetchListings();
            navigate(paths.dashboard, { replace: true, state: {} });
        }
    }, [location.state]);
    useEffect(() => {
        const onVisible = () => { if (document.visibilityState === "visible") fetchListings(); };
        document.addEventListener("visibilitychange", onVisible);
        return () => document.removeEventListener("visibilitychange", onVisible);
    }, [currentUserId]);

    const favoriteApartments = useMemo(() => {
        const set = new Set(favoriteIds);
        return allApartments.filter(a => set.has(a.Id_Apartment));
    }, [favoriteIds, allApartments]);

    const toggleFavorite = async (id: number) => {
        const isFav = favoriteIds.includes(id);
        setFavoriteIds(prev => isFav ? prev.filter(x => x !== id) : [...prev, id]);
        try {
            isFav ? await favoriteService.remove(currentUserId, id) : await favoriteService.add(currentUserId, id);
        } catch {
            setFavoriteIds(prev => isFav ? [...prev, id] : prev.filter(x => x !== id));
        }
    };

    const go = (key: NavKey) => { setActive(key); localStorage.setItem("rentora_dash_tab", key); };

    // ── Delete listing ─────────────────────────────────────────────────────────
    const [deleteTarget, setDeleteTarget] = useState<Apartment | null>(null);
    const [deletebusy,   setDeleteBusy]   = useState(false);
    const [snack, setSnack]               = useState<{ msg: string; sev: "success" | "error" } | null>(null);

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        setDeleteBusy(true);
        try {
            await apartmentService.delete(deleteTarget.Id_Apartment);
            setMyListings(prev => prev.filter(a => a.Id_Apartment !== deleteTarget.Id_Apartment));
            ownerNotifications.listingDeleted(addNotification, deleteTarget.Address);
            setDeleteTarget(null);
            setSnack({ msg: t("dashboard.myListings.deleteSuccess"), sev: "success" });
        } catch (err: unknown) {
            const data = (err as { response?: { data?: unknown } })?.response?.data;
            const isActiveBooking =
                (typeof data === "object" && data !== null && (data as { message?: string })?.message?.toLowerCase().includes("booking")) ||
                (typeof data === "string" && data.toLowerCase().includes("booking"));
            setDeleteTarget(null);
            setSnack({ msg: isActiveBooking ? t("dashboard.myListings.deleteErrorActive") : t("dashboard.myListings.deleteError"), sev: "error" });
        } finally {
            setDeleteBusy(false);
        }
    };

    // ── Edit listing ───────────────────────────────────────────────────────────
    const handleEdit = async (apt: Apartment) => {
        try {
            const payments = await paymentHistoryService.getByApartment(apt.Id_Apartment);
            const now = new Date();
            const hasOngoing = payments.some(p => p.rentedFrom && p.rentedTo && new Date(p.rentedFrom) <= now && now <= new Date(p.rentedTo));
            if (hasOngoing) { setSnack({ msg: t("dashboard.myListings.editErrorActive"), sev: "error" }); return; }
        } catch {
            // backend blochează oricum dacă există booking activ
        }
        navigate(paths.editListing, { state: { apartment: apt } });
    };

    const initials = currentUser
        ? `${currentUser.name?.[0] ?? ""}${currentUser.surname?.[0] ?? ""}`.toUpperCase()
        : "U";

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default", mt: `${NAVBAR_H}px`, pb: { xs: `${BOTTOM_NAV_H}px`, md: 0 } }}>

            {!isMobile && (
                <DashboardSidebar nav={NAV} active={active} onNavigate={go} currentUser={currentUser} initials={initials} />
            )}

            <Box sx={{ flex: 1, p: { xs: 2, md: 4 }, minWidth: 0 }}>
                {isMobile && <DashboardMobileHeader currentUser={currentUser} initials={initials} />}

                {active === "profile" && <><PageHeading title={t("dashboard.tabs.profile")} subtitle={t("dashboard.subtitle")} /><ProfileTab currentUser={currentUser} onEditProfile={() => navigate(paths.settings)} /></>}
                {active === "listings" && !isRenter && <><PageHeading title={t("dashboard.tabs.apartments")} /><MyListingsTab myListings={myListings} favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} onEdit={handleEdit} onDelete={setDeleteTarget} /></>}
                {active === "recent"   && <><PageHeading title={t("dashboard.tabs.recentViewed")} /><RecentViewTab /></>}
                {active === "payments" && <><PageHeading title={t("dashboard.tabs.payments")} /><PaymentsTab /></>}
                {active === "favorites" && <><PageHeading title={t("dashboard.tabs.favorites")} /><FavoritesTab favoriteApartments={favoriteApartments} favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} /></>}
                {active === "upcoming" && <><PageHeading title={t("dashboard.tabs.upcomingStays")} /><UpcomingStaysTab /></>}
                {active === "previous" && <><PageHeading title={t("dashboard.tabs.previousStays")} /><PreviousStaysTab /></>}
            </Box>

            {isMobile && <DashboardBottomNav nav={NAV} active={active} onChange={go} />}

            <DeleteListingDialog
                target={deleteTarget} busy={deletebusy} snack={snack}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDeleteConfirm}
                onSnackClose={() => setSnack(null)}
            />
        </Box>
    );
}
