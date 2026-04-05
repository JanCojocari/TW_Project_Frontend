// components/apartmentDetail/ApartmentInfoPanel.tsx
import { Box, Typography, Button, Paper, Divider, Card, CardContent } from "@mui/material";
import { LocationOn as LocationOnIcon, AttachMoney as AttachMoneyIcon, Person as PersonIcon } from "@mui/icons-material";
import { useNavigate }    from "react-router-dom";
import { useTranslation } from "react-i18next";
import { gradients, colors } from "../../theme/gradients.ts";
import type { Apartment } from "../../types/apartment.types";

interface User { Id_User: number; Name: string; Surname: string; Email?: string | null; Phone: string; }
interface Props { apartment: Apartment; owner: User | null | undefined; renter: User | null | undefined; isAvailable: boolean; }

const iconBoxSx = { background: "", p: 1.5, borderRadius: 2, display: "flex", color: "#FFFFFF" };

const UserCard = ({ user, label, color }: { user: User; label: string; color: string }) => {
    const { t } = useTranslation();
    return (
        <Card variant="outlined" sx={{ mb: 3, borderRadius: 2, bgcolor: "background.default" }}>
            <CardContent>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
                    <PersonIcon sx={{ color, fontSize: 28 }} />
                    <Typography variant="h6" fontWeight={700}>{label}</Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                    <strong>{t("components.infoPanel.name")}:</strong> {user.Name} {user.Surname}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                    <strong>{t("components.infoPanel.email")}:</strong> {user.Email || "N/A"}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    <strong>{t("components.infoPanel.phone")}:</strong> {user.Phone}
                </Typography>
            </CardContent>
        </Card>
    );
};

const ApartmentInfoPanel = ({ apartment, owner, renter, isAvailable }: Props) => {
    const navigate    = useNavigate();
    const { t }       = useTranslation();
    const gradientBox = { ...iconBoxSx, background: gradients.primary, boxShadow: `0 4px 12px ${colors.primaryAlpha25}` };

    const intervalMap: Record<string, string> = {
        hour:  t("apartment.perHour"),
        day:   t("apartment.perDay"),
        month: t("apartment.perMonth"),
    };
    const intervalLabel = intervalMap[apartment.Interval] ?? apartment.Interval;

    return (
        <Paper elevation={1} sx={{ p: 4, borderRadius: 4, height: "100%", border: `1px solid ${colors.border}` }}>
            <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start", mb: 3 }}>
                <Box sx={gradientBox}><LocationOnIcon sx={{ fontSize: 28 }} /></Box>
                <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>{t("components.infoPanel.address")}</Typography>
                    <Typography variant="h5" fontWeight={700}>{apartment.Address}</Typography>
                </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start", mb: 3 }}>
                <Box sx={gradientBox}><AttachMoneyIcon sx={{ fontSize: 28 }} /></Box>
                <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>{t("components.infoPanel.price")}</Typography>
                    <Typography variant="h4" fontWeight={900} color="primary.main">
                        {apartment.Cost_per_interval} {apartment.Currency}
                        <Typography component="span" variant="body1" color="text.secondary" sx={{ ml: 1 }}>
                            / {intervalLabel}
                        </Typography>
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {owner  && <UserCard user={owner}  label={t("apartment.owner")}  color="primary.main" />}
            {!isAvailable && renter && <UserCard user={renter} label={t("apartment.renter")} color="error.main" />}

            <Button variant="contained" fullWidth size="large"
                    onClick={() => navigate(`/payments?apartmentId=${apartment.Id_Apartment}`)}
                    disabled={!isAvailable}
                    sx={{ py: 1.8, borderRadius: 2, fontWeight: 700, fontSize: 16 }}>
                {isAvailable ? t("apartment.rentNow") : t("apartment.unavailable")}
            </Button>

            {isAvailable && (
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2, textAlign: "center" }}>
                    {t("apartment.redirect")}
                </Typography>
            )}
        </Paper>
    );
};

export default ApartmentInfoPanel;