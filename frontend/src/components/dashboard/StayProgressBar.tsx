// components/dashboard/StayProgressBar.tsx
import { Box, Typography } from "@mui/material";
import CalendarTodayIcon   from "@mui/icons-material/CalendarToday";
import { useTranslation }  from "react-i18next";
import { colors }          from "../../theme/gradients";
import { formatDate }      from "../../utils/formatDate";
import { nightsCount, stayProgress, isActive } from "./stayHelpers";

interface Props {
    startDate: Date;
    endDate:   Date;
}

export default function StayProgressBar({ startDate, endDate }: Props) {
    const { t }    = useTranslation();
    const pct      = stayProgress(startDate, endDate);
    const active   = isActive(startDate, endDate);
    const upcoming = startDate > new Date();
    const nights   = nightsCount(startDate, endDate);

    const accentColor = active ? colors.success : colors.primary;
    const accentAlpha = active ? colors.successAlpha15 : colors.primaryAlpha15;

    return (
        <Box sx={{
            position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 3,
            background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)",
            px: 2, pt: 3, pb: 1.5,
        }}>
            {/* Date pills + status chip */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Box sx={{
                    display: "flex", alignItems: "center", gap: 0.6,
                    bgcolor: "rgba(255,255,255,0.13)", backdropFilter: "blur(6px)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    px: 1.2, py: 0.5, borderRadius: 99,
                }}>
                    <CalendarTodayIcon sx={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }} />
                    <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#fff", lineHeight: 1 }}>
                        {formatDate(startDate)}
                    </Typography>
                </Box>

                <Box sx={{
                    px: 1.2, py: 0.5, borderRadius: 99,
                    bgcolor: accentColor,
                    boxShadow: `0 2px 10px ${accentAlpha}`,
                }}>
                    <Typography sx={{ fontSize: 10, fontWeight: 800, color: "#fff", lineHeight: 1, letterSpacing: 0.4 }}>
                        {active
                            ? t("dashboard.upcomingStays.badgeNow")
                            : upcoming
                                ? t("dashboard.upcomingStays.badgeUpcoming")
                                : t("dashboard.upcomingStays.badgePast")}
                    </Typography>
                </Box>

                <Box sx={{
                    display: "flex", alignItems: "center", gap: 0.6,
                    bgcolor: "rgba(255,255,255,0.13)", backdropFilter: "blur(6px)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    px: 1.2, py: 0.5, borderRadius: 99,
                }}>
                    <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#fff", lineHeight: 1 }}>
                        {formatDate(endDate)}
                    </Typography>
                    <CalendarTodayIcon sx={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }} />
                </Box>
            </Box>

            {/* Progress track */}
            <Box sx={{ height: 3, bgcolor: "rgba(255,255,255,0.18)", borderRadius: 99, overflow: "hidden" }}>
                <Box sx={{
                    height: "100%", width: `${pct}%`,
                    background: accentColor, borderRadius: 99,
                    transition: "width 0.6s ease",
                }} />
            </Box>

            <Typography sx={{ fontSize: 10, color: "rgba(255,255,255,0.45)", mt: 0.5, textAlign: "center" }}>
                {nights} {nights === 1
                    ? t("dashboard.upcomingStays.night")
                    : t("dashboard.upcomingStays.nights")}
                {active && pct > 0 && ` · ${pct}% ${t("dashboard.upcomingStays.elapsed")}`}
            </Typography>
        </Box>
    );
}
