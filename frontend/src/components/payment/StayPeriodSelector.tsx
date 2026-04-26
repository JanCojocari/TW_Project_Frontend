import { useState } from "react";
import { Box, Typography, Alert, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { PickersDay, type PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import { colors } from "../../theme/gradients";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import DatePickerProvider from "../common/DatePickerProvider.tsx";
import type { BookedPeriodDto } from "../../services/paymentHistoryService";
import { useTranslation } from "react-i18next";

interface Props {
    interval:      string;
    startDate:     Dayjs | null;
    endDate:       Dayjs | null;
    hours:         number;
    hoursInput:    string;
    months:        number;
    monthsInput:   string;
    dateError:     string | null;
    bookedPeriods: BookedPeriodDto[];
    onStartChange: (val: Dayjs | null) => void;
    onEndChange:   (val: Dayjs | null) => void;
    onHoursChange: (input: string, value: number) => void;
    onMonthsChange:(input: string, value: number) => void;
    onHoursBlur:   () => void;
    onMonthsBlur:  () => void;
}

function isDayBooked(day: Dayjs, periods: BookedPeriodDto[]): boolean {
    return periods.some(p => {
        const start = dayjs(p.startDate);
        const end   = dayjs(p.endDate);
        return (day.isSame(start, "day") || day.isAfter(start, "day")) &&
            (day.isSame(end,   "day") || day.isBefore(end, "day"));
    });
}

function BookedDay(
    props: PickersDayProps<Dayjs> & { bookedPeriods: BookedPeriodDto[]; onBookedClick: () => void }
) {
    const { bookedPeriods, onBookedClick, day, ...rest } = props;
    const booked = isDayBooked(day, bookedPeriods);
    return (
        <PickersDay
            {...rest}
            day={day}
            disabled={booked || rest.disabled}
            onClick={booked ? onBookedClick : rest.onClick}
            sx={booked ? {
                backgroundColor: "error.light",
                color: "white",
                "&:hover": { backgroundColor: "error.main" },
                "&.Mui-disabled": {
                    backgroundColor: "error.light",
                    color: "white",
                    opacity: 0.75,
                },
            } : undefined}
        />
    );
}

const StayPeriodSelector = ({
                                interval, startDate, endDate, hours, hoursInput,
                                months, monthsInput, dateError, bookedPeriods,
                                onStartChange, onEndChange, onHoursChange, onMonthsChange,
                                onHoursBlur, onMonthsBlur,
                            }: Props) => {
    const { t } = useTranslation();
    const [showBookedHint, setShowBookedHint] = useState(false);

    const handleBookedClick = () => setShowBookedHint(true);

    const sharedDatePickerProps = {
        shouldDisableDate: (day: Dayjs) => isDayBooked(day, bookedPeriods),
        slots: { day: BookedDay },
        slotProps: {
            day: { bookedPeriods, onBookedClick: handleBookedClick } as any,
        },
    };

    return (
        <DatePickerProvider>
            <Box sx={{ p: 3, borderRadius: 3, border: `1px solid ${colors.border}`, mb: 3 }}>
                <Typography variant="subtitle1" fontWeight={700} mb={2}>
                    {t("components.stayPeriodSelector.title")}
                </Typography>

                {interval === "hour" && (
                    <TextField
                        label={t("components.stayPeriodSelector.hoursLabel")}
                        type="number"
                        value={hoursInput}
                        onChange={e => {
                            const raw = parseInt(e.target.value);
                            onHoursChange(e.target.value, isNaN(raw) || raw < 1 ? hours : raw);
                        }}
                        onBlur={onHoursBlur}
                        inputProps={{ min: 1 }}
                        fullWidth
                    />
                )}

                {interval === "day" && (
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                        <DatePicker
                            label={t("components.stayPeriodSelector.arrivalLabel")}
                            value={startDate}
                            onChange={val => { setShowBookedHint(false); onStartChange(val); }}
                            minDate={dayjs().add(1, "day")}
                            {...sharedDatePickerProps}
                            slotProps={{
                                ...sharedDatePickerProps.slotProps,
                                textField: { fullWidth: true },
                            }}
                        />
                        <DatePicker
                            label={t("components.stayPeriodSelector.departureLabel")}
                            value={endDate}
                            onChange={val => { setShowBookedHint(false); onEndChange(val); }}
                            disablePast
                            minDate={startDate ?? dayjs()}
                            {...sharedDatePickerProps}
                            slotProps={{
                                ...sharedDatePickerProps.slotProps,
                                textField: { fullWidth: true },
                            }}
                        />
                    </Box>
                )}

                {interval === "month" && (
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                        <DatePicker
                            label={t("components.stayPeriodSelector.arrivalLabel")}
                            value={startDate}
                            onChange={val => { setShowBookedHint(false); onStartChange(val); }}
                            disablePast
                            {...sharedDatePickerProps}
                            slotProps={{
                                ...sharedDatePickerProps.slotProps,
                                textField: { fullWidth: true },
                            }}
                        />
                        <TextField
                            label={t("components.stayPeriodSelector.monthsLabel")}
                            type="number"
                            value={monthsInput}
                            onChange={e => {
                                const raw = parseInt(e.target.value);
                                onMonthsChange(e.target.value, isNaN(raw) || raw < 1 ? months : raw);
                            }}
                            onBlur={onMonthsBlur}
                            inputProps={{ min: 1 }}
                            fullWidth
                        />
                    </Box>
                )}

                {startDate && endDate && interval === "day" && (
                    <Typography variant="body2" color="text.secondary" mt={1.5}>
                        {endDate.diff(startDate, "day")} {t("components.stayPeriodSelector.nightsSelected")}
                    </Typography>
                )}

                {startDate && endDate && interval === "month" && (
                    <Typography variant="body2" color="text.secondary" mt={1.5}>
                        {months} {months === 1
                        ? t("components.stayPeriodSelector.luna")
                        : t("components.stayPeriodSelector.luni")
                    } -- {startDate.format("DD MMM YYYY")} - {endDate.format("DD MMM YYYY")}
                    </Typography>
                )}

                {showBookedHint && (
                    <Alert severity="warning" sx={{ mt: 1.5, borderRadius: 2 }} onClose={() => setShowBookedHint(false)}>
                        {t("components.stayPeriodSelector.bookedHint")}
                    </Alert>
                )}

                {dateError && (
                    <Alert severity="error" sx={{ mt: 1.5, borderRadius: 2 }}>{dateError}</Alert>
                )}
            </Box>
        </DatePickerProvider>
    );
};

export default StayPeriodSelector;