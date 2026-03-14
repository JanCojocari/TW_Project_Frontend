import { Box, TextField, Typography } from "@mui/material";
import { AttachMoney as MoneyIcon, Cancel as CancelIcon, CheckCircle as CheckIcon } from "@mui/icons-material";
import Section from "./Section.tsx";
import type { FormState, Errors } from "./types.ts";
import { colors } from "../../theme/gradients.ts";
import type { AdditionalInfo } from "../../types/apartment.types";

interface Props {
    form: FormState;
    errors: Errors;
    set: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
    clearError: (key: string) => void;
}

const policies: { value: AdditionalInfo["cancellationPolicy"]; label: string; desc: string; color: string }[] = [
    { value: "flexible", label: "Flexibilă", desc: "Rambursare integrală cu 24h înainte", color: "#16a34a" },
    { value: "moderate", label: "Moderată",  desc: "Rambursare 50% cu 5 zile înainte",   color: "#F59E0B" },
    { value: "strict",   label: "Strictă",   desc: "Fără rambursare după confirmare",     color: "#dc2626" },
];

const StepDescription = ({ form, errors, set, clearError }: Props) => (
    <Section icon={<MoneyIcon sx={{ fontSize: 24 }} />} title="Descriere & Reguli" step={6}
             subtitle="Prezintă apartamentul și stabilește condițiile">
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>

            <TextField
                label="Descriere *" multiline rows={4} fullWidth
                placeholder="Descrie apartamentul tău — stil, renovare, dotări speciale, atmosferă..."
                value={form.description}
                onChange={e => { set("description", e.target.value); clearError("description"); }}
                error={!!errors.description} helperText={errors.description}
            />

            <TextField
                label="Regulile casei (opțional)" multiline rows={3} fullWidth
                placeholder="ex: Nu se fumează în interior. Animale acceptate cu acord prealabil..."
                value={form.houseRules}
                onChange={e => set("houseRules", e.target.value)}
            />

            <Box>
                <Typography variant="body2" fontWeight={700} color="text.secondary" sx={{ mb: 1.5 }}>
                    <CancelIcon sx={{ verticalAlign: "middle", mr: 1, fontSize: 18 }} />
                    Politică de anulare
                </Typography>
                <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
                    {policies.map(opt => {
                        const active = form.cancellationPolicy === opt.value;
                        return (
                            <Box key={opt.value} onClick={() => set("cancellationPolicy", opt.value)} sx={{
                                flex: 1, p: 2, borderRadius: 2.5, cursor: "pointer",
                                border: `2px solid ${active ? opt.color : colors.border}`,
                                bgcolor: active ? `${opt.color}12` : "transparent",
                                transition: "all 0.15s ease",
                                "&:hover": { borderColor: opt.color, bgcolor: `${opt.color}08` },
                            }}>
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.5 }}>
                                    <Typography variant="body2" fontWeight={800} sx={{ color: active ? opt.color : "text.primary" }}>
                                        {opt.label}
                                    </Typography>
                                    {active && <CheckIcon sx={{ fontSize: 16, color: opt.color }} />}
                                </Box>
                                <Typography variant="caption" color="text.secondary">{opt.desc}</Typography>
                            </Box>
                        );
                    })}
                </Box>
            </Box>
        </Box>
    </Section>
);

export default StepDescription;

