import { Box, Paper, Typography, Chip } from "@mui/material";
import { MeetingRoom as RoomsIcon, SquareFoot as AreaIcon, Groups as GuestsIcon, AccessTime as TimeIcon, Cancel as CancelIcon } from "@mui/icons-material";
import { colors } from "../../theme/gradients.ts";
import type { AdditionalInfo } from "../../types/apartment.types";

const cancellationLabels: Record<string, { label: string; color: "success" | "warning" | "error" }> = {
    flexible: { label: "Flexibilă", color: "success" },
    moderate: { label: "Moderată",  color: "warning" },
    strict:   { label: "Strictă",   color: "error" },
};

const AdditionalInfoTab = ({ info }: { info: AdditionalInfo }) => {
    const stats = [
        { icon: <RoomsIcon />,  label: "Camere",       value: info.rooms },
        { icon: <RoomsIcon />,  label: "Dormitoare",   value: info.bedrooms },
        { icon: <RoomsIcon />,  label: "Băi",          value: info.bathrooms },
        { icon: <RoomsIcon />,  label: "Paturi",       value: info.beds },
        { icon: <AreaIcon />,   label: "Suprafață",    value: `${info.surfaceArea} m²` },
        { icon: <GuestsIcon />, label: "Max. Oaspeți", value: info.maxGuests },
        { icon: <RoomsIcon />,  label: "Etaj",         value: `${info.floor} / ${info.totalFloors}` },
    ];
    const cancellation = cancellationLabels[info.cancellationPolicy];

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
                    <TimeIcon sx={{ mr: 1, verticalAlign: "middle", color: "primary.main" }} /> Check-in & Check-out
                </Typography>
                <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
                    <Box sx={{ flex: 1, p: 2, borderRadius: 2, bgcolor: colors.primaryAlpha06 }}>
                        <Typography variant="body2" color="text.secondary" fontWeight={600}>Check-in</Typography>
                        <Typography variant="body1" fontWeight={700}>{info.checkInFrom} – {info.checkInUntil}</Typography>
                        {info.selfCheckIn && <Chip label="Self check-in disponibil" size="small" color="success" sx={{ mt: 1, fontWeight: 600 }} />}
                    </Box>
                    <Box sx={{ flex: 1, p: 2, borderRadius: 2, bgcolor: "rgba(239,68,68,0.04)" }}>
                        <Typography variant="body2" color="text.secondary" fontWeight={600}>Check-out</Typography>
                        <Typography variant="body1" fontWeight={700}>{info.checkOutFrom} – {info.checkOutUntil}</Typography>
                    </Box>
                </Box>
            </Paper>

            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, mb: 3, border: `1px solid ${colors.border}` }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>Descriere</Typography>
                <Typography variant="body1" color="text.secondary" lineHeight={1.8}>{info.description}</Typography>
            </Paper>

            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
                {info.houseRules && (
                    <Paper variant="outlined" sx={{ flex: 7, p: 3, borderRadius: 3, border: `1px solid ${colors.border}` }}>
                        <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>Regulile casei</Typography>
                        <Typography variant="body2" color="text.secondary" lineHeight={1.8}>{info.houseRules}</Typography>
                    </Paper>
                )}
                <Paper variant="outlined" sx={{ flex: 5, p: 3, borderRadius: 3, border: `1px solid ${colors.border}` }}>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>
                        <CancelIcon sx={{ mr: 1, verticalAlign: "middle", color: "primary.main" }} /> Politică anulare
                    </Typography>
                    <Chip label={cancellation.label} color={cancellation.color} sx={{ fontWeight: 700, fontSize: 14 }} />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5, lineHeight: 1.7 }}>
                        {info.cancellationPolicy === "flexible" && "Rambursare integrală dacă anulați cu cel puțin 24h înainte."}
                        {info.cancellationPolicy === "moderate" && "Rambursare 50% dacă anulați cu cel puțin 5 zile înainte."}
                        {info.cancellationPolicy === "strict"   && "Fără rambursare după confirmarea rezervării."}
                    </Typography>
                </Paper>
            </Box>
        </Box>
    );
};

export default AdditionalInfoTab;