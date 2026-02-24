import { useParams, useNavigate } from "react-router-dom";
import { useMemo, useState, useCallback } from "react";
import {
    Box, Container, Typography, Button, Paper, Chip, Divider,
    Card, CardContent, Alert, IconButton,
} from "@mui/material";
import {
    LocationOn as LocationOnIcon, AttachMoney as AttachMoneyIcon,
    Person as PersonIcon, ArrowBack as ArrowBackIcon,
    ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import { apartments } from "../mockdata/apartments";
import { users }      from "../mockdata/users";
import { gradients, colors } from "../theme/gradients.ts";

const buildImageList = (url: string) => [url, url, url];

/* ── ImageCarousel ────────────────────────────────────────────────────── */

interface CarouselProps { images: string[]; altBase: string; statusChip: React.ReactNode; }

const ImageCarousel = ({ images, altBase, statusChip }: CarouselProps) => {
    const [current, setCurrent] = useState(0);
    const [animDir, setAnimDir] = useState<"left" | "right" | null>(null);

    const go = useCallback((dir: "prev" | "next") => {
        setAnimDir(dir === "next" ? "left" : "right");
        setTimeout(() => {
            setCurrent((c) => dir === "next" ? (c + 1) % images.length : (c - 1 + images.length) % images.length);
            setAnimDir(null);
        }, 260);
    }, [images.length]);

    const goTo = useCallback((idx: number) => {
        if (idx === current) return;
        setAnimDir(idx > current ? "left" : "right");
        setTimeout(() => { setCurrent(idx); setAnimDir(null); }, 260);
    }, [current]);

    return (
        <Paper elevation={2} sx={{ borderRadius: 4, overflow: "hidden", height: "100%", position: "relative" }}>
            <img
                src={images[current]}
                alt={altBase}
                style={{
                    width: "100%", height: "100%", objectFit: "cover", display: "block",
                    transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1), opacity 0.28s ease",
                    transform:  animDir ? `translateX(${animDir === "left" ? "-6%" : "6%"})` : "translateX(0)",
                    opacity:    animDir ? 0 : 1,
                }}
            />

            {/* Gradient scrim */}
            <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 45%)", pointerEvents: "none" }} />

            {/* Status chip */}
            <Box sx={{ position: "absolute", top: 20, left: 20 }}>{statusChip}</Box>

            {/* Counter */}
            <Box sx={{
                position: "absolute", top: 18, right: 18,
                bgcolor: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)",
                color: "white", fontSize: 12, fontWeight: 700, px: 1.5, py: 0.4,
                borderRadius: "20px", border: "1px solid rgba(255,255,255,0.15)", userSelect: "none",
            }}>
                {current + 1} / {images.length}
            </Box>

            {/* Prev / Next */}
            {(["prev", "next"] as const).map((dir) => (
                <IconButton
                    key={dir}
                    onClick={() => go(dir)}
                    aria-label={dir === "prev" ? "Imaginea anterioară" : "Imaginea următoare"}
                    sx={{
                        position: "absolute", top: "50%",
                        [dir === "prev" ? "left" : "right"]: 12,
                        transform: "translateY(-50%)",
                        bgcolor: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)",
                        width: 40, height: 40,
                        border: "1px solid rgba(255,255,255,0.5)",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
                        transition: "all 0.2s ease",
                        "&:hover": { bgcolor: "white", transform: "translateY(-50%) scale(1.08)", boxShadow: `0 4px 16px ${colors.primaryAlpha25}` },
                    }}
                >
                    {dir === "prev" ? <ChevronLeftIcon sx={{ color: "primary.main" }} /> : <ChevronRightIcon sx={{ color: "primary.main" }} />}
                </IconButton>
            ))}

            {/* Thumbnails + dots */}
            <Box sx={{ position: "absolute", bottom: 14, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                <Box sx={{ display: "flex", gap: 1, px: 1.2, py: 0.8, bgcolor: "rgba(0,0,0,0.35)", backdropFilter: "blur(10px)", borderRadius: 2.5, border: "1px solid rgba(255,255,255,0.12)" }}>
                    {images.map((url, idx) => (
                        <Box
                            key={idx}
                            component="img"
                            src={url}
                            alt={`thumb-${idx + 1}`}
                            onClick={() => goTo(idx)}
                            sx={{
                                width: 48, height: 34, objectFit: "cover", borderRadius: 1.2, cursor: "pointer",
                                border: idx === current ? "2px solid white" : "2px solid transparent",
                                opacity: idx === current ? 1 : 0.55,
                                transition: "all 0.2s ease",
                                "&:hover": { opacity: 1, transform: "scale(1.06)" },
                            }}
                        />
                    ))}
                </Box>
                <Box sx={{ display: "flex", gap: 0.8 }}>
                    {images.map((_, idx) => (
                        <Box
                            key={idx}
                            onClick={() => goTo(idx)}
                            sx={{
                                width: idx === current ? 20 : 7, height: 7, borderRadius: "100px",
                                bgcolor: idx === current ? "white" : "rgba(255,255,255,0.45)",
                                cursor: "pointer", transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                                "&:hover": { bgcolor: "rgba(255,255,255,0.8)" },
                            }}
                        />
                    ))}
                </Box>
            </Box>
        </Paper>
    );
};

/* ── ApartmentDetail ──────────────────────────────────────────────────── */

const ApartmentDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [showRentSuccess, setShowRentSuccess] = useState(false);

    const apartment = useMemo(() => apartments.find((a) => a.Id_Apartment === Number(id)), [id]);
    const owner     = useMemo(() => apartment ? users.find((u) => u.Id_User === apartment.Id_Owner) : null, [apartment]);
    const renter    = useMemo(() => apartment?.Id_Renter ? users.find((u) => u.Id_User === apartment.Id_Renter) : null, [apartment]);

    if (!apartment) return (
        <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "background.default" }}>
            <Typography variant="h5" color="text.secondary">Apartamentul nu a fost găsit</Typography>
        </Box>
    );

    const isAvailable = apartment.Id_Renter === null;
    const images      = buildImageList(apartment.image_url);

    const getIntervalLabel = (interval: string) => ({ hour: "oră", day: "zi", month: "lună" }[interval] ?? interval);

    const statusChip = (
        <Chip
            label={isAvailable ? "Disponibil" : "Ocupat"}
            color={isAvailable ? "success" : "error"}
            sx={{ fontWeight: 700, fontSize: "14px", px: 2, py: 2.5 }}
        />
    );

    const iconBoxSx = {
        background: gradients.primary,
        p: 1.5, borderRadius: 2, display: "flex",
        color: "#FFFFFF",
        boxShadow: `0 4px 12px ${colors.primaryAlpha25}`,
    };

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: { xs: 3, md: 5 }, mt: 10 }}>
            <Container maxWidth="lg">
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 3, fontWeight: 600 }}>
                    Înapoi la anunțuri
                </Button>

                {showRentSuccess && (
                    <Alert severity="success" onClose={() => setShowRentSuccess(false)} sx={{ mb: 3 }}>
                        Apartament închiriat cu succes!
                    </Alert>
                )}

                <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
                    {/* Carousel */}
                    <Box sx={{ flex: { xs: "1", md: "1 1 58%" } }}>
                        <ImageCarousel images={images} altBase={apartment.Address} statusChip={statusChip} />
                    </Box>

                    {/* Details */}
                    <Box sx={{ flex: { xs: "1", md: "1 1 42%" } }}>
                        <Paper elevation={1} sx={{ p: 4, borderRadius: 4, height: "100%", border: `1px solid ${colors.border}` }}>

                            {/* Address */}
                            <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start", mb: 3 }}>
                                <Box sx={iconBoxSx}><LocationOnIcon sx={{ fontSize: 28 }} /></Box>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>Adresă</Typography>
                                    <Typography variant="h5" fontWeight={700}>{apartment.Address}</Typography>
                                </Box>
                            </Box>

                            <Divider sx={{ my: 3 }} />

                            {/* Price */}
                            <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start", mb: 3 }}>
                                <Box sx={iconBoxSx}><AttachMoneyIcon sx={{ fontSize: 28 }} /></Box>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>Preț</Typography>
                                    <Typography variant="h4" fontWeight={900} color="primary.main">
                                        {apartment.Cost_per_interval} {apartment.Currency}
                                        <Typography component="span" variant="body1" color="text.secondary" sx={{ ml: 1 }}>
                                            / {getIntervalLabel(apartment.Interval)}
                                        </Typography>
                                    </Typography>
                                </Box>
                            </Box>

                            <Divider sx={{ my: 3 }} />

                            {/* Owner */}
                            <Card variant="outlined" sx={{ mb: 3, borderRadius: 2, bgcolor: "background.default" }}>
                                <CardContent>
                                    <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
                                        <PersonIcon sx={{ color: "primary.main", fontSize: 28 }} />
                                        <Typography variant="h6" fontWeight={700}>Proprietar</Typography>
                                    </Box>
                                    {owner && (
                                        <>
                                            <Typography variant="body1" color="text.secondary" gutterBottom><strong>Nume:</strong> {owner.Name} {owner.Surname}</Typography>
                                            <Typography variant="body1" color="text.secondary" gutterBottom><strong>Email:</strong> {owner.Email || "N/A"}</Typography>
                                            <Typography variant="body1" color="text.secondary"><strong>Telefon:</strong> {owner.Phone}</Typography>
                                        </>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Renter */}
                            {!isAvailable && renter && (
                                <Card variant="outlined" sx={{ mb: 3, borderRadius: 2, bgcolor: "background.default" }}>
                                    <CardContent>
                                        <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
                                            <PersonIcon sx={{ color: "error.main", fontSize: 28 }} />
                                            <Typography variant="h6" fontWeight={700}>Chiriaș Curent</Typography>
                                        </Box>
                                        <Typography variant="body1" color="text.secondary" gutterBottom><strong>Nume:</strong> {renter.Name} {renter.Surname}</Typography>
                                        <Typography variant="body1" color="text.secondary" gutterBottom><strong>Email:</strong> {renter.Email || "N/A"}</Typography>
                                        <Typography variant="body1" color="text.secondary"><strong>Telefon:</strong> {renter.Phone}</Typography>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Rent button */}
                            <Button
                                variant="contained"
                                fullWidth
                                size="large"
                                onClick={() => navigate(`/payments?apartmentId=${apartment.Id_Apartment}`)}
                                disabled={!isAvailable}
                                sx={{ py: 1.8, borderRadius: 2, fontWeight: 700, fontSize: 16 }}
                            >
                                {isAvailable ? "Închiriază Acum" : "Indisponibil"}
                            </Button>

                            {isAvailable && (
                                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2, textAlign: "center" }}>
                                    Vei fi redirecționat către pagina de plată
                                </Typography>
                            )}
                        </Paper>
                    </Box>
                </Box>

                {/* Additional info */}
                <Paper elevation={1} sx={{ mt: 4, p: 4, borderRadius: 4, border: `1px solid ${colors.border}` }}>
                    <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>Informații Suplimentare</Typography>
                </Paper>
            </Container>
        </Box>
    );
};

export default ApartmentDetail;