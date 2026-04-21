// src/components/createListing/StepSpaceInfo.tsx
import { memo }              from "react";
import React                 from "react";
import { Box, Typography, IconButton } from "@mui/material";
import {
    MeetingRoom as RoomsIcon,
    AccessTime as TimeIcon,
    Lock as LockIcon,
    CheckCircle as CheckIcon,
    Add as AddIcon,
    Remove as RemoveIcon,
    Person as PersonIcon,
} from "@mui/icons-material";
import { TimePicker }            from "@mui/x-date-pickers/TimePicker";
import { AdapterDayjs }          from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider }  from "@mui/x-date-pickers/LocalizationProvider";
import dayjs                     from "dayjs";
import { useTranslation }        from "react-i18next";
import Section                   from "./Section.tsx";
import DebouncedTextField        from "../common/DebouncedTextField.tsx";
import type { FormState, Errors }        from "../../types/CreateListingTypes.ts";
import { colors }                from "../../theme/gradients.ts";

interface Props {
    rooms:         string;
    bedrooms:      string;
    bathrooms:     string;
    beds:          string;
    surfaceArea:   string;
    maxGuests:     string;
    floor:         string;
    totalFloors:   string;
    checkInFrom:   string;
    checkInUntil:  string;
    checkOutFrom:  string;
    checkOutUntil: string;
    selfCheckIn:   boolean;
    errors:        Errors;
    set:           <K extends keyof FormState>(key: K, value: FormState[K]) => void;
    clearError:    (key: string) => void;
}

const toTime   = (s: string) => s ? dayjs(`2000-01-01T${s}`) : null;
const fromTime = (d: dayjs.Dayjs | null) => d ? d.format("HH:mm") : "";
const timePickerProps = (zIndex = 1400) => ({
    textField: { size: "small" as const, sx: { flex: 1, minWidth: 0 } },
    popper:    { sx: { zIndex } },
});

/* ── Stepper control ─────────────────────────────────────────────────── */
function Stepper({
                     label, value, onChange, min = 0, error = false,
                 }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    min?: number;
    error?: boolean;
}) {
    const num = parseInt(value, 10) || 0;
    const dec = () => onChange(String(Math.max(min, num - 1)));
    const inc = () => onChange(String(num + 1));

    return (
        <Box sx={{
            display: "flex", flexDirection: "column", alignItems: "center",
            p: 2, borderRadius: 3,
            border: `1px solid ${error ? "#d32f2f" : colors.border}`,
            bgcolor: error ? "rgba(211,47,47,0.04)" : "background.paper",
            gap: 1,
            transition: "border-color 0.15s",
            "&:hover": { borderColor: error ? "#d32f2f" : colors.primaryDark },
        }}>
            <Typography variant="caption" fontWeight={700} color="text.secondary"
                        sx={{ textTransform: "uppercase", letterSpacing: 0.8, textAlign: "center", lineHeight: 1.2 }}>
                {label}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <IconButton
                    size="small"
                    onClick={dec}
                    disabled={num <= min}
                    sx={{
                        width: 28, height: 28,
                        bgcolor: colors.primaryAlpha10,
                        color: colors.primaryDark,
                        border: `1px solid ${colors.primaryAlpha25}`,
                        "&:hover": { bgcolor: colors.primaryAlpha25 },
                        "&.Mui-disabled": { opacity: 0.3 },
                    }}
                >
                    <RemoveIcon sx={{ fontSize: 14 }} />
                </IconButton>
                <Typography sx={{ fontSize: 20, fontWeight: 800, color: "text.primary", minWidth: 28, textAlign: "center" }}>
                    {num}
                </Typography>
                <IconButton
                    size="small"
                    onClick={inc}
                    sx={{
                        width: 28, height: 28,
                        bgcolor: colors.primaryAlpha10,
                        color: colors.primaryDark,
                        border: `1px solid ${colors.primaryAlpha25}`,
                        "&:hover": { bgcolor: colors.primaryAlpha25 },
                    }}
                >
                    <AddIcon sx={{ fontSize: 14 }} />
                </IconButton>
            </Box>
        </Box>
    );
}

/* ── MaxGuests — visual person indicator ─────────────────────────────── */
function MaxGuestsControl({ value, onChange, error = false }: { value: string; onChange: (v: string) => void; error?: boolean }) {
    const { t } = useTranslation();
    const num = parseInt(value, 10) || 0;
    const MAX_ICONS = 10;
    const shown = Math.min(num, MAX_ICONS);

    return (
        <Box sx={{
            p: 2.5, borderRadius: 3,
            border: `1px solid ${error ? "#d32f2f" : colors.border}`,
            bgcolor: error ? "rgba(211,47,47,0.04)" : "background.paper",
        }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                <Typography variant="caption" fontWeight={700} color="text.secondary"
                            sx={{ textTransform: "uppercase", letterSpacing: 0.8 }}>
                    {t("components.steps.space.maxGuests")}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <IconButton size="small" onClick={() => onChange(String(Math.max(0, num - 1)))}
                                disabled={num <= 0}
                                sx={{ width: 26, height: 26, bgcolor: colors.primaryAlpha10, color: colors.primaryDark, "&.Mui-disabled": { opacity: 0.3 } }}>
                        <RemoveIcon sx={{ fontSize: 13 }} />
                    </IconButton>
                    <Typography sx={{ fontWeight: 800, fontSize: 18, minWidth: 24, textAlign: "center" }}>{num}</Typography>
                    <IconButton size="small" onClick={() => onChange(String(num + 1))}
                                sx={{ width: 26, height: 26, bgcolor: colors.primaryAlpha10, color: colors.primaryDark }}>
                        <AddIcon sx={{ fontSize: 13 }} />
                    </IconButton>
                </Box>
            </Box>
            {/* Person icons */}
            <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                {Array.from({ length: MAX_ICONS }).map((_, i) => (
                    <PersonIcon
                        key={i}
                        sx={{
                            fontSize: 20,
                            color: i < shown ? colors.primaryDark : colors.border,
                            transition: "color 0.15s",
                        }}
                    />
                ))}
                {num > MAX_ICONS && (
                    <Typography variant="caption" color="text.secondary" sx={{ alignSelf: "center", ml: 0.5 }}>
                        +{num - MAX_ICONS}
                    </Typography>
                )}
            </Box>
        </Box>
    );
}

const icon = <RoomsIcon sx={{ fontSize: 24 }} />;

const StepSpaceInfo = memo(({
                                rooms, bedrooms, bathrooms, beds, surfaceArea,
                                maxGuests, floor, totalFloors,
                                checkInFrom, checkInUntil, checkOutFrom, checkOutUntil,
                                selfCheckIn, errors, set, clearError,
                            }: Props) => {
    const { t } = useTranslation();

    const steppers: { key: keyof FormState; label: string }[] = [
        { key: "rooms",       label: t("components.steps.space.rooms")       },
        { key: "bedrooms",    label: t("components.steps.space.bedrooms")    },
        { key: "bathrooms",   label: t("components.steps.space.bathrooms")   },
        { key: "beds",        label: t("components.steps.space.beds")        },
        { key: "floor",       label: t("components.steps.space.floor")       },
        { key: "totalFloors", label: t("components.steps.space.totalFloors") },
    ];

    const values: Record<string, string> = {
        rooms, bedrooms, bathrooms, beds, floor, totalFloors,
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Section
                icon={icon}
                title={t("createListing.steps.space.title")}
                subtitle={t("createListing.steps.space.subtitle")}
                step={5}
            >
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>

                    {/* Stepper grid */}
                    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 2 }}>
                        {steppers.map(f => (
                            <Stepper
                                key={f.key}
                                label={f.label}
                                value={values[f.key]}
                                onChange={(v) => { set(f.key, v as FormState[typeof f.key]); clearError(f.key); }}
                                error={!!errors[f.key]}
                            />
                        ))}
                    </Box>

                    {/* Surface area — plain input */}
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2, alignItems: "stretch" }}>
                        {/* Surface */}
                        <Box sx={{
                            p: 2.5, borderRadius: 3,
                            border: `1px solid ${errors.surfaceArea ? "#d32f2f" : colors.border}`,
                            bgcolor: errors.surfaceArea ? "rgba(211,47,47,0.04)" : "background.paper",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                        }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                                <Typography variant="caption" fontWeight={700} color="text.secondary"
                                            sx={{ textTransform: "uppercase", letterSpacing: 0.8 }}>
                                    {t("components.steps.space.surface")}
                                </Typography>
                            </Box>
                            <DebouncedTextField
                                type="number"
                                value={surfaceArea}
                                onChange={(v) => { set("surfaceArea", v as FormState["surfaceArea"]); clearError("surfaceArea"); }}
                                inputProps={{ min: 0, onWheel: (e: React.WheelEvent<HTMLInputElement>) => e.currentTarget.blur() }}
                                fullWidth
                                variant="standard"
                                InputProps={{ disableUnderline: true }}
                                sx={{
                                    "& input": {
                                        fontSize: 28,
                                        fontWeight: 800,
                                        textAlign: "center",
                                        color: "text.primary",
                                        p: 0,
                                    },
                                }}
                            />
                        </Box>

                        {/* Max guests */}
                        <MaxGuestsControl
                            value={maxGuests}
                            onChange={(v) => { set("maxGuests", v as FormState["maxGuests"]); clearError("maxGuests"); }}
                            error={!!errors.maxGuests}
                        />
                    </Box>

                    {/* Check-in / Check-out */}
                    <Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                            <TimeIcon sx={{ fontSize: 16, color: colors.primaryDark }} />
                            <Typography variant="caption" fontWeight={700} color="text.secondary"
                                        sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
                                {t("components.steps.space.checkInOut")}
                            </Typography>
                        </Box>
                        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                            <Box sx={{ p: 2, borderRadius: 2.5, bgcolor: colors.primaryAlpha06, border: `1px solid ${(errors.checkInFrom || errors.checkInUntil) ? "#d32f2f" : colors.primaryAlpha25}`, display: "flex", flexDirection: "column", gap: 1.5, overflow: "hidden" }}>
                                <Typography variant="caption" fontWeight={700} color="primary.main">Check-in</Typography>
                                <Box sx={{ display: "flex", gap: 1, minWidth: 0 }}>
                                    <TimePicker
                                        label={t("components.steps.space.from")}
                                        value={toTime(checkInFrom)}
                                        onChange={(d) => { set("checkInFrom", fromTime(d) as FormState["checkInFrom"]); clearError("checkInFrom"); }}
                                        slotProps={timePickerProps()}
                                    />
                                    <TimePicker
                                        label={t("components.steps.space.until")}
                                        value={toTime(checkInUntil)}
                                        onChange={(d) => { set("checkInUntil", fromTime(d) as FormState["checkInUntil"]); clearError("checkInUntil"); }}
                                        slotProps={timePickerProps()}
                                    />
                                </Box>
                            </Box>
                            <Box sx={{ p: 2, borderRadius: 2.5, bgcolor: "rgba(239,68,68,0.04)", border: `1px solid ${(errors.checkOutFrom || errors.checkOutUntil) ? "#d32f2f" : "rgba(239,68,68,0.15)"}`, display: "flex", flexDirection: "column", gap: 1.5, overflow: "hidden" }}>
                                <Typography variant="caption" fontWeight={700} color="error.main">Check-out</Typography>
                                <Box sx={{ display: "flex", gap: 1, minWidth: 0 }}>
                                    <TimePicker
                                        label={t("components.steps.space.from")}
                                        value={toTime(checkOutFrom)}
                                        onChange={(d) => { set("checkOutFrom", fromTime(d) as FormState["checkOutFrom"]); clearError("checkOutFrom"); }}
                                        slotProps={timePickerProps()}
                                    />
                                    <TimePicker
                                        label={t("components.steps.space.until")}
                                        value={toTime(checkOutUntil)}
                                        onChange={(d) => { set("checkOutUntil", fromTime(d) as FormState["checkOutUntil"]); clearError("checkOutUntil"); }}
                                        slotProps={timePickerProps()}
                                    />
                                </Box>
                            </Box>
                        </Box>

                        {/* Self check-in toggle */}
                        <Box
                            onClick={() => set("selfCheckIn", !selfCheckIn as FormState["selfCheckIn"])}
                            sx={{
                                mt: 2, display: "flex", alignItems: "center", gap: 2,
                                p: 2, borderRadius: 2.5, cursor: "pointer",
                                border: `1px solid ${selfCheckIn ? colors.primaryDark : colors.border}`,
                                bgcolor: selfCheckIn ? colors.primaryAlpha10 : "transparent",
                                transition: "all 0.15s ease",
                                "&:hover": { borderColor: colors.primaryDark, bgcolor: colors.primaryAlpha06 },
                            }}
                        >
                            <LockIcon sx={{ color: selfCheckIn ? colors.primaryDark : "text.disabled", fontSize: 22 }} />
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" fontWeight={700} sx={{ color: selfCheckIn ? colors.primaryDark : "text.primary" }}>
                                    {t("components.steps.space.selfCheckin")}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {t("components.steps.space.selfCheckinDesc")}
                                </Typography>
                            </Box>
                            {selfCheckIn && <CheckIcon sx={{ color: colors.primaryDark, fontSize: 20 }} />}
                        </Box>
                    </Box>
                </Box>
            </Section>
        </LocalizationProvider>
    );
});

StepSpaceInfo.displayName = "StepSpaceInfo";
export default StepSpaceInfo;