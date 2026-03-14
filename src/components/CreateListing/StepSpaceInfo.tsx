import { Box, TextField, Typography } from "@mui/material";
import {
    MeetingRoom as RoomsIcon, SquareFoot as AreaIcon,
    Groups as GuestsIcon, AccessTime as TimeIcon, Lock as LockIcon,
    CheckCircle as CheckIcon,
} from "@mui/icons-material";
import Section from "./Section.tsx";
import type { FormState } from "./types.ts";
import { colors } from "../../theme/gradients.ts";

interface Props {
    form: FormState;
    set: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}

const statFields = [
    { key: "rooms",       label: "Nr. camere",     icon: <RoomsIcon /> },
    { key: "bedrooms",    label: "Dormitoare",      icon: <RoomsIcon /> },
    { key: "bathrooms",   label: "Băi",             icon: <RoomsIcon /> },
    { key: "beds",        label: "Paturi",          icon: <RoomsIcon /> },
    { key: "surfaceArea", label: "Suprafață (m²)",  icon: <AreaIcon /> },
    { key: "maxGuests",   label: "Max. oaspeți",    icon: <GuestsIcon /> },
    { key: "floor",       label: "Etaj",            icon: <RoomsIcon /> },
    { key: "totalFloors", label: "Total etaje",     icon: <RoomsIcon /> },
];

const StepSpaceInfo = ({ form, set }: Props) => (
    <Section icon={<RoomsIcon sx={{ fontSize: 24 }} />} title="Informații despre spațiu" step={5}
             subtitle="Camere, suprafață, capacitate oaspeți">
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>

            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 2 }}>
                {statFields.map(f => (
                    <TextField key={f.key} label={f.label} type="number" size="small"
                               value={(form as any)[f.key]}
                               onChange={e => set(f.key as keyof FormState, e.target.value as any)}
                               inputProps={{ min: 0 }} />
                ))}
            </Box>

            <Box>
                <Typography variant="body2" fontWeight={700} color="text.secondary" sx={{ mb: 1.5 }}>
                    <TimeIcon sx={{ verticalAlign: "middle", mr: 1, fontSize: 18 }} />
                    Check-in & Check-out
                </Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                    <Box sx={{ p: 2, borderRadius: 2, bgcolor: colors.primaryAlpha06, display: "flex", flexDirection: "column", gap: 1.5 }}>
                        <Typography variant="caption" fontWeight={700} color="primary.main">Check-in</Typography>
                        <Box sx={{ display: "flex", gap: 1 }}>
                            <TextField size="small" label="De la" type="time" value={form.checkInFrom}
                                       onChange={e => set("checkInFrom", e.target.value)} InputLabelProps={{ shrink: true }} sx={{ flex: 1 }} />
                            <TextField size="small" label="Până la" type="time" value={form.checkInUntil}
                                       onChange={e => set("checkInUntil", e.target.value)} InputLabelProps={{ shrink: true }} sx={{ flex: 1 }} />
                        </Box>
                    </Box>
                    <Box sx={{ p: 2, borderRadius: 2, bgcolor: "rgba(239,68,68,0.04)", display: "flex", flexDirection: "column", gap: 1.5 }}>
                        <Typography variant="caption" fontWeight={700} color="error.main">Check-out</Typography>
                        <Box sx={{ display: "flex", gap: 1 }}>
                            <TextField size="small" label="De la" type="time" value={form.checkOutFrom}
                                       onChange={e => set("checkOutFrom", e.target.value)} InputLabelProps={{ shrink: true }} sx={{ flex: 1 }} />
                            <TextField size="small" label="Până la" type="time" value={form.checkOutUntil}
                                       onChange={e => set("checkOutUntil", e.target.value)} InputLabelProps={{ shrink: true }} sx={{ flex: 1 }} />
                        </Box>
                    </Box>
                </Box>

                <Box onClick={() => set("selfCheckIn", !form.selfCheckIn)} sx={{
                    mt: 2, display: "flex", alignItems: "center", gap: 1.5,
                    p: 2, borderRadius: 2, cursor: "pointer",
                    border: `1px solid ${form.selfCheckIn ? colors.primaryDark : colors.border}`,
                    bgcolor: form.selfCheckIn ? colors.primaryAlpha10 : "transparent",
                    transition: "all 0.15s ease", "&:hover": { borderColor: colors.primaryDark },
                }}>
                    <LockIcon sx={{ color: form.selfCheckIn ? colors.primaryDark : colors.textSecondary, fontSize: 20 }} />
                    <Box>
                        <Typography variant="body2" fontWeight={700} sx={{ color: form.selfCheckIn ? colors.primaryDark : "text.primary" }}>
                            Self check-in disponibil
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Oaspeții pot intra fără prezența proprietarului
                        </Typography>
                    </Box>
                    {form.selfCheckIn && <CheckIcon sx={{ ml: "auto", color: colors.primaryDark, fontSize: 18 }} />}
                </Box>
            </Box>
        </Box>
    </Section>
);

export default StepSpaceInfo;