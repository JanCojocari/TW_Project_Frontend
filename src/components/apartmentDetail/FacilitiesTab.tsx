import { Box, Paper, Typography } from "@mui/material";
import { Check as CheckIcon, Close as CloseIcon, Wifi as WifiIcon, LocalParking as ParkingIcon, AcUnit as AcIcon, LocalFireDepartment as HeatingIcon, LocalLaundryService as WasherIcon, DryCleaningOutlined as DryerIcon, Kitchen as KitchenIcon, Tv as TvIcon, Balcony as BalconyIcon, Pool as PoolIcon, FitnessCenter as GymIcon, Elevator as ElevatorIcon, Pets as PetsIcon, SmokingRooms as SmokingIcon, Security as SecurityIcon, Lock as LockIcon } from "@mui/icons-material";
import { colors } from "../../theme/gradients.ts";
import type { Facilities } from "../../types/apartment.types";

interface FacilityItem { key: keyof Facilities; label: string; icon: React.ReactNode; }

const facilityGroups: { title: string; items: FacilityItem[] }[] = [
    { title: "Internet & Parcare", items: [
            { key: "wifi",        label: "Wi-Fi gratuit",    icon: <WifiIcon /> },
            { key: "parking",     label: "Parcare",          icon: <ParkingIcon /> },
            { key: "parkingFree", label: "Parcare gratuită", icon: <ParkingIcon /> },
        ]},
    { title: "Climă", items: [
            { key: "ac",      label: "Aer condiționat", icon: <AcIcon /> },
            { key: "heating", label: "Încălzire",       icon: <HeatingIcon /> },
        ]},
    { title: "Electrocasnice", items: [
            { key: "washer",      label: "Mașină de spălat", icon: <WasherIcon /> },
            { key: "dryer",       label: "Uscător",          icon: <DryerIcon /> },
            { key: "dishwasher",  label: "Mașină de vase",   icon: <KitchenIcon /> },
            { key: "refrigerator",label: "Frigider",         icon: <KitchenIcon /> },
            { key: "microwave",   label: "Cuptor microunde", icon: <KitchenIcon /> },
            { key: "oven",        label: "Cuptor",           icon: <KitchenIcon /> },
            { key: "stove",       label: "Plită",            icon: <KitchenIcon /> },
            { key: "tv",          label: "TV",               icon: <TvIcon /> },
        ]},
    { title: "Spații & Dotări", items: [
            { key: "balcony",  label: "Balcon",      icon: <BalconyIcon /> },
            { key: "terrace",  label: "Terasă",      icon: <BalconyIcon /> },
            { key: "garden",   label: "Grădină",     icon: <BalconyIcon /> },
            { key: "pool",     label: "Piscină",     icon: <PoolIcon /> },
            { key: "gym",      label: "Sală fitness",icon: <GymIcon /> },
            { key: "elevator", label: "Ascensor",    icon: <ElevatorIcon /> },
        ]},
    { title: "Politici", items: [
            { key: "petFriendly",    label: "Animale acceptate", icon: <PetsIcon /> },
            { key: "smokingAllowed", label: "Fumat permis",      icon: <SmokingIcon /> },
        ]},
    { title: "Securitate", items: [
            { key: "securityCamera", label: "Cameră securitate", icon: <SecurityIcon /> },
            { key: "keypadEntry",    label: "Intrare cu cod",    icon: <LockIcon /> },
            { key: "safe",           label: "Seif",              icon: <LockIcon /> },
        ]},
];

const FacilitiesTab = ({ facilities }: { facilities: Facilities }) => (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 3 }}>
        {facilityGroups.map((group) => (
            <Paper key={group.title} variant="outlined" sx={{
                p: 2.5, borderRadius: 3,
                border: `1px solid ${colors.border}`,
                bgcolor: "background.paper",      // ← reacționează la temă
            }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, color: "primary.main" }}>
                    {group.title}
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    {group.items.map((item) => {
                        const active = facilities[item.key];
                        return (
                            <Box key={item.key} sx={{ display: "flex", alignItems: "center", gap: 1.5, opacity: active ? 1 : 0.45 }}>
                                <Box sx={{
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    width: 32, height: 32, borderRadius: 2,
                                    // ← bgcolor și color din temă, nu hardcodate
                                    bgcolor: active ? colors.primaryAlpha10 : "action.hover",
                                    color:   active ? "primary.main" : "text.disabled",
                                    "& svg": { fontSize: 18 },
                                }}>
                                    {item.icon}
                                </Box>
                                <Typography variant="body2" fontWeight={active ? 600 : 400} sx={{
                                    // ← color din temă
                                    color: active ? "text.primary" : "text.disabled",
                                    flex: 1,
                                }}>
                                    {item.label}
                                </Typography>
                                {active
                                    ? <CheckIcon sx={{ fontSize: 16, color: "success.main" }} />
                                    : <CloseIcon sx={{ fontSize: 16, color: "text.disabled" }} />
                                }
                            </Box>
                        );
                    })}
                </Box>
            </Paper>
        ))}
    </Box>
);

export default FacilitiesTab;