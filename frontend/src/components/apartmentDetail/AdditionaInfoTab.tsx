// components/apartmentDetail/AdditionaInfoTab.tsx
import { Box, Paper, Typography, Chip } from "@mui/material";
import { MeetingRoom as RoomsIcon, SquareFoot as AreaIcon, Groups as GuestsIcon, AccessTime as TimeIcon, Cancel as CancelIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { colors }         from "../../theme/gradients.ts";
import type { AdditionalInfo } from "../../types/apartment.types";

type CancelKey = "flexible" | "moderate" | "strict";
const cancelColor: Record<CancelKey, "success" | "warning" | "error"> = {
    flexible: "success", moderate: "warning", strict: "error",
};

const AdditionalInfoTab = ({ info }: { info: AdditionalInfo }) => {
    const { t } = useTranslation();
    const c = info.cancellationPolicy as CancelKey;

    const stats = [
        { icon: <RoomsIcon />,  label: t("components.additionalInfo.rooms"),     value: info.rooms },
        { icon: <RoomsIcon />,  label: t("components.additionalInfo.bedrooms"),  value: info.bedrooms },
        { icon: <RoomsIcon />,  label: t("components.additionalInfo.bathrooms"), value: info.bathrooms },
        { icon: <RoomsIcon />,  label: t("components.additionalInfo.beds"),      value: info.beds },
        { icon: <AreaIcon />,   label: t("components.additionalInfo.surface"),   value: `${info.surfaceArea} m²` },
        { icon: <GuestsIcon />, label: t("components.additionalInfo.maxGuests"), value: info.maxGuests },
        { icon: <RoomsIcon />,  label: t("components.additionalInfo.floor"),     value: `${info.floor} / ${info.totalFloors}` },
    ];

    return (
        <Box>
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 2, mb: 3 }}>
                {stats.map((s) => (
                    <Paper key={s.label} variant="outlined" sx={{ p: 2, borderRadius: 3, textAlign: "center", border: `1px solid ${colors.border}`, transition: "all 0.2s ease", "&:hover": { borderColor: colors.primary, boxShadow: `0 4px 12px ${colors.primaryAlpha10}` } }}>
                        <Box sx={{ color: colors.primary, mb: 0.5, "& svg": { fontSize: 24 } }}>{s.icon}</Box>
                        <Typography variant="h6" fontWeight={800} color="primary.main">{s.value}</Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>{s.label}</Typography>
                    </Paper>
                ))}
            </Box>

            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, mb: 3, border: `1px solid ${colors.border}` }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                    <TimeIcon sx={{ mr: 1, verticalAlign: "middle", color: "primary.main" }} />
                    {t("components.additionalInfo.checkin")}
                </Typography>
                <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
                    <Box sx={{ flex: 1, p: 2, borderRadius: 2, bgcolor: colors.primaryAlpha06 }}>
                        <Typography variant="body2" color="text.secondary" fontWeight={600}>{t("components.additionalInfo.checkInLabel")}</Typography>
                        <Typography variant="body1" fontWeight={700}>{info.checkInFrom} – {info.checkInUntil}</Typography>
                        {info.selfCheckIn && <Chip label={t("components.additionalInfo.selfCheckin")} size="small" color="success" sx={{ mt: 1, fontWeight: 600 }} />}
                    </Box>
                    <Box sx={{ flex: 1, p: 2, borderRadius: 2, bgcolor: "rgba(239,68,68,0.04)" }}>
                        <Typography variant="body2" color="text.secondary" fontWeight={600}>{t("components.additionalInfo.checkOutLabel")}</Typography>
                        <Typography variant="body1" fontWeight={700}>{info.checkOutFrom} – {info.checkOutUntil}</Typography>
                    </Box>
                </Box>
            </Paper>

            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, mb: 3, border: `1px solid ${colors.border}` }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>{t("components.additionalInfo.description")}</Typography>
                <Typography variant="body1" color="text.secondary" lineHeight={1.8}>{info.description}</Typography>
            </Paper>

            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
                {info.houseRules && (
                    <Paper variant="outlined" sx={{ flex: 7, p: 3, borderRadius: 3, border: `1px solid ${colors.border}` }}>
                        <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>{t("components.additionalInfo.houseRules")}</Typography>
                        <Typography variant="body2" color="text.secondary" lineHeight={1.8}>{info.houseRules}</Typography>
                    </Paper>
                )}
                <Paper variant="outlined" sx={{ flex: 5, p: 3, borderRadius: 3, border: `1px solid ${colors.border}` }}>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>
                        <CancelIcon sx={{ mr: 1, verticalAlign: "middle", color: "primary.main" }} />
                        {t("components.additionalInfo.cancellationPolicy")}
                    </Typography>
                    <Chip label={t(`components.additionalInfo.cancellation.${c}.label`)} color={cancelColor[c]} sx={{ fontWeight: 700, fontSize: 14 }} />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5, lineHeight: 1.7 }}>
                        {t(`components.additionalInfo.cancellation.${c}.desc`)}
                    </Typography>
                </Paper>
            </Box>
        </Box>
    );
};

export default AdditionalInfoTab;