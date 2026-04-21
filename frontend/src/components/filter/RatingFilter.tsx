// components/filters/RatingFilter.tsx
import { Box, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import FilterSection from "./FilterSection";
import type { FilterState } from "../../types/filterTypes";
import { colors, gradients } from "../../theme/gradients";

interface Props {
    minRating:  number | null;
    minReviews: number | null;
    onChange:   (patch: Partial<FilterState>) => void;
}

export default function RatingFilter({ minRating, minReviews, onChange }: Props) {
    const { t } = useTranslation();
    return (
        <FilterSection title={t("filters.rating")}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}
                                sx={{ mb: 1, display: "block" }}>
                        {t("filters.minRating")}
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
                        {[3, 3.5, 4, 4.5].map((r) => (
                            <ToggleButton key={r} value={r}>{r}+</ToggleButton>
                        ))}
                    </ToggleButtonGroup>
                </Box>

                <TextField
                    label={t("filters.minReviews")} type="number" size="small" fullWidth
                    value={minReviews ?? ""}
                    onChange={(e) => onChange({ minReviews: e.target.value ? Number(e.target.value) : null })}
                    inputProps={{ min: 0 }}
                />
            </Box>
        </FilterSection>
    );
}