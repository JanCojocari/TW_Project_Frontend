import { useParams, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { Box, Container, Typography, Button, Chip, Alert, Paper, Tabs, Tab } from "@mui/material";
import { ArrowBack as ArrowBackIcon, LocationOn as LocationOnIcon, Wifi as WifiIcon, MeetingRoom as RoomsIcon, Star as StarIcon } from "@mui/icons-material";
import { apartments }        from "../mockdata/apartments";
import { users }             from "../mockdata/users";
import { colors }            from "../theme/gradients.ts";
import { getApartmentLocation, getApartmentFacilities, getApartmentInfo, getApartmentReviews } from "../mockdata/Apartmentdetails.ts";
import ImageCarousel from "../components/apartmentDetail/ImageCarousel.tsx";
import AdditionalInfoTab from "../components/apartmentDetail/AdditionaInfoTab.tsx";
import ApartmentInfoPanel from "../components/apartmentDetail/ApartmentInfoPanel.tsx";
import TabPanel from "../components/apartmentDetail/TabPanel.tsx";
import FacilitiesTab from "../components/apartmentDetail/FacilitiesTab.tsx";
import LocationTab from "../components/apartmentDetail/LocationTab.tsx";
import ReviewsTab from "../components/apartmentDetail/ReviewsTab.tsx";

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

    const apartment  = useMemo(() => apartments.find((a) => a.Id_Apartment === Number(id)), [id]);
    const owner      = useMemo(() => apartment ? users.find((u) => u.Id_User === apartment.Id_Owner) : null, [apartment]);
    const renter     = useMemo(() => apartment?.Id_Renter ? users.find((u) => u.Id_User === apartment.Id_Renter) : null, [apartment]);
    const location   = useMemo(() => apartment ? getApartmentLocation(apartment.Id_Apartment)   : null, [apartment]);
    const facilities = useMemo(() => apartment ? getApartmentFacilities(apartment.Id_Apartment) : null, [apartment]);
    const addInfo    = useMemo(() => apartment ? getApartmentInfo(apartment.Id_Apartment)        : null, [apartment]);
    const reviews    = useMemo(() => apartment ? getApartmentReviews(apartment.Id_Apartment)     : [],  [apartment]);

    if (!apartment) return (
        <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "background.default" }}>
            <Typography variant="h5" color="text.secondary">Apartamentul nu a fost găsit</Typography>
        </Box>
    );

    const isAvailable = apartment.Id_Renter === null;
    const images      = [apartment.image_url, apartment.image_url, apartment.image_url];
    const statusChip  = (
        <Chip label={isAvailable ? "Disponibil" : "Ocupat"} sx={{ fontWeight: 700, fontSize: "14px", px: 2, py: 2.5, bgcolor: isAvailable ? "rgba(22,163,74,0.3)" : "rgba(220,38,38,0.3)", color: "white" }} />
    );

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
                    <Box sx={{ flex: { xs: "1", md: "1 1 58%" } }}>
                        <ImageCarousel images={images} altBase={apartment.Address} statusChip={statusChip} />
                    </Box>
                    <Box sx={{ flex: { xs: "1", md: "1 1 42%" } }}>
                        <ApartmentInfoPanel apartment={apartment} owner={owner} renter={renter} isAvailable={isAvailable} />
                    </Box>
                </Box>

                {/* ── Tab bar — bgcolor din temă, nu hardcodat ── */}
                <Paper elevation={1} sx={{
                    mt: 4, borderRadius: 4, overflow: "hidden",
                    border: `1px solid ${colors.border}`,
                    bgcolor: "background.paper",
                }}>
                    <Box sx={{
                        borderBottom: `1px solid ${colors.border}`,
                        bgcolor: "background.paper",   // ← în loc de linear-gradient cu bgPaper hardcodat
                        px: { xs: 1, sm: 3 },
                    }}>
                        <Tabs
                            value={activeTab}
                            onChange={(_, v) => setActiveTab(v)}
                            centered
                            sx={{ "& .MuiTab-root": { minHeight: 60, px: { xs: 2, sm: 3 } } }}
                        >
                            {tabConfig.map((tab, idx) => (
                                <Tab key={tab.label} label={
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <Box sx={{
                                            color: activeTab === idx ? "primary.main" : "text.secondary",
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