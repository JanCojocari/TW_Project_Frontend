// pages/ApartmentDetail.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useTranslation }         from "react-i18next";
import { Box, Container, Typography, Button, Chip } from "@mui/material";
import {
    ArrowBack as ArrowBackIcon,
    HourglassEmpty as HourglassIcon,
    Block as BlockIcon,
    CheckCircleOutline as SuccessIcon,
} from "@mui/icons-material";
import type { Apartment } from "../types/apartment.types";
import type { User }      from "../types/user.types";
import { colors }         from "../theme/gradients.ts";
import { useAuth }        from "../auth/AuthContext.tsx";
import { apartmentService }              from "../services/apartmentService.ts";
import { reviewService }                 from "../services/reviewService.ts";
import type { ReviewApiDto }             from "../services/reviewService.ts";
import { recentViewService }             from "../services/recentViewService.ts";
import { userService, mapUserApiToUser } from "../services/userService.ts";
import ImageCarousel       from "../components/apartmentDetail/ImageCarousel.tsx";
import ApartmentInfoPanel  from "../components/apartmentDetail/ApartmentInfoPanel.tsx";
import ApartmentTabsPanel  from "../components/apartmentDetail/ApartmentTabsPanel.tsx";
import StatusBanner        from "../components/apartmentDetail/StatusBanner.tsx";

const ApartmentDetail = () => {
    const { id }       = useParams<{ id: string }>();
    const navigate     = useNavigate();
    const { t }        = useTranslation();
    const { currentUser } = useAuth();

    const [showRentSuccess, setShowRentSuccess] = useState(false);
    const [apartment, setApartment]             = useState<Apartment | null>(null);
    const [reviews, setReviews]                 = useState<ReviewApiDto[]>([]);
    const [owner, setOwner]                     = useState<User | null>(null);
    const [renter, setRenter]                   = useState<User | null>(null);
    const [loading, setLoading]                 = useState(true);
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
                    userService.getById(apt.Id_Owner).then(u => setOwner(mapUserApiToUser(u))).catch(() => {});
                    if (apt.Id_Renter) userService.getById(apt.Id_Renter).then(u => setRenter(mapUserApiToUser(u))).catch(() => {});
                }
                return reviewService.getByApartment(apartmentId);
            })
            .then(setReviews)
            .finally(() => setLoading(false));
    }, [id]);

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
    const isOwner     = currentUser?.id === apartment.Id_Owner;

    const images = apartment.image_urls.length > 0
        ? apartment.image_urls
        : apartment.image_url ? [apartment.image_url] : [];

    const statusChip = (
        <Chip
            label={isAvailable ? t("listings.available") : t("listings.occupied")}
            size="small"
            sx={{
                fontWeight: 800, fontSize: 11, textTransform: "uppercase",
                letterSpacing: "0.5px", backdropFilter: "blur(8px)", borderRadius: 2,
                bgcolor: isAvailable ? colors.success : colors.error, color: "white",
            }}
        />
    );

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: { xs: 3, md: 5 }, mt: 10 }}>
            <Container maxWidth="lg">
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}
                        sx={{ mb: 3, fontWeight: 600, textTransform: "none", borderRadius: 2 }}>
                    {t("apartment.back")}
                </Button>

                {showRentSuccess && (
                    <StatusBanner type="success" icon={<SuccessIcon sx={{ fontSize: 18 }} />} message={t("apartment.rentSuccess")} />
                )}
                {isOwner && apartment.status === "pending" && (
                    <StatusBanner type="pending" icon={<HourglassIcon sx={{ fontSize: 18 }} />} message={t("apartment.statusPending")} />
                )}
                {isOwner && apartment.status === "declined" && (
                    <StatusBanner type="declined" icon={<BlockIcon sx={{ fontSize: 18 }} />} message={t("apartment.statusDeclined")} />
                )}

                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "58% 1fr" }, gap: 3, alignItems: "stretch", mb: 4 }}>
                    <ImageCarousel images={images} altBase={apartment.Address} statusChip={statusChip} />
                    <Box sx={{ position: { md: "sticky" }, top: { md: "90px" }, alignSelf: { md: "start" } }}>
                        <ApartmentInfoPanel
                            apartment={apartment}
                            owner={owner}
                            renter={renter}
                            isAvailable={canRent}
                            isOwner={isOwner}
                        />
                    </Box>
                </Box>

                <ApartmentTabsPanel
                    location={apartment.location    ?? null}
                    facilities={apartment.facilities ?? null}
                    addInfo={apartment.additionalInfo ?? null}
                    reviews={reviews}
                    apartmentId={Number(id)}
                    ownerId={apartment.Id_Owner}
                />
            </Container>
        </Box>
    );
};

export default ApartmentDetail;
