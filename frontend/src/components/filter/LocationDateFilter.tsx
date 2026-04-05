// components/filters/LocationDateFilter.tsx
// Folosește @mui/x-date-pickers în loc de input type="date"
// pentru a respecta tema dark/light automat.

import { Box, TextField } from "@mui/material";
import { DatePicker }     from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs }   from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { type Dayjs }   from "dayjs";
import FilterSection             from "./FilterSection";
import type { FilterState }      from "../../types/filterTypes";

interface Props {
    city:     string;
    checkIn:  string;
    checkOut: string;
    onChange: (patch: Partial<FilterState>) => void;
}

export default function LocationDateFilter({ city, checkIn, checkOut, onChange }: Props) {
    const toISO  = (d: Dayjs | null) => d ? d.format("YYYY-MM-DD") : "";
    const fromISO = (s: string)      => s ? dayjs(s) : null;

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <FilterSection title="Check-in & Check-out">
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <DatePicker
                        label="Check-in"
                        value={fromISO(checkIn)}
                        onChange={(d) => onChange({ checkIn: toISO(d) })}
                        slotProps={{
                            textField: { size: "small", fullWidth: true },
                            // Popover-ul calendarului moștenește tema automat
                            popper: { sx: { zIndex: 1400 } },
                        }}
                    />
                    <DatePicker
                        label="Check-out"
                        value={fromISO(checkOut)}
                        onChange={(d) => onChange({ checkOut: toISO(d) })}
                        minDate={checkIn ? dayjs(checkIn) : undefined}
                        slotProps={{
                            textField: { size: "small", fullWidth: true },
                            popper: { sx: { zIndex: 1400 } },
                        }}
                    />
                </Box>
            </FilterSection>

            <FilterSection title="Locație">
                <TextField
                    placeholder="ex: Centru, Buiucani..."
                    size="small" fullWidth
                    value={city}
                    onChange={(e) => onChange({ city: e.target.value })}
                />
            </FilterSection>
        </LocalizationProvider>
    );
}