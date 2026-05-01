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
            {/* City / region chips */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
                {[location.city, location.region, location.country, location.postalCode]
                    .filter(Boolean)
                    .map((label) => (
                        <Chip
                            key={label}
                            label={label}
                            variant="outlined"
                            color="primary"
                            sx={{ fontWeight: 600, borderRadius: "8px" }}
                        />
                    ))}
            </Box>

            {/* Map embed */}
            <Box sx={{
                borderRadius: "14px",
                overflow: "hidden",
                border: `1px solid ${colors.border}`,
                boxShadow: `0 4px 20px ${colors.primaryAlpha10}`,
                height: 360,
            }}>
                <iframe
                    title={t("apartment.tabs.location")}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0, display: "block" }}
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps?q=${location.latitude},${location.longitude}&z=15&output=embed`}
                    allowFullScreen
                />
            </Box>

            {/* Nearby landmarks */}
            {location.nearbyLandmarks && location.nearbyLandmarks.length > 0 && (
                <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
                        {t("components.locationTab.nearbyLandmarks")}
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {location.nearbyLandmarks.map((lm) => (
                            <Chip
                                key={lm}
                                icon={<LocationOnIcon sx={{ fontSize: 15 }} />}
                                label={lm}
                                sx={{
                                    bgcolor: colors.primaryAlpha06,
                                    color: colors.primaryDark,
                                    fontWeight: 500,
                                    borderRadius: "8px",
                                }}
                            />
                        ))}
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default LocationTab;