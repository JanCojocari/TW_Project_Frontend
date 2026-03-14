import { Box, TextField, Typography, Button, Chip } from "@mui/material";
import { LocationOn as LocationOnIcon, Add as AddIcon } from "@mui/icons-material";
import Section from "./Section.tsx";
import type { FormState, Errors } from "./types.ts";
import { colors } from "../../theme/gradients.ts";

interface Props {
    form: FormState;
    errors: Errors;
    set: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
    clearError: (key: string) => void;
    onAddLandmark: () => void;
    onRemoveLandmark: (i: number) => void;
}

const StepLocation = ({ form, errors, set, clearError, onAddLandmark, onRemoveLandmark }: Props) => (
    <Section icon={<LocationOnIcon sx={{ fontSize: 24 }} />} title="Locație" step={3}
             subtitle="Coordonate GPS, oraș și puncte de interes">
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" }, gap: 2 }}>
                <TextField label="Oraș *" value={form.city}
                           onChange={e => { set("city", e.target.value); clearError("city"); }}
                           error={!!errors.city} helperText={errors.city} />
                <TextField label="Sector / Cartier (opțional)" value={form.region}
                           onChange={e => set("region", e.target.value)} placeholder="ex: Centru" />
                <TextField label="Cod poștal (opțional)" value={form.postalCode}
                           onChange={e => set("postalCode", e.target.value)} placeholder="ex: MD-2001" />
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                <TextField label="Latitudine (opțional)" value={form.latitude} type="number"
                           onChange={e => set("latitude", e.target.value)} placeholder="ex: 47.0245" />
                <TextField label="Longitudine (opțional)" value={form.longitude} type="number"
                           onChange={e => set("longitude", e.target.value)} placeholder="ex: 28.8322" />
            </Box>

            <Box>
                <Typography variant="body2" fontWeight={700} color="text.secondary" sx={{ mb: 1 }}>
                    Puncte de interes apropiate (opțional)
                </Typography>
                <Box sx={{ display: "flex", gap: 1, mb: 1.5 }}>
                    <TextField size="small" fullWidth placeholder="ex: Parcul Central 0.3 km"
                               value={form.landmarkInput}
                               onChange={e => set("landmarkInput", e.target.value)}
                               onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); onAddLandmark(); } }} />
                    <Button variant="outlined" onClick={onAddLandmark} sx={{ minWidth: 48, px: 2 }}>
                        <AddIcon />
                    </Button>
                </Box>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {form.landmarks.map((lm, i) => (
                        <Chip key={i} label={lm} size="small" onDelete={() => onRemoveLandmark(i)}
                              sx={{ bgcolor: colors.primaryAlpha10, color: colors.primaryDark, fontWeight: 600 }} />
                    ))}
                </Box>
            </Box>
        </Box>
    </Section>
);

export default StepLocation;