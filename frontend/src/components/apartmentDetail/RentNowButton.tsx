// components/apartmentDetail/RentNowButton.tsx
import { Box, Button, Typography, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { colors } from "../../theme/gradients";

interface Props {
    apartmentId: number;
    interval:    string;
    isAvailable: boolean;
    isOwner:     boolean;
}

export default function RentNowButton({ apartmentId, interval, isAvailable, isOwner }: Props) {
    const navigate  = useNavigate();
    const { t }     = useTranslation();

    return (
        <Box sx={{ mt: "auto" }}>
            <Tooltip
                title={isOwner ? t("apartment.ownApartment") : ""}
                placement="top" arrow
                disableHoverListener={!isOwner}
                disableFocusListener={!isOwner}
                disableTouchListener={!isOwner}
            >
                <span style={{ display: "block", width: "100%" }}>
                    <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        onClick={() => navigate(`/payments?apartmentId=${apartmentId}&interval=${interval}`)}
                        disabled={!isAvailable}
                        sx={{
                            py: 1.6, borderRadius: 2,
                            fontWeight: 700, fontSize: 15,
                            textTransform: "none",
                            boxShadow: isAvailable ? `0 4px 14px ${colors.primaryAlpha25}` : "none",
                        }}
                    >
                        {isAvailable ? t("apartment.rentNow") : t("apartment.unavailable")}
                    </Button>
                </span>
            </Tooltip>
            {isAvailable && (
                <Typography variant="caption" color="text.secondary"
                            sx={{ display: "block", mt: 1.5, textAlign: "center" }}>
                    {t("apartment.redirect")}
                </Typography>
            )}
        </Box>
    );
}
