// components/createListing/SpaceStepper.tsx
import { Box, Typography, IconButton } from "@mui/material";
import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";
import { colors } from "../../theme/gradients";

interface Props {
    label:    string;
    value:    string;
    onChange: (v: string) => void;
    min?:     number;
    error?:   boolean;
}

export default function SpaceStepper({ label, value, onChange, min = 0, error = false }: Props) {
    const num = parseInt(value, 10) || 0;
    const dec = () => onChange(String(Math.max(min, num - 1)));
    const inc = () => onChange(String(num + 1));

    return (
        <Box sx={{
            display: "flex", flexDirection: "column", alignItems: "center",
            p: 2, borderRadius: 3, gap: 1,
            border: `1px solid ${error ? "#d32f2f" : colors.border}`,
            bgcolor: error ? "rgba(211,47,47,0.04)" : "background.paper",
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
                    sx={{ width: 28, height: 28, bgcolor: colors.primaryAlpha10, color: colors.primaryDark, border: `1px solid ${colors.primaryAlpha25}`, "&:hover": { bgcolor: colors.primaryAlpha25 }, "&.Mui-disabled": { opacity: 0.3 } }}
                >
                    <RemoveIcon sx={{ fontSize: 14 }} />
                </IconButton>
                <Typography sx={{ fontSize: 20, fontWeight: 800, color: "text.primary", minWidth: 28, textAlign: "center" }}>
                    {num}
                </Typography>
                <IconButton
                    size="small"
                    onClick={inc}
                    sx={{ width: 28, height: 28, bgcolor: colors.primaryAlpha10, color: colors.primaryDark, border: `1px solid ${colors.primaryAlpha25}`, "&:hover": { bgcolor: colors.primaryAlpha25 } }}
                >
                    <AddIcon sx={{ fontSize: 14 }} />
                </IconButton>
            </Box>
        </Box>
    );
}
