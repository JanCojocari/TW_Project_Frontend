// components/apartmentDetail/AdditionaInfoTab.tsx
import { Box, Typography, Chip, Divider } from "@mui/material";
import {
    MeetingRoom as RoomsIcon, SquareFoot as AreaIcon,
    Groups as GuestsIcon, AccessTime as TimeIcon,
    Cancel as CancelIcon, BedOutlined as BedIcon,
    BathtubOutlined as BathIcon, Layers as FloorIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { colors } from "../../theme/gradients.ts";
import type { AdditionalInfo } from "../../types/apartment.types";

type CancelKey = "flexible" | "moderate" | "strict";
const cancelColor: Record<CancelKey, "success" | "warning" | "error"> = {
    flexible: "success", moderate: "warning", strict: "error",
};

// ── Stat card: large number + small label ─────────────────────────────────────
const StatCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) => (
    <Box sx={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", gap: 0.5,
        p: 2.5, borderRadius: "14px",
        border: `1px solid ${colors.border}`,
        bgcolor: "background.paper",
        transition: "border-color 0.18s ease, box-shadow 0.18s ease",
        "&:hover": {
            borderColor: colors.primary,
            boxShadow: `0 4px 14px ${colors.primaryAlpha10}`,
        },
        minHeight: 100,
    }}>
        <Box sx={{ color: colors.primary, "& svg": { fontSize: 20 }, mb: 0.5 }}>
            {icon}
        </Box>
        <Typography variant="h5" fontWeight={800} color="primary.main" lineHeight={1}>
            {value}
        </Typography>
        <Typography variant="caption" color="text.secondary" fontWeight={500} textAlign="center" lineHeight={1.3}>
            {label}
        </Typography>
    </Box>
);

// ── Section header ────────────────────────────────────────────────────────────
const SectionHeader = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
        <Box sx={{ color: "primary.main", display: "flex", alignItems: "center", "& svg": { fontSize: 20 } }}>
            {icon}
        </Box>
        <Typography variant="subtitle1" fontWeight={700}>{title}</Typography>
    </Box>
);

// ── AdditionalInfoTab ─────────────────────────────────────────────────────────
const AdditionalInfoTab = ({ info }: { info: AdditionalInfo }) => {
    const { t } = useTranslation();
    const c = info.cancellationPolicy as CancelKey;

    const stats = [
        { icon: <RoomsIcon />, label: t("components.additionalInfo.rooms"),    value: info.rooms },
        { icon: <BedIcon />,   label: t("components.additionalInfo.bedrooms"), value: info.bedrooms },
        { icon: <BathIcon />,  label: t("components.additionalInfo.bathrooms"),value: info.bathrooms },
        { icon: <BedIcon />,   label: t("components.additionalInfo.beds"),     value: info.beds },
        { icon: <AreaIcon />,  label: t("components.additionalInfo.surface"),  value: `${info.surfaceArea} m²` },
        { icon: <GuestsIcon />,label: t("components.additionalInfo.maxGuests"),value: info.maxGuests },
        { icon: <FloorIcon />, label: t("components.additionalInfo.floor"),    value: `${info.floor}/${info.totalFloors}` },
    ];

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3.5 }}>
            {/* ── Stats grid — 7 coloane egale, 100% latime ──────────── */}
            <Box sx={{ display: "grid", gridTemplateColumns: `repeat(${stats.length}, 1fr)`, gap: 1.5 }}>
                {stats.map((s) => (
                    <StatCard key={s.label} icon={s.icon} label={s.label} value={s.value} />
                ))}
            </Box>

            {/* ── Check-in/out ────────────────────────────────────────── */}
            <Box>
                <SectionHeader icon={<TimeIcon />} title={t("components.additionalInfo.checkin")} />
                <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 1.5 }}>
                    <Box sx={{
                        flex: 1, p: 2, borderRadius: "12px",
                        bgcolor: colors.primaryAlpha06,
                        border: `1px solid ${colors.border}`,
                    }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: "block", mb: 0.5 }}>
                            {t("components.additionalInfo.checkInLabel")}
                        </Typography>
                        <Typography variant="body1" fontWeight={700}>
                            {info.checkInFrom} – {info.checkInUntil}
                        </Typography>
                        {info.selfCheckIn && (
                            <Chip
                                label={t("components.additionalInfo.selfCheckin")}
                                size="small" color="success"
                                sx={{ mt: 1, fontWeight: 600, borderRadius: "6px" }}
                            />
                        )}
                    </Box>
                    <Box sx={{
                        flex: 1, p: 2, borderRadius: "12px",
                        bgcolor: "rgba(239,68,68,0.04)",
                        border: `1px solid ${colors.border}`,
                    }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: "block", mb: 0.5 }}>
                            {t("components.additionalInfo.checkOutLabel")}
                        </Typography>
                        <Typography variant="body1" fontWeight={700}>
                            {info.checkOutFrom} – {info.checkOutUntil}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Divider />

            {/* ── Description ─────────────────────────────────────────── */}
            <Box sx={{
                p: 2.5, borderRadius: "14px",
                border: `1px solid ${colors.border}`,
                bgcolor: "background.paper",
            }}>
                <SectionHeader icon={<RoomsIcon />} title={t("components.additionalInfo.description")} />
                <Typography variant="body1" color="text.secondary" lineHeight={1.85}>
                    {info.description}
                </Typography>
            </Box>

            {/* ── House Rules + Cancellation — ambele in box-uri egale ── */}
            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2.5, alignItems: "stretch" }}>
                {info.houseRules && (
                    <Box sx={{
                        flex: 1, p: 2.5, borderRadius: "14px",
                        border: `1px solid ${colors.border}`,
                        bgcolor: "background.paper",
                    }}>
                        <SectionHeader icon={<RoomsIcon />} title={t("components.additionalInfo.houseRules")} />
                        <Typography variant="body2" color="text.secondary" lineHeight={1.8}>
                            {info.houseRules}
                        </Typography>
                    </Box>
                )}

                {/* Daca nu exista houseRules, Cancellation ocupa toata latimea */}
                <Box sx={{
                    flex: 1, p: 2.5, borderRadius: "14px",
                    border: `1px solid ${colors.border}`,
                    bgcolor: "background.paper",
                }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                        <CancelIcon sx={{ fontSize: 18, color: "primary.main" }} />
                        <Typography variant="subtitle2" fontWeight={700}>
                            {t("components.additionalInfo.cancellationPolicy")}
                        </Typography>
                    </Box>
                    <Chip
                        label={t(`components.additionalInfo.cancellation.${c}.label`)}
                        color={cancelColor[c]}
                        sx={{ fontWeight: 700, fontSize: 13, borderRadius: "8px", mb: 1.5 }}
                    />
                    <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
                        {t(`components.additionalInfo.cancellation.${c}.desc`)}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default AdditionalInfoTab;