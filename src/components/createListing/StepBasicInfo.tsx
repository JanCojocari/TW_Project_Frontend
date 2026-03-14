import { Box, TextField, Typography, ToggleButtonGroup, ToggleButton } from "@mui/material";
import { Home as HomeIcon } from "@mui/icons-material";
import Section from "./Section.tsx";
import type { FormState, Errors } from "../../types/CreateListingTypes.ts";
import { toggleSx } from "../../types/CreateListingTypes.ts";
import type { Currency, RentInterval } from "../../types/apartment.types";

interface Props {
    form: FormState;
    errors: Errors;
    set: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
    clearError: (key: string) => void;
}

const StepBasicInfo = ({ form, errors, set, clearError }: Props) => (
    <Section icon={<HomeIcon sx={{ fontSize: 24 }} />} title="Informații de bază" step={1}
             subtitle="Adresa, prețul și intervalul de închiriere">
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>

            <TextField
                label="Adresă completă *"
                placeholder="ex: Str. Ștefan cel Mare 1, Chișinău"
                value={form.address}
                onChange={e => { set("address", e.target.value); clearError("address"); }}
                error={!!errors.address} helperText={errors.address}
                fullWidth
            />

            <Box>
                <Typography variant="body2" fontWeight={700} color="text.secondary" sx={{ mb: 1.5 }}>
                    Preț și interval *
                </Typography>
                <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
                    <TextField
                        label="Preț" type="number"sx={{ flex: 2 }}
                        value={form.cost} inputProps={{ min: 0 }}
                        onChange={e => { set("cost", e.target.value); clearError("cost"); }}
                        error={!!errors.cost} helperText={errors.cost}
                    />
                    <Box sx={{ flex: 3 }}>
                        <ToggleButtonGroup value={form.currency} exclusive
                                           onChange={(_, v) => { if (v) set("currency", v); }}
                                           sx={{ ...toggleSx, height: 56, "& .MuiToggleButton-root": { ...toggleSx["& .MuiToggleButton-root"], flex: 1 } }}>
                            {(["USD", "EUR", "MDL"] as Currency[]).map(c => (
                                <ToggleButton key={c} value={c}>{c}</ToggleButton>
                            ))}
                        </ToggleButtonGroup>
                    </Box>
                </Box>

                <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: "block", mb: 1 }}>
                        Interval de închiriere
                    </Typography>
                    <ToggleButtonGroup value={form.interval} exclusive
                                       onChange={(_, v) => { if (v) set("interval", v); }}
                                       sx={toggleSx}>
                        {([
                            { value: "hour",  label: "Per oră" },
                            { value: "day",   label: "Per zi" },
                            { value: "month", label: "Per lună" },
                        ] as { value: RentInterval; label: string }[]).map(opt => (
                            <ToggleButton key={opt.value} value={opt.value}>{opt.label}</ToggleButton>
                        ))}
                    </ToggleButtonGroup>
                </Box>
            </Box>
        </Box>
    </Section>
);

export default StepBasicInfo;