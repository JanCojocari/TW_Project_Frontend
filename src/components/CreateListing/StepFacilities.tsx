import { Box, Typography } from "@mui/material";
import {
    Star as StarIcon, CheckCircle as CheckIcon,
    Wifi as WifiIcon, LocalParking as ParkingIcon, AcUnit as AcIcon,
    LocalFireDepartment as HeatingIcon, LocalLaundryService as WasherIcon,
    DryCleaningOutlined as DryerIcon, Kitchen as KitchenIcon, Tv as TvIcon,
    Balcony as BalconyIcon, Pool as PoolIcon, FitnessCenter as GymIcon,
    Elevator as ElevatorIcon, Pets as PetsIcon, SmokingRooms as SmokingIcon,
    Security as SecurityIcon, Lock as LockIcon,
} from "@mui/icons-material";
import Section from "./Section.tsx";
import { colors } from "../../theme/gradients.ts";
import type { Facilities } from "../../types/apartment.types";

interface Props {
    facilities: Facilities;
    onToggle: (key: keyof Facilities) => void;
}

const groups: { title: string; items: { key: keyof Facilities; label: string; icon: React.ReactNode }[] }[] = [
    { title: "Internet & Parcare", items: [
            { key: "wifi", label: "Wi-Fi gratuit", icon: <WifiIcon /> },
            { key: "parking", label: "Parcare", icon: <ParkingIcon /> },
            { key: "parkingFree", label: "Parcare gratuită", icon: <ParkingIcon /> },
        ]},
    { title: "Climă", items: [
            { key: "ac", label: "Aer condiționat", icon: <AcIcon /> },
            { key: "heating", label: "Încălzire", icon: <HeatingIcon /> },
        ]},
    { title: "Electrocasnice", items: [
            { key: "washer", label: "Mașină spălat", icon: <WasherIcon /> },
            { key: "dryer", label: "Uscător", icon: <DryerIcon /> },
            { key: "dishwasher", label: "Mașină vase", icon: <KitchenIcon /> },
            { key: "refrigerator", label: "Frigider", icon: <KitchenIcon /> },
            { key: "microwave", label: "Microunde", icon: <KitchenIcon /> },
            { key: "oven", label: "Cuptor", icon: <KitchenIcon /> },
            { key: "stove", label: "Plită", icon: <KitchenIcon /> },
            { key: "tv", label: "TV", icon: <TvIcon /> },
        ]},
    { title: "Spații & Dotări", items: [
            { key: "balcony", label: "Balcon", icon: <BalconyIcon /> },
            { key: "terrace", label: "Terasă", icon: <BalconyIcon /> },
            { key: "garden", label: "Grădină", icon: <BalconyIcon /> },
            { key: "pool", label: "Piscină", icon: <PoolIcon /> },
            { key: "gym", label: "Sală fitness", icon: <GymIcon /> },
            { key: "elevator", label: "Ascensor", icon: <ElevatorIcon /> },
        ]},
    { title: "Politici", items: [
            { key: "petFriendly", label: "Animale acceptate", icon: <PetsIcon /> },
            { key: "smokingAllowed", label: "Fumat permis", icon: <SmokingIcon /> },
        ]},
    { title: "Securitate", items: [
            { key: "securityCamera", label: "Cameră securitate", icon: <SecurityIcon /> },
            { key: "keypadEntry", label: "Intrare cu cod", icon: <LockIcon /> },
            { key: "safe", label: "Seif", icon: <LockIcon /> },
        ]},
];

const activeCount = (f: Facilities) => Object.values(f).filter(Boolean).length;

const StepFacilities = ({ facilities, onToggle }: Props) => (
    <Section icon={<StarIcon sx={{ fontSize: 24 }} />} title="Facilități" step={4}
             subtitle={`${activeCount(facilities)} facilități selectate`}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {groups.map(group => (
                <Box key={group.title}>
                    <Typography variant="caption" fontWeight={800} color="text.secondary"
                                sx={{ textTransform: "uppercase", letterSpacing: "0.8px", display: "block", mb: 1.5 }}>
                        {group.title}
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {group.items.map(item => {
                            const active = facilities[item.key];
                            return (
                                <Box key={item.key} onClick={() => onToggle(item.key)} sx={{
                                    display: "flex", alignItems: "center", gap: 1,
                                    px: 2, py: 1, borderRadius: 2.5, cursor: "pointer",
                                    border: `1px solid ${active ? colors.primaryDark : colors.border}`,
                                    bgcolor: active ? colors.primaryAlpha10 : "transparent",
                                    color: active ? colors.primaryDark : colors.textSecondary,
                                    fontWeight: active ? 700 : 500, transition: "all 0.15s ease",
                                    "&:hover": { borderColor: colors.primaryDark, bgcolor: colors.primaryAlpha06 },
                                    "& svg": { fontSize: 18 },
                                }}>
                                    <Box sx={{ color: "inherit" }}>{item.icon}</Box>
                                    <Typography variant="body2" fontWeight="inherit" sx={{ color: "inherit" }}>{item.label}</Typography>
                                    {active && <CheckIcon sx={{ fontSize: 14, ml: 0.5 }} />}
                                </Box>
                            );
                        })}
                    </Box>
                </Box>
            ))}
        </Box>
    </Section>
);

export default StepFacilities;