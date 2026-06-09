// components/dashboard/PastHeroStayCard.tsx
import { Box, Typography, Button } from "@mui/material";
import LocationOnIcon    from "@mui/icons-material/LocationOn";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { useTranslation } from "react-i18next";
import { useNavigate }    from "react-router-dom";
import { colors, gradients } from "../../theme/gradients";
import { paths }          from "../../app/paths";
import type { StayEntry } from "./stayHelpers";
import PastDateOverlay    from "./PastDateOverlay";

interface Props {
    stay: StayEntry;
}

export default function PastHeroStayCard({ stay }: Props) {
    const { t }    = useTranslation();
    const navigate = useNavigate();
    const { apartment, startDate, endDate } = stay;
    const cardImage = apartment.image_urls?.[0] ?? apartment.image_url;

    return (
        <Box sx={{
            borderRadius: 4, overflow: "hidden",
            border: `1px solid ${colors.border}`,
            bgcolor: "background.paper",
            display: "flex", flexDirection: "column",
            height: "100%",
            boxShadow: `0 4px 24px ${colors.primaryAlpha10}`,
            transition: "box-shadow 0.25s, transform 0.25s",
            "&:hover": {
                boxShadow: `0 10px 40px ${colors.primaryAlpha25}`,
                transform: "translateY(-3px)",
            },
        }}>
            {/* Imagine desaturată pentru sejururi terminate */}
            <Box sx={{ position: "relative", flex: "0 0 300px", overflow: "hidden", bgcolor: "background.default" }}>
                {cardImage
                    ? <img src={cardImage} alt={apartment.Address}
                           style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.7)" }} />
                    : <Box sx={{
                        width: "100%", height: "100%",
                        background: gradients.primary, opacity: 0.6,
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                        <LocationOnIcon sx={{ fontSize: 48, color: "#fff", opacity: 0.4 }} />
                    </Box>
                }
                <PastDateOverlay startDate={startDate} endDate={endDate} />
            </Box>

            {/* Info */}
            <Box sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column", gap: 2.5 }}>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                    <Box sx={{
                        background: colors.primaryAlpha10, p: 1, borderRadius: 1.5,
                        border: `1px solid ${colors.primaryAlpha25}`, flexShrink: 0,
                    }}>
                        <LocationOnIcon sx={{ fontSize: 18, color: "primary.main", display: "block" }} />
                    </Box>
                    <Typography sx={{ fontWeight: 800, fontSize: 16, color: "text.primary", lineHeight: 1.35, letterSpacing: "-0.3px" }}>
                        {apartment.Address}
                    </Typography>
                </Box>

                <Box sx={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    p: 2, borderRadius: 2,
                    bgcolor: "background.default",
                    border: `1px solid ${colors.border}`,
                }}>
                    <Box>
                        <Typography sx={{ fontSize: 10, fontWeight: 700, color: "text.disabled", textTransform: "uppercase", letterSpacing: 1, mb: 0.3 }}>
                            {t("apartment.owner")}
                        </Typography>
                        <Typography sx={{ fontWeight: 700, fontSize: 13, color: "text.primary" }}>
                            {`User #${apartment.Id_Owner}`}
                        </Typography>
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                        <Typography sx={{ fontSize: 10, fontWeight: 700, color: "text.disabled", textTransform: "uppercase", letterSpacing: 1, mb: 0.3 }}>
                            {t("apartment.price")}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.4, justifyContent: "flex-end" }}>
                            <Typography sx={{ fontWeight: 900, fontSize: 20, color: "primary.main", lineHeight: 1 }}>
                                {apartment.Cost_per_interval}
                            </Typography>
                            <Typography sx={{ fontWeight: 600, fontSize: 12, color: "text.secondary" }}>
                                {apartment.Currency}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Button
                    variant="outlined"
                    fullWidth
                    endIcon={<ArrowRightAltIcon />}
                    onClick={() => navigate(paths.apartmentDetail(apartment.Id_Apartment))}
                    sx={{
                        mt: "auto", fontWeight: 700, textTransform: "none",
                        borderRadius: 2.5, py: 1.3,
                        borderColor: colors.primaryAlpha25,
                        color: "primary.main",
                        "&:hover": { borderColor: "primary.main", bgcolor: colors.primaryAlpha06 },
                    }}
                >
                    {t("listings.details")}
                </Button>
            </Box>
        </Box>
    );
}
