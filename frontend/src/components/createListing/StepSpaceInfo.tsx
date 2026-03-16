// components/createListing/StepSpaceInfo.tsx
import { Box, Typography, TextField } from "@mui/material";
import { MeetingRoom as RoomsIcon, AccessTime as TimeIcon, Lock as LockIcon, CheckCircle as CheckIcon } from "@mui/icons-material";
import { TimePicker }            from "@mui/x-date-pickers/TimePicker";
import { AdapterDayjs }          from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider }  from "@mui/x-date-pickers/LocalizationProvider";
import dayjs                     from "dayjs";
import { useTranslation }        from "react-i18next";
import Section                   from "./Section.tsx";
import type { FormState }        from "./types.ts";
import { colors }                from "../../theme/gradients.ts";

interface Props {
    form: FormState;
    set:  <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}

const toTime   = (s: string) => s ? dayjs(`2000-01-01T${s}`) : null;
const fromTime = (d: dayjs.Dayjs | null) => d ? d.format("HH:mm") : "";
const timePickerProps = (zIndex = 1400) => ({
    textField: { size: "small" as const, sx: { flex: 1, minWidth: 0 } },
    popper:    { sx: { zIndex } },
});

const StepSpaceInfo = ({ form, set }: Props) => {
    const { t } = useTranslation();

    const statFields = [
        { key: "rooms",       label: t("components.steps.space.rooms")       },
        { key: "bedrooms",    label: t("components.steps.space.bedrooms")    },
        { key: "bathrooms",   label: t("components.steps.space.bathrooms")   },
        { key: "beds",        label: t("components.steps.space.beds")        },
        { key: "surfaceArea", label: t("components.steps.space.surface")     },
        { key: "maxGuests",   label: t("components.steps.space.maxGuests")   },
        { key: "floor",       label: t("components.steps.space.floor")       },
        { key: "totalFloors", label: t("components.steps.space.totalFloors") },
    ];

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Section icon={<RoomsIcon sx={{ fontSize: 24 }} />}
                     title={t("createListing.steps.space.title")}
                     subtitle={t("createListing.steps.space.subtitle")}
                     step={5}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 2 }}>
                        {statFields.map((f) => (
                            <TextField key={f.key} label={f.label} type="number" size="small"
                                       value={(form as any)[f.key]}
                                       onChange={(e) => set(f.key as keyof FormState, e.target.value as any)}
                                       inputProps={{ min: 0, onWheel: (e: any) => e.currentTarget.blur() }}
                            />
                        ))}
                    </Box>

                    <Box>
                        <Typography variant="body2" fontWeight={700} color="text.secondary" sx={{ mb: 1.5 }}>
                            <TimeIcon sx={{ verticalAlign: "middle", mr: 1, fontSize: 18 }} />
                            {t("components.steps.space.checkInOut")}
                        </Typography>
                        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                            <Box sx={{ p: 2, borderRadius: 2, bgcolor: colors.primaryAlpha06, display: "flex", flexDirection: "column", gap: 1.5, overflow: "hidden" }}>
                                <Typography variant="caption" fontWeight={700} color="primary.main">Check-in</Typography>
                                <Box sx={{ display: "flex", gap: 1, minWidth: 0 }}>
                                    <TimePicker label={t("components.steps.space.from")} value={toTime(form.checkInFrom)}
                                                onChange={(d) => set("checkInFrom", fromTime(d))} slotProps={timePickerProps()} />
                                    <TimePicker label={t("components.steps.space.until")} value={toTime(form.checkInUntil)}
                                                onChange={(d) => set("checkInUntil", fromTime(d))} slotProps={timePickerProps()} />
                                </Box>
                            </Box>
                            <Box sx={{ p: 2, borderRadius: 2, bgcolor: "rgba(239,68,68,0.04)", display: "flex", flexDirection: "column", gap: 1.5, overflow: "hidden" }}>
                                <Typography variant="caption" fontWeight={700} color="error.main">Check-out</Typography>
                                <Box sx={{ display: "flex", gap: 1, minWidth: 0 }}>
                                    <TimePicker label={t("components.steps.space.from")} value={toTime(form.checkOutFrom)}
                                                onChange={(d) => set("checkOutFrom", fromTime(d))} slotProps={timePickerProps()} />
                                    <TimePicker label={t("components.steps.space.until")} value={toTime(form.checkOutUntil)}
                                                onChange={(d) => set("checkOutUntil", fromTime(d))} slotProps={timePickerProps()} />
                                </Box>
                            </Box>
                        </Box>

                        <Box onClick={() => set("selfCheckIn", !form.selfCheckIn)} sx={{
                            mt: 2, display: "flex", alignItems: "center", gap: 1.5, p: 2, borderRadius: 2, cursor: "pointer",
                            border: `1px solid ${form.selfCheckIn ? colors.primaryDark : colors.border}`,
                            bgcolor: form.selfCheckIn ? colors.primaryAlpha10 : "transparent",
                            transition: "all 0.15s ease", "&:hover": { borderColor: colors.primaryDark },
                        }}>
                            <LockIcon sx={{ color: form.selfCheckIn ? colors.primaryDark : colors.textSecondary, fontSize: 20 }} />
                            <Box>
                                <Typography variant="body2" fontWeight={700} sx={{ color: form.selfCheckIn ? colors.primaryDark : "text.primary" }}>
                                    {t("components.steps.space.selfCheckin")}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {t("components.steps.space.selfCheckinDesc")}
                                </Typography>
                            </Box>
                            {form.selfCheckIn && <CheckIcon sx={{ ml: "auto", color: colors.primaryDark, fontSize: 18 }} />}
                        </Box>
                    </Box>
                </Box>
            </Section>
        </LocalizationProvider>
    );
};

export default StepSpaceInfo;