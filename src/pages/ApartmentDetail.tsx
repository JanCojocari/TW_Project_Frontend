import { useParams, useNavigate } from "react-router-dom";
import { useMemo, useState, useCallback } from "react";
import {
    Box,
    Container,
    Typography,
    Button,
    Paper,
    Chip,
    Divider,
    Card,
    CardContent,
    Alert,
    IconButton,
} from "@mui/material";
import {
    LocationOn as LocationOnIcon,
    AttachMoney as AttachMoneyIcon,
    Person as PersonIcon,
    ArrowBack as ArrowBackIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import { apartments } from "../mockdata/apartments";
import { users } from "../mockdata/users";

const buildImageList = (primaryUrl: string): string[] => {
    // Înlocuiește cu `apartment.images` când vei avea array real
    return [primaryUrl, primaryUrl, primaryUrl];
};

// ---------------------------------------------------------------------------
// ImageCarousel
// ---------------------------------------------------------------------------
interface CarouselProps {
    images: string[];
    altBase: string;
    statusChip: React.ReactNode;
}

const ImageCarousel = ({ images, altBase, statusChip }: CarouselProps) => {
    const [current, setCurrent] = useState(0);
    const [animDir, setAnimDir] = useState<"left" | "right" | null>(null);

    const go = useCallback(
        (dir: "prev" | "next") => {
            setAnimDir(dir === "next" ? "left" : "right");
            setTimeout(() => {
                setCurrent((c) =>
                    dir === "next"
                        ? (c + 1) % images.length
                        : (c - 1 + images.length) % images.length
                );
                setAnimDir(null);
            }, 260);
        },
        [images.length]
    );

    const goTo = useCallback(
        (idx: number) => {
            if (idx === current) return;
            setAnimDir(idx > current ? "left" : "right");
            setTimeout(() => {
                setCurrent(idx);
                setAnimDir(null);
            }, 260);
        },
        [current]
    );

    return (
        <Paper
            sx={{
                borderRadius: 4,
                overflow: "hidden",
                height: "100%",
                position: "relative",
            }}
        >
            {/* ── Slide ── */}
            <img
                src={images[current]}
                alt={altBase}
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    transition:
                        "transform 0.28s cubic-bezier(0.4,0,0.2,1), opacity 0.28s ease",
                    transform: animDir
                        ? `translateX(${animDir === "left" ? "-6%" : "6%"})`
                        : "translateX(0)",
                    opacity: animDir ? 0 : 1,
                }}
            />

            {/* Gradient scrim */}
            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    background:
                        "linear-gradient(to top, rgba(0,0,0,0.50) 0%, transparent 45%)",
                    pointerEvents: "none",
                }}
            />

            {/* Status chip — top-left, exact ca originalul */}
            <Box sx={{ position: "absolute", top: 20, left: 20 }}>
                {statusChip}
            </Box>

            {/* Counter top-right */}
            <Box
                sx={{
                    position: "absolute",
                    top: 18,
                    right: 18,
                    background: "rgba(0,0,0,0.45)",
                    backdropFilter: "blur(8px)",
                    color: "white",
                    fontSize: 12,
                    fontWeight: 700,
                    px: 1.5,
                    py: 0.4,
                    borderRadius: "20px",
                    border: "1px solid rgba(255,255,255,0.15)",
                    letterSpacing: "0.5px",
                    userSelect: "none",
                }}
            >
                {current + 1} / {images.length}
            </Box>

            {/* Prev */}
            <IconButton
                onClick={() => go("prev")}
                aria-label="Imaginea anterioară"
                sx={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "rgba(255,255,255,0.92)",
                    backdropFilter: "blur(8px)",
                    width: 40,
                    height: 40,
                    border: "1px solid rgba(255,255,255,0.5)",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                        background: "white",
                        transform: "translateY(-50%) scale(1.08)",
                        boxShadow: "0 4px 16px rgba(0, 224, 198, 0.28)",
                    },
                }}
            >
                <ChevronLeftIcon sx={{ color: "#00E0C6", fontSize: 24 }} />
            </IconButton>

            {/* Next */}
            <IconButton
                onClick={() => go("next")}
                aria-label="Imaginea următoare"
                sx={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "rgba(255,255,255,0.92)",
                    backdropFilter: "blur(8px)",
                    width: 40,
                    height: 40,
                    border: "1px solid rgba(255,255,255,0.5)",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                        background: "white",
                        transform: "translateY(-50%) scale(1.08)",
                        boxShadow: "0 4px 16px rgba(0, 224, 198, 0.28)",
                    },
                }}
            >
                <ChevronRightIcon sx={{ color: "#00E0C6", fontSize: 24 }} />
            </IconButton>

            {/* Thumbnail strip + dots — suprapuse la baza imaginii */}
            <Box
                sx={{
                    position: "absolute",
                    bottom: 14,
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1,
                }}
            >
                {/* Thumbnails */}
                <Box
                    sx={{
                        display: "flex",
                        gap: 1,
                        px: 1.2,
                        py: 0.8,
                        background: "rgba(0,0,0,0.35)",
                        backdropFilter: "blur(10px)",
                        borderRadius: 2.5,
                        border: "1px solid rgba(255,255,255,0.12)",
                    }}
                >
                    {images.map((url, idx) => (
                        <Box
                            key={idx}
                            component="img"
                            src={url}
                            alt={`thumb-${idx + 1}`}
                            onClick={() => goTo(idx)}
                            sx={{
                                width: 48,
                                height: 34,
                                objectFit: "cover",
                                borderRadius: 1.2,
                                cursor: "pointer",
                                border: idx === current
                                    ? "2px solid white"
                                    : "2px solid transparent",
                                opacity: idx === current ? 1 : 0.55,
                                transition: "all 0.2s ease",
                                "&:hover": { opacity: 1, transform: "scale(1.06)" },
                            }}
                        />
                    ))}
                </Box>

                {/* Dots */}
                <Box sx={{ display: "flex", gap: 0.8 }}>
                    {images.map((_, idx) => (
                        <Box
                            key={idx}
                            onClick={() => goTo(idx)}
                            sx={{
                                width: idx === current ? 20 : 7,
                                height: 7,
                                borderRadius: "100px",
                                background: idx === current
                                    ? "white"
                                    : "rgba(255,255,255,0.45)",
                                cursor: "pointer",
                                transition:
                                    "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                                "&:hover": {
                                    background: "rgba(255,255,255,0.8)",
                                },
                            }}
                        />
                    ))}
                </Box>
            </Box>
        </Paper>
    );
};

// ---------------------------------------------------------------------------
// ApartmentDetail
// ---------------------------------------------------------------------------
const ApartmentDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [showRentSuccess, setShowRentSuccess] = useState(false);

    const apartment = useMemo(
        () => apartments.find((a) => a.Id_Apartment === Number(id)),
        [id]
    );

    const owner = useMemo(
        () =>
            apartment ? users.find((u) => u.Id_User === apartment.Id_Owner) : null,
        [apartment]
    );

    const renter = useMemo(
        () =>
            apartment?.Id_Renter
                ? users.find((u) => u.Id_User === apartment.Id_Renter)
                : null,
        [apartment]
    );

    if (!apartment) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#071A1D",
                }}
            >
                <Typography variant="h5" sx={{ color: "#E6F7F5" }}>
                    Apartamentul nu a fost găsit
                </Typography>
            </Box>
        );
    }

    const handleRent = () => {
        navigate(`/payments?apartmentId=${apartment.Id_Apartment}`);
    };

    const getIntervalLabel = (interval: string): string => {
        const intervals: { [key: string]: string } = {
            hour: "oră",
            day: "zi",
            month: "lună",
        };
        return intervals[interval] || interval;
    };

    const isAvailable = apartment.Id_Renter === null;
    const images = buildImageList(apartment.image_url);

    const statusChip = (
        <Chip
            label={isAvailable ? "Disponibil" : "Ocupat"}
            sx={{
                background: isAvailable
                    ? "linear-gradient(135deg, #00E0C6, #00BFA6)"
                    : "linear-gradient(135deg, #FF4D6D, #FF3B4A)",
                color: isAvailable ? "#071A1D" : "white",
                fontWeight: 700,
                fontSize: "14px",
                px: 2,
                py: 2.5,
            }}
        />
    );

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: "#071A1D",
                py: { xs: 3, md: 5 },
                mt: 10,
            }}
        >
            <Container maxWidth="lg">
                {/* Buton înapoi */}
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                    sx={{
                        mb: 3,
                        color: "#00E0C6",
                        fontWeight: 600,
                        "&:hover": {
                            background: "rgba(0, 224, 198, 0.1)",
                        },
                    }}
                >
                    Înapoi la anunțuri
                </Button>

                {showRentSuccess && (
                    <Alert
                        severity="success"
                        onClose={() => setShowRentSuccess(false)}
                        sx={{ mb: 3, borderRadius: 2 }}
                    >
                        Apartament închiriat cu succes!
                    </Alert>
                )}

                {/* ── Layout: imagine stânga | detalii dreapta ── */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        gap: 4,
                    }}
                >
                    {/* Carousel — stânga */}
                    <Box sx={{ flex: { xs: "1", md: "1 1 58%" } }}>
                        <ImageCarousel
                            images={images}
                            altBase={apartment.Address}
                            statusChip={statusChip}
                        />
                    </Box>

                    {/* Detalii — dreapta */}
                    <Box sx={{ flex: { xs: "1", md: "1 1 42%" } }}>
                        <Paper
                            sx={{
                                p: 4,
                                borderRadius: 4,
                                height: "100%",
                                background: "#0F2F34",
                                border: "1px solid #12383D",
                            }}
                        >
                            {/* Adresă */}
                            <Box
                                sx={{
                                    display: "flex",
                                    gap: 2,
                                    alignItems: "flex-start",
                                    mb: 3,
                                }}
                            >
                                <Box
                                    sx={{
                                        background:
                                            "linear-gradient(135deg, #00E0C6, #00BFA6)",
                                        p: 1.5,
                                        borderRadius: 2,
                                        display: "flex",
                                    }}
                                >
                                    <LocationOnIcon
                                        sx={{ color: "#071A1D", fontSize: 28 }}
                                    />
                                </Box>
                                <Box>
                                    <Typography
                                        variant="body2"
                                        sx={{ color: "#8FB5B1" }}
                                        gutterBottom
                                    >
                                        Adresă
                                    </Typography>
                                    <Typography
                                        variant="h5"
                                        fontWeight={700}
                                        sx={{ color: "#E6F7F5" }}
                                    >
                                        {apartment.Address}
                                    </Typography>
                                </Box>
                            </Box>

                            <Divider sx={{ my: 3, borderColor: "#12383D" }} />

                            {/* Preț */}
                            <Box
                                sx={{
                                    display: "flex",
                                    gap: 2,
                                    alignItems: "flex-start",
                                    mb: 3,
                                }}
                            >
                                <Box
                                    sx={{
                                        background:
                                            "linear-gradient(135deg, #00E0C6, #00BFA6)",
                                        p: 1.5,
                                        borderRadius: 2,
                                        display: "flex",
                                    }}
                                >
                                    <AttachMoneyIcon
                                        sx={{ color: "#071A1D", fontSize: 28 }}
                                    />
                                </Box>
                                <Box>
                                    <Typography
                                        variant="body2"
                                        sx={{ color: "#8FB5B1" }}
                                        gutterBottom
                                    >
                                        Preț
                                    </Typography>
                                    <Typography
                                        variant="h4"
                                        fontWeight={900}
                                        sx={{ color: "#00E0C6" }}
                                    >
                                        {apartment.Cost_per_interval}{" "}
                                        {apartment.Currency}
                                        <Typography
                                            component="span"
                                            variant="body1"
                                            sx={{ color: "#8FB5B1", ml: 1 }}
                                        >
                                            /{" "}
                                            {getIntervalLabel(apartment.Interval)}
                                        </Typography>
                                    </Typography>
                                </Box>
                            </Box>

                            <Divider sx={{ my: 3, borderColor: "#12383D" }} />

                            {/* Proprietar */}
                            <Card
                                variant="outlined"
                                sx={{
                                    mb: 3,
                                    borderRadius: 2,
                                    background: "#0C2529",
                                    borderColor: "#12383D",
                                }}
                            >
                                <CardContent>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: 2,
                                            alignItems: "center",
                                            mb: 2,
                                        }}
                                    >
                                        <PersonIcon
                                            sx={{ color: "#00E0C6", fontSize: 28 }}
                                        />
                                        <Typography
                                            variant="h6"
                                            fontWeight={700}
                                            sx={{ color: "#E6F7F5" }}
                                        >
                                            Proprietar
                                        </Typography>
                                    </Box>
                                    {owner && (
                                        <>
                                            <Typography
                                                variant="body1"
                                                sx={{ color: "#8FB5B1" }}
                                                gutterBottom
                                            >
                                                <strong>Nume:</strong> {owner.Name}{" "}
                                                {owner.Surname}
                                            </Typography>
                                            <Typography
                                                variant="body1"
                                                sx={{ color: "#8FB5B1" }}
                                                gutterBottom
                                            >
                                                <strong>Email:</strong>{" "}
                                                {owner.Email || "N/A"}
                                            </Typography>
                                            <Typography
                                                variant="body1"
                                                sx={{ color: "#8FB5B1" }}
                                            >
                                                <strong>Telefon:</strong> {owner.Phone}
                                            </Typography>
                                        </>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Chiriaș curent */}
                            {!isAvailable && renter && (
                                <Card
                                    variant="outlined"
                                    sx={{
                                        mb: 3,
                                        borderRadius: 2,
                                        background: "#0C2529",
                                        borderColor: "#12383D",
                                    }}
                                >
                                    <CardContent>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                gap: 2,
                                                alignItems: "center",
                                                mb: 2,
                                            }}
                                        >
                                            <PersonIcon
                                                sx={{
                                                    color: "#FF4D6D",
                                                    fontSize: 28,
                                                }}
                                            />
                                            <Typography
                                                variant="h6"
                                                fontWeight={700}
                                                sx={{ color: "#E6F7F5" }}
                                            >
                                                Chiriaș Curent
                                            </Typography>
                                        </Box>
                                        <Typography
                                            variant="body1"
                                            sx={{ color: "#8FB5B1" }}
                                            gutterBottom
                                        >
                                            <strong>Nume:</strong> {renter.Name}{" "}
                                            {renter.Surname}
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            sx={{ color: "#8FB5B1" }}
                                            gutterBottom
                                        >
                                            <strong>Email:</strong>{" "}
                                            {renter.Email || "N/A"}
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            sx={{ color: "#8FB5B1" }}
                                        >
                                            <strong>Telefon:</strong> {renter.Phone}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Buton închiriere */}
                            <Button
                                variant="contained"
                                fullWidth
                                size="large"
                                onClick={handleRent}
                                disabled={!isAvailable}
                                sx={{
                                    background: isAvailable
                                        ? "linear-gradient(90deg, #00E0C6, #00BFA6)"
                                        : "rgba(0, 224, 198, 0.3)",
                                    color: isAvailable ? "#071A1D" : "#8FB5B1",
                                    py: 1.8,
                                    borderRadius: 2,
                                    fontWeight: 700,
                                    fontSize: 16,
                                    "&:hover": {
                                        transform: isAvailable
                                            ? "translateY(-2px)"
                                            : "none",
                                        boxShadow: isAvailable
                                            ? "0 12px 24px rgba(0, 224, 198, 0.4)"
                                            : "none",
                                    },
                                }}
                            >
                                {isAvailable
                                    ? "Închiriază Acum (soon)"
                                    : "Indisponibil"}
                            </Button>

                            {isAvailable && (
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: "#8FB5B1",
                                        display: "block",
                                        mt: 2,
                                        textAlign: "center",
                                    }}
                                >
                                    Vei fi redirecționat către pagina de plată
                                </Typography>
                            )}
                        </Paper>
                    </Box>
                </Box>

                {/* Informații suplimentare */}
                <Paper
                    sx={{
                        mt: 4,
                        p: 4,
                        borderRadius: 4,
                        background: "#0F2F34",
                        border: "1px solid #12383D",
                    }}
                >
                    <Typography
                        variant="h5"
                        fontWeight={700}
                        sx={{ mb: 3, color: "#E6F7F5" }}
                    >
                        Informații Suplimentare
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
};

export default ApartmentDetail;