// components/filters/RatingFilter.tsx
import { Box, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import FilterSection from "./FilterSection";
import type { FilterState } from "../../types/filterTypes";
import { colors, gradients } from "../../theme/gradients";

interface Props {
    minRating:  number | null;
    minReviews: number | null;
    onChange:   (patch: Partial<FilterState>) => void;
}

export default function RatingFilter({ minRating, minReviews, onChange }: Props) {
    return (
        <FilterSection title="Rating & Recenzii">
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}
                                sx={{ mb: 1, display: "block" }}>
                        Rating minim (din 10)
                    </Typography>
                    <ToggleButtonGroup
                        value={minRating} exclusive
                        onChange={(_, v) => onChange({ minRating: v })}
                        sx={{
                            display: "flex", flexWrap: "wrap", gap: 0.8,
                            "& .MuiToggleButton-root": {
                                borderRadius: "8px !important",
                                border: `1px solid ${colors.border} !important`,
                                fontWeight: 700, fontSize: 13,
                                minWidth: 44, py: 0.6,
                                "&.Mui-selected": {
                                    background: gradients.primary, color: "white",
                                    borderColor: "transparent !important",
                                },
                            },
                        }}
                    >
                        {[7, 8, 9, 9.5].map((r) => (
                            <ToggleButton key={r} value={r}>{r}+</ToggleButton>
                        ))}
                    </ToggleButtonGroup>
                </Box>

                <TextField
                    label="Nr. minim recenzii" type="number" size="small" fullWidth
                    value={minReviews ?? ""}
                    onChange={(e) => onChange({ minReviews: e.target.value ? Number(e.target.value) : null })}
                    inputProps={{ min: 0 }}
                />
            </Box>
        </FilterSection>
    );
}