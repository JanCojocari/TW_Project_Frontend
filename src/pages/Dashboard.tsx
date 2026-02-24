import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Alert, Box, Button, Chip, Container, Dialog, DialogActions, DialogContent,
    DialogTitle, Divider, IconButton, InputAdornment, Paper, Stack,
    Tab, Tabs, TextField, Typography,
} from "@mui/material";
import VisibilityIcon    from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import { apartments } from "../mockdata/apartments";
import { users }      from "../mockdata/users";
import { paths }      from "../app/paths";
import ApartmentCard  from "../components/ApartmentCard";
import type { Apartment } from "../types/apartment.types.ts";
import { gradients, colors } from "../theme/gradients.ts";

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
    const navigate = useNavigate();
    const [tab, setTab] = useState<DashboardTab>(0);
    const currentUserId = 1;

    const currentUser = useMemo(() => users.find((u) => u.Id_User === currentUserId) ?? null, []);
    const myListings  = useMemo(() => apartments.filter((a) => a.Id_Owner === currentUserId), []);
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
            <Paper
                elevation={1}
                sx={{ p: 6, borderRadius: 4, border: `1px solid ${colors.border}` }}
            >
                {/* Header */}
                <Box sx={{ mb: 6 }}>
                    <Typography variant="h3" fontWeight={900} sx={{ letterSpacing: "-1.5px", mb: 1 }}>
                        Control{" "}
                        <Box component="span" sx={{ background: gradients.textPrimary, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Panel</Box>
                    </Typography>
                    <Typography color="text.secondary" sx={{ fontSize: "16px" }}>
                        Monitorizează activitatea, gestionează portofoliul și plățile tale.
                    </Typography>
                </Box>

                {/* Tabs */}
                <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto" sx={{ mb: 2, borderBottom: `1px solid ${colors.border}` }}>
                    <Tab label="Profil Utilizator"  />
                    <Tab label="Proprietățile Mele" />
                    <Tab label="Istoric Financiar"  />
                    <Tab label="Favorite"           />
                </Tabs>

                <Box sx={{ pt: 6 }}>
                    {tab === 0 && <ProfileTab currentUser={currentUser} onEditProfile={() => navigate(paths.editProfile)} />}
                    {tab === 1 && <MyListingsTab  myListings={myListings}            favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} />}
                    {tab === 2 && <PaymentsTab />}
                    {tab === 3 && <FavoritesTab   favoriteApartments={favoriteApartments} favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} />}
                </Box>
            </Paper>
        </Container>
    );
}

/* ─── Profile Tab ──────────────────────────────────────────────────────── */

function ProfileTab({ currentUser, onEditProfile }: { currentUser: any; onEditProfile: () => void }) {
    const [changePasswordOpen, setChangePasswordOpen] = useState(false);

    if (!currentUser) return (
        <Typography color="text.disabled" sx={{ textAlign: "center", py: 10 }}>Eroare: Sesiune utilizator invalidă.</Typography>
    );

    const labelStyle = { color: "text.disabled", fontSize: "11px", textTransform: "uppercase" as const, fontWeight: 800, letterSpacing: "1px" };

    return (
        <Stack spacing={4}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, bgcolor: "background.default", border: `1px solid ${colors.border}` }}>
                <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} gap={3}>
                    <Box>
                        <Typography variant="h5" fontWeight={900} sx={{ mb: 2 }}>{currentUser.Name} {currentUser.Surname}</Typography>
                        <Stack spacing={1}>
                            {[
                                { label: "Email",    value: currentUser.Email    || "—" },
                                { label: "Telefon",  value: currentUser.Phone    || "—" },
                                { label: "Naștere",  value: currentUser.Birthday || "—" },
                                { label: "Gen",      value: currentUser.Gender   || "—" },
                            ].map(({ label, value }) => (
                                <Box key={label} sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                                    <Typography sx={{ ...labelStyle, minWidth: "60px" }}>{label}</Typography>
                                    <Typography fontWeight={600} color="text.primary">{value}</Typography>
                                </Box>
                            ))}
                        </Stack>
                    </Box>
                    <Stack spacing={1.5}>
                        <Button variant="contained" onClick={onEditProfile} sx={{ whiteSpace: "nowrap" }}>Editează Profil</Button>
                        <Button variant="outlined"  onClick={() => setChangePasswordOpen(true)}>Schimbă Parola</Button>
                    </Stack>
                </Stack>
            </Paper>

            <ChangePasswordDialog open={changePasswordOpen} onClose={() => setChangePasswordOpen(false)} />
        </Stack>
    );
}

/* ─── Change Password Dialog ───────────────────────────────────────────── */

function ChangePasswordDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew,     setShowNew]     = useState(false);
    const [saved,       setSaved]       = useState(false);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 4, border: `1px solid ${colors.border}` } }}>
            <DialogTitle sx={{ fontWeight: 900 }}>Schimbă Parola</DialogTitle>
            <DialogContent>
                {saved && <Alert severity="success" sx={{ mb: 2 }}>Parola a fost schimbată! (mock)</Alert>}
                <Stack spacing={2} sx={{ pt: 1 }}>
                    <TextField
                        label="Parola curentă"
                        type={showCurrent ? "text" : "password"}
                        fullWidth
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowCurrent(!showCurrent)} edge="end">
                                        {showCurrent ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        label="Parola nouă"
                        type={showNew ? "text" : "password"}
                        fullWidth
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowNew(!showNew)} edge="end">
                                        {showNew ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField label="Confirmă parola nouă" type="password" fullWidth />
                </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2.5, gap: 1 }}>
                <Button variant="outlined" onClick={onClose}>Anulează</Button>
                <Button variant="contained" onClick={() => { setSaved(true); setTimeout(onClose, 1500); }}>Salvează</Button>
            </DialogActions>
        </Dialog>
    );
}

/* ─── My Listings Tab ──────────────────────────────────────────────────── */

function MyListingsTab({ myListings, favoriteIds, onToggleFavorite }: { myListings: any[]; favoriteIds: number[]; onToggleFavorite: (id: number) => void }) {
    if (myListings.length === 0) return (
        <Box sx={{ textAlign: "center", py: 10 }}>
            <Typography color="text.disabled" sx={{ fontSize: "18px", fontStyle: "italic" }}>Nu ai publicat niciun anunț până în prezent.</Typography>
        </Box>
    );

    return (
        <Box sx={{ display: "grid", gap: 4, gridTemplateColumns: { xs: "1fr", sm: "repeat(2,1fr)", md: "repeat(3,1fr)" } }}>
            {myListings.map((apt) => (
                <ApartmentCard
                    key={apt.Id_Apartment}
                    apartment={apt}
                    favorites={favoriteIds}
                    toggleFavorite={onToggleFavorite}
                    getUserName={(id) => users.find((u) => u.Id_User === id)?.Name || "User"}
                    getStatus={(a: any) => a.Id_Renter ? "Ocupat" : "Disponibil"}
                />
            ))}
        </Box>
    );
}

/* ─── Payments Tab ─────────────────────────────────────────────────────── */

function PaymentsTab() {
    return (
        <Stack spacing={4}>
            <Typography variant="h5" fontWeight={900} sx={{ mb: 2 }}>Arhivă Plăți & Facturi</Typography>
            <Stack spacing={2.5}>
                <PaymentRow label="Chirie Apartament #442" meta="850 EUR • Februarie 2026 • Mun. Chișinău" status="Succes" />
                <PaymentRow label="Chirie Apartament #119" meta="420 EUR • Ianuarie 2026 • Str. Pușkin 12"  status="Succes" />
            </Stack>
        </Stack>
    );
}

function PaymentRow({ label, meta, status }: { label: string; meta: string; status: string }) {
    return (
        <Paper
            elevation={0}
            sx={{
                p:          3,
                borderRadius: 3,
                bgcolor:    "background.default",
                border:     `1px solid ${colors.border}`,
                display:    "flex",
                justifyContent: "space-between",
                alignItems: "center",
                transition: "all 0.3s ease",
                "&:hover":  { borderColor: "primary.main", boxShadow: `0 4px 16px ${colors.primaryAlpha10}` },
            }}
        >
            <Box>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 0.5 }}>
                    <Typography fontWeight={800} sx={{ fontSize: "16px" }}>{label}</Typography>
                    <Chip label={status} color="success" size="small" />
                </Box>
                <Typography color="text.secondary" sx={{ fontSize: "14px" }}>{meta}</Typography>
            </Box>
            <Button variant="outlined" sx={{ borderRadius: 2, px: 3 }}>Descarcă PDF</Button>
        </Paper>
    );
}

/* ─── Favorites Tab ────────────────────────────────────────────────────── */

function FavoritesTab({ favoriteApartments, favoriteIds, onToggleFavorite }: { favoriteApartments: Apartment[]; favoriteIds: number[]; onToggleFavorite: (id: number) => void }) {
    if (favoriteApartments.length === 0) return (
        <Box sx={{ textAlign: "center", py: 10 }}>
            <Typography color="text.disabled" sx={{ fontSize: "18px", fontStyle: "italic" }}>Lista ta de favorite este goală.</Typography>
        </Box>
    );

    return (
        <Box sx={{ display: "grid", gap: 4, gridTemplateColumns: { xs: "1fr", sm: "repeat(2,1fr)", md: "repeat(3,1fr)" } }}>
            {favoriteApartments.map((apt) => (
                <ApartmentCard
                    key={apt.Id_Apartment}
                    apartment={apt}
                    favorites={favoriteIds}
                    toggleFavorite={onToggleFavorite}
                    getUserName={(id) => users.find((u) => u.Id_User === id)?.Name || "User"}
                    getStatus={(a: any) => a.Id_Renter ? "Ocupat" : "Disponibil"}
                />
            ))}
        </Box>
    );
}