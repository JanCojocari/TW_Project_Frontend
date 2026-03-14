// components/filters/PriceFilter.tsx
import { Box, Chip, Slider } from "@mui/material";
import FilterSection  from "./FilterSection";
import { priceConfig } from "../../types/filterTypes";
import type { FilterState } from "../../types/filterTypes";
import { colors, gradients } from "../../theme/gradients";

interface Props {
    currency:   FilterState["currency"];
    priceRange: FilterState["priceRange"];
    onChange:   (range: [number, number]) => void;
}

export default function PriceFilter({ currency, priceRange, onChange }: Props) {
    const cfg = priceConfig[currency];

    return (
        <FilterSection title={`Preț${cfg.symbol ? ` (${cfg.symbol})` : ""}`}>
            <Box sx={{ px: 1 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    <Chip label={`${cfg.symbol} ${priceRange[0]}`} size="small"
                          sx={{ fontWeight: 700, bgcolor: colors.primaryAlpha10, color: "primary.dark" }} />
                    <Chip label={`${cfg.symbol} ${priceRange[1]}`} size="small"
                          sx={{ fontWeight: 700, bgcolor: colors.primaryAlpha10, color: "primary.dark" }} />
                </Box>
                <Slider
                    value={priceRange}
                    onChange={(_, v) => onChange(v as [number, number])}
                    min={cfg.min} max={cfg.max} step={cfg.step}
                    sx={{
                        color: "primary.dark",
                        "& .MuiSlider-thumb": { width: 18, height: 18 },
                        "& .MuiSlider-track": { background: gradients.primary, border: "none" },
                    }}
                />
            </Box>
        </FilterSection>
    );
}