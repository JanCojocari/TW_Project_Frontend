// pages/Dashboard.tsx
import { useMemo, useState }   from "react";
import { useNavigate }         from "react-router-dom";
import { useTranslation }      from "react-i18next";
import { Box, Container, Paper, Tab, Tabs, Typography } from "@mui/material";
import { apartments }          from "../mockdata/apartments";
import { users }               from "../mockdata/users";
import { paths }               from "../app/paths";
import { gradients, colors }   from "../theme/gradients";
import ProfileTab              from "../components/dashboard/ProfileTab";
import MyListingsTab           from "../components/dashboard/MyListingsTab";
import PaymentsTab             from "../components/dashboard/paymentTab/PaymentsTab";
import FavoritesTab            from "../components/dashboard/FavoritesTab";

type DashboardTab = 0 | 1 | 2 | 3;
const FAVORITES_KEY = "rentora_favorites";

function getFavorites(): number[] {
    try {
        const raw = localStorage.getItem(FAVORITES_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed.filter(Number.isFinite) : [];
    } catch { return []; }
}
function setFavorites(ids: number[]) { localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids)); }

export default function Dashboard() {
    const navigate      = useNavigate();
    const { t }         = useTranslation();
    const [tab, setTab] = useState<DashboardTab>(0);
    const currentUserId = 1;

    const currentUser        = useMemo(() => users.find((u) => u.Id_User === currentUserId) ?? null, []);
    const myListings         = useMemo(() => apartments.filter((a) => a.Id_Owner === currentUserId), []);
    const [favoriteIds, setFavoriteIds] = useState<number[]>(() => getFavorites());

    const favoriteApartments = useMemo(() => {
        const set = new Set(favoriteIds);
        return apartments.filter((a) => set.has(a.Id_Apartment));
    }, [favoriteIds]);

    const toggleFavorite = (id: number) => {
        setFavoriteIds((prev) => {
            const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
            setFavorites(next);
            return next;
        });
    };

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
                    {tab === 1 && <MyListingsTab myListings={myListings}   favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} />}
                    {tab === 2 && <PaymentsTab />}
                    {tab === 3 && <FavoritesTab  favoriteApartments={favoriteApartments} favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} />}
                </Box>
            </Paper>
        </Container>
    );
}