// components/createListing/CreateListingBottomBar.tsx
import { Box, Button, Typography } from "@mui/material";
import { ArrowBack as ArrowBackIcon, ArrowForward as ArrowForwardIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { gradients, colors } from "../../theme/gradients";
import { STEPS } from "../../types/CreateListingTypes";

interface Props {
    activeStep:     number;
    isSubmitting:   boolean;
    isEditMode:     boolean;
    summaryAddress: string;
    summaryPrice:   string;
    summaryInterval: string;
    onPrev:   () => void;
    onNext:   () => void;
    onSubmit: () => void;
}

export default function CreateListingBottomBar({
    activeStep, isSubmitting, isEditMode,
    summaryAddress, summaryPrice, summaryInterval,
    onPrev, onNext, onSubmit,
}: Props) {
    const { t } = useTranslation();
    const isLast = activeStep === STEPS.length - 1;

    return (
        <Box sx={{
            position: "sticky", bottom: 0,
            bgcolor: "background.paper",
            borderTop: `1px solid ${colors.border}`,
            px: { xs: 3, md: 5 }, py: 2,
            display: "flex", alignItems: "center", gap: 3,
            backdropFilter: "blur(8px)",
            zIndex: 10,
            boxShadow: "0 -4px 24px rgba(0,0,0,0.06)",
        }}>
            {/* Summary */}
            <Box sx={{ flex: 1, display: { xs: "none", sm: "flex" }, gap: 3 }}>
                {summaryAddress && summaryAddress !== "—" && (
                    <Box>
                        <Typography variant="caption" color="text.disabled"
                            sx={{ textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 700 }}>
                            {t("components.infoPanel.address")}
                        </Typography>
                        <Typography variant="body2" fontWeight={600}
                            sx={{ maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {summaryAddress}
                        </Typography>
                    </Box>
                )}
                {summaryPrice && summaryPrice !== "—" && (
                    <Box>
                        <Typography variant="caption" color="text.disabled"
                            sx={{ textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 700 }}>
                            {t("components.infoPanel.price")}
                        </Typography>
                        <Typography variant="body2" fontWeight={700} sx={{ color: colors.primaryDark }}>
                            {summaryPrice}{summaryInterval}
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* Navigation buttons */}
            <Box sx={{ display: "flex", gap: 1.5, ml: "auto" }}>
                {activeStep > 0 && (
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={onPrev}
                        sx={{ fontWeight: 600, borderRadius: 2, borderColor: colors.border, color: "text.secondary" }}
                    >
                        {t("createListing.back")}
                    </Button>
                )}

                {!isLast ? (
                    <Button
                        variant="contained"
                        endIcon={<ArrowForwardIcon />}
                        onClick={onNext}
                        sx={{
                            fontWeight: 700, borderRadius: 2, px: 3,
                            background: gradients.primary,
                            boxShadow: `0 4px 14px ${colors.primaryAlpha25}`,
                        }}
                    >
                        {t("createListing.next") ?? "Next"}
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        onClick={onSubmit}
                        disabled={isSubmitting}
                        sx={{
                            fontWeight: 800, fontSize: 15, borderRadius: 2, px: 4,
                            background: gradients.primary,
                            boxShadow: `0 4px 14px ${colors.primaryAlpha25}`,
                        }}
                    >
                        {isSubmitting
                            ? (t("createListing.publishing") ?? "Se publică...")
                            : isEditMode
                                ? "Salvează modificările"
                                : t("createListing.publish")
                        }
                    </Button>
                )}
            </Box>
        </Box>
    );
}
