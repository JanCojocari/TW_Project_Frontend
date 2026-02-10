import { useMemo, useState } from "react";
import {
    Box,
    Button,
    Chip,
    Container,
    Divider,
    Paper,
    Stack,
    Tab,
    Tabs,
    Typography,
    Grid,
} from "@mui/material";

import ListingCard from "../components/ListingCard";
import { apartments } from "../mockdata/apartments";
import { users } from "../mockdata/users";
import { paths } from "../app/paths";

type DashboardTab = 0 | 1 | 2 | 3;

const FAVORITES_KEY = "rentora_favorites";

function getFavorites(): number[] {
    try {
        const raw = localStorage.getItem(FAVORITES_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed.filter((x) => Number.isFinite(x));
        return [];
    } catch {
        return [];
    }
}

function setFavorites(ids: number[]) {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
}

export default function Dashboard() {
    const [tab, setTab] = useState<DashboardTab>(0);

    // TODO: replace with AuthContext later
    const currentUserId = 1;

    const currentUser = useMemo(() => {
        return users.find((u) => u.Id_User === currentUserId) ?? null;
    }, [currentUserId]);

    const myListings = useMemo(() => {
        return apartments.filter((a) => a.Id_Owner === currentUserId);
    }, [currentUserId]);

    const [favoriteIds, setFavoriteIds] = useState<number[]>(() => getFavorites());

    const favoriteApartments = useMemo(() => {
        const set = new Set(favoriteIds);
        return apartments.filter((a) => set.has(a.Id_Apartment));
    }, [favoriteIds]);

    const toggleFavorite = (apartmentId: number) => {
        setFavoriteIds((prev) => {
            const exists = prev.includes(apartmentId);
            const next = exists ? prev.filter((id) => id !== apartmentId) : [...prev, apartmentId];
            setFavorites(next);
            return next;
        });
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
                <Typography variant="h4" fontWeight={900}>
                    Dashboard
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                    Gestionează contul, anunțurile și activitatea ta.
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Tabs
                    value={tab}
                    onChange={(_, v) => setTab(v)}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                        "& .MuiTab-root": { textTransform: "none", fontWeight: 700 },
                    }}
                >
                    <Tab label="Profil" />
                    <Tab label="Anunțurile mele" />
                    <Tab label="Plăți" />
                    <Tab label="Favorite" />
                </Tabs>

                <Divider sx={{ mt: 1 }} />

                <Box sx={{ pt: 2 }}>
                    {tab === 0 && (
                        <ProfileTab currentUser={currentUser} />
                    )}

                    {tab === 1 && (
                        <MyListingsTab
                            myListings={myListings}
                            favoriteIds={favoriteIds}
                            onToggleFavorite={toggleFavorite}
                        />
                    )}

                    {tab === 2 && (
                        <PaymentsTab />
                    )}

                    {tab === 3 && (
                        <FavoritesTab
                            favoriteApartments={favoriteApartments}
                            favoriteIds={favoriteIds}
                            onToggleFavorite={toggleFavorite}
                        />
                    )}
                </Box>
            </Paper>
        </Container>
    );
}

/* ---------------- Tabs ---------------- */

function ProfileTab({ currentUser }: { currentUser: any }) {
    if (!currentUser) {
        return (
            <Typography color="text.secondary">
                Nu ești autentificat.
            </Typography>
        );
    }

    return (
        <Stack spacing={2}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
                <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" gap={2}>
                    <Box>
                        <Typography variant="h6" fontWeight={900}>
                            {currentUser.Name} {currentUser.Surname}
                        </Typography>
                        <Typography color="text.secondary">
                            Email: {currentUser.Email ?? "—"}
                        </Typography>
                        <Typography color="text.secondary">
                            Telefon: {currentUser.Phone}
                        </Typography>
                    </Box>

                    <Box textAlign={{ xs: "left", sm: "right" }}>
                        <Typography color="text.secondary">Sold cont</Typography>
                        <Typography variant="h6" fontWeight={900}>
                            {currentUser.Account_sold}
                        </Typography>
                    </Box>
                </Stack>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
                <Typography fontWeight={800} sx={{ mb: 1 }}>
                    Detalii
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                    <Chip label={`ID: ${currentUser.Id_User}`} />
                    <Chip label={`Zi naștere: ${currentUser.Birthday ?? "—"}`} />
                    <Chip label={`Gen: ${currentUser.Gender ?? "—"}`} />
                </Stack>
            </Paper>

            {/* optional later: edit form */}
            <Stack direction="row" gap={1}>
                <Button variant="contained" sx={{ borderRadius: 2 }}>
                    Editează profil (soon)
                </Button>
                <Button variant="outlined" sx={{ borderRadius: 2 }}>
                    Schimbă parola (soon)
                </Button>
            </Stack>
        </Stack>
    );
}

function MyListingsTab({
                           myListings,
                           favoriteIds,
                           onToggleFavorite,
                       }: {
    myListings: any[];
    favoriteIds: number[];
    onToggleFavorite: (id: number) => void;
}) {
    if (myListings.length === 0) {
        return (
            <Typography color="text.secondary">
                Nu ai anunțuri încă.
            </Typography>
        );
    }

    return (
        <Grid container spacing={2}>
            {myListings.map((a) => (
                <Grid item xs={12} sm={6} md={4} key={a.Id_Apartment}>
                    <Box>
                        <ListingCard apartment={a} />
                        <Button
                            onClick={() => onToggleFavorite(a.Id_Apartment)}
                            variant={favoriteIds.includes(a.Id_Apartment) ? "contained" : "outlined"}
                            fullWidth
                            sx={{ mt: 1, borderRadius: 2, textTransform: "none", fontWeight: 700 }}
                        >
                            {favoriteIds.includes(a.Id_Apartment) ? "În favorite" : "Adaugă la favorite"}
                        </Button>
                    </Box>
                </Grid>
            ))}
        </Grid>
    );
}

function PaymentsTab() {
    // Skeleton only (until you have mockdata/payment or backend)
    return (
        <Stack spacing={2}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
                <Typography fontWeight={900} sx={{ mb: 0.5 }}>
                    Istoric plăți
                </Typography>
                <Typography color="text.secondary">
                    Aici vor apărea plățile tale (note de plată / link-uri către chitanțe).
                </Typography>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
                <Typography fontWeight={800}>Exemplu (mock)</Typography>
                <Divider sx={{ my: 1.5 }} />
                <Stack spacing={1}>
                    <PaymentRow label="Plată #1001" meta="45 EUR • 2026-02-10 • Bd. Dacia 10" />
                    <PaymentRow label="Plată #1002" meta="35 EUR • 2026-02-01 • Str. Testemitanu 14" />
                </Stack>
            </Paper>
        </Stack>
    );
}

function PaymentRow({ label, meta }: { label: string; meta: string }) {
    return (
        <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2}>
            <Box>
                <Typography fontWeight={800}>{label}</Typography>
                <Typography color="text.secondary" variant="body2">
                    {meta}
                </Typography>
            </Box>
            <Button variant="outlined" sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700 }}>
                Vezi nota (soon)
            </Button>
        </Stack>
    );
}

function FavoritesTab({
                          favoriteApartments,
                          favoriteIds,
                          onToggleFavorite,
                      }: {
    favoriteApartments: any[];
    favoriteIds: number[];
    onToggleFavorite: (id: number) => void;
}) {
    if (favoriteApartments.length === 0) {
        return (
            <Typography color="text.secondary">
                Nu ai favorite încă. Adaugă din pagina “Anunțuri”.
            </Typography>
        );
    }

    return (
        <Grid container spacing={2}>
            {favoriteApartments.map((a) => (
                <Grid item xs={12} sm={6} md={4} key={a.Id_Apartment}>
                    <Box>
                        <ListingCard apartment={a} />
                        <Button
                            onClick={() => onToggleFavorite(a.Id_Apartment)}
                            variant="contained"
                            color="error"
                            fullWidth
                            sx={{ mt: 1, borderRadius: 2, textTransform: "none", fontWeight: 700 }}
                        >
                            Scoate din favorite
                        </Button>
                    </Box>
                </Grid>
            ))}
        </Grid>
    );
}