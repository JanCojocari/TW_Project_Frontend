import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box, Container, Typography, Button, Paper, TextField, Divider,
    ToggleButton, ToggleButtonGroup, Chip, IconButton, Alert, Stepper,
    Step, StepLabel, LinearProgress,
} from "@mui/material";
import {
    ArrowBack as ArrowBackIcon,
    CloudUpload as UploadIcon,
    Close as CloseIcon,
    LocationOn as LocationOnIcon,
    AttachMoney as MoneyIcon,
    Home as HomeIcon,
    Star as StarIcon,
    CheckCircle as CheckIcon,
    Add as AddIcon,
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
    AccessTime as TimeIcon,
    Cancel as CancelIcon,
    Groups as GuestsIcon,
    SquareFoot as AreaIcon,
    MeetingRoom as RoomsIcon,
    PhotoCamera as CameraIcon,
} from "@mui/icons-material";
import { gradients, colors } from "../theme/gradients.ts";
import { paths } from "../app/paths.ts";
import type { Currency, RentInterval, Facilities, AdditionalInfo, MapLocation } from "../types/apartment.types";

/* ─────────────────────────────────────────────────────────────────────────
   Form state type
───────────────────────────────────────────────────────────────────────── */
type FormState = {
    // Core apartment
    address: string;
    cost: string;
    currency: Currency;
    interval: RentInterval;
    images: File[];
    imagePreviewUrls: string[];

    // Location
    latitude: string;
    longitude: string;
    city: string;
    region: string;
    postalCode: string;
    landmarks: string[];
    landmarkInput: string;

    // Facilities
    facilities: Facilities;

    // Additional info
    rooms: string;
    bedrooms: string;
    bathrooms: string;
    beds: string;
    floor: string;
    totalFloors: string;
    surfaceArea: string;
    maxGuests: string;
    checkInFrom: string;
    checkInUntil: string;
    checkOutFrom: string;
    checkOutUntil: string;
    selfCheckIn: boolean;
    description: string;
    houseRules: string;
    cancellationPolicy: AdditionalInfo["cancellationPolicy"];
};

const defaultFacilities: Facilities = {
    wifi: false, parking: false, parkingFree: false,
    ac: false, heating: false,
    washer: false, dryer: false, dishwasher: false, refrigerator: false,
    microwave: false, oven: false, stove: false, tv: false,
    balcony: false, terrace: false, garden: false, pool: false,
    gym: false, elevator: false,
    petFriendly: false, smokingAllowed: false,
    securityCamera: false, keypadEntry: false, safe: false,
};

const initialForm: FormState = {
    address: "", cost: "", currency: "EUR", interval: "month",
    images: [], imagePreviewUrls: [],
    latitude: "", longitude: "", city: "Chișinău", region: "", postalCode: "",
    landmarks: [], landmarkInput: "",
    facilities: { ...defaultFacilities },
    rooms: "", bedrooms: "", bathrooms: "", beds: "",
    floor: "", totalFloors: "", surfaceArea: "", maxGuests: "",
    checkInFrom: "14:00", checkInUntil: "22:00",
    checkOutFrom: "08:00", checkOutUntil: "12:00",
    selfCheckIn: false,
    description: "", houseRules: "",
    cancellationPolicy: "flexible",
};

/* ─────────────────────────────────────────────────────────────────────────
   Facility groups config
───────────────────────────────────────────────────────────────────────── */
const facilityGroups: { title: string; items: { key: keyof Facilities; label: string; icon: React.ReactNode }[] }[] = [
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
            { key: "washer",       label: "Mașină spălat",  icon: <WasherIcon /> },
            { key: "dryer",        label: "Uscător",         icon: <DryerIcon /> },
            { key: "dishwasher",   label: "Mașină vase",    icon: <KitchenIcon /> },
            { key: "refrigerator", label: "Frigider",        icon: <KitchenIcon /> },
            { key: "microwave",    label: "Microunde",       icon: <KitchenIcon /> },
            { key: "oven",         label: "Cuptor",          icon: <KitchenIcon /> },
            { key: "stove",        label: "Plită",           icon: <KitchenIcon /> },
            { key: "tv",           label: "TV",              icon: <TvIcon /> },
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

/* ─────────────────────────────────────────────────────────────────────────
   Section wrapper
───────────────────────────────────────────────────────────────────────── */
const Section = ({
                     icon, title, subtitle, children, step,
                 }: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    step: number;
}) => (
    <Paper elevation={1} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 4, border: `1px solid ${colors.border}`, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 3 }}>
            <Box sx={{
                background: gradients.primary, p: 1.5, borderRadius: 2,
                display: "flex", color: "white", flexShrink: 0,
                boxShadow: `0 4px 12px ${colors.primaryAlpha25}`,
            }}>
                {icon}
            </Box>
            <Box sx={{ flex: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Typography variant="h6" fontWeight={800}>{title}</Typography>
                    <Chip label={`Pasul ${step}`} size="small"
                          sx={{ bgcolor: colors.primaryAlpha10, color: colors.primaryDark, fontWeight: 700, fontSize: 11 }} />
                </Box>
                {subtitle && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{subtitle}</Typography>
                )}
            </Box>
        </Box>
        <Divider sx={{ mb: 3 }} />
        {children}
    </Paper>
);

/* ─────────────────────────────────────────────────────────────────────────
   Toggle button group style
───────────────────────────────────────────────────────────────────────── */
const toggleSx = {
    display: "flex", flexWrap: "wrap", gap: 1,
    "& .MuiToggleButton-root": {
        borderRadius: "10px !important",
        border: `1px solid ${colors.border} !important`,
        fontWeight: 700, fontSize: 13, py: 1, px: 2,
        textTransform: "none",
        "&.Mui-selected": {
            background: gradients.primary,
            color: "white",
            borderColor: "transparent !important",
            boxShadow: `0 4px 12px ${colors.primaryAlpha25}`,
        },
    },
};

/* ─────────────────────────────────────────────────────────────────────────
   Validation
───────────────────────────────────────────────────────────────────────── */
type Errors = Partial<Record<string, string>>;

const validate = (form: FormState): Errors => {
    const e: Errors = {};
    if (!form.address.trim())       e.address     = "Adresa este obligatorie";
    if (!form.cost || isNaN(Number(form.cost)) || Number(form.cost) <= 0)
        e.cost        = "Introduceți un preț valid";
    if (!form.city.trim())          e.city        = "Orașul este obligatoriu";
    if (!form.description.trim())   e.description = "Descrierea este obligatorie";
    if (form.images.length === 0)   e.images      = "Adăugați cel puțin o imagine";
    return e;
};

/* ─────────────────────────────────────────────────────────────────────────
   CreateListing page
───────────────────────────────────────────────────────────────────────── */
const CreateListing = () => {
    const navigate = useNavigate();
    const [form, setForm]       = useState<FormState>(initialForm);
    const [errors, setErrors]   = useState<Errors>({});
    const [submitted, setSubmitted] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
        setForm(prev => ({ ...prev, [key]: value }));

    const setFacility = (key: keyof Facilities) =>
        setForm(prev => ({
            ...prev,
            facilities: { ...prev.facilities, [key]: !prev.facilities[key] },
        }));

    /* ── Image handling ── */
    const handleImages = useCallback((files: FileList | null) => {
        if (!files) return;
        const newFiles  = Array.from(files).slice(0, 8 - form.images.length);
        const newUrls   = newFiles.map(f => URL.createObjectURL(f));
        setForm(prev => ({
            ...prev,
            images:           [...prev.images, ...newFiles],
            imagePreviewUrls: [...prev.imagePreviewUrls, ...newUrls],
        }));
        if (errors.images) setErrors(prev => ({ ...prev, images: undefined }));
    }, [form.images.length, errors.images]);

    const removeImage = (idx: number) => {
        URL.revokeObjectURL(form.imagePreviewUrls[idx]);
        setForm(prev => ({
            ...prev,
            images:           prev.images.filter((_, i) => i !== idx),
            imagePreviewUrls: prev.imagePreviewUrls.filter((_, i) => i !== idx),
        }));
    };

    /* ── Landmark handling ── */
    const addLandmark = () => {
        const val = form.landmarkInput.trim();
        if (!val) return;
        setForm(prev => ({ ...prev, landmarks: [...prev.landmarks, val], landmarkInput: "" }));
    };

    /* ── Submit ── */
    const handleSubmit = () => {
        const e = validate(form);
        setErrors(e);
        if (Object.keys(e).length > 0) return;

        // Mock submit — in production, call API here
        console.log("Form submitted:", form);
        setSubmitted(true);

        // Simulate redirect to new apartment (use mock Id)
        setTimeout(() => navigate(paths.apartmentDetail(1)), 1500);
    };

    const activeFacilities = Object.values(form.facilities).filter(Boolean).length;

    /* ── Progress ── */
    const progress = (() => {
        let filled = 0;
        const total = 6;
        if (form.address)           filled++;
        if (form.cost)              filled++;
        if (form.images.length > 0) filled++;
        if (form.city)              filled++;
        if (form.description)       filled++;
        if (activeFacilities > 0)   filled++;
        return Math.round((filled / total) * 100);
    })();

    if (submitted) return (
        <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "background.default" }}>
            <Box sx={{ textAlign: "center" }}>
                <Box sx={{
                    width: 80, height: 80, borderRadius: "50%",
                    background: gradients.success,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    mx: "auto", mb: 3,
                    boxShadow: `0 8px 24px ${colors.successAlpha15}`,
                }}>
                    <CheckIcon sx={{ fontSize: 40, color: "white" }} />
                </Box>
                <Typography variant="h5" fontWeight={800} sx={{ mb: 1 }}>Anunț creat cu succes!</Typography>
                <Typography variant="body1" color="text.secondary">Ești redirecționat către anunțul tău...</Typography>
                <LinearProgress sx={{ mt: 3, width: 200, mx: "auto", borderRadius: 2 }} />
            </Box>
        </Box>
    );

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: { xs: 3, md: 5 }, mt: 10 }}>
            <Container maxWidth="md">

                {/* ── Header ── */}
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 3, fontWeight: 600 }}>
                    Înapoi
                </Button>

                <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                        <Box sx={{ background: gradients.primary, p: 1.5, borderRadius: 2, display: "flex", color: "white" }}>
                            <HomeIcon sx={{ fontSize: 28 }} />
                        </Box>
                        <Box>
                            <Typography variant="h4" fontWeight={900}>Plasează un anunț</Typography>
                            <Typography variant="body2" color="text.secondary">Completează detaliile apartamentului tău</Typography>
                        </Box>
                    </Box>

                    {/* Progress bar */}
                    <Box sx={{ mt: 3, p: 2.5, borderRadius: 3, bgcolor: colors.bgPaper, border: `1px solid ${colors.border}` }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                            <Typography variant="caption" fontWeight={700} color="text.secondary">Completare formular</Typography>
                            <Typography variant="caption" fontWeight={800} color="primary.main">{progress}%</Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={progress} sx={{
                            height: 8, borderRadius: 4,
                            bgcolor: colors.primaryAlpha10,
                            "& .MuiLinearProgress-bar": { background: gradients.primary, borderRadius: 4 },
                        }} />
                    </Box>
                </Box>

                {/* ── Errors summary ── */}
                {Object.keys(errors).length > 0 && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
                        Te rugăm să completezi câmpurile obligatorii marcate mai jos.
                    </Alert>
                )}

                {/* ════════════════════════════════════════════════════════
                    STEP 1 — Informații de bază
                ════════════════════════════════════════════════════════ */}
                <Section icon={<HomeIcon sx={{ fontSize: 24 }} />} title="Informații de bază" step={1}
                         subtitle="Adresa, prețul și intervalul de închiriere">

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>

                        {/* Address */}
                        <TextField
                            label="Adresă completă *"
                            placeholder="ex: Str. Ștefan cel Mare 1, Chișinău"
                            value={form.address}
                            onChange={e => { set("address", e.target.value); if(errors.address) setErrors(p => ({...p, address: undefined})); }}
                            error={!!errors.address}
                            helperText={errors.address}
                            fullWidth
                        />

                        {/* Price + Currency + Interval */}
                        <Box>
                            <Typography variant="body2" fontWeight={700} color="text.secondary" sx={{ mb: 1.5 }}>
                                Preț și interval *
                            </Typography>
                            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
                                <TextField
                                    label="Preț"
                                    type="number"
                                    value={form.cost}
                                    onChange={e => { set("cost", e.target.value); if(errors.cost) setErrors(p => ({...p, cost: undefined})); }}
                                    error={!!errors.cost}
                                    helperText={errors.cost}
                                    sx={{ flex: 2 }}
                                    inputProps={{ min: 0 }}
                                />
                                <Box sx={{ flex: 3 }}>
                                    <ToggleButtonGroup
                                        value={form.currency} exclusive
                                        onChange={(_, v) => { if (v) set("currency", v); }}
                                        sx={{ ...toggleSx, height: 56, "& .MuiToggleButton-root": { ...toggleSx["& .MuiToggleButton-root"], flex: 1 } }}
                                    >
                                        {(["USD", "EUR", "MDL"] as Currency[]).map(c => (
                                            <ToggleButton key={c} value={c}>{c}</ToggleButton>
                                        ))}
                                    </ToggleButtonGroup>
                                </Box>
                            </Box>

                            <Box sx={{ mt: 2 }}>
                                <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: "block", mb: 1 }}>
                                    Interval de închiriere
                                </Typography>
                                <ToggleButtonGroup
                                    value={form.interval} exclusive
                                    onChange={(_, v) => { if (v) set("interval", v); }}
                                    sx={toggleSx}
                                >
                                    {([
                                        { value: "hour",  label: "Per oră" },
                                        { value: "day",   label: "Per zi" },
                                        { value: "month", label: "Per lună" },
                                    ] as { value: RentInterval; label: string }[]).map(opt => (
                                        <ToggleButton key={opt.value} value={opt.value}>{opt.label}</ToggleButton>
                                    ))}
                                </ToggleButtonGroup>
                            </Box>
                        </Box>
                    </Box>
                </Section>

                {/* ════════════════════════════════════════════════════════
                    STEP 2 — Fotografii
                ════════════════════════════════════════════════════════ */}
                <Section icon={<CameraIcon sx={{ fontSize: 24 }} />} title="Fotografii" step={2}
                         subtitle="Adaugă până la 8 imagini ale apartamentului">

                    {/* Drop zone */}
                    <Box
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={e => e.preventDefault()}
                        onDrop={e => { e.preventDefault(); handleImages(e.dataTransfer.files); }}
                        sx={{
                            border: `2px dashed ${errors.images ? "#ef4444" : colors.border}`,
                            borderRadius: 3, p: 4, textAlign: "center",
                            cursor: "pointer", transition: "all 0.2s ease",
                            bgcolor: errors.images ? "rgba(239,68,68,0.03)" : colors.primaryAlpha06,
                            "&:hover": { borderColor: colors.primaryDark, bgcolor: colors.primaryAlpha10 },
                            mb: 2,
                        }}
                    >
                        <UploadIcon sx={{ fontSize: 40, color: errors.images ? "#ef4444" : colors.primaryDark, mb: 1 }} />
                        <Typography variant="body1" fontWeight={700}>
                            Trage imaginile aici sau <Box component="span" sx={{ color: "primary.main" }}>alege fișiere</Box>
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            PNG, JPG, WEBP • max 8 imagini • {form.images.length}/8 adăugate
                        </Typography>
                        {errors.images && (
                            <Typography variant="caption" color="error" sx={{ display: "block", mt: 0.5 }}>
                                {errors.images}
                            </Typography>
                        )}
                    </Box>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        style={{ display: "none" }}
                        onChange={e => handleImages(e.target.files)}
                    />

                    {/* Image previews */}
                    {form.imagePreviewUrls.length > 0 && (
                        <Box sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                            gap: 2,
                        }}>
                            {form.imagePreviewUrls.map((url, idx) => (
                                <Box key={idx} sx={{ position: "relative", borderRadius: 2, overflow: "hidden", aspectRatio: "4/3" }}>
                                    <img src={url} alt={`preview-${idx}`}
                                         style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                                    {idx === 0 && (
                                        <Box sx={{
                                            position: "absolute", bottom: 6, left: 6,
                                            bgcolor: "rgba(0,0,0,0.6)", color: "white",
                                            px: 1, py: 0.3, borderRadius: 1, fontSize: 11, fontWeight: 700,
                                        }}>
                                            Copertă
                                        </Box>
                                    )}
                                    <IconButton
                                        onClick={() => removeImage(idx)}
                                        size="small"
                                        sx={{
                                            position: "absolute", top: 4, right: 4,
                                            bgcolor: "rgba(0,0,0,0.55)", color: "white",
                                            width: 24, height: 24,
                                            "&:hover": { bgcolor: "rgba(239,68,68,0.85)" },
                                        }}
                                    >
                                        <CloseIcon sx={{ fontSize: 14 }} />
                                    </IconButton>
                                </Box>
                            ))}

                            {form.images.length < 8 && (
                                <Box
                                    onClick={() => fileInputRef.current?.click()}
                                    sx={{
                                        aspectRatio: "4/3", borderRadius: 2,
                                        border: `2px dashed ${colors.border}`,
                                        display: "flex", flexDirection: "column",
                                        alignItems: "center", justifyContent: "center",
                                        cursor: "pointer", color: colors.textSecondary,
                                        "&:hover": { borderColor: colors.primaryDark, color: colors.primaryDark },
                                        transition: "all 0.2s ease",
                                    }}
                                >
                                    <AddIcon sx={{ fontSize: 28 }} />
                                    <Typography variant="caption" fontWeight={600}>Adaugă</Typography>
                                </Box>
                            )}
                        </Box>
                    )}
                </Section>

                {/* ════════════════════════════════════════════════════════
                    STEP 3 — Locație
                ════════════════════════════════════════════════════════ */}
                <Section icon={<LocationOnIcon sx={{ fontSize: 24 }} />} title="Locație" step={3}
                         subtitle="Coordonate GPS, oraș și puncte de interes">

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>

                        {/* City + Region + PostalCode */}
                        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" }, gap: 2 }}>
                            <TextField
                                label="Oraș *" value={form.city}
                                onChange={e => { set("city", e.target.value); if(errors.city) setErrors(p => ({...p, city: undefined})); }}
                                error={!!errors.city} helperText={errors.city}
                            />
                            <TextField label="Sector / Cartier (opțional)" value={form.region}
                                       onChange={e => set("region", e.target.value)} placeholder="ex: Centru" />
                            <TextField label="Cod poștal (opțional)" value={form.postalCode}
                                       onChange={e => set("postalCode", e.target.value)} placeholder="ex: MD-2001" />
                        </Box>

                        {/* GPS */}
                        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                            <TextField label="Latitudine (opțional)" value={form.latitude} type="number"
                                       onChange={e => set("latitude", e.target.value)} placeholder="ex: 47.0245" />
                            <TextField label="Longitudine (opțional)" value={form.longitude} type="number"
                                       onChange={e => set("longitude", e.target.value)} placeholder="ex: 28.8322" />
                        </Box>

                        {/* Landmarks */}
                        <Box>
                            <Typography variant="body2" fontWeight={700} color="text.secondary" sx={{ mb: 1 }}>
                                Puncte de interes apropiate (opțional)
                            </Typography>
                            <Box sx={{ display: "flex", gap: 1, mb: 1.5 }}>
                                <TextField
                                    size="small" fullWidth
                                    placeholder="ex: Parcul Central 0.3 km"
                                    value={form.landmarkInput}
                                    onChange={e => set("landmarkInput", e.target.value)}
                                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addLandmark(); } }}
                                />
                                <Button variant="outlined" onClick={addLandmark} sx={{ minWidth: 48, px: 2 }}>
                                    <AddIcon />
                                </Button>
                            </Box>
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                {form.landmarks.map((lm, i) => (
                                    <Chip key={i} label={lm} size="small" onDelete={() =>
                                        setForm(prev => ({ ...prev, landmarks: prev.landmarks.filter((_, j) => j !== i) }))}
                                          sx={{ bgcolor: colors.primaryAlpha10, color: colors.primaryDark, fontWeight: 600 }}
                                    />
                                ))}
                            </Box>
                        </Box>
                    </Box>
                </Section>

                {/* ════════════════════════════════════════════════════════
                    STEP 4 — Facilități
                ════════════════════════════════════════════════════════ */}
                <Section icon={<StarIcon sx={{ fontSize: 24 }} />} title="Facilități" step={4}
                         subtitle={`${activeFacilities} facilitate${activeFacilities !== 1 ? "i" : ""} selectate`}>

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        {facilityGroups.map(group => (
                            <Box key={group.title}>
                                <Typography variant="caption" fontWeight={800} color="text.secondary"
                                            sx={{ textTransform: "uppercase", letterSpacing: "0.8px", display: "block", mb: 1.5 }}>
                                    {group.title}
                                </Typography>
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                    {group.items.map(item => {
                                        const active = form.facilities[item.key];
                                        return (
                                            <Box
                                                key={item.key}
                                                onClick={() => setFacility(item.key)}
                                                sx={{
                                                    display: "flex", alignItems: "center", gap: 1,
                                                    px: 2, py: 1, borderRadius: 2.5, cursor: "pointer",
                                                    border: `1px solid ${active ? colors.primaryDark : colors.border}`,
                                                    bgcolor: active ? colors.primaryAlpha10 : "transparent",
                                                    color: active ? colors.primaryDark : colors.textSecondary,
                                                    fontWeight: active ? 700 : 500,
                                                    transition: "all 0.15s ease",
                                                    "&:hover": { borderColor: colors.primaryDark, bgcolor: colors.primaryAlpha06 },
                                                    "& svg": { fontSize: 18 },
                                                }}
                                            >
                                                <Box sx={{ color: "inherit" }}>{item.icon}</Box>
                                                <Typography variant="body2" fontWeight="inherit" sx={{ color: "inherit" }}>
                                                    {item.label}
                                                </Typography>
                                                {active && <CheckIcon sx={{ fontSize: 14, ml: 0.5 }} />}
                                            </Box>
                                        );
                                    })}
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Section>

                {/* ════════════════════════════════════════════════════════
                    STEP 5 — Informații suplimentare
                ════════════════════════════════════════════════════════ */}
                <Section icon={<RoomsIcon sx={{ fontSize: 24 }} />} title="Informații despre spațiu" step={5}
                         subtitle="Camere, suprafață, capacitate oaspeți">

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>

                        {/* Room stats */}
                        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 2 }}>
                            {[
                                { key: "rooms",      label: "Nr. camere",     icon: <RoomsIcon /> },
                                { key: "bedrooms",   label: "Dormitoare",     icon: <RoomsIcon /> },
                                { key: "bathrooms",  label: "Băi",            icon: <RoomsIcon /> },
                                { key: "beds",       label: "Paturi",         icon: <RoomsIcon /> },
                                { key: "surfaceArea",label: "Suprafață (m²)", icon: <AreaIcon /> },
                                { key: "maxGuests",  label: "Max. oaspeți",   icon: <GuestsIcon /> },
                                { key: "floor",      label: "Etaj",           icon: <RoomsIcon /> },
                                { key: "totalFloors",label: "Total etaje",    icon: <RoomsIcon /> },
                            ].map(f => (
                                <TextField
                                    key={f.key} label={f.label} type="number" size="small"
                                    value={(form as any)[f.key]}
                                    onChange={e => set(f.key as keyof FormState, e.target.value as any)}
                                    inputProps={{ min: 0 }}
                                />
                            ))}
                        </Box>

                        {/* Check-in / Check-out */}
                        <Box>
                            <Typography variant="body2" fontWeight={700} color="text.secondary" sx={{ mb: 1.5 }}>
                                <TimeIcon sx={{ verticalAlign: "middle", mr: 1, fontSize: 18 }} />
                                Check-in & Check-out
                            </Typography>
                            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                                <Box sx={{ p: 2, borderRadius: 2, bgcolor: colors.primaryAlpha06, display: "flex", flexDirection: "column", gap: 1.5 }}>
                                    <Typography variant="caption" fontWeight={700} color="primary.main">Check-in</Typography>
                                    <Box sx={{ display: "flex", gap: 1 }}>
                                        <TextField size="small" label="De la" type="time" value={form.checkInFrom}
                                                   onChange={e => set("checkInFrom", e.target.value)}
                                                   InputLabelProps={{ shrink: true }} sx={{ flex: 1 }} />
                                        <TextField size="small" label="Până la" type="time" value={form.checkInUntil}
                                                   onChange={e => set("checkInUntil", e.target.value)}
                                                   InputLabelProps={{ shrink: true }} sx={{ flex: 1 }} />
                                    </Box>
                                </Box>
                                <Box sx={{ p: 2, borderRadius: 2, bgcolor: "rgba(239,68,68,0.04)", display: "flex", flexDirection: "column", gap: 1.5 }}>
                                    <Typography variant="caption" fontWeight={700} color="error.main">Check-out</Typography>
                                    <Box sx={{ display: "flex", gap: 1 }}>
                                        <TextField size="small" label="De la" type="time" value={form.checkOutFrom}
                                                   onChange={e => set("checkOutFrom", e.target.value)}
                                                   InputLabelProps={{ shrink: true }} sx={{ flex: 1 }} />
                                        <TextField size="small" label="Până la" type="time" value={form.checkOutUntil}
                                                   onChange={e => set("checkOutUntil", e.target.value)}
                                                   InputLabelProps={{ shrink: true }} sx={{ flex: 1 }} />
                                    </Box>
                                </Box>
                            </Box>

                            {/* Self check-in */}
                            <Box
                                onClick={() => set("selfCheckIn", !form.selfCheckIn)}
                                sx={{
                                    mt: 2, display: "flex", alignItems: "center", gap: 1.5,
                                    p: 2, borderRadius: 2, cursor: "pointer",
                                    border: `1px solid ${form.selfCheckIn ? colors.primaryDark : colors.border}`,
                                    bgcolor: form.selfCheckIn ? colors.primaryAlpha10 : "transparent",
                                    transition: "all 0.15s ease",
                                    "&:hover": { borderColor: colors.primaryDark },
                                }}
                            >
                                <LockIcon sx={{ color: form.selfCheckIn ? colors.primaryDark : colors.textSecondary, fontSize: 20 }} />
                                <Box>
                                    <Typography variant="body2" fontWeight={700} sx={{ color: form.selfCheckIn ? colors.primaryDark : "text.primary" }}>
                                        Self check-in disponibil
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Oaspeții pot intra fără prezența proprietarului
                                    </Typography>
                                </Box>
                                {form.selfCheckIn && <CheckIcon sx={{ ml: "auto", color: colors.primaryDark, fontSize: 18 }} />}
                            </Box>
                        </Box>
                    </Box>
                </Section>

                {/* ════════════════════════════════════════════════════════
                    STEP 6 — Descriere & Reguli
                ════════════════════════════════════════════════════════ */}
                <Section icon={<MoneyIcon sx={{ fontSize: 24 }} />} title="Descriere & Reguli" step={6}
                         subtitle="Prezintă apartamentul și stabilește condițiile">

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>

                        <TextField
                            label="Descriere *"
                            multiline rows={4}
                            placeholder="Descrie apartamentul tău — stil, renovare, dotări speciale, atmosferă..."
                            value={form.description}
                            onChange={e => { set("description", e.target.value); if(errors.description) setErrors(p => ({...p, description: undefined})); }}
                            error={!!errors.description}
                            helperText={errors.description}
                            fullWidth
                        />

                        <TextField
                            label="Regulile casei (opțional)"
                            multiline rows={3}
                            placeholder="ex: Nu se fumează în interior. Animale acceptate cu acord prealabil..."
                            value={form.houseRules}
                            onChange={e => set("houseRules", e.target.value)}
                            fullWidth
                        />

                        {/* Cancellation policy */}
                        <Box>
                            <Typography variant="body2" fontWeight={700} color="text.secondary" sx={{ mb: 1.5 }}>
                                <CancelIcon sx={{ verticalAlign: "middle", mr: 1, fontSize: 18 }} />
                                Politică de anulare
                            </Typography>
                            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
                                {([
                                    {
                                        value: "flexible",
                                        label: "Flexibilă",
                                        desc: "Rambursare integrală cu 24h înainte",
                                        color: colors.success,
                                    },
                                    {
                                        value: "moderate",
                                        label: "Moderată",
                                        desc: "Rambursare 50% cu 5 zile înainte",
                                        color: "#F59E0B",
                                    },
                                    {
                                        value: "strict",
                                        label: "Strictă",
                                        desc: "Fără rambursare după confirmare",
                                        color: colors.error,
                                    },
                                ] as { value: AdditionalInfo["cancellationPolicy"]; label: string; desc: string; color: string }[]).map(opt => {
                                    const active = form.cancellationPolicy === opt.value;
                                    return (
                                        <Box key={opt.value} onClick={() => set("cancellationPolicy", opt.value)}
                                             sx={{
                                                 flex: 1, p: 2, borderRadius: 2.5, cursor: "pointer",
                                                 border: `2px solid ${active ? opt.color : colors.border}`,
                                                 bgcolor: active ? `${opt.color}12` : "transparent",
                                                 transition: "all 0.15s ease",
                                                 "&:hover": { borderColor: opt.color, bgcolor: `${opt.color}08` },
                                             }}
                                        >
                                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.5 }}>
                                                <Typography variant="body2" fontWeight={800} sx={{ color: active ? opt.color : "text.primary" }}>
                                                    {opt.label}
                                                </Typography>
                                                {active && <CheckIcon sx={{ fontSize: 16, color: opt.color }} />}
                                            </Box>
                                            <Typography variant="caption" color="text.secondary">{opt.desc}</Typography>
                                        </Box>
                                    );
                                })}
                            </Box>
                        </Box>
                    </Box>
                </Section>

                {/* ── Submit ── */}
                <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, mb: 6 }}>
                    <Button variant="outlined" size="large" fullWidth onClick={() => navigate(-1)}
                            sx={{ py: 1.8, borderRadius: 2.5, fontWeight: 700 }}>
                        Anulează
                    </Button>
                    <Button variant="contained" size="large" fullWidth onClick={handleSubmit}
                            sx={{ py: 1.8, borderRadius: 2.5, fontWeight: 800, fontSize: 16 }}>
                        Publică anunțul
                    </Button>
                </Box>

            </Container>
        </Box>
    );
};

export default CreateListing;