// components/CreateListing/StepSpaceInfo.tsx
import { Box, Typography } from "@mui/material";
import {
    MeetingRoom as RoomsIcon, SquareFoot as AreaIcon,
    Groups as GuestsIcon, AccessTime as TimeIcon, Lock as LockIcon,
    CheckCircle as CheckIcon,
} from "@mui/icons-material";
import { TimePicker }           from "@mui/x-date-pickers/TimePicker";
import { AdapterDayjs }         from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs                    from "dayjs";
import { TextField }            from "@mui/material";
import Section                  from "./Section.tsx";
import type { FormState }       from "./types.ts";
import { colors }               from "../../theme/gradients.ts";

interface Props {
    form: FormState;
    set:  <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}

const statFields = [
    { key: "rooms",       label: "Nr. camere"    },
    { key: "bedrooms",    label: "Dormitoare"    },
    { key: "bathrooms",   label: "Băi"           },
    { key: "beds",        label: "Paturi"        },
    { key: "surfaceArea", label: "Suprafață (m²)"},
    { key: "maxGuests",   label: "Max. oaspeți"  },
    { key: "floor",       label: "Etaj"          },
    { key: "totalFloors", label: "Total etaje"   },
];

// Convertire HH:mm string ↔ Dayjs
const toTime  = (s: string) => s ? dayjs(`2000-01-01T${s}`) : null;
const fromTime = (d: dayjs.Dayjs | null) => d ? d.format("HH:mm") : "";

const timePickerProps = (zIndex = 1400) => ({
    textField: { size: "small" as const, sx: { flex: 1, minWidth: 0 } },
    popper:    { sx: { zIndex } },
});

const StepSpaceInfo = ({ form, set }: Props) => (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Section icon={<RoomsIcon sx={{ fontSize: 24 }} />} title="Informații despre spațiu" step={5}
                 subtitle="Camere, suprafață, capacitate oaspeți">
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>

                {/* Câmpuri numerice */}
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 2 }}>
                    {statFields.map((f) => (
                        <TextField key={f.key} label={f.label} type="number" size="small"
                                   value={(form as any)[f.key]}
                                   onChange={(e) => set(f.key as keyof FormState, e.target.value as any)}
                                   inputProps={{ min: 0 }}
                        />
                    ))}
                </Box>

                {/* Check-in & Check-out cu TimePicker */}
                <Box>
                    <Typography variant="body2" fontWeight={700} color="text.secondary" sx={{ mb: 1.5 }}>
                        <TimeIcon sx={{ verticalAlign: "middle", mr: 1, fontSize: 18 }} />
                        Check-in & Check-out
                    </Typography>
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                        <Box sx={{ p: 2, borderRadius: 2, bgcolor: colors.primaryAlpha06, display: "flex", flexDirection: "column", gap: 1.5, overflow: "hidden" }}>
                            <Typography variant="caption" fontWeight={700} color="primary.main">Check-in</Typography>
                            <Box sx={{ display: "flex", gap: 1, minWidth: 0 }}>
                                <TimePicker label="De la" value={toTime(form.checkInFrom)}
                                            onChange={(d) => set("checkInFrom", fromTime(d))}
                                            slotProps={timePickerProps()} />
                                <TimePicker label="Până la" value={toTime(form.checkInUntil)}
                                            onChange={(d) => set("checkInUntil", fromTime(d))}
                                            slotProps={timePickerProps()} />
                            </Box>
                        </Box>
                        <Box sx={{ p: 2, borderRadius: 2, bgcolor: "rgba(239,68,68,0.04)", display: "flex", flexDirection: "column", gap: 1.5, overflow: "hidden" }}>
                            <Typography variant="caption" fontWeight={700} color="error.main">Check-out</Typography>
                            <Box sx={{ display: "flex", gap: 1, minWidth: 0 }}>
                                <TimePicker label="De la" value={toTime(form.checkOutFrom)}
                                            onChange={(d) => set("checkOutFrom", fromTime(d))}
                                            slotProps={timePickerProps()} />
                                <TimePicker label="Până la" value={toTime(form.checkOutUntil)}
                                            onChange={(d) => set("checkOutUntil", fromTime(d))}
                                            slotProps={timePickerProps()} />
                            </Box>
                        </Box>
                    </Box>

                    {/* Self check-in toggle */}
                    <Box onClick={() => set("selfCheckIn", !form.selfCheckIn)} sx={{
                        mt: 2, display: "flex", alignItems: "center", gap: 1.5,
                        p: 2, borderRadius: 2, cursor: "pointer",
                        border: `1px solid ${form.selfCheckIn ? colors.primaryDark : colors.border}`,
                        bgcolor: form.selfCheckIn ? colors.primaryAlpha10 : "transparent",
                        transition: "all 0.15s ease",
                        "&:hover": { borderColor: colors.primaryDark },
                    }}>
                        <LockIcon sx={{ color: form.selfCheckIn ? colors.primaryDark : colors.textSecondary, fontSize: 20 }} />
                        <Box>
                            <Typography variant="body2" fontWeight={700}
                                        sx={{ color: form.selfCheckIn ? colors.primaryDark : "text.primary" }}>
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
    </LocalizationProvider>
);

export default StepSpaceInfo;