// components/apartmentDetail/LocationTab.tsx
import { Box, Typography, Chip } from "@mui/material";
import { LocationOn as LocationOnIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { colors }         from "../../theme/gradients.ts";
import type { MapLocation } from "../../types/apartment.types";

const LocationTab = ({ location }: { location: MapLocation }) => {
    const { t } = useTranslation();
    return (
        <Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 3 }}>
                {[location.city, location.region, location.country, location.postalCode]
                    .filter(Boolean)
                    .map((label) => (
                        <Chip key={label} label={label} variant="outlined" color="primary" sx={{ fontWeight: 600, borderRadius: 2 }} />
                    ))}
            </Box>

            <Box sx={{ borderRadius: 3, overflow: "hidden", border: `1px solid ${colors.border}`, boxShadow: `0 4px 20px ${colors.primaryAlpha10}`, height: 380 }}>
                <iframe
                    title={t("apartment.tabs.location")}
                    width="100%" height="100%"
                    frameBorder="0" style={{ border: 0 }}
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps?q=${location.latitude},${location.longitude}&z=15&output=embed`}
                    allowFullScreen
                />
            </Box>

            {location.nearbyLandmarks && location.nearbyLandmarks.length > 0 && (
                <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>
                        {t("components.locationTab.nearbyLandmarks")}
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {location.nearbyLandmarks.map((lm) => (
                            <Chip key={lm} icon={<LocationOnIcon sx={{ fontSize: 16 }} />} label={lm}
                                  sx={{ bgcolor: colors.primaryAlpha06, color: colors.primaryDark, fontWeight: 500, borderRadius: 2 }} />
                        ))}
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default LocationTab;