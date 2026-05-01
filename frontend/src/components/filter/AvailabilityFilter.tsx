// components/filters/AvailabilityFilter.tsx
import { FormControl, FormControlLabel, Radio, RadioGroup, Typography } from "@mui/material";
import FilterSection from "./FilterSection";
import type { FilterState } from "../../types/filterTypes";

interface Props {
    value:    FilterState["availability"];
    onChange: (v: FilterState["availability"]) => void;
}

const OPTIONS = [
    { value: "ALL",       label: "Toate"       },
    { value: "available", label: "Disponibile" },
] as const;

export default function AvailabilityFilter({ value, onChange }: Props) {
    return (
        <FilterSection title="Disponibilitate">
            <FormControl>
                <RadioGroup value={value} onChange={(e) => onChange(e.target.value as FilterState["availability"])}>
                    {OPTIONS.map((opt) => (
                        <FormControlLabel
                            key={opt.value}
                            value={opt.value}
                            control={<Radio size="small" />}
                            label={<Typography variant="body2" fontWeight={600}>{opt.label}</Typography>}
                        />
                    ))}
                </RadioGroup>
            </FormControl>
        </FilterSection>
    );
}