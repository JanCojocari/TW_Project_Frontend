// components/dashboard/UpcomingStaysTab.tsx
import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Alert, Chip } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useTranslation }   from "react-i18next";
import { useAuth }          from "../../auth/AuthContext";
import { apartmentService } from "../../services/apartmentService";
import { colors }           from "../../theme/gradients";
import { type StayEntry, fetchRenterPayments } from "./stayHelpers";
import HeroStayCard    from "./HeroStayCard";
import CompactStayCard from "./CompactStayCard";

export default function UpcomingStaysTab() {
    const { t }           = useTranslation();
    const { currentUser } = useAuth();

    const [stays,   setStays]   = useState<StayEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState(false);

    useEffect(() => {
        if (!currentUser?.id) return;
        const now = new Date();

        fetchRenterPayments(currentUser.id)
            .then(async (payments) => {
                const active = payments
                    .filter(p => p.startDate != null && p.endDate != null && new Date(p.endDate) >= now)
                    .sort((a, b) => new Date(a.startDate!).getTime() - new Date(b.startDate!).getTime());

                const entries = await Promise.all(
                    active.map(p =>
                        apartmentService.getById(p.apartmentId)
                            .then(apt => apt
                                ? { apartment: apt, startDate: new Date(p.startDate!), endDate: new Date(p.endDate!) }
                                : null)
                            .catch(() => null)
                    )
                );
                setStays(entries.filter((e): e is StayEntry => e !== null));
            })
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, [currentUser?.id]);

    if (loading) return (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
        </Box>
    );

    if (error) return (
        <Alert severity="error" sx={{ mt: 2 }}>
            {t("dashboard.upcomingStays.errorLoad")}
        </Alert>
    );

    if (stays.length === 0) return (
        <Box sx={{ textAlign: "center", py: 10 }}>
            <Typography color="text.disabled" sx={{ fontSize: 18, fontStyle: "italic" }}>
                {t("dashboard.upcomingStays.empty")}
            </Typography>
        </Box>
    );

    const [hero, ...rest] = stays;

    return (
        <Box sx={{ pb: 6 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                <CalendarTodayIcon sx={{ fontSize: 18, color: "primary.main" }} />
                <Typography sx={{
                    fontSize: 13, fontWeight: 800, color: "text.disabled",
                    textTransform: "uppercase", letterSpacing: "1px",
                }}>
                    {t("dashboard.upcomingStays.sectionLabel") ?? "Your upcoming stays"}
                </Typography>
                <Chip
                    label={stays.length} size="small"
                    sx={{ height: 20, fontSize: 11, fontWeight: 800, bgcolor: colors.primaryAlpha10, color: "primary.main" }}
                />
            </Box>

            {stays.length === 1 ? (
                <Box sx={{ maxWidth: 480 }}>
                    <HeroStayCard stay={hero} />
                </Box>
            ) : (
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3, alignItems: "stretch" }}>
                    <HeroStayCard stay={hero} />
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {rest.map(stay => (
                            <CompactStayCard key={stay.apartment.Id_Apartment} stay={stay} />
                        ))}
                    </Box>
                </Box>
            )}
        </Box>
    );
}
