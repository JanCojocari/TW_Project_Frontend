import { Box, Typography, Alert, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { colors } from "../../theme/gradients";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import DatePickerProvider from "../common/DatePickerProvider.tsx";

interface Props {
    interval:      string;
    startDate:     Dayjs | null;
    endDate:       Dayjs | null;
    hours:         number;
    hoursInput:    string;
    months:        number;
    monthsInput:   string;
    dateError:     string | null;
    onStartChange: (val: Dayjs | null) => void;
    onEndChange:   (val: Dayjs | null) => void;
    onHoursChange: (input: string, value: number) => void;
    onMonthsChange:(input: string, value: number) => void;
    onHoursBlur:   () => void;
    onMonthsBlur:  () => void;
}

const StayPeriodSelector = ({
                                interval, startDate, endDate, hours, hoursInput,
                                months, monthsInput, dateError,
                                onStartChange, onEndChange, onHoursChange, onMonthsChange,
                                onHoursBlur, onMonthsBlur,
                            }: Props) => (
    <DatePickerProvider>
        <Box sx={{ p: 3, borderRadius: 3, border: `1px solid ${colors.border}`, mb: 3 }}>
            <Typography variant="subtitle1" fontWeight={700} mb={2}>
                Perioada sejurului
            </Typography>

            {interval === "hour" && (
                <TextField
                    label="Numar de ore"
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
                        label="Data sosirii"
                        value={startDate}
                        onChange={onStartChange}
                        minDate={dayjs().add(1, "day")}
                        slotProps={{ textField: { fullWidth: true } }}
                    />
                    <DatePicker
                        label="Data plecarii"
                        value={endDate}
                        onChange={onEndChange}
                        disablePast
                        minDate={startDate ?? dayjs()}
                        slotProps={{ textField: { fullWidth: true } }}
                    />
                </Box>
            )}

            {interval === "month" && (
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                    <DatePicker
                        label="Data sosirii"
                        value={startDate}
                        onChange={onStartChange}
                        disablePast
                        slotProps={{ textField: { fullWidth: true } }}
                    />
                    <TextField
                        label="Numar de luni"
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
                    {endDate.diff(startDate, "day")} nopti selectate
                </Typography>
            )}

            {startDate && endDate && interval === "month" && (
                <Typography variant="body2" color="text.secondary" mt={1.5}>
                    {months} {months === 1 ? "luna" : "luni"} -- {startDate.format("DD MMM YYYY")} - {endDate.format("DD MMM YYYY")}
                </Typography>
            )}

            {dateError && (
                <Alert severity="error" sx={{ mt: 1.5, borderRadius: 2 }}>{dateError}</Alert>
            )}
        </Box>
    </DatePickerProvider>
);

export default StayPeriodSelector;