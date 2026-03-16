// components/filters/FacilitiesFilter.tsx
import { Box, Chip, Typography } from "@mui/material";
import {
    Wifi as WifiIcon, LocalParking as ParkingIcon, AcUnit as AcIcon,
    LocalFireDepartment as HeatingIcon, LocalLaundryService as WasherIcon,
    DryCleaningOutlined as DryerIcon, Kitchen as KitchenIcon, Tv as TvIcon,
    Balcony as BalconyIcon, Pool as PoolIcon, FitnessCenter as GymIcon,
    Elevator as ElevatorIcon, Pets as PetsIcon, SmokingRooms as SmokingIcon,
    Security as SecurityIcon, Lock as LockIcon,
} from "@mui/icons-material";
import FilterSection             from "./FilterSection";
import { facilityGroupsConfig }  from "../../types/filterTypes";
import type { FilterState }      from "../../types/filterTypes";
import type { Facilities }       from "../../types/apartment.types";
import { colors }                from "../../theme/gradients";

// Mapare nume icon → componentă React
const ICON_MAP: Record<string, React.ReactNode> = {
    Wifi:                 <WifiIcon sx={{ fontSize: 16 }} />,
    LocalParking:         <ParkingIcon sx={{ fontSize: 16 }} />,
    AcUnit:               <AcIcon sx={{ fontSize: 16 }} />,
    LocalFireDepartment:  <HeatingIcon sx={{ fontSize: 16 }} />,
    LocalLaundryService:  <WasherIcon sx={{ fontSize: 16 }} />,
    DryCleaning:          <DryerIcon sx={{ fontSize: 16 }} />,
    Kitchen:              <KitchenIcon sx={{ fontSize: 16 }} />,
    Tv:                   <TvIcon sx={{ fontSize: 16 }} />,
    Balcony:              <BalconyIcon sx={{ fontSize: 16 }} />,
    Pool:                 <PoolIcon sx={{ fontSize: 16 }} />,
    FitnessCenter:        <GymIcon sx={{ fontSize: 16 }} />,
    Elevator:             <ElevatorIcon sx={{ fontSize: 16 }} />,
    Pets:                 <PetsIcon sx={{ fontSize: 16 }} />,
    SmokingRooms:         <SmokingIcon sx={{ fontSize: 16 }} />,
    Security:             <SecurityIcon sx={{ fontSize: 16 }} />,
    Lock:                 <LockIcon sx={{ fontSize: 16 }} />,
};

interface Props {
    facilities: FilterState["facilities"];
    onToggle:   (key: keyof Facilities) => void;
}

export default function FacilitiesFilter({ facilities, onToggle }: Props) {
    const activeCount = Object.values(facilities).filter(Boolean).length;

    return (
        <FilterSection title="Facilități" noDivider>
            {activeCount > 0 && (
                <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
                    <Chip label={`${activeCount} selectate`} size="small"
                          sx={{ bgcolor: colors.primaryAlpha10, color: "primary.dark", fontWeight: 700, fontSize: 11 }} />
                </Box>
            )}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                {facilityGroupsConfig.map((group) => (
                    <Box key={group.title}>
                        <Typography variant="caption" color="text.secondary" fontWeight={700}
                                    sx={{ textTransform: "uppercase", letterSpacing: "0.5px", mb: 1, display: "block" }}>
                            {group.title}
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
                            {group.items.map((item) => {
                                const active = !!facilities[item.key];
                                return (
                                    <Box key={item.key} onClick={() => onToggle(item.key)} sx={{
                                        display: "flex", alignItems: "center", gap: 0.8,
                                        px: 1.5, py: 0.7, borderRadius: 2, cursor: "pointer",
                                        border: `1px solid ${active ? colors.primaryDark : colors.border}`,
                                        bgcolor: active ? colors.primaryAlpha10 : "transparent",
                                        color:   active ? "primary.dark" : "text.secondary",
                                        fontWeight: active ? 700 : 500, fontSize: 13,
                                        transition: "all 0.15s ease",
                                        "&:hover": { borderColor: "primary.dark", bgcolor: colors.primaryAlpha06 },
                                    }}>
                                        {ICON_MAP[item.icon]}
                                        <Typography variant="caption" fontWeight="inherit" sx={{ color: "inherit" }}>
                                            {item.label}
                                        </Typography>
                                    </Box>
                                );
                            })}
                        </Box>
                    </Box>
                ))}
            </Box>
        </FilterSection>
    );
}