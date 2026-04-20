// components/dashboard/UpcomingStaysTab.tsx
import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import CalendarTodayIcon    from "@mui/icons-material/CalendarToday";
import { useTranslation }   from "react-i18next";
import { useAuth }          from "../../auth/AuthContext";
import { apartmentService } from "../../services/apartmentService";
import ApartmentCard        from "../listing/ApartmentCard";
import type { Apartment }   from "../../types/apartment.types";
import { formatDate } from '../../utils/formatDate';
import { colors }           from "../../theme/gradients";
import axiosInstance        from "../../api/axiosInstance";

// Tip local — nu depinde de paymentHistoryService
interface RenterPayment {
    id:          number;
    apartmentId: number;
    renterId:    number;
    ownerId:     number;
    totalCost:   number;
    currency:    number;
    createdAt:   string;
    startDate:   string | null;
    endDate:     string | null;
    invoiceUrl:  string | null;
}

interface StayEntry {
    apartment: Apartment;
    startDate: Date;
    endDate:   Date;
}

async function fetchRenterPayments(renterId: number): Promise<RenterPayment[]> {
    const res = await axiosInstance.get<RenterPayment[]>(`/payments/renter/${renterId}`);
    return res.data;
}

export default function UpcomingStaysTab() {
    const { t }           = useTranslation();
    const { currentUser } = useAuth();

    const [stays, setStays]     = useState<StayEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState(false);

    useEffect(() => {
        if (!currentUser?.id) return;
        const now = new Date();

        Promise.all([
            fetchRenterPayments(currentUser.id),
            apartmentService.getAll(),
        ])
            .then(([payments, apartments]) => {
                const aptMap = new Map<number, Apartment>(
                    apartments.map(a => [a.Id_Apartment, a])
                );

                const upcoming = payments
                    .filter(p => p.startDate != null && new Date(p.startDate) > now)
                    .sort((a, b) => new Date(a.startDate!).getTime() - new Date(b.startDate!).getTime())
                    .reduce<StayEntry[]>((acc, p) => {
                        const apt = aptMap.get(p.apartmentId);
                        if (apt) acc.push({
                            apartment: apt,
                            startDate: new Date(p.startDate!),
                            endDate:   new Date(p.endDate!),
                        });
                        return acc;
                    }, []);

                setStays(upcoming);
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

    return (
        <Box sx={{ display: "grid", gap: 4, gridTemplateColumns: { xs: "1fr", sm: "repeat(2,1fr)", md: "repeat(3,1fr)" } }}>
            {stays.map(({ apartment, startDate, endDate }) => (
                <Box key={apartment.Id_Apartment}>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 0.75,
                        mb: 1.5,
                        px: 2,
                        py: 1.5,
                        backgroundColor: "background.paper",
                        border: `1px solid ${colors.border}`,
                        borderRadius: 2,
                    }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <CalendarTodayIcon sx={{ fontSize: 18, color: "primary.main" }} />
                            <Typography sx={{ fontSize: 16, fontWeight: 800, color: "text.primary", letterSpacing: "-0.3px" }}>
                                {formatDate(startDate)} — {formatDate(endDate)}
                            </Typography>
                        </Box>
                    </Box>

                    <ApartmentCard
                        apartment={apartment}
                        favorites={[]}
                        toggleFavorite={() => {}}
                        getUserName={(id: number) => `User #${id}`}
                        getStatus={() => t("listings.occupied")}
                    />
                </Box>
            ))}
        </Box>
    );
}