import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Alert,
    Box,
    Button,
    Chip,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    InputAdornment,
    Paper,
    Stack,
    Tab,
    Tabs,
    TextField,
    Typography,
    Grid,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

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
    const navigate = useNavigate();
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
                        <ProfileTab
                            currentUser={currentUser}
                            onEditProfile={() => navigate(paths.editProfile)}
                        />
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

function ProfileTab({ currentUser, onEditProfile }: { currentUser: any; onEditProfile: () => void }) {
    const [changePasswordOpen, setChangePasswordOpen] = useState(false);

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

            <Stack direction="row" gap={1}>
                <Button
                    variant="contained"
                    onClick={onEditProfile}
                    sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700 }}
                >
                    Editează profil
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => setChangePasswordOpen(true)}
                    sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700 }}
                >
                    Schimbă parola
                </Button>
            </Stack>

            <ChangePasswordDialog
                open={changePasswordOpen}
                onClose={() => setChangePasswordOpen(false)}
                currentPassword={currentUser.Password}
            />
        </Stack>
    );
}

/* ─── Change Password Dialog ─────────────────────────────── */

type PwdForm = { current: string; next: string; confirm: string };
type PwdErrors = Partial<Record<keyof PwdForm, string>>;

function validatePwd(form: PwdForm, realCurrent: string): PwdErrors {
    const errors: PwdErrors = {};
    if (!form.current) {
        errors.current = "Parola curentă este obligatorie.";
    } else if (form.current !== realCurrent) {
        errors.current = "Parola curentă este incorectă.";
    }
    if (!form.next) {
        errors.next = "Parola nouă este obligatorie.";
    } else if (form.next.length < 6) {
        errors.next = "Parola nouă trebuie să aibă cel puțin 6 caractere.";
    } else if (form.next === form.current) {
        errors.next = "Parola nouă trebuie să fie diferită de cea curentă.";
    }
    if (!form.confirm) {
        errors.confirm = "Confirmarea parolei este obligatorie.";
    } else if (form.confirm !== form.next) {
        errors.confirm = "Parolele nu se potrivesc.";
    }
    return errors;
}

function ChangePasswordDialog({
    open,
    onClose,
    currentPassword,
}: {
    open: boolean;
    onClose: () => void;
    currentPassword: string;
}) {
    const empty: PwdForm = { current: "", next: "", confirm: "" };
    const [form, setForm] = useState<PwdForm>(empty);
    const [errors, setErrors] = useState<PwdErrors>({});
    const [touched, setTouched] = useState<Partial<Record<keyof PwdForm, boolean>>>({});
    const [showPwd, setShowPwd] = useState<Record<keyof PwdForm, boolean>>({
        current: false, next: false, confirm: false,
    });
    const [success, setSuccess] = useState(false);

    const reset = () => {
        setForm(empty);
        setErrors({});
        setTouched({});
        setShowPwd({ current: false, next: false, confirm: false });
        setSuccess(false);
    };

    const handleClose = () => { reset(); onClose(); };

    const handleChange = (field: keyof PwdForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const updated = { ...form, [field]: e.target.value };
        setForm(updated);
        setSuccess(false);
        if (touched[field]) setErrors(validatePwd(updated, currentPassword));
    };

    const handleBlur = (field: keyof PwdForm) => () => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        setErrors(validatePwd(form, currentPassword));
    };

    const toggleShow = (field: keyof PwdForm) =>
        setShowPwd((prev) => ({ ...prev, [field]: !prev[field] }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setTouched({ current: true, next: true, confirm: true });
        const errs = validatePwd(form, currentPassword);
        setErrors(errs);
        if (Object.keys(errs).length > 0) return;
        // TODO: call API when backend is ready
        setSuccess(true);
        setForm(empty);
        setTouched({});
    };

    const showErr = (f: keyof PwdForm) => touched[f] && !!errors[f];
    const errMsg = (f: keyof PwdForm) => (touched[f] ? errors[f] : undefined);

    const pwdField = (
        field: keyof PwdForm,
        label: string,
    ) => (
        <TextField
            label={label}
            type={showPwd[field] ? "text" : "password"}
            value={form[field]}
            onChange={handleChange(field)}
            onBlur={handleBlur(field)}
            error={showErr(field)}
            helperText={errMsg(field)}
            fullWidth
            required
            autoComplete="off"
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton onClick={() => toggleShow(field)} edge="end" size="small">
                            {showPwd[field] ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />
    );

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
            <DialogTitle sx={{ fontWeight: 900 }}>Schimbă parola</DialogTitle>
            <Box component="form" onSubmit={handleSubmit} noValidate>
                <DialogContent>
                    <Stack spacing={2.5} sx={{ pt: 0.5 }}>
                        {pwdField("current", "Parola curentă")}
                        <Divider />
                        {pwdField("next", "Parola nouă")}
                        {pwdField("confirm", "Confirmă parola nouă")}
                        {success && (
                            <Alert severity="success" sx={{ borderRadius: 2 }}>
                                Parola a fost schimbată cu succes! (mock)
                            </Alert>
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
                    <Button
                        onClick={handleClose}
                        variant="outlined"
                        sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2 }}
                    >
                        Anulează
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2 }}
                    >
                        Salvează
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
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
        <></>
        /*<Grid container spacing={2}>
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
        </Grid>*/
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
        <></>
        /*<Grid container spacing={2}>
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
        </Grid>*/
    );
}