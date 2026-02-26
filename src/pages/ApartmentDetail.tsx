import { useParams, useNavigate } from "react-router-dom";
import { useMemo, useState, useCallback } from "react";
import {
    Box, Container, Typography, Button, Paper, Chip, Divider,
    Card, CardContent, Alert, IconButton, Tabs, Tab,
    LinearProgress, Avatar,
} from "@mui/material";
import {
    LocationOn as LocationOnIcon,
    AttachMoney as AttachMoneyIcon,
    Person as PersonIcon,
    ArrowBack as ArrowBackIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    Wifi as WifiIcon,
    LocalParking as ParkingIcon,
    AcUnit as AcIcon,
    LocalFireDepartment as HeatingIcon,
    LocalLaundryService as WasherIcon,
    DryCleaningOutlined as DryerIcon,
    Kitchen as KitchenIcon,
    Tv as TvIcon,
    Balcony as BalconyIcon,
    Pool as PoolIcon,
    FitnessCenter as GymIcon,
    Elevator as ElevatorIcon,
    Pets as PetsIcon,
    SmokingRooms as SmokingIcon,
    Security as SecurityIcon,
    Lock as LockIcon,
    Star as StarIcon,
    Check as CheckIcon,
    Close as CloseIcon,
    MeetingRoom as RoomsIcon,
    SquareFoot as AreaIcon,
    Groups as GuestsIcon,
    AccessTime as TimeIcon,
    Cancel as CancelIcon,
} from "@mui/icons-material";
import { apartments }        from "../mockdata/apartments";
import { users }             from "../mockdata/users";
import { gradients, colors } from "../theme/gradients.ts";
import {
    getApartmentLocation,
    getApartmentFacilities,
    getApartmentInfo,
    getApartmentReviews,
} from "../mockdata/Apartmentdetails.ts";
import type { MapLocation, Facilities, AdditionalInfo, Review } from "../types/apartment.types";

/* ─────────────────────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────────────────────── */
const buildImageList = (url: string) => [url, url, url];

/* ─────────────────────────────────────────────────────────────────────────
   ImageCarousel
───────────────────────────────────────────────────────────────────────── */
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
                src={images[current]} alt={altBase}
                style={{
                    width: "100%", height: "100%", objectFit: "cover", display: "block",
                    transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1), opacity 0.28s ease",
                    transform: animDir ? `translateX(${animDir === "left" ? "-6%" : "6%"})` : "translateX(0)",
                    opacity: animDir ? 0 : 1,
                }}
            />
            <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 45%)", pointerEvents: "none" }} />
            <Box sx={{ position: "absolute", top: 20, left: 20 }}>{statusChip}</Box>
            <Box sx={{
                position: "absolute", top: 18, right: 18,
                bgcolor: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)",
                color: "white", fontSize: 12, fontWeight: 700, px: 1.5, py: 0.4,
                borderRadius: "20px", border: "1px solid rgba(255,255,255,0.15)", userSelect: "none",
            }}>
                {current + 1} / {images.length}
            </Box>
            {(["prev", "next"] as const).map((dir) => (
                <IconButton key={dir} onClick={() => go(dir)}
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
            <Box sx={{ position: "absolute", bottom: 14, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                <Box sx={{ display: "flex", gap: 1, px: 1.2, py: 0.8, bgcolor: "rgba(0,0,0,0.35)", backdropFilter: "blur(10px)", borderRadius: 2.5, border: "1px solid rgba(255,255,255,0.12)" }}>
                    {images.map((url, idx) => (
                        <Box key={idx} component="img" src={url} alt={`thumb-${idx + 1}`} onClick={() => goTo(idx)}
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
                        <Box key={idx} onClick={() => goTo(idx)}
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

/* ─────────────────────────────────────────────────────────────────────────
   Tab Panel wrapper
───────────────────────────────────────────────────────────────────────── */
interface TabPanelProps { children: React.ReactNode; value: number; index: number; }
const TabPanel = ({ children, value, index }: TabPanelProps) => (
    <Box role="tabpanel" hidden={value !== index}
         sx={{
             animation: value === index ? "fadeIn 0.3s ease" : "none",
             "@keyframes fadeIn": { from: { opacity: 0, transform: "translateY(8px)" }, to: { opacity: 1, transform: "translateY(0)" } },
         }}
    >
        {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </Box>
);

/* ─────────────────────────────────────────────────────────────────────────
   Tab 1 — Locație
───────────────────────────────────────────────────────────────────────── */
const LocationTab = ({ location }: { location: MapLocation }) => (
    <Box>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 3 }}>
            {[location.city, location.region, location.country, location.postalCode]
                .filter(Boolean)
                .map((label) => (
                    <Chip key={label} label={label} variant="outlined" color="primary"
                          sx={{ fontWeight: 600, borderRadius: 2 }} />
                ))}
        </Box>

        <Box sx={{
            borderRadius: 3, overflow: "hidden",
            border: `1px solid ${colors.border}`,
            boxShadow: `0 4px 20px ${colors.primaryAlpha10}`,
            height: 380,
        }}>
            <iframe
                title="Locație apartament"
                width="100%" height="100%"
                frameBorder="0" style={{ border: 0 }}
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${location.latitude},${location.longitude}&z=15&output=embed`}
                allowFullScreen
            />
        </Box>

        {location.nearbyLandmarks && location.nearbyLandmarks.length > 0 && (
            <Box sx={{ mt: 3 }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>Puncte de interes apropiate</Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {location.nearbyLandmarks.map((lm) => (
                        <Chip key={lm} icon={<LocationOnIcon sx={{ fontSize: 16 }} />} label={lm}
                              sx={{ bgcolor: colors.primaryAlpha06, color: colors.primaryDark, fontWeight: 500, borderRadius: 2 }} />
                    ))}
                </Box>
            </Box>
        )}
    </Box>
);

/* ─────────────────────────────────────────────────────────────────────────
   Tab 2 — Facilități
───────────────────────────────────────────────────────────────────────── */
interface FacilityItem { key: keyof Facilities; label: string; icon: React.ReactNode; }

const facilityGroups: { title: string; items: FacilityItem[] }[] = [
    {
        title: "Internet & Parcare",
        items: [
            { key: "wifi",        label: "Wi-Fi gratuit",    icon: <WifiIcon /> },
            { key: "parking",     label: "Parcare",          icon: <ParkingIcon /> },
            { key: "parkingFree", label: "Parcare gratuită", icon: <ParkingIcon /> },
        ],
    },
    {
        title: "Climă",
        items: [
            { key: "ac",      label: "Aer condiționat", icon: <AcIcon /> },
            { key: "heating", label: "Încălzire",        icon: <HeatingIcon /> },
        ],
    },
    {
        title: "Electrocasnice",
        items: [
            { key: "washer",       label: "Mașină de spălat", icon: <WasherIcon /> },
            { key: "dryer",        label: "Uscător",           icon: <DryerIcon /> },
            { key: "dishwasher",   label: "Mașină de vase",   icon: <KitchenIcon /> },
            { key: "refrigerator", label: "Frigider",          icon: <KitchenIcon /> },
            { key: "microwave",    label: "Cuptor microunde",  icon: <KitchenIcon /> },
            { key: "oven",         label: "Cuptor",            icon: <KitchenIcon /> },
            { key: "stove",        label: "Plită",             icon: <KitchenIcon /> },
            { key: "tv",           label: "TV",                icon: <TvIcon /> },
        ],
    },
    {
        title: "Spații & Dotări",
        items: [
            { key: "balcony",  label: "Balcon",       icon: <BalconyIcon /> },
            { key: "terrace",  label: "Terasă",       icon: <BalconyIcon /> },
            { key: "garden",   label: "Grădină",      icon: <BalconyIcon /> },
            { key: "pool",     label: "Piscină",      icon: <PoolIcon /> },
            { key: "gym",      label: "Sală fitness", icon: <GymIcon /> },
            { key: "elevator", label: "Ascensor",     icon: <ElevatorIcon /> },
        ],
    },
    {
        title: "Politici",
        items: [
            { key: "petFriendly",    label: "Animale acceptate", icon: <PetsIcon /> },
            { key: "smokingAllowed", label: "Fumat permis",       icon: <SmokingIcon /> },
        ],
    },
    {
        title: "Securitate",
        items: [
            { key: "securityCamera", label: "Cameră securitate", icon: <SecurityIcon /> },
            { key: "keypadEntry",    label: "Intrare cu cod",     icon: <LockIcon /> },
            { key: "safe",           label: "Seif",               icon: <LockIcon /> },
        ],
    },
];

const FacilitiesTab = ({ facilities }: { facilities: Facilities }) => (
    <Box sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
        gap: 3,
    }}>
        {facilityGroups.map((group) => (
            <Paper key={group.title} variant="outlined"
                   sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${colors.border}` }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, color: colors.primaryDark }}>
                    {group.title}
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    {group.items.map((item) => {
                        const active = facilities[item.key];
                        return (
                            <Box key={item.key} sx={{ display: "flex", alignItems: "center", gap: 1.5, opacity: active ? 1 : 0.4 }}>
                                <Box sx={{
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    width: 32, height: 32, borderRadius: 2,
                                    bgcolor: active ? colors.primaryAlpha10 : "rgba(0,0,0,0.04)",
                                    color: active ? colors.primaryDark : colors.textDisabled,
                                    "& svg": { fontSize: 18 },
                                }}>
                                    {item.icon}
                                </Box>
                                <Typography variant="body2" fontWeight={active ? 600 : 400}
                                            sx={{ color: active ? colors.textPrimary : colors.textDisabled, flex: 1 }}>
                                    {item.label}
                                </Typography>
                                {active
                                    ? <CheckIcon sx={{ fontSize: 16, color: colors.success }} />
                                    : <CloseIcon sx={{ fontSize: 16, color: colors.textDisabled }} />
                                }
                            </Box>
                        );
                    })}
                </Box>
            </Paper>
        ))}
    </Box>
);


/* ─────────────────────────────────────────────────────────────────────────
   Tab 3 — Informații suplimentare
───────────────────────────────────────────────────────────────────────── */
const cancellationLabels: Record<string, { label: string; color: "success" | "warning" | "error" }> = {
    flexible: { label: "Flexibilă", color: "success" },
    moderate: { label: "Moderată",  color: "warning" },
    strict:   { label: "Strictă",   color: "error" },
};

const AdditionalInfoTab = ({ info }: { info: AdditionalInfo }) => {
    const stats = [
        { icon: <RoomsIcon />,  label: "Camere",       value: info.rooms },
        { icon: <RoomsIcon />,  label: "Dormitoare",   value: info.bedrooms },
        { icon: <RoomsIcon />,  label: "Băi",          value: info.bathrooms },
        { icon: <RoomsIcon />,  label: "Paturi",       value: info.beds },
        { icon: <AreaIcon />,   label: "Suprafață",    value: `${info.surfaceArea} m²` },
        { icon: <GuestsIcon />, label: "Max. Oaspeți", value: info.maxGuests },
        { icon: <RoomsIcon />,  label: "Etaj",         value: `${info.floor} / ${info.totalFloors}` },
    ];

    const cancellation = cancellationLabels[info.cancellationPolicy];

    return (
        <Box>
            {/* Stats — CSS grid auto-fill */}
            <Box sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
                gap: 2,
                mb: 3,
            }}>
                {stats.map((s) => (
                    <Paper key={s.label} variant="outlined" sx={{
                        p: 2, borderRadius: 3, textAlign: "center",
                        border: `1px solid ${colors.border}`,
                        transition: "all 0.2s ease",
                        "&:hover": { borderColor: colors.primary, boxShadow: `0 4px 12px ${colors.primaryAlpha10}` },
                    }}>
                        <Box sx={{ color: colors.primary, mb: 0.5, "& svg": { fontSize: 24 } }}>{s.icon}</Box>
                        <Typography variant="h6" fontWeight={800} color="primary.main">{s.value}</Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>{s.label}</Typography>
                    </Paper>
                ))}
            </Box>

            {/* Check-in / Check-out */}
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, mb: 3, border: `1px solid ${colors.border}` }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                    <TimeIcon sx={{ mr: 1, verticalAlign: "middle", color: "primary.main" }} />
                    Check-in & Check-out
                </Typography>
                <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
                    <Box sx={{ flex: 1, p: 2, borderRadius: 2, bgcolor: colors.primaryAlpha06 }}>
                        <Typography variant="body2" color="text.secondary" fontWeight={600}>Check-in</Typography>
                        <Typography variant="body1" fontWeight={700}>{info.checkInFrom} – {info.checkInUntil}</Typography>
                        {info.selfCheckIn && (
                            <Chip label="Self check-in disponibil" size="small" color="success" sx={{ mt: 1, fontWeight: 600 }} />
                        )}
                    </Box>
                    <Box sx={{ flex: 1, p: 2, borderRadius: 2, bgcolor: "rgba(239,68,68,0.04)" }}>
                        <Typography variant="body2" color="text.secondary" fontWeight={600}>Check-out</Typography>
                        <Typography variant="body1" fontWeight={700}>{info.checkOutFrom} – {info.checkOutUntil}</Typography>
                    </Box>
                </Box>
            </Paper>

            {/* Descriere */}
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, mb: 3, border: `1px solid ${colors.border}` }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>Descriere</Typography>
                <Typography variant="body1" color="text.secondary" lineHeight={1.8}>{info.description}</Typography>
            </Paper>

            {/* Reguli + Politică anulare */}
            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
                {info.houseRules && (
                    <Paper variant="outlined" sx={{ flex: 7, p: 3, borderRadius: 3, border: `1px solid ${colors.border}` }}>
                        <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>Regulile casei</Typography>
                        <Typography variant="body2" color="text.secondary" lineHeight={1.8}>{info.houseRules}</Typography>
                    </Paper>
                )}
                <Paper variant="outlined" sx={{ flex: 5, p: 3, borderRadius: 3, border: `1px solid ${colors.border}` }}>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>
                        <CancelIcon sx={{ mr: 1, verticalAlign: "middle", color: "primary.main" }} />
                        Politică anulare
                    </Typography>
                    <Chip label={cancellation.label} color={cancellation.color} sx={{ fontWeight: 700, fontSize: 14 }} />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5, lineHeight: 1.7 }}>
                        {info.cancellationPolicy === "flexible" && "Rambursare integrală dacă anulați cu cel puțin 24h înainte."}
                        {info.cancellationPolicy === "moderate" && "Rambursare 50% dacă anulați cu cel puțin 5 zile înainte."}
                        {info.cancellationPolicy === "strict"   && "Fără rambursare după confirmarea rezervării."}
                    </Typography>
                </Paper>
            </Box>
        </Box>
    );
};

/* ─────────────────────────────────────────────────────────────────────────
   Tab 4 — Recenzii
───────────────────────────────────────────────────────────────────────── */
const ratingCategories: { key: keyof Review["ratings"]; label: string }[] = [
    { key: "cleanliness",   label: "Curățenie" },
    { key: "location",      label: "Locație" },
    { key: "valueForMoney", label: "Raport calitate-preț" },
    { key: "comfort",       label: "Confort" },
    { key: "facilities",    label: "Facilități" },
    { key: "communication", label: "Comunicare" },
];

const RatingBar = () => (
    <Box />
);

const ReviewCard = () => (
    <Box />
)
const ReviewsTab = () => (
    <Box/>
)    

/* ─────────────────────────────────────────────────────────────────────────
   ApartmentDetail — main component
───────────────────────────────────────────────────────────────────────── */
const tabConfig = [
    { label: "Locație",    icon: <LocationOnIcon sx={{ fontSize: 18 }} /> },
    { label: "Facilități", icon: <WifiIcon sx={{ fontSize: 18 }} /> },
    { label: "Informații", icon: <RoomsIcon sx={{ fontSize: 18 }} /> },
    { label: "Recenzii",   icon: <StarIcon sx={{ fontSize: 18 }} /> },
];

const ApartmentDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [showRentSuccess, setShowRentSuccess] = useState(false);
    const [activeTab, setActiveTab] = useState(0);

    const apartment = useMemo(() => apartments.find((a) => a.Id_Apartment === Number(id)), [id]);
    const owner     = useMemo(() => apartment ? users.find((u) => u.Id_User === apartment.Id_Owner) : null, [apartment]);
    const renter    = useMemo(() => apartment?.Id_Renter ? users.find((u) => u.Id_User === apartment.Id_Renter) : null, [apartment]);

    const location   = useMemo(() => apartment ? getApartmentLocation(apartment.Id_Apartment)   : null, [apartment]);
    const facilities = useMemo(() => apartment ? getApartmentFacilities(apartment.Id_Apartment) : null, [apartment]);
    const addInfo    = useMemo(() => apartment ? getApartmentInfo(apartment.Id_Apartment)        : null, [apartment]);
    const reviews    = useMemo(() => apartment ? getApartmentReviews(apartment.Id_Apartment)     : [],  [apartment]);

    if (!apartment) return (
        <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "background.default" }}>
            <Typography variant="h5" color="text.secondary">Apartamentul nu a fost găsit</Typography>
        </Box>
    );

    const isAvailable      = apartment.Id_Renter === null;
    const images           = buildImageList(apartment.image_url);
    const getIntervalLabel = (interval: string) => ({ hour: "oră", day: "zi", month: "lună" }[interval] ?? interval);

    const statusChip = (
        <Chip
            label={isAvailable ? "Disponibil" : "Ocupat"}
            sx={{
                fontWeight: 700,
                fontSize: "14px",
                px: 2,
                py: 2.5,
                bgcolor: isAvailable ? "rgba(22, 163, 74, 0.3)" : "rgba(220, 38, 38, 0.3)",
                color: "white",
            }}
        />
    );

    const iconBoxSx = {
        background: gradients.primary, p: 1.5, borderRadius: 2, display: "flex",
        color: "#FFFFFF", boxShadow: `0 4px 12px ${colors.primaryAlpha25}`,
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

                {/* ── Hero: carousel + details card ── */}
                <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
                    <Box sx={{ flex: { xs: "1", md: "1 1 58%" } }}>
                        <ImageCarousel images={images} altBase={apartment.Address} statusChip={statusChip} />
                    </Box>

                    <Box sx={{ flex: { xs: "1", md: "1 1 42%" } }}>
                        <Paper elevation={1} sx={{ p: 4, borderRadius: 4, height: "100%", border: `1px solid ${colors.border}` }}>

                            <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start", mb: 3 }}>
                                <Box sx={iconBoxSx}><LocationOnIcon sx={{ fontSize: 28 }} /></Box>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>Adresă</Typography>
                                    <Typography variant="h5" fontWeight={700}>{apartment.Address}</Typography>
                                </Box>
                            </Box>

                            <Divider sx={{ my: 3 }} />

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

                            <Button variant="contained" fullWidth size="large"
                                    onClick={() => navigate(`/payments?apartmentId=${apartment.Id_Apartment}`)}
                                    disabled={!isAvailable}
                                    sx={{ py: 1.8, borderRadius: 2, fontWeight: 700, fontSize: 16 }}>
                                {isAvailable ? "Închiriează Acum" : "Indisponibil"}
                            </Button>

                            {isAvailable && (
                                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2, textAlign: "center" }}>
                                    Vei fi redirecționat către pagina de plată
                                </Typography>
                            )}
                        </Paper>
                    </Box>
                </Box>

                {/* ── Tab Bar ── */}
                <Paper elevation={1} sx={{ mt: 4, borderRadius: 4, overflow: "hidden", border: `1px solid ${colors.border}` }}>

                    {/* Tab headers */}
                    <Box sx={{
                        borderBottom: `1px solid ${colors.border}`,
                        background: `linear-gradient(to bottom, ${colors.bgPaper}, ${colors.primaryAlpha06})`,
                        px: { xs: 1, sm: 3 },
                    }}>
                        <Tabs
                            value={activeTab}
                            onChange={(_, v) => setActiveTab(v)}
                            variant={{ xs: "scrollable", sm: "standard" } as any}
                            scrollButtons="auto"
                            centered
                            sx={{ "& .MuiTab-root": { minHeight: 60, px: { xs: 2, sm: 3 } } }}
                        >
                            {tabConfig.map((tab, idx) => (
                                <Tab key={tab.label} label={
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <Box sx={{
                                            color: activeTab === idx ? "primary.main" : colors.textSecondary,
                                            display: "flex", alignItems: "center",
                                            transition: "color 0.2s ease",
                                        }}>
                                            {tab.icon}
                                        </Box>
                                        <span>{tab.label}</span>
                                    </Box>
                                } />
                            ))}
                        </Tabs>
                    </Box>

                    {/* Tab content */}
                    <Box sx={{ p: { xs: 2, sm: 4 } }}>
                        <TabPanel value={activeTab} index={0}>
                            {location   && <LocationTab location={location} />}
                        </TabPanel>
                        <TabPanel value={activeTab} index={1}>
                            {facilities && <FacilitiesTab facilities={facilities} />}
                        </TabPanel>
                        <TabPanel value={activeTab} index={2}>
                            {addInfo    && <AdditionalInfoTab info={addInfo} />}
                        </TabPanel>
                        <TabPanel value={activeTab} index={3}>
                            <ReviewsTab reviews={reviews} />
                        </TabPanel>
                    </Box>
                </Paper>

            </Container>
        </Box>
    );
};

export default ApartmentDetail;