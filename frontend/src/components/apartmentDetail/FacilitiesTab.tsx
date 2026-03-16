// components/apartmentDetail/FacilitiesTab.tsx
import { Box, Paper, Typography } from "@mui/material";
import { Check as CheckIcon, Close as CloseIcon, Wifi as WifiIcon, LocalParking as ParkingIcon, AcUnit as AcIcon, LocalFireDepartment as HeatingIcon, LocalLaundryService as WasherIcon, DryCleaningOutlined as DryerIcon, Kitchen as KitchenIcon, Tv as TvIcon, Balcony as BalconyIcon, Pool as PoolIcon, FitnessCenter as GymIcon, Elevator as ElevatorIcon, Pets as PetsIcon, SmokingRooms as SmokingIcon, Security as SecurityIcon, Lock as LockIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { colors }         from "../../theme/gradients.ts";
import type { Facilities } from "../../types/apartment.types";

interface FacilityItem { key: keyof Facilities; labelKey: string; icon: React.ReactNode; }
interface FacilityGroup { titleKey: string; items: FacilityItem[]; }

// Grupuri cu chei de traducere în loc de text hardcodat
const facilityGroups: FacilityGroup[] = [
    { titleKey: "filters.facilities", items: [] }, // nu e folosit direct — grupurile au chei proprii
];

const GROUPS: { titleKey: string; items: { key: keyof Facilities; labelKey: string; icon: React.ReactNode }[] }[] = [
    { titleKey: "g.internet", items: [
            { key: "wifi",        labelKey: "f.wifi",        icon: <WifiIcon /> },
            { key: "parking",     labelKey: "f.parking",     icon: <ParkingIcon /> },
            { key: "parkingFree", labelKey: "f.parkingFree", icon: <ParkingIcon /> },
        ]},
    { titleKey: "g.climate", items: [
            { key: "ac",      labelKey: "f.ac",      icon: <AcIcon /> },
            { key: "heating", labelKey: "f.heating", icon: <HeatingIcon /> },
        ]},
    { titleKey: "g.appliances", items: [
            { key: "washer",       labelKey: "f.washer",      icon: <WasherIcon /> },
            { key: "dryer",        labelKey: "f.dryer",       icon: <DryerIcon /> },
            { key: "dishwasher",   labelKey: "f.dishwasher",  icon: <KitchenIcon /> },
            { key: "refrigerator", labelKey: "f.fridge",      icon: <KitchenIcon /> },
            { key: "microwave",    labelKey: "f.microwave",   icon: <KitchenIcon /> },
            { key: "oven",         labelKey: "f.oven",        icon: <KitchenIcon /> },
            { key: "stove",        labelKey: "f.stove",       icon: <KitchenIcon /> },
            { key: "tv",           labelKey: "f.tv",          icon: <TvIcon /> },
        ]},
    { titleKey: "g.spaces", items: [
            { key: "balcony",  labelKey: "f.balcony",  icon: <BalconyIcon /> },
            { key: "terrace",  labelKey: "f.terrace",  icon: <BalconyIcon /> },
            { key: "garden",   labelKey: "f.garden",   icon: <BalconyIcon /> },
            { key: "pool",     labelKey: "f.pool",     icon: <PoolIcon /> },
            { key: "gym",      labelKey: "f.gym",      icon: <GymIcon /> },
            { key: "elevator", labelKey: "f.elevator", icon: <ElevatorIcon /> },
        ]},
    { titleKey: "g.policies", items: [
            { key: "petFriendly",    labelKey: "f.pets",    icon: <PetsIcon /> },
            { key: "smokingAllowed", labelKey: "f.smoking", icon: <SmokingIcon /> },
        ]},
    { titleKey: "g.security", items: [
            { key: "securityCamera", labelKey: "f.camera",  icon: <SecurityIcon /> },
            { key: "keypadEntry",    labelKey: "f.keypad",  icon: <LockIcon /> },
            { key: "safe",           labelKey: "f.safe",    icon: <LockIcon /> },
        ]},
];

// Traduceri inline pentru facilități (folosesc cheile din filterTypes dar mapate aici)
const FacilitiesTab = ({ facilities }: { facilities: Facilities }) => {
    const { t, i18n } = useTranslation();
    const isEn = i18n.language === "en";

    // Titluri grupuri
    const groupTitles: Record<string, string> = isEn ? {
        "g.internet":   "Internet & Parking",
        "g.climate":    "Climate",
        "g.appliances": "Appliances",
        "g.spaces":     "Spaces & Amenities",
        "g.policies":   "Policies",
        "g.security":   "Security",
    } : {
        "g.internet":   "Internet & Parcare",
        "g.climate":    "Climă",
        "g.appliances": "Electrocasnice",
        "g.spaces":     "Spații & Dotări",
        "g.policies":   "Politici",
        "g.security":   "Securitate",
    };

    // Etichete facilități
    const facilityLabels: Record<string, string> = isEn ? {
        "f.wifi": "Free Wi-Fi", "f.parking": "Parking", "f.parkingFree": "Free parking",
        "f.ac": "Air conditioning", "f.heating": "Heating",
        "f.washer": "Washing machine", "f.dryer": "Dryer", "f.dishwasher": "Dishwasher",
        "f.fridge": "Refrigerator", "f.microwave": "Microwave", "f.oven": "Oven", "f.stove": "Stove", "f.tv": "TV",
        "f.balcony": "Balcony", "f.terrace": "Terrace", "f.garden": "Garden",
        "f.pool": "Pool", "f.gym": "Gym", "f.elevator": "Elevator",
        "f.pets": "Pets allowed", "f.smoking": "Smoking allowed",
        "f.camera": "Security camera", "f.keypad": "Keypad entry", "f.safe": "Safe",
    } : {
        "f.wifi": "Wi-Fi gratuit", "f.parking": "Parcare", "f.parkingFree": "Parcare gratuită",
        "f.ac": "Aer condiționat", "f.heating": "Încălzire",
        "f.washer": "Mașină de spălat", "f.dryer": "Uscător", "f.dishwasher": "Mașină de vase",
        "f.fridge": "Frigider", "f.microwave": "Cuptor microunde", "f.oven": "Cuptor", "f.stove": "Plită", "f.tv": "TV",
        "f.balcony": "Balcon", "f.terrace": "Terasă", "f.garden": "Grădină",
        "f.pool": "Piscină", "f.gym": "Sală fitness", "f.elevator": "Ascensor",
        "f.pets": "Animale acceptate", "f.smoking": "Fumat permis",
        "f.camera": "Cameră securitate", "f.keypad": "Intrare cu cod", "f.safe": "Seif",
    };

    return (
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 3 }}>
            {GROUPS.map((group) => (
                <Paper key={group.titleKey} variant="outlined" sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${colors.border}`, bgcolor: "background.paper" }}>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, color: "primary.main" }}>
                        {groupTitles[group.titleKey]}
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        {group.items.map((item) => {
                            const active = facilities[item.key];
                            return (
                                <Box key={item.key} sx={{ display: "flex", alignItems: "center", gap: 1.5, opacity: active ? 1 : 0.45 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: 2, bgcolor: active ? colors.primaryAlpha10 : "action.hover", color: active ? "primary.main" : "text.disabled", "& svg": { fontSize: 18 } }}>
                                        {item.icon}
                                    </Box>
                                    <Typography variant="body2" fontWeight={active ? 600 : 400} sx={{ color: active ? "text.primary" : "text.disabled", flex: 1 }}>
                                        {facilityLabels[item.labelKey]}
                                    </Typography>
                                    {active ? <CheckIcon sx={{ fontSize: 16, color: "success.main" }} /> : <CloseIcon sx={{ fontSize: 16, color: "text.disabled" }} />}
                                </Box>
                            );
                        })}
                    </Box>
                </Paper>
            ))}
        </Box>
    );
};

export default FacilitiesTab;