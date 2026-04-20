// components/dashboard/RecentViewTab.tsx
import { useEffect, useState } from "react";
import { Box, Typography, Button, CircularProgress, Alert, Select, MenuItem } from "@mui/material";
import DeleteSweepIcon    from "@mui/icons-material/DeleteSweep";
import { useTranslation } from "react-i18next";
import { useAuth }        from "../../auth/AuthContext";
import { apartmentService } from "../../services/apartmentService";
import { recentViewService, type RecentViewApiDto } from "../../services/recentViewService";
import ApartmentCard      from "../listing/ApartmentCard";
import type { Apartment } from "../../types/apartment.types";
import { colors }         from "../../theme/gradients";

interface ViewEntry {
    apartment: Apartment;
    viewedAt:  Date;
}

type Period = "today" | "yesterday" | "thisWeek" | "older" | "all";

function inPeriod(viewedAt: Date, period: Period, now: Date): boolean {
    const startOfToday     = new Date(now); startOfToday.setHours(0, 0, 0, 0);
    const startOfYesterday = new Date(startOfToday); startOfYesterday.setDate(startOfYesterday.getDate() - 1);
    const startOfWeek      = new Date(startOfToday); startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    switch (period) {
        case "today":     return viewedAt >= startOfToday;
        case "yesterday": return viewedAt >= startOfYesterday && viewedAt < startOfToday;
        case "thisWeek":  return viewedAt >= startOfWeek && viewedAt < startOfYesterday;
        case "older":     return viewedAt < startOfWeek;
        default:          return true;
    }
}

export default function RecentViewTab() {
    const { t }           = useTranslation();
    const { currentUser } = useAuth();

    const [entries, setEntries]   = useState<ViewEntry[]>([]);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState(false);
    const [clearing, setClearing] = useState(false);
    const [period, setPeriod]     = useState<Period>("all");

    const load = () => {
        if (!currentUser?.id) return;
        setLoading(true);
        Promise.all([
            recentViewService.getByUser(currentUser.id),
            apartmentService.getAll(),
        ])
            .then(([views, apartments]: [RecentViewApiDto[], Apartment[]]) => {
                const aptMap = new Map<number, Apartment>(
                    apartments.map(a => [a.Id_Apartment, a])
                );
                const result = views.reduce<ViewEntry[]>((acc, v) => {
                    const apt = aptMap.get(v.apartmentId);
                    if (apt) acc.push({ apartment: apt, viewedAt: new Date(v.viewedAt) });
                    return acc;
                }, []);
                setEntries(result);
            })
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, [currentUser?.id]);

    const handleClearAll = async () => {
        if (!currentUser?.id) return;
        setClearing(true);
        try {
            await recentViewService.clearAll(currentUser.id);
            setEntries([]);
        } catch {
            setError(true);
        } finally {
            setClearing(false);
        }
    };

    if (loading) return (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
        </Box>
    );

    if (error) return (
        <Alert severity="error" sx={{ mt: 2 }}>
            {t("dashboard.recentViewed.errorLoad")}
        </Alert>
    );

    if (entries.length === 0) return (
        <Box sx={{ textAlign: "center", py: 10 }}>
            <Typography color="text.disabled" sx={{ fontSize: 18, fontStyle: "italic" }}>
                {t("dashboard.recentViewed.empty")}
            </Typography>
        </Box>
    );

    const now     = new Date();
    const visible = entries.filter(e => inPeriod(e.viewedAt, period, now));

    const PERIOD_OPTIONS: { value: Period; labelKey: string }[] = [
        { value: "all",       labelKey: "dashboard.recentViewed.groups.all" },
        { value: "today",     labelKey: "dashboard.recentViewed.groups.today" },
        { value: "yesterday", labelKey: "dashboard.recentViewed.groups.yesterday" },
        { value: "thisWeek",  labelKey: "dashboard.recentViewed.groups.thisWeek" },
        { value: "older",     labelKey: "dashboard.recentViewed.groups.older" },
    ];

    return (
        <Box sx={{ pb: 6 }}>
            {/* Toolbar: dropdown stanga, clear all dreapta */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Select
                    value={period}
                    onChange={e => setPeriod(e.target.value as Period)}
                    size="small"
                    variant="outlined"
                    sx={{
                        minWidth: 180,
                        fontWeight: 700,
                        fontSize: 14,
                        backgroundColor: "transparent",
                        border: `1px solid ${colors.border}`,
                        borderRadius: 2,
                        color: "text.primary",
                        "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                        "& .MuiSelect-icon": { color: "text.secondary" },
                    }}
                >
                    {PERIOD_OPTIONS.map(opt => (
                        <MenuItem key={opt.value} value={opt.value} sx={{ fontWeight: 600 }}>
                            {t(opt.labelKey)}
                        </MenuItem>
                    ))}
                </Select>

                <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteSweepIcon />}
                    disabled={clearing}
                    onClick={handleClearAll}
                    sx={{ borderRadius: 2, fontWeight: 700 }}
                >
                    {clearing ? t("dashboard.recentViewed.clearing") : t("dashboard.recentViewed.clearAll")}
                </Button>
            </Box>

            {/* Mesaj daca filtrul nu are rezultate */}
            {visible.length === 0 && (
                <Box sx={{ textAlign: "center", py: 8 }}>
                    <Typography color="text.disabled" sx={{ fontSize: 16, fontStyle: "italic" }}>
                        {t("dashboard.recentViewed.noResults")}
                    </Typography>
                </Box>
            )}

            {/* Grid carduri */}
            <Box sx={{ display: "grid", gap: 4, gridTemplateColumns: { xs: "1fr", sm: "repeat(2,1fr)", md: "repeat(3,1fr)" } }}>
                {visible.map(({ apartment }) => (
                    <ApartmentCard
                        key={apartment.Id_Apartment}
                        apartment={apartment}
                        favorites={[]}
                        toggleFavorite={() => {}}
                        getUserName={(id: number) => `User #${id}`}
                        getStatus={(apt: Apartment) => apt.Id_Renter
                            ? t("listings.occupied")
                            : t("listings.available")}
                    />
                ))}
            </Box>
        </Box>
    );
}