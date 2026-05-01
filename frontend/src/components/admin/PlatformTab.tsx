// components/admin/PlatformTab.tsx
import { useEffect, useState } from "react";
import {
    Box, Card, CardContent, CardActionArea, Typography, Grid, CircularProgress, Alert,
} from "@mui/material";
import PeopleIcon      from "@mui/icons-material/People";
import ApartmentIcon   from "@mui/icons-material/Apartment";
import HourglassIcon   from "@mui/icons-material/HourglassEmpty";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon      from "@mui/icons-material/Cancel";
import PaymentIcon     from "@mui/icons-material/Payment";
import StarIcon        from "@mui/icons-material/Star";
import SupportIcon     from "@mui/icons-material/Support";
import ErrorIcon       from "@mui/icons-material/Error";
import { adminService, type AdminStats } from "../../services/adminService";
import { gradients, colors } from "../../theme/gradients";

export type NavKey = "dashboard" | "listings" | "users" | "payments" | "reviews" | "support";

interface StatCardProps {
    label: string;
    value: number;
    icon: React.ReactNode;
    accent?: string;
    navKey: NavKey;
    onNavigate: (key: NavKey) => void;
}

const StatCard = ({ label, value, icon, accent, navKey, onNavigate }: StatCardProps) => (
    <Card
        elevation={0}
        sx={{
            border: `1px solid ${colors.border}`,
            borderRadius: 3,
            height: "100%",
            transition: "border-color 0.15s, box-shadow 0.15s",
            "&:hover": { borderColor: "primary.main" },
        }}
    >
        <CardActionArea onClick={() => onNavigate(navKey)} sx={{ height: "100%", borderRadius: 3 }}>
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, p: 3 }}>
                <Box sx={{
                    background: accent ?? gradients.primary,
                    p: 1.5, borderRadius: 2,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    minWidth: 48, minHeight: 48,
                }}>
                    <Box sx={{ color: "#fff", display: "flex" }}>{icon}</Box>
                </Box>
                <Box>
                    <Typography variant="h4" fontWeight={900} lineHeight={1}>{value}</Typography>
                    <Typography variant="body2" color="text.secondary" mt={0.5}>{label}</Typography>
                </Box>
            </CardContent>
        </CardActionArea>
    </Card>
);

interface PlatformTabProps {
    onNavigate: (key: NavKey) => void;
}

export default function PlatformTab({ onNavigate }: PlatformTabProps) {
    const [stats, setStats]     = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState<string | null>(null);

    useEffect(() => {
        adminService.getStats()
            .then(data => { setStats(data); setError(null); })
            .catch(() => setError("Failed to load stats."))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}><CircularProgress /></Box>;
    if (error || !stats) return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;

    const cards: Omit<StatCardProps, "onNavigate">[] = [
        { label: "Total Users",            value: stats.totalUsers,           icon: <PeopleIcon />,      navKey: "users"    },
        { label: "Total Apartments",       value: stats.totalApartments,      icon: <ApartmentIcon />,   navKey: "listings" },
        { label: "Pending Apartments",     value: stats.pendingApartments,    icon: <HourglassIcon />,   navKey: "listings", accent: "linear-gradient(135deg,#f59e0b,#d97706)" },
        { label: "Approved Apartments",    value: stats.approvedApartments,   icon: <CheckCircleIcon />, navKey: "listings", accent: "linear-gradient(135deg,#10b981,#059669)" },
        { label: "Declined Apartments",    value: stats.declinedApartments,   icon: <CancelIcon />,      navKey: "listings", accent: "linear-gradient(135deg,#ef4444,#dc2626)" },
        { label: "Total Payments",         value: stats.totalPayments,        icon: <PaymentIcon />,     navKey: "payments", accent: "linear-gradient(135deg,#8b5cf6,#7c3aed)" },
        { label: "Total Reviews",          value: stats.totalReviews,         icon: <StarIcon />,        navKey: "reviews",  accent: "linear-gradient(135deg,#f59e0b,#d97706)" },
        { label: "Total Support Requests", value: stats.totalSupportRequests, icon: <SupportIcon />,     navKey: "support",  accent: "linear-gradient(135deg,#3b82f6,#2563eb)" },
        { label: "Open Support Requests",  value: stats.openSupportRequests,  icon: <ErrorIcon />,       navKey: "support",  accent: "linear-gradient(135deg,#ef4444,#dc2626)" },
    ];

    return (
        <Grid container spacing={3}>
            {cards.map(card => (
                <Grid key={card.label} size={{ xs: 12, sm: 6, md: 4 }}>
                    <StatCard {...card} onNavigate={onNavigate} />
                </Grid>
            ))}
        </Grid>
    );
}