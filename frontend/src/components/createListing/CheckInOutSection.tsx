// components/createListing/CheckInOutSection.tsx
import { Box, Typography } from "@mui/material";
import { AccessTime as TimeIcon, Lock as LockIcon, CheckCircle as CheckIcon } from "@mui/icons-material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { colors } from "../../theme/gradients";
import type { FormState, Errors } from "../../types/CreateListingTypes";

const toTime   = (s: string) => s ? dayjs(`2000-01-01T${s}`) : null;
const fromTime = (d: dayjs.Dayjs | null) => d ? d.format("HH:mm") : "";
const slotProps = (zIndex = 1400) => ({
    textField: { size: "small" as const, sx: { flex: 1, minWidth: 0 } },
    popper:    { sx: { zIndex } },
});

interface Props {
    checkInFrom:   string;
    checkInUntil:  string;
    checkOutFrom:  string;
    checkOutUntil: string;
    selfCheckIn:   boolean;
    errors:        Errors;
    set:           <K extends keyof FormState>(key: K, value: FormState[K]) => void;
    clearError:    (key: string) => void;
}

export default function CheckInOutSection({
    checkInFrom, checkInUntil, checkOutFrom, checkOutUntil,
    selfCheckIn, errors, set, clearError,
}: Props) {
    const { t } = useTranslation();

    return (
        <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <TimeIcon sx={{ fontSize: 16, color: colors.primaryDark }} />
                <Typography variant="caption" fontWeight={700} color="text.secondary"
                            sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
                    {t("components.steps.space.checkInOut")}
                </Typography>
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                {/* Check-in */}
                <Box sx={{ p: 2, borderRadius: 2.5, bgcolor: colors.primaryAlpha06, border: `1px solid ${(errors.checkInFrom || errors.checkInUntil) ? "#d32f2f" : colors.primaryAlpha25}`, display: "flex", flexDirection: "column", gap: 1.5, overflow: "hidden" }}>
                    <Typography variant="caption" fontWeight={700} color="primary.main">Check-in</Typography>
                    <Box sx={{ display: "flex", gap: 1, minWidth: 0 }}>
                        <TimePicker
                            label={t("components.steps.space.from")}
                            value={toTime(checkInFrom)}
                            onChange={d => { set("checkInFrom", fromTime(d) as FormState["checkInFrom"]); clearError("checkInFrom"); }}
                            slotProps={slotProps()}
                        />
                        <TimePicker
                            label={t("components.steps.space.until")}
                            value={toTime(checkInUntil)}
                            onChange={d => { set("checkInUntil", fromTime(d) as FormState["checkInUntil"]); clearError("checkInUntil"); }}
                            slotProps={slotProps()}
                        />
                    </Box>
                </Box>

                {/* Check-out */}
                <Box sx={{ p: 2, borderRadius: 2.5, bgcolor: "rgba(239,68,68,0.04)", border: `1px solid ${(errors.checkOutFrom || errors.checkOutUntil) ? "#d32f2f" : "rgba(239,68,68,0.15)"}`, display: "flex", flexDirection: "column", gap: 1.5, overflow: "hidden" }}>
                    <Typography variant="caption" fontWeight={700} color="error.main">Check-out</Typography>
                    <Box sx={{ display: "flex", gap: 1, minWidth: 0 }}>
                        <TimePicker
                            label={t("components.steps.space.from")}
                            value={toTime(checkOutFrom)}
                            onChange={d => { set("checkOutFrom", fromTime(d) as FormState["checkOutFrom"]); clearError("checkOutFrom"); }}
                            slotProps={slotProps()}
                        />
                        <TimePicker
                            label={t("components.steps.space.until")}
                            value={toTime(checkOutUntil)}
                            onChange={d => { set("checkOutUntil", fromTime(d) as FormState["checkOutUntil"]); clearError("checkOutUntil"); }}
                            slotProps={slotProps()}
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
    );
}
