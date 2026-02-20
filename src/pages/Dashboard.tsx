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
import ApartmentCard from "../components/ApartmentCard";
import type { Apartment } from "../types/apartment.types.ts";

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
        <Container
            maxWidth="lg"
            sx={{
                py: { xs: 4, md: 8 },
                minHeight: "100vh",
                mt: 10,
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    p: 6,
                    borderRadius: 4,
                    background: "#0F2F34",
                    border: "1px solid #12383D",
                    boxShadow: "0 40px 100px rgba(0, 0, 0, 0.4)",
                }}
            >
                {/* Header */}
                <Box sx={{ mb: 6 }}>
                    <Typography
                        variant="h3"
                        fontWeight={900}
                        sx={{
                            color: "#E6F7F5",
                            letterSpacing: "-1.5px",
                            mb: 1,
                        }}
                    >
                        Control <Box component="span" sx={{ color: "#00E0C6" }}>Panel</Box>
                    </Typography>
                    <Typography sx={{ color: "#8FB5B1", fontSize: "16px" }}>
                        Monitorizează activitatea, gestionează portofoliul și plățile tale.
                    </Typography>
                </Box>

                {/* Tabs */}
                <Tabs
                    value={tab}
                    onChange={(_, v) => setTab(v)}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                        mb: 2,
                        borderBottom: "1px solid #12383D",
                        "& .MuiTab-root": {
                            textTransform: "none",
                            fontWeight: 800,
                            fontSize: "15px",
                            color: "#5C7A77",
                            px: 4,
                            pb: 2.5,
                            "&.Mui-selected": {
                                color: "#00E0C6",
                            },
                        },
                        "& .MuiTabs-indicator": {
                            backgroundColor: "#00E0C6",
                            height: 3,
                            borderRadius: "3px 3px 0 0",
                            boxShadow: "0 0 10px rgba(0, 224, 198, 0.5)",
                        },
                    }}
                >
                    <Tab label="Profil Utilizator" />
                    <Tab label="Proprietățile Mele" />
                    <Tab label="Istoric Financiar" />
                    <Tab label="Favorite" />
                </Tabs>

                {/* Tab Content */}
                <Box sx={{ pt: 6 }}>
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

                    {tab === 2 && <PaymentsTab />}

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

/* ─────────── Profil Tab ─────────── */

function ProfileTab({
                        currentUser,
                        onEditProfile,
                    }: {
    currentUser: any;
    onEditProfile: () => void;
}) {
    const [changePasswordOpen, setChangePasswordOpen] = useState(false);

    if (!currentUser) {
        return (
            <Typography sx={{ color: "#5C7A77", textAlign: "center", py: 10 }}>
                Eroare: Sesiune utilizator invalidă.
            </Typography>
        );
    }

    return (
        <Stack spacing={4}>
            {/* User Info Card */}
            <Paper
                elevation={0}
                sx={{
                    p: 4,
                    borderRadius: 4,
                    background: "#0C2529",
                    border: "1px solid #12383D",
                }}
            >
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    gap={3}
                >
                    <Box>
                        <Typography
                            variant="h5"
                            fontWeight={900}
                            sx={{ color: "#E6F7F5", mb: 2 }}
                        >
                            {currentUser.Name} {currentUser.Surname}
                        </Typography>
                        <Stack spacing={1}>
                            <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                                <Typography
                                    sx={{
                                        color: "#5C7A77",
                                        fontSize: "12px",
                                        textTransform: "uppercase",
                                        fontWeight: 800,
                                        minWidth: "50px",
                                    }}
                                >
                                    Email
                                </Typography>
                                <Typography
                                    sx={{
                                        color: "#8FB5B1",
                                        fontSize: "14px",
                                        fontWeight: 600,
                                    }}
                                >
                                    {currentUser.Email ?? "—"}
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                                <Typography
                                    sx={{
                                        color: "#5C7A77",
                                        fontSize: "12px",
                                        textTransform: "uppercase",
                                        fontWeight: 800,
                                        minWidth: "50px",
                                    }}
                                >
                                    Telefon
                                </Typography>
                                <Typography
                                    sx={{
                                        color: "#8FB5B1",
                                        fontSize: "14px",
                                        fontWeight: 600,
                                    }}
                                >
                                    {currentUser.Phone}
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>

                    <Box
                        sx={{
                            background: "#0F2F34",
                            p: 3,
                            borderRadius: 3,
                            border: "1px solid #12383D",
                            minWidth: { xs: "100%", sm: "200px" },
                            textAlign: "center",
                        }}
                    >
                        <Typography
                            sx={{
                                color: "#5C7A77",
                                fontSize: "11px",
                                textTransform: "uppercase",
                                fontWeight: 800,
                                letterSpacing: "1px",
                                mb: 1,
                            }}
                        >
                            Sold Disponibil
                        </Typography>
                        <Typography
                            variant="h4"
                            fontWeight={900}
                            sx={{
                                color: "#00E0C6",
                                textShadow: "0 0 15px rgba(0, 224, 198, 0.3)",
                            }}
                        >
                            {currentUser.Account_sold} EUR
                        </Typography>
                    </Box>
                </Stack>
            </Paper>

            {/* Technical Info */}
            <Box>
                <Typography
                    variant="overline"
                    sx={{
                        color: "#5C7A77",
                        fontWeight: 800,
                        letterSpacing: "2px",
                        mb: 2,
                        display: "block",
                    }}
                >
                    Informații Tehnice
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={2}>
                    <Chip
                        label={`UID: ${currentUser.Id_User}`}
                        sx={{
                            background: "rgba(0, 224, 198, 0.05)",
                            color: "#00E0C6",
                            fontWeight: 800,
                            border: "1px solid rgba(0, 224, 198, 0.1)",
                            borderRadius: "8px",
                        }}
                    />
                    <Chip
                        label={`Născut: ${currentUser.Birthday ?? "—"}`}
                        sx={{
                            background: "#0C2529",
                            color: "#8FB5B1",
                            fontWeight: 700,
                            border: "1px solid #12383D",
                            borderRadius: "8px",
                        }}
                    />
                    <Chip
                        label={`Gen: ${
                            currentUser.Gender === "M" ? "Masculin" : "Feminin"
                        }`}
                        sx={{
                            background: "#0C2529",
                            color: "#8FB5B1",
                            fontWeight: 700,
                            border: "1px solid #12383D",
                            borderRadius: "8px",
                        }}
                    />
                </Stack>
            </Box>

            <Divider sx={{ borderColor: "#12383D" }} />

            {/* Action Buttons */}
            <Stack direction={{ xs: "column", sm: "row" }} gap={3}>
                <Button
                    variant="contained"
                    onClick={onEditProfile}
                    sx={{
                        background: "linear-gradient(90deg, #00E0C6, #00BFA6)",
                        color: "#071A1D",
                        borderRadius: 2.5,
                        textTransform: "none",
                        fontWeight: 900,
                        px: 4,
                        py: 1.5,
                        boxShadow: "0 0 15px rgba(0, 224, 198, 0.2)",
                        "&:hover": {
                            background: "linear-gradient(90deg, #00FFF0, #00E0C6)",
                            boxShadow: "0 0 25px rgba(0, 224, 198, 0.4)",
                            transform: "translateY(-2px)",
                        },
                    }}
                >
                    Actualizează Datele
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => setChangePasswordOpen(true)}
                    sx={{
                        borderColor: "#12383D",
                        color: "#8FB5B1",
                        borderRadius: 2.5,
                        textTransform: "none",
                        fontWeight: 700,
                        px: 4,
                        py: 1.5,
                        "&:hover": {
                            borderColor: "#00E0C6",
                            background: "rgba(0, 224, 198, 0.05)",
                            color: "#E6F7F5",
                        },
                    }}
                >
                    Schimbă Parola
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

/* ─────────── Change Password Dialog ─────────── */

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
        current: false,
        next: false,
        confirm: false,
    });
    const [success, setSuccess] = useState(false);

    const reset = () => {
        setForm(empty);
        setErrors({});
        setTouched({});
        setShowPwd({ current: false, next: false, confirm: false });
        setSuccess(false);
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleChange = (field: keyof PwdForm) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
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

    const pwdField = (field: keyof PwdForm, label: string) => (
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
            sx={{
                "& .MuiOutlinedInput-root": {
                    color: "#E6F7F5",
                    "& fieldset": { borderColor: "#12383D" },
                    "&:hover fieldset": { borderColor: "#00E0C6" },
                    "&.Mui-focused fieldset": { borderColor: "#00E0C6" },
                },
                "& .MuiInputBase-input::placeholder": {
                    color: "#5C7A77",
                    opacity: 1,
                },
                "& .MuiFormHelperText-root": {
                    color: "#FF4D6D",
                },
            }}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                            onClick={() => toggleShow(field)}
                            edge="end"
                            size="small"
                            sx={{ color: "#00E0C6" }}
                        >
                            {showPwd[field] ? (
                                <VisibilityOffIcon fontSize="small" />
                            ) : (
                                <VisibilityIcon fontSize="small" />
                            )}
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />
    );

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="xs"
            PaperProps={{
                sx: {
                    background: "#0F2F34",
                    border: "1px solid #12383D",
                },
            }}
        >
            <DialogTitle
                sx={{
                    fontWeight: 900,
                    color: "#E6F7F5",
                    borderBottom: "1px solid #12383D",
                }}
            >
                Schimbă Parola
            </DialogTitle>
            <Box component="form" onSubmit={handleSubmit} noValidate>
                <DialogContent sx={{ backgroundColor: "#0F2F34" }}>
                    <Stack spacing={2.5} sx={{ pt: 2 }}>
                        {pwdField("current", "Parola curentă")}
                        <Divider sx={{ borderColor: "#12383D" }} />
                        {pwdField("next", "Parola nouă")}
                        {pwdField("confirm", "Confirmă parola nouă")}
                        {success && (
                            <Alert
                                severity="success"
                                sx={{
                                    borderRadius: 2,
                                    background: "rgba(34, 227, 164, 0.1)",
                                    color: "#22E3A4",
                                    "& .MuiAlert-icon": { color: "#22E3A4" },
                                }}
                            >
                                Parola a fost schimbată cu succes!
                            </Alert>
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions
                    sx={{
                        px: 3,
                        pb: 2.5,
                        gap: 1,
                        borderTop: "1px solid #12383D",
                    }}
                >
                    <Button
                        onClick={handleClose}
                        variant="outlined"
                        sx={{
                            textTransform: "none",
                            fontWeight: 700,
                            borderRadius: 2,
                            borderColor: "#12383D",
                            color: "#8FB5B1",
                            "&:hover": {
                                borderColor: "#00E0C6",
                                background: "rgba(0, 224, 198, 0.05)",
                                color: "#E6F7F5",
                            },
                        }}
                    >
                        Anulează
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{
                            textTransform: "none",
                            fontWeight: 700,
                            borderRadius: 2,
                            background: "linear-gradient(90deg, #00E0C6, #00BFA6)",
                            color: "#071A1D",
                            "&:hover": {
                                background: "linear-gradient(90deg, #00FFF0, #00E0C6)",
                                boxShadow: "0 0 20px rgba(0, 224, 198, 0.4)",
                            },
                        }}
                    >
                        Salvează
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}

/* ─────────── My Listings Tab ─────────── */

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
            <Box sx={{ textAlign: "center", py: 10 }}>
                <Typography
                    sx={{
                        color: "#5C7A77",
                        fontSize: "18px",
                        fontStyle: "italic",
                    }}
                >
                    Nu ai publicat niciun anunț până în prezent.
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: "grid",
                gap: 4,
                gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(3, 1fr)",
                },
            }}
        >
            {myListings.map((apt) => (
                <ApartmentCard
                    key={apt.Id_Apartment}
                    apartment={apt}
                    favorites={favoriteIds}
                    toggleFavorite={onToggleFavorite}
                    getUserName={(id: number) =>
                        users.find((u) => u.Id_User === id)?.Name || "User"
                    }
                    getStatus={(a: any) =>
                        a.Id_Renter ? "Ocupat" : "Disponibil"
                    }
                    getIntervalLabel={(interval: string) => {
                        if (interval === "hour") return "oră";
                        if (interval === "day") return "zi";
                        if (interval === "month") return "lună";
                        return interval;
                    }}
                />
            ))}
        </Box>
    );
}

/* ─────────── Payments Tab ─────────── */

function PaymentsTab() {
    return (
        <Stack spacing={4}>
            <Box>
                <Typography
                    variant="h5"
                    fontWeight={900}
                    sx={{ color: "#E6F7F5", mb: 4 }}
                >
                    Arhivă Plăți & Facturi
                </Typography>
                <Stack spacing={2.5}>
                    <PaymentRow
                        label="Chirie Apartament #442"
                        meta="850 EUR • Februarie 2026 • Mun. Chișinău"
                        status="Succes"
                    />
                    <PaymentRow
                        label="Chirie Apartament #119"
                        meta="420 EUR • Ianuarie 2026 • Str. Pușkin 12"
                        status="Succes"
                    />
                </Stack>
            </Box>
        </Stack>
    );
}

function PaymentRow({
                        label,
                        meta,
                        status,
                    }: {
    label: string;
    meta: string;
    status: string;
}) {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                borderRadius: 4,
                background: "#0C2529",
                border: "1px solid #12383D",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                transition: "all 0.3s ease",
                "&:hover": {
                    borderColor: "#00E0C6",
                    background: "#0F2F34",
                },
            }}
        >
            <Box>
                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        alignItems: "center",
                        mb: 0.5,
                    }}
                >
                    <Typography
                        fontWeight={800}
                        sx={{ color: "#E6F7F5", fontSize: "16px" }}
                    >
                        {label}
                    </Typography>
                    <Chip
                        label={status}
                        size="small"
                        sx={{
                            background: "rgba(34, 227, 164, 0.1)",
                            color: "#22E3A4",
                            fontWeight: 800,
                            fontSize: "10px",
                            height: "20px",
                        }}
                    />
                </Box>
                <Typography sx={{ color: "#5C7A77", fontSize: "14px" }}>
                    {meta}
                </Typography>
            </Box>
            <Button
                variant="outlined"
                sx={{
                    borderColor: "#12383D",
                    color: "#00E0C6",
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 800,
                    px: 3,
                    "&:hover": {
                        borderColor: "#00E0C6",
                        background: "rgba(0, 224, 198, 0.05)",
                    },
                }}
            >
                Descarcă PDF
            </Button>
        </Paper>
    );
}

/* ─────────── Favorites Tab ─────────── */

function FavoritesTab({
                          favoriteApartments,
                          favoriteIds,
                          onToggleFavorite,
                      }: {
    favoriteApartments: Apartment[];
    favoriteIds: number[];
    onToggleFavorite: (id: number) => void;
}) {
    if (favoriteApartments.length === 0) {
        return (
            <Box sx={{ textAlign: "center", py: 10 }}>
                <Typography
                    sx={{
                        color: "#5C7A77",
                        fontSize: "18px",
                        fontStyle: "italic",
                    }}
                >
                    Lista ta de favorite este goală.
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: "grid",
                gap: 4,
                gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(3, 1fr)",
                },
            }}
        >
            {favoriteApartments.map((apt) => (
                <ApartmentCard
                    key={apt.Id_Apartment}
                    apartment={apt}
                    favorites={favoriteIds}
                    toggleFavorite={onToggleFavorite}
                    getUserName={(id: number) =>
                        users.find((u) => u.Id_User === id)?.Name || "User"
                    }
                    getStatus={(a: any) =>
                        a.Id_Renter ? "Ocupat" : "Disponibil"
                    }
                    getIntervalLabel={(interval: string) => {
                        if (interval === "hour") return "oră";
                        if (interval === "day") return "zi";
                        if (interval === "month") return "lună";
                        return interval;
                    }}
                />
            ))}
        </Box>
    );
}