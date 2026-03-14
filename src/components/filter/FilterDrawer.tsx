// components/filters/FilterDrawer.tsx
// Desktop + Mobile: Drawer lateral stânga cu overlay (blackout)
// Butonul Filtre e în Listings.tsx, aliniat cu search bar

import { Box, Button, Drawer, IconButton, Typography } from "@mui/material";
import { Close as CloseIcon, FilterList as FilterListIcon,
    RestartAlt as ResetIcon } from "@mui/icons-material";
import { gradients, colors } from "../../theme/gradients";
import type { FilterState }       from "./filterTypes";
import AvailabilityFilter         from "./AvailabilityFilter";
import CurrencyIntervalFilter     from "./CurrencyIntervalFilter";
import PriceFilter                from "./PriceFilter";
import LocationDateFilter         from "./LocationDateFilter";
import RatingFilter               from "./RatingFilter";
import FacilitiesFilter           from "./FacilitiesFilter";
import type { Facilities }        from "../../types/apartment.types";

interface Props {
    open:     boolean;
    onClose:  () => void;
    filters:  FilterState;
    onChange: (filters: FilterState) => void;
    onApply:  () => void;
    onReset:  () => void;
}

export default function FilterDrawer({ open, onClose, filters, onChange, onApply, onReset }: Props) {
    const set   = <K extends keyof FilterState>(key: K, value: FilterState[K]) =>
        onChange({ ...filters, [key]: value });
    const patch = (p: Partial<FilterState>) => onChange({ ...filters, ...p });
    const toggleFacility = (key: keyof Facilities) =>
        onChange({ ...filters, facilities: { ...filters.facilities, [key]: filters.facilities[key] ? undefined : true } });

    return (
        <Drawer
            anchor="left"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width:          { xs: "100vw", sm: 380 },
                    bgcolor:        "background.paper",
                    display:        "flex",
                    flexDirection:  "column",
                    // Sus în jos, fără spațiu sus — sub header
                    top:            0,
                    height:         "100%",
                },
            }}
            // Overlay întunecat peste restul paginii
            slotProps={{
                backdrop: {
                    sx: { bgcolor: "rgba(0,0,0,0.5)" },
                },
            }}
        >
            {/* Header sticky */}
            <Box sx={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                px: 3, py: 2.5,
                bgcolor: "background.paper",
                borderBottom: `1px solid ${colors.border}`,
                position: "sticky", top: 0, zIndex: 1,
            }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box sx={{ background: gradients.primary, p: 1, borderRadius: 1.5, display: "flex", color: "white" }}>
                        <FilterListIcon sx={{ fontSize: 18 }} />
                    </Box>
                    <Typography variant="h6" fontWeight={800}>Filtre</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Button size="small" startIcon={<ResetIcon />} onClick={onReset}
                            sx={{ color: "text.secondary", fontWeight: 600, fontSize: 12 }}>
                        Resetează
                    </Button>
                    <IconButton onClick={onClose} size="small"
                                sx={{ bgcolor: colors.primaryAlpha10, "&:hover": { bgcolor: colors.primaryAlpha15 } }}>
                        <CloseIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                </Box>
            </Box>

            {/* Conținut scrollabil */}
            <Box sx={{ flex: 1, overflowY: "auto", px: 3, py: 3 }}>
                <AvailabilityFilter value={filters.availability} onChange={(v) => set("availability", v)} />
                <CurrencyIntervalFilter currency={filters.currency} interval={filters.interval} onChange={patch} />
                <PriceFilter currency={filters.currency} priceRange={filters.priceRange} onChange={(r) => set("priceRange", r)} />
                <LocationDateFilter city={filters.city} checkIn={filters.checkIn} checkOut={filters.checkOut} onChange={patch} />
                <RatingFilter minRating={filters.minRating} minReviews={filters.minReviews} onChange={patch} />
                <FacilitiesFilter facilities={filters.facilities} onToggle={toggleFacility} />
            </Box>

            {/* Footer sticky */}
            <Box sx={{ px: 3, py: 2.5, borderTop: `1px solid ${colors.border}`, bgcolor: "background.paper" }}>
                <Button fullWidth variant="contained" size="large"
                        onClick={() => { onApply(); onClose(); }}
                        sx={{ py: 1.6, borderRadius: 2.5, fontWeight: 800, fontSize: 15 }}>
                    Aplică filtrele
                </Button>
            </Box>
        </Drawer>
    );
}