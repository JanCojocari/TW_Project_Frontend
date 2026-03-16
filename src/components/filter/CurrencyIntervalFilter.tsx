// components/filters/CurrencyIntervalFilter.tsx
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import FilterSection  from "./FilterSection";
import { priceConfig } from "../../types/filterTypes";
import type { FilterState } from "../../types/filterTypes";
import { colors, gradients } from "../../theme/gradients";

const toggleSx = {
    display: "flex", gap: 1,
    "& .MuiToggleButton-root": {
        flex: 1, borderRadius: "8px !important",
        border: `1px solid ${colors.border} !important`,
        fontWeight: 700, fontSize: 13, py: 0.8,
        "&.Mui-selected": {
            background: gradients.primary, color: "white",
            borderColor: "transparent !important",
        },
    },
};

interface Props {
    currency: FilterState["currency"];
    interval: FilterState["interval"];
    onChange: (patch: Partial<FilterState>) => void;
}

export default function CurrencyIntervalFilter({ currency, interval, onChange }: Props) {
    return (
        <>
            <FilterSection title="Monedă">
                <ToggleButtonGroup value={currency} exclusive sx={toggleSx}
                                   onChange={(_, v) => {
                                       if (!v) return;
                                       const cfg = priceConfig[v];
                                       onChange({ currency: v, priceRange: [cfg.min, cfg.max] });
                                   }}
                >
                    {(["ALL", "USD", "EUR", "MDL"] as const).map((c) => (
                        <ToggleButton key={c} value={c}>{c === "ALL" ? "Toate" : c}</ToggleButton>
                    ))}
                </ToggleButtonGroup>
            </FilterSection>

            <FilterSection title="Interval de închiriere">
                <ToggleButtonGroup value={interval} exclusive sx={toggleSx}
                                   onChange={(_, v) => { if (v) onChange({ interval: v }); }}
                >
                    {([
                        { value: "ALL",   label: "Toate" },
                        { value: "hour",  label: "Oră"   },
                        { value: "day",   label: "Zi"    },
                        { value: "month", label: "Lună"  },
                    ] as const).map((opt) => (
                        <ToggleButton key={opt.value} value={opt.value}>{opt.label}</ToggleButton>
                    ))}
                </ToggleButtonGroup>
            </FilterSection>
        </>
    );
}