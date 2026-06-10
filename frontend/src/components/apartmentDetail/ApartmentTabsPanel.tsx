// components/apartmentDetail/ApartmentTabsPanel.tsx
import { useState } from "react";
import { Box, Paper, Tabs, Tab } from "@mui/material";
import { LocationOn as LocationOnIcon, Wifi as WifiIcon, MeetingRoom as RoomsIcon, Star as StarIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { colors } from "../../theme/gradients";
import type { MapLocation, Facilities, AdditionalInfo } from "../../types/apartment.types";
import type { ReviewApiDto } from "../../services/reviewService";
import TabPanel         from "./TabPanel";
import LocationTab      from "./LocationTab";
import FacilitiesTab    from "./FacilitiesTab";
import AdditionalInfoTab from "./AdditionaInfoTab";
import ReviewsTab       from "./ReviewsTab";

interface Props {
    location:    MapLocation | null;
    facilities:  Facilities  | null;
    addInfo:     AdditionalInfo | null;
    reviews:     ReviewApiDto[];
    apartmentId: number;
    ownerId:     number;
}

export default function ApartmentTabsPanel({ location, facilities, addInfo, reviews, apartmentId, ownerId }: Props) {
    const { t }        = useTranslation();
    const [active, setActive] = useState(0);

    const tabs = [
        { label: t("apartment.tabs.location"),   icon: <LocationOnIcon sx={{ fontSize: 17 }} /> },
        { label: t("apartment.tabs.facilities"), icon: <WifiIcon       sx={{ fontSize: 17 }} /> },
        { label: t("apartment.tabs.info"),       icon: <RoomsIcon      sx={{ fontSize: 17 }} /> },
        { label: t("apartment.tabs.reviews"),    icon: <StarIcon       sx={{ fontSize: 17 }} /> },
    ];

    return (
        <Paper elevation={0} sx={{ borderRadius: 4, overflow: "hidden", border: `1px solid ${colors.border}`, bgcolor: "background.paper" }}>
            <Box sx={{ borderBottom: `1px solid ${colors.border}`, bgcolor: "background.paper", px: { xs: 1, sm: 3 } }}>
                <Tabs
                    value={active}
                    onChange={(_, v) => setActive(v)}
                    centered
                    sx={{
                        "& .MuiTab-root": { minHeight: 56, px: { xs: 1.5, sm: 2.5 }, textTransform: "none", fontWeight: 600, fontSize: 14 },
                        "& .MuiTabs-indicator": { height: 3, borderRadius: "3px 3px 0 0" },
                    }}
                >
                    {tabs.map((tab, idx) => (
                        <Tab
                            key={tab.label}
                            label={
                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                                    <Box sx={{ color: active === idx ? "primary.main" : "text.secondary", display: "flex", alignItems: "center", transition: "color 0.18s ease" }}>
                                        {tab.icon}
                                    </Box>
                                    <span>{tab.label}</span>
                                </Box>
                            }
                        />
                    ))}
                </Tabs>
            </Box>

            <Box sx={{ p: { xs: 2.5, sm: 4 }, bgcolor: "background.paper" }}>
                <TabPanel value={active} index={0}>{location   && <LocationTab location={location} />}</TabPanel>
                <TabPanel value={active} index={1}>{facilities && <FacilitiesTab facilities={facilities} />}</TabPanel>
                <TabPanel value={active} index={2}>{addInfo    && <AdditionalInfoTab info={addInfo} />}</TabPanel>
                <TabPanel value={active} index={3}><ReviewsTab reviews={reviews} apartmentId={apartmentId} ownerId={ownerId} /></TabPanel>
            </Box>
        </Paper>
    );
}
