// pages/ApartmentDetail.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useTranslation }         from "react-i18next";
import {
    Box, Container, Typography, Button,
    Chip, Paper, Tabs, Tab,
} from "@mui/material";
import {
    ArrowBack as ArrowBackIcon,
    LocationOn as LocationOnIcon,
    Wifi as WifiIcon,
    MeetingRoom as RoomsIcon,
    Star as StarIcon,
    HourglassEmpty as HourglassIcon,
    Block as BlockIcon,
    CheckCircleOutline as SuccessIcon,
} from "@mui/icons-material";
import type { Apartment }    from "../types/apartment.types";
import type { User }         from "../types/user.types";
import { colors }            from "../theme/gradients.ts";
import { useAuth }           from "../auth/AuthContext.tsx";
import { apartmentService }  from "../services/apartmentService.ts";
import { reviewService }     from "../services/reviewService.ts";
import type { ReviewApiDto } from "../services/reviewService.ts";
import { recentViewService } from "../services/recentViewService.ts";
import { userService, mapUserApiToUser } from "../services/userService.ts";
import ImageCarousel      from "../components/apartmentDetail/ImageCarousel.tsx";
import AdditionalInfoTab  from "../components/apartmentDetail/AdditionaInfoTab.tsx";
import ApartmentInfoPanel from "../components/apartmentDetail/ApartmentInfoPanel.tsx";
import TabPanel           from "../components/apartmentDetail/TabPanel.tsx";
import FacilitiesTab      from "../components/apartmentDetail/FacilitiesTab.tsx";
import LocationTab        from "../components/apartmentDetail/LocationTab.tsx";
import ReviewsTab         from "../components/apartmentDetail/ReviewsTab.tsx";

const StatusBanner = ({
                          type,
                          icon,
                          message,
                      }: {
    type: "pending" | "declined" | "success";
    icon: React.ReactNode;
    message: string;
}) => {
    const bgMap = {
        pending: "rgba(245,158,11,0.08)",
        declined: "rgba(239,68,68,0.08)",
        success: colors.primaryAlpha06,
    };
    const borderMap = {
        pending: "rgba(245,158,11,0.3)",
        declined: "rgba(239,68,68,0.3)",
        success: colors.border,
    };
    const colorMap = {
        pending: "#d97706",
        declined: "#b91c1c",
        success: colors.primary,
    };

    return (
        <Box sx={{
            display: "flex", alignItems: "center", gap: 1.5,
            px: 2.5, py: 1.5, borderRadius: 3, mb: 3,
            bgcolor: bgMap[type],
            border: `1px solid ${borderMap[type]}`,
        }}>
            <Box sx={{ color: colorMap[type], display: "flex", flexShrink: 0 }}>{icon}</Box>
            <Typography variant="body2" fontWeight={600} sx={{ color: colorMap[type] }}>
                {message}
            </Typography>
        </Box>
    );
};

const ApartmentDetail = () => {
    const { id }       = useParams<{ id: string }>();
    const navigate     = useNavigate();
    const { t }        = useTranslation();
    const [showRentSuccess, setShowRentSuccess] = useState(false);
    const [activeTab, setActiveTab]             = useState(0);
    const [apartment, setApartment]             = useState<Apartment | null>(null);
    const [reviews, setReviews]                 = useState<ReviewApiDto[]>([]);
    const [owner, setOwner]                     = useState<User | null>(null);
    const [renter, setRenter]                   = useState<User | null>(null);
    const [loading, setLoading]                 = useState(true);
    const { currentUser }                       = useAuth();
    const recentViewAdded = useRef(false);

    useEffect(() => {
        recentViewAdded.current = false;
        const apartmentId = Number(id);
        setLoading(true);
        setOwner(null);
        setRenter(null);
        apartmentService.getById(apartmentId)
            .then((apt) => {
                setApartment(apt);
                if (apt && currentUser && !recentViewAdded.current) {
                    recentViewAdded.current = true;
                    recentViewService.add(currentUser.id, apartmentId).catch(() => {});
                    userService.getById(apt.Id_Owner).then((u) => setOwner(mapUserApiToUser(u))).catch(() => {});
                    if (apt.Id_Renter) userService.getById(apt.Id_Renter).then((u) => setRenter(mapUserApiToUser(u))).catch(() => {});
                }
                return reviewService.getByApartment(apartmentId);
            })
            .then(setReviews)
            .finally(() => setLoading(false));
    }, [id]);

    const location   = apartment?.location      ?? null;
    const facilities = apartment?.facilities    ?? null;
    const addInfo    = apartment?.additionalInfo ?? null;

    const tabConfig = [
        { label: t("apartment.tabs.location"),   icon: <LocationOnIcon sx={{ fontSize: 17 }} /> },
        { label: t("apartment.tabs.facilities"), icon: <WifiIcon sx={{ fontSize: 17 }} /> },
        { label: t("apartment.tabs.info"),       icon: <RoomsIcon sx={{ fontSize: 17 }} /> },
        { label: t("apartment.tabs.reviews"),    icon: <StarIcon sx={{ fontSize: 17 }} /> },
    ];

    if (loading) return (
        <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "background.default" }}>
            <Typography variant="h5" color="text.secondary">Se încarcă...</Typography>
        </Box>
    );

    if (!apartment) return (
        <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "background.default" }}>
            <Typography variant="h5" color="text.secondary">{t("apartment.notFound")}</Typography>
        </Box>
    );

    const isAvailable = apartment.Id_Renter === null;
    const canRent     = isAvailable && currentUser?.id !== apartment.Id_Owner;

    const images = apartment.image_urls.length > 0
        ? apartment.image_urls
        : apartment.image_url
            ? [apartment.image_url]
            : [];

    const statusChip = (
        <Chip
            label={isAvailable ? t("listings.available") : t("listings.occupied")}
            size="small"
            sx={{
                fontWeight: 800, fontSize: 11, textTransform: "uppercase",
                letterSpacing: "0.5px", backdropFilter: "blur(8px)",
                borderRadius: 2,
                bgcolor: isAvailable ? colors.success : colors.error,
                color: "white",
            }}
        />
    );

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: { xs: 3, md: 5 }, mt: 10 }}>
            <Container maxWidth="lg">
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                    sx={{ mb: 3, fontWeight: 600, textTransform: "none", borderRadius: 2 }}
                >
                    {t("apartment.back")}
                </Button>

                {showRentSuccess && (
                    <StatusBanner
                        type="success"
                        icon={<SuccessIcon sx={{ fontSize: 18 }} />}
                        message={t("apartment.rentSuccess")}
                    />
                )}
                {currentUser?.id === apartment.Id_Owner && apartment.status === "pending" && (
                    <StatusBanner
                        type="pending"
                        icon={<HourglassIcon sx={{ fontSize: 18 }} />}
                        message={t("apartment.statusPending")}
                    />
                )}
                {currentUser?.id === apartment.Id_Owner && apartment.status === "declined" && (
                    <StatusBanner
                        type="declined"
                        icon={<BlockIcon sx={{ fontSize: 18 }} />}
                        message={t("apartment.statusDeclined")}
                    />
                )}

                {/* ── Two-column hero — stretch ca sa fie la aceeasi inaltime ── */}
                <Box sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "58% 1fr" },
                    gap: 3,
                    // stretch: ambele coloane iau inaltimea celei mai mari
                    alignItems: "stretch",
                    mb: 4,
                }}>
                    <ImageCarousel images={images} altBase={apartment.Address} statusChip={statusChip} />

                    {/* Sticky doar pe desktop */}
                    <Box sx={{ position: { md: "sticky" }, top: { md: "90px" }, alignSelf: { md: "start" } }}>
                        <ApartmentInfoPanel
                            apartment={apartment}
                            owner={owner}
                            renter={renter}
                            isAvailable={canRent}
                            isOwner={currentUser?.id === apartment.Id_Owner}
                        />
                    </Box>
                </Box>

                {/* ── Tabbed panel ─────────────────────────────────────────── */}
                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: 4,
                        overflow: "hidden",
                        border: `1px solid ${colors.border}`,
                        bgcolor: "background.paper",
                    }}
                >
                    <Box sx={{
                        borderBottom: `1px solid ${colors.border}`,
                        bgcolor: "background.paper",
                        px: { xs: 1, sm: 3 },
                    }}>
                        <Tabs
                            value={activeTab}
                            onChange={(_, v) => setActiveTab(v)}
                            // centrat in tab panel
                            centered
                            sx={{
                                "& .MuiTab-root": {
                                    minHeight: 56,
                                    px: { xs: 1.5, sm: 2.5 },
                                    textTransform: "none",
                                    fontWeight: 600,
                                    fontSize: 14,
                                },
                                "& .MuiTabs-indicator": {
                                    height: 3,
                                    borderRadius: "3px 3px 0 0",
                                },
                            }}
                        >
                            {tabConfig.map((tab, idx) => (
                                <Tab
                                    key={tab.label}
                                    label={
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                                            <Box sx={{
                                                color: activeTab === idx ? "primary.main" : "text.secondary",
                                                display: "flex", alignItems: "center",
                                                transition: "color 0.18s ease",
                                            }}>
                                                {tab.icon}
                                            </Box>
                                            <span>{tab.label}</span>
                                        </Box>
                                    }
                                />
                            ))}
                        </Tabs>
                    </Box>

                    <Box sx={{ p: { xs: 2.5, sm: 4 }, bgcolor: "background.paper" }}>
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
                            <ReviewsTab
                                reviews={reviews}
                                apartmentId={Number(id)}
                                ownerId={apartment.Id_Owner}
                            />
                        </TabPanel>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default ApartmentDetail;