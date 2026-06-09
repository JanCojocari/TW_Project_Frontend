// components/dashboard/CompactStayCard.tsx
import { Box, Typography, Button } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { useTranslation } from "react-i18next";
import { useNavigate }    from "react-router-dom";
import { colors, gradients } from "../../theme/gradients";
import { formatDate }     from "../../utils/formatDate";
import { paths }          from "../../app/paths";
import type { StayEntry } from "./stayHelpers";
import { isActive, stayProgress } from "./stayHelpers";

interface Props {
    stay: StayEntry;
}

export default function CompactStayCard({ stay }: Props) {
    const { t }    = useTranslation();
    const navigate = useNavigate();
    const { apartment, startDate, endDate } = stay;
    const cardImage = apartment.image_urls?.[0] ?? apartment.image_url;
    const active    = isActive(startDate, endDate);
    const pct       = stayProgress(startDate, endDate);

    return (
        <Box sx={{
            borderRadius: 3, overflow: "hidden",
            border: `1px solid ${colors.border}`,
            bgcolor: "background.paper",
            display: "flex",
            boxShadow: `0 2px 12px ${colors.primaryAlpha10}`,
            transition: "box-shadow 0.2s, transform 0.2s",
            "&:hover": {
                boxShadow: `0 6px 24px ${colors.primaryAlpha25}`,
                transform: "translateY(-2px)",
            },
        }}>
            {/* Thumbnail */}
            <Box sx={{ position: "relative", width: 110, flexShrink: 0, overflow: "hidden", bgcolor: "background.default" }}>
                {cardImage
                    ? <img src={cardImage} alt={apartment.Address}
                           style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <Box sx={{ width: "100%", height: "100%", background: gradients.primary }} />
                }
                {active && (
                    <Box sx={{
                        position: "absolute", top: 8, left: 8,
                        bgcolor: colors.success, borderRadius: 99,
                        width: 8, height: 8,
                        boxShadow: `0 0 0 3px ${colors.successAlpha15}`,
                    }} />
                )}
            </Box>

            {/* Info */}
            <Box sx={{ flex: 1, p: 1.75, display: "flex", flexDirection: "column", gap: 0.75, minWidth: 0 }}>
                <Typography sx={{
                    fontWeight: 700, fontSize: 13, color: "text.primary",
                    lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>
                    {apartment.Address}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <CalendarTodayIcon sx={{ fontSize: 11, color: "text.disabled" }} />
                    <Typography sx={{ fontSize: 11, color: "text.secondary", fontWeight: 500 }}>
                        {formatDate(startDate)}
                    </Typography>
                    <ArrowRightAltIcon sx={{ fontSize: 13, color: "text.disabled" }} />
                    <Typography sx={{ fontSize: 11, color: "text.secondary", fontWeight: 500 }}>
                        {formatDate(endDate)}
                    </Typography>
                </Box>

                <Box sx={{ height: 3, bgcolor: colors.primaryAlpha10, borderRadius: 99, overflow: "hidden" }}>
                    <Box sx={{
                        height: "100%", width: `${pct}%`,
                        background: active ? colors.success : gradients.primary,
                        borderRadius: 99,
                    }} />
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: "auto" }}>
                    <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.3 }}>
                        <Typography sx={{ fontWeight: 900, fontSize: 15, color: "primary.main", lineHeight: 1 }}>
                            {apartment.Cost_per_interval}
                        </Typography>
                        <Typography sx={{ fontWeight: 500, fontSize: 11, color: "text.secondary" }}>
                            {apartment.Currency}
                        </Typography>
                    </Box>
                    <Button
                        size="small" variant="outlined"
                        onClick={() => navigate(paths.apartmentDetail(apartment.Id_Apartment))}
                        sx={{
                            fontSize: 11, fontWeight: 700, textTransform: "none",
                            borderRadius: 99, px: 1.5, py: 0.3,
                            borderColor: colors.primaryAlpha25, color: "primary.main",
                            "&:hover": { borderColor: "primary.main", bgcolor: colors.primaryAlpha06 },
                        }}
                    >
                        {t("listings.details")}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}
