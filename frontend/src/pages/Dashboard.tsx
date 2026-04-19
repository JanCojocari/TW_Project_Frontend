// pages/Dashboard.tsx
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate }         from "react-router-dom";
import { useTranslation }      from "react-i18next";
import { Box, Container, Paper, Tab, Tabs, Typography } from "@mui/material";
import type { Apartment }      from "../types/apartment.types";
import { useAuth }             from "../auth/AuthContext";
import { userService }         from "../services/userService";
import { apartmentService }    from "../services/apartmentService";
import { favoriteService }     from "../services/favoriteService";
import { paths }               from "../app/paths";
import { gradients, colors }   from "../theme/gradients";
import ProfileTab              from "../components/dashboard/ProfileTab";
import MyListingsTab           from "../components/dashboard/MyListingsTab";
import PaymentsTab             from "../components/dashboard/paymentTab/PaymentsTab";
import FavoritesTab            from "../components/dashboard/FavoritesTab";

type DashboardTab = 0 | 1 | 2 | 3;

export default function Dashboard() {
    const navigate        = useNavigate();
    const { t }           = useTranslation();
    const { currentUser } = useAuth();
    const [tab, setTab]   = useState<DashboardTab>(0);

    const currentUserId = currentUser?.id ?? 0;

    const [myListings, setMyListings]       = useState<Apartment[]>([]);
    const [allApartments, setAllApartments] = useState<Apartment[]>([]);
    const [favoriteIds, setFavoriteIds]     = useState<number[]>([]);
    const [usersMap, setUsersMap]           = useState<Record<number, string>>({});

    useEffect(() => {
        if (!currentUserId) return;

        apartmentService.getByOwner(currentUserId).then(setMyListings).catch(() => setMyListings([]));
        apartmentService.getAll().then(setAllApartments).catch(() => setAllApartments([]));
        userService.getAll()
            .then(list => setUsersMap(Object.fromEntries(list.map(u => [u.id, u.name]))))
            .catch(() => {});

        // Incarca favoritele din API
        favoriteService.getByUser(currentUserId)
            .then(favs => setFavoriteIds(favs.map(f => f.apartmentId)))
            .catch(() => setFavoriteIds([]));
    }, [currentUserId]);

    const favoriteApartments = useMemo(() => {
        const set = new Set(favoriteIds);
        return allApartments.filter((a) => set.has(a.Id_Apartment));
    }, [favoriteIds, allApartments]);

    const toggleFavorite = async (id: number) => {
        const isFav = favoriteIds.includes(id);
        // Actualizare optimista
        setFavoriteIds(prev => isFav ? prev.filter(x => x !== id) : [...prev, id]);
        try {
            if (isFav) {
                await favoriteService.remove(currentUserId, id);
            } else {
                await favoriteService.add(currentUserId, id);
            }
        } catch {
            // Rollback la eroare
            setFavoriteIds(prev => isFav ? [...prev, id] : prev.filter(x => x !== id));
        }
    };

    const getUserName = useCallback((id: number) => usersMap[id] ?? `User #${id}`, [usersMap]);

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 }, minHeight: "100vh", mt: 10 }}>
            <Paper elevation={1} sx={{ p: 6, borderRadius: 4, border: `1px solid ${colors.border}` }}>
                <Box sx={{ mb: 6 }}>
                    <Typography variant="h3" fontWeight={900} sx={{ letterSpacing: "-1.5px", mb: 1 }}>
                        {t("dashboard.controlPanel")}{" "}
                        <Box component="span" sx={{ background: gradients.textPrimary, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                            {t("dashboard.controlSpan")}
                        </Box>
                    </Typography>
                    <Typography color="text.secondary" sx={{ fontSize: "16px" }}>
                        {t("dashboard.subtitle")}
                    </Typography>
                </Box>

                <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto"
                      sx={{ mb: 2, borderBottom: `1px solid ${colors.border}` }}>
                    <Tab label={t("dashboard.tabs.profile")}    />
                    <Tab label={t("dashboard.tabs.apartments")} />
                    <Tab label={t("dashboard.tabs.payments")}   />
                    <Tab label={t("dashboard.tabs.favorites")}  />
                </Tabs>

                <Box sx={{ pt: 6 }}>
                    {tab === 0 && <ProfileTab    currentUser={currentUser} onEditProfile={() => navigate(paths.settings)} />}
                    {tab === 1 && <MyListingsTab myListings={myListings}   favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} getUserName={getUserName} />}
                    {tab === 2 && <PaymentsTab />}
                    {tab === 3 && <FavoritesTab  favoriteApartments={favoriteApartments} favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} getUserName={getUserName} />}
                </Box>
            </Paper>
        </Container>
    );
}