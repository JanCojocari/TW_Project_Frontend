// components/createListing/MaxGuestsControl.tsx
import { Box, Typography, IconButton } from "@mui/material";
import { Add as AddIcon, Remove as RemoveIcon, Person as PersonIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { colors } from "../../theme/gradients";

const MAX_ICONS = 10;

interface Props {
    value:    string;
    onChange: (v: string) => void;
    error?:   boolean;
}

export default function MaxGuestsControl({ value, onChange, error = false }: Props) {
    const { t } = useTranslation();
    const num   = parseInt(value, 10) || 0;
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
                    <IconButton size="small" onClick={() => onChange(String(Math.max(0, num - 1)))} disabled={num <= 0}
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
            <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                {Array.from({ length: MAX_ICONS }).map((_, i) => (
                    <PersonIcon key={i} sx={{ fontSize: 20, color: i < shown ? colors.primaryDark : colors.border, transition: "color 0.15s" }} />
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
