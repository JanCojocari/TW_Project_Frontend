// components/dashboard/PreviousStaysTab.tsx
import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Alert, Chip } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useTranslation }   from "react-i18next";
import { useAuth }          from "../../auth/AuthContext";
import { apartmentService } from "../../services/apartmentService";
import type { Apartment }   from "../../types/apartment.types";
import { colors }           from "../../theme/gradients";
import { type StayEntry, fetchRenterPayments } from "./stayHelpers";
import PastHeroStayCard    from "./PastHeroStayCard";
import PastCompactStayCard from "./PastCompactStayCard";

export default function PreviousStaysTab() {
    const { t }           = useTranslation();
    const { currentUser } = useAuth();

    const [stays,   setStays]   = useState<StayEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState(false);

    useEffect(() => {
        if (!currentUser?.id) return;
        const now = new Date();

        Promise.all([
            fetchRenterPayments(currentUser.id),
            apartmentService.getAll(),
        ])
            .then(([payments, apartments]) => {
                const aptMap = new Map<number, Apartment>(apartments.map(a => [a.Id_Apartment, a]));
                const previous = payments
                    .filter(p => p.endDate != null && new Date(p.endDate) < now)
                    .sort((a, b) => new Date(b.startDate!).getTime() - new Date(a.startDate!).getTime())
                    .reduce<StayEntry[]>((acc, p) => {
                        const apt = aptMap.get(p.apartmentId);
                        if (apt) acc.push({ apartment: apt, startDate: new Date(p.startDate!), endDate: new Date(p.endDate!) });
                        return acc;
                    }, []);
                setStays(previous);
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
            {t("dashboard.previousStays.errorLoad")}
        </Alert>
    );

    if (stays.length === 0) return (
        <Box sx={{ textAlign: "center", py: 10 }}>
            <Typography color="text.disabled" sx={{ fontSize: 18, fontStyle: "italic" }}>
                {t("dashboard.previousStays.empty")}
            </Typography>
        </Box>
    );

    const [hero, ...rest] = stays;

    return (
        <Box sx={{ pb: 6 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                <CalendarTodayIcon sx={{ fontSize: 18, color: "text.disabled" }} />
                <Typography sx={{
                    fontSize: 13, fontWeight: 800, color: "text.disabled",
                    textTransform: "uppercase", letterSpacing: "1px",
                }}>
                    {t("dashboard.previousStays.sectionLabel")}
                </Typography>
                <Chip
                    label={stays.length} size="small"
                    sx={{
                        height: 20, fontSize: 11, fontWeight: 800,
                        bgcolor: "background.default", color: "text.secondary",
                        border: `1px solid ${colors.border}`,
                    }}
                />
            </Box>

            {stays.length === 1 ? (
                <Box sx={{ maxWidth: 480 }}>
                    <PastHeroStayCard stay={hero} />
                </Box>
            ) : (
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3, alignItems: "stretch" }}>
                    <PastHeroStayCard stay={hero} />
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {rest.map(stay => (
                            <PastCompactStayCard key={stay.apartment.Id_Apartment} stay={stay} />
                        ))}
                    </Box>
                </Box>
            )}
        </Box>
    );
}
