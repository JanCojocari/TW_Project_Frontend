// pages/ApartmentDetail.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation }         from "react-i18next";
import { Box, Container, Typography, Button, Chip, Alert, Paper, Tabs, Tab } from "@mui/material";
import { ArrowBack as ArrowBackIcon, LocationOn as LocationOnIcon, Wifi as WifiIcon, MeetingRoom as RoomsIcon, Star as StarIcon } from "@mui/icons-material";
import type { Apartment }    from "../types/apartment.types";
import type { User }         from "../types/user.types";
import { colors }            from "../theme/gradients.ts";
import { useAuth }           from "../auth/AuthContext.tsx";
import { apartmentService }  from "../services/apartmentService.ts";
import { reviewService }     from "../services/reviewService.ts";
import type { ReviewApiDto } from "../services/reviewService.ts";
import { recentViewService } from "../services/recentViewService.ts";
import { userService, mapUserApiToUser } from "../services/userService.ts";
import ImageCarousel     from "../components/apartmentDetail/ImageCarousel.tsx";
import AdditionalInfoTab from "../components/apartmentDetail/AdditionaInfoTab.tsx";
import ApartmentInfoPanel from "../components/apartmentDetail/ApartmentInfoPanel.tsx";
import TabPanel          from "../components/apartmentDetail/TabPanel.tsx";
import FacilitiesTab     from "../components/apartmentDetail/FacilitiesTab.tsx";
import LocationTab       from "../components/apartmentDetail/LocationTab.tsx";
import ReviewsTab        from "../components/apartmentDetail/ReviewsTab.tsx";

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

    useEffect(() => {
        const apartmentId = Number(id);
        setLoading(true);
        setOwner(null);
        setRenter(null);
        apartmentService.getById(apartmentId)
            .then(apt => {
                setApartment(apt);
                if (apt && currentUser) {
                    recentViewService.add(currentUser.id, apartmentId).catch(() => {});
                    userService.getById(apt.Id_Owner).then(u => setOwner(mapUserApiToUser(u))).catch(() => {});
                    if (apt.Id_Renter) userService.getById(apt.Id_Renter).then(u => setRenter(mapUserApiToUser(u))).catch(() => {});
                }
                return reviewService.getByApartment(apartmentId);
            })
            .then(setReviews)
            .finally(() => setLoading(false));
    }, [id]);
    const location   = apartment?.location   ?? null;
    const facilities = apartment?.facilities ?? null;
    const addInfo    = apartment?.additionalInfo ?? null;

    // tabConfig în interiorul componentei — se re-evaluează la schimbarea limbii
    const tabConfig = [
        { label: t("apartment.tabs.location"),   icon: <LocationOnIcon sx={{ fontSize: 18 }} /> },
        { label: t("apartment.tabs.facilities"), icon: <WifiIcon sx={{ fontSize: 18 }} /> },
        { label: t("apartment.tabs.info"),       icon: <RoomsIcon sx={{ fontSize: 18 }} /> },
        { label: t("apartment.tabs.reviews"),    icon: <StarIcon sx={{ fontSize: 18 }} /> },
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
    const images      = apartment.image_url ? [apartment.image_url, apartment.image_url, apartment.image_url] : [];
    const statusChip  = (
        <Chip label={isAvailable ? t("listings.available") : t("listings.occupied")}
              sx={{ fontWeight: 700, fontSize: "14px", px: 2, py: 2.5, bgcolor: isAvailable ? "rgba(22,163,74,0.3)" : "rgba(220,38,38,0.3)", color: "white" }} />
    );

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: { xs: 3, md: 5 }, mt: 10 }}>
            <Container maxWidth="lg">
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 3, fontWeight: 600 }}>
                    {t("apartment.back")}
                </Button>

                {showRentSuccess && (
                    <Alert severity="success" onClose={() => setShowRentSuccess(false)} sx={{ mb: 3 }}>
                        {t("apartment.rentSuccess")}
                    </Alert>
                )}

                <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
                    <Box sx={{ flex: { xs: "1", md: "1 1 58%" } }}>
                        <ImageCarousel images={images} altBase={apartment.Address} statusChip={statusChip} />
                    </Box>
                    <Box sx={{ flex: { xs: "1", md: "1 1 42%" } }}>
                        <ApartmentInfoPanel apartment={apartment} owner={owner} renter={renter} isAvailable={isAvailable} />
                    </Box>
                </Box>

                <Paper elevation={1} sx={{ mt: 4, borderRadius: 4, overflow: "hidden", border: `1px solid ${colors.border}`, bgcolor: "background.paper" }}>
                    <Box sx={{ borderBottom: `1px solid ${colors.border}`, bgcolor: "background.paper", px: { xs: 1, sm: 3 } }}>
                        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} centered
                              sx={{ "& .MuiTab-root": { minHeight: 60, px: { xs: 2, sm: 3 } } }}>
                            {tabConfig.map((tab, idx) => (
                                <Tab key={tab.label} label={
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <Box sx={{ color: activeTab === idx ? "primary.main" : "text.secondary", display: "flex", alignItems: "center", transition: "color 0.2s ease" }}>
                                            {tab.icon}
                                        </Box>
                                        <span>{tab.label}</span>
                                    </Box>
                                } />
                            ))}
                        </Tabs>
                    </Box>
                    <Box sx={{ p: { xs: 2, sm: 4 }, bgcolor: "background.paper" }}>
                        <TabPanel value={activeTab} index={0}>{location   && <LocationTab location={location} />}</TabPanel>
                        <TabPanel value={activeTab} index={1}>{facilities && <FacilitiesTab facilities={facilities} />}</TabPanel>
                        <TabPanel value={activeTab} index={2}>{addInfo    && <AdditionalInfoTab info={addInfo} />}</TabPanel>
                        <TabPanel value={activeTab} index={3}><ReviewsTab reviews={reviews} /></TabPanel>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default ApartmentDetail;