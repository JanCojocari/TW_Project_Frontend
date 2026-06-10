// components/apartmentDetail/ApartmentInfoPanel.tsx
import { Box, Typography, Paper, Divider } from "@mui/material";
import { LocationOn as LocationOnIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { gradients, colors } from "../../theme/gradients.ts";
import type { Apartment } from "../../types/apartment.types";
import OwnerRow          from "./OwnerRow";
import ApartmentPriceRow from "./ApartmentPriceRow";
import RentNowButton     from "./RentNowButton";
import type { UserContact } from "./OwnerRow";

interface Props {
    apartment:   Apartment;
    owner:       UserContact | null | undefined;
    renter:      UserContact | null | undefined;
    isAvailable: boolean;
    isOwner:     boolean;
}

export default function ApartmentInfoPanel({ apartment, owner, renter, isAvailable, isOwner }: Props) {
    const { t } = useTranslation();

    const intervalMap: Record<string, string> = {
        hour:  t("apartment.perHour"),
        day:   t("apartment.perDay"),
        month: t("apartment.perMonth"),
    };
    const intervalLabel = intervalMap[apartment.Interval] ?? apartment.Interval;
    const isOccupied    = apartment.Id_Renter !== null;

    return (
        <Paper
            elevation={1}
            sx={{
                p: { xs: 3, md: 3.5 }, borderRadius: 3,
                border: `1px solid ${colors.border}`,
                bgcolor: "background.paper",
                height: "100%",
                display: "flex", flexDirection: "column",
                overflow: "hidden",
            }}
        >
            {/* Address */}
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start", mb: 3 }}>
                <Box sx={{
                    flexShrink: 0, width: 40, height: 40, borderRadius: 2,
                    background: gradients.primary,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: `0 4px 12px ${colors.primaryAlpha25}`,
                }}>
                    <LocationOnIcon sx={{ fontSize: 20, color: "#fff" }} />
                </Box>
                <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}
                                sx={{ textTransform: "uppercase", letterSpacing: "0.5px", display: "block", mb: 0.3 }}>
                        {t("components.infoPanel.address")}
                    </Typography>
                    <Typography variant="h6" fontWeight={700} lineHeight={1.25}>
                        {apartment.Address}
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <ApartmentPriceRow
                cost={apartment.Cost_per_interval}
                currency={apartment.Currency}
                intervalLabel={intervalLabel}
                isOccupied={isOccupied}
                renter={renter}
            />

            <Divider sx={{ mb: 3 }} />

            {owner && (
                <Box sx={{ mb: 3 }}>
                    <OwnerRow user={owner} label={t("apartment.owner")} />
                </Box>
            )}

            <RentNowButton
                apartmentId={apartment.Id_Apartment}
                interval={apartment.Interval}
                isAvailable={isAvailable}
                isOwner={isOwner}
            />
        </Paper>
    );
}
