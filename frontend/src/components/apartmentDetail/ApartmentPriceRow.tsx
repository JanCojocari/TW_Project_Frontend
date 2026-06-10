// components/apartmentDetail/ApartmentPriceRow.tsx
import { Box, Typography, Chip } from "@mui/material";
import { useTranslation } from "react-i18next";
import { colors } from "../../theme/gradients";
import RenterPopover from "./RenterPopover";
import type { UserContact } from "./OwnerRow";

interface Props {
    cost:          number;
    currency:      string;
    intervalLabel: string;
    isOccupied:    boolean;
    renter:        UserContact | null | undefined;
}

export default function ApartmentPriceRow({ cost, currency, intervalLabel, isOccupied, renter }: Props) {
    const { t } = useTranslation();

    return (
        <Box sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}
                        sx={{ textTransform: "uppercase", letterSpacing: "0.5px", display: "block", mb: 0.75 }}>
                {t("components.infoPanel.price")}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.75 }}>
                    <Typography variant="h4" fontWeight={900} color="primary.main" lineHeight={1}>
                        {cost}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" fontWeight={600}>{currency}</Typography>
                    <Typography variant="body1" color="text.disabled" fontWeight={400}>/</Typography>
                    <Typography variant="body1" color="text.secondary" fontWeight={500}>{intervalLabel}</Typography>
                </Box>

                <Box sx={{ ml: "auto", display: "flex", alignItems: "center" }}>
                    {isOccupied && renter ? (
                        <RenterPopover renter={renter} label={t("apartment.renter")} />
                    ) : isOccupied ? (
                        <Chip label={t("listings.occupied")} size="small"
                              sx={{ fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.5px", borderRadius: 1.5, bgcolor: colors.error, color: "#fff" }}
                        />
                    ) : (
                        <Chip label={t("listings.available")} size="small"
                              sx={{ fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.5px", borderRadius: 1.5, bgcolor: colors.success, color: "#fff" }}
                        />
                    )}
                </Box>
            </Box>
        </Box>
    );
}
