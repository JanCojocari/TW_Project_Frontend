// src/components/createListing/StepFacilities.tsx
import { memo }              from "react";
import { Box, Typography }   from "@mui/material";
import {
    Star as StarIcon, CheckCircle as CheckIcon,
    Wifi as WifiIcon, LocalParking as ParkingIcon, AcUnit as AcIcon,
    LocalFireDepartment as HeatingIcon, LocalLaundryService as WasherIcon,
    DryCleaningOutlined as DryerIcon, Kitchen as KitchenIcon, Tv as TvIcon,
    Balcony as BalconyIcon, Pool as PoolIcon, FitnessCenter as GymIcon,
    Elevator as ElevatorIcon, Pets as PetsIcon, SmokingRooms as SmokingIcon,
    Security as SecurityIcon, Lock as LockIcon,
} from "@mui/icons-material";
import { useTranslation }    from "react-i18next";
import Section               from "./Section.tsx";
import { colors }            from "../../theme/gradients.ts";
import type { Facilities }   from "../../types/apartment.types";

interface Props { facilities: Facilities; onToggle: (key: keyof Facilities) => void; }

const activeCount = (f: Facilities) => Object.values(f).filter(Boolean).length;

const StepFacilities = memo(({ facilities, onToggle }: Props) => {
    const { t, i18n } = useTranslation();
    const isEn = i18n.language === "en";

    const groups: {
        titleRo: string;
        titleEn: string;
        items: { key: keyof Facilities; labelRo: string; labelEn: string; icon: React.ReactNode }[];
    }[] = [
        {
            titleRo: "Internet & Parcare", titleEn: "Internet & Parking",
            items: [
                { key: "wifi",        labelRo: "Wi-Fi gratuit",    labelEn: "Free Wi-Fi",   icon: <WifiIcon /> },
                { key: "parking",     labelRo: "Parcare",          labelEn: "Parking",      icon: <ParkingIcon /> },
                { key: "parkingFree", labelRo: "Parcare gratuită", labelEn: "Free parking", icon: <ParkingIcon /> },
            ],
        },
        {
            titleRo: "Climă", titleEn: "Climate",
            items: [
                { key: "ac",      labelRo: "Aer condiționat", labelEn: "Air conditioning", icon: <AcIcon /> },
                { key: "heating", labelRo: "Încălzire",       labelEn: "Heating",          icon: <HeatingIcon /> },
            ],
        },
        {
            titleRo: "Electrocasnice", titleEn: "Appliances",
            items: [
                { key: "washer",       labelRo: "Mașină spălat",  labelEn: "Washing machine", icon: <WasherIcon /> },
                { key: "dryer",        labelRo: "Uscător",         labelEn: "Dryer",           icon: <DryerIcon /> },
                { key: "dishwasher",   labelRo: "Mașină vase",    labelEn: "Dishwasher",      icon: <KitchenIcon /> },
                { key: "refrigerator", labelRo: "Frigider",        labelEn: "Refrigerator",    icon: <KitchenIcon /> },
                { key: "microwave",    labelRo: "Microunde",       labelEn: "Microwave",       icon: <KitchenIcon /> },
                { key: "oven",         labelRo: "Cuptor",          labelEn: "Oven",            icon: <KitchenIcon /> },
                { key: "stove",        labelRo: "Plită",           labelEn: "Stove",           icon: <KitchenIcon /> },
                { key: "tv",           labelRo: "TV",              labelEn: "TV",              icon: <TvIcon /> },
            ],
        },
        {
            titleRo: "Spații & Dotări", titleEn: "Spaces & Amenities",
            items: [
                { key: "balcony",  labelRo: "Balcon",       labelEn: "Balcony",  icon: <BalconyIcon /> },
                { key: "terrace",  labelRo: "Terasă",       labelEn: "Terrace",  icon: <BalconyIcon /> },
                { key: "garden",   labelRo: "Grădină",      labelEn: "Garden",   icon: <BalconyIcon /> },
                { key: "pool",     labelRo: "Piscină",      labelEn: "Pool",     icon: <PoolIcon /> },
                { key: "gym",      labelRo: "Sală fitness", labelEn: "Gym",      icon: <GymIcon /> },
                { key: "elevator", labelRo: "Ascensor",     labelEn: "Elevator", icon: <ElevatorIcon /> },
            ],
        },
        {
            titleRo: "Politici", titleEn: "Policies",
            items: [
                { key: "petFriendly",    labelRo: "Animale acceptate", labelEn: "Pets allowed",    icon: <PetsIcon /> },
                { key: "smokingAllowed", labelRo: "Fumat permis",      labelEn: "Smoking allowed", icon: <SmokingIcon /> },
            ],
        },
        {
            titleRo: "Securitate", titleEn: "Security",
            items: [
                { key: "securityCamera", labelRo: "Cameră securitate", labelEn: "Security camera", icon: <SecurityIcon /> },
                { key: "keypadEntry",    labelRo: "Intrare cu cod",    labelEn: "Keypad entry",    icon: <LockIcon /> },
                { key: "safe",           labelRo: "Seif",              labelEn: "Safe",            icon: <LockIcon /> },
            ],
        },
    ];

    const count = activeCount(facilities);

    return (
        <Section
            icon={<StarIcon sx={{ fontSize: 24 }} />}
            title={t("createListing.steps.facilities.title")}
            subtitle={`${count} ${t("components.steps.facilities.selected")}`}
            step={4}
        >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {groups.map(group => (
                    <Box key={group.titleRo}>
                        <Typography
                            variant="caption"
                            fontWeight={800}
                            color="text.secondary"
                            sx={{ textTransform: "uppercase", letterSpacing: "0.8px", display: "block", mb: 1.5 }}
                        >
                            {isEn ? group.titleEn : group.titleRo}
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                            {group.items.map(item => {
                                const active = facilities[item.key];
                                return (
                                    <Box
                                        key={item.key}
                                        onClick={() => onToggle(item.key)}
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                            px: 2, py: 1,
                                            borderRadius: 99,
                                            cursor: "pointer",
                                            border: `1px solid ${active ? colors.primaryDark : colors.border}`,
                                            bgcolor: active ? colors.primaryAlpha10 : "background.paper",
                                            color: active ? colors.primaryDark : "text.secondary",
                                            fontWeight: active ? 700 : 500,
                                            transition: "all 0.15s ease",
                                            "&:hover": {
                                                borderColor: colors.primaryDark,
                                                bgcolor: colors.primaryAlpha06,
                                                color: colors.primaryDark,
                                            },
                                            "& svg": { fontSize: 17 },
                                        }}
                                    >
                                        <Box sx={{ color: "inherit", display: "flex" }}>{item.icon}</Box>
                                        <Typography variant="body2" fontWeight="inherit" sx={{ color: "inherit", fontSize: 13 }}>
                                            {isEn ? item.labelEn : item.labelRo}
                                        </Typography>
                                        {active && <CheckIcon sx={{ fontSize: 13, ml: 0.5 }} />}
                                    </Box>
                                );
                            })}
                        </Box>
                    </Box>
                ))}
            </Box>
        </Section>
    );
});

StepFacilities.displayName = "StepFacilities";
export default StepFacilities;