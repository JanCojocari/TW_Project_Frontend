// components/createListing/CreateListingSidebar.tsx
import { Box, Button, LinearProgress, Tooltip, Typography } from "@mui/material";
import {
    Home       as HomeIcon,
    CheckCircle as CheckIcon,
    ArrowBack   as ArrowBackIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { gradients, colors } from "../../theme/gradients";
import { STEPS, NAVBAR_H, SIDEBAR_W } from "../../types/CreateListingTypes";

interface Props {
    isEditMode:   boolean;
    activeStep:   number;
    visitedSteps: Set<number>;
    progress:     number;
    onStepClick:  (idx: number) => void;
    onBack:       () => void;
}

export default function CreateListingSidebar({
    isEditMode, activeStep, visitedSteps, progress, onStepClick, onBack,
}: Props) {
    const { t } = useTranslation();

    return (
        <Box sx={{
            width: SIDEBAR_W,
            bgcolor: "background.paper",
            borderRight: `1px solid ${colors.border}`,
            position: "sticky",
            top: NAVBAR_H,
            height: `calc(100vh - ${NAVBAR_H}px)`,
            alignSelf: "flex-start",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            zIndex: 900,
        }}>
            {/* Header */}
            <Box sx={{ px: 3, pt: 3, pb: 2, borderBottom: `1px solid ${colors.border}` }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
                    <Box sx={{ background: gradients.primary, p: 1, borderRadius: 1.5, display: "flex", color: "white", flexShrink: 0 }}>
                        <HomeIcon sx={{ fontSize: 18 }} />
                    </Box>
                    <Typography fontWeight={800} fontSize={15} sx={{ letterSpacing: "-0.3px" }}>
                        {isEditMode ? "Editare anunț" : t("createListing.title")}
                    </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                    {t("createListing.subtitle")}
                </Typography>

                <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                        <Typography variant="caption" fontWeight={600} color="text.secondary">
                            {t("components.section.step")} {activeStep + 1}/{STEPS.length}
                        </Typography>
                        <Typography variant="caption" fontWeight={700} sx={{ color: colors.primaryDark }}>
                            {progress}%
                        </Typography>
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                            height: 5,
                            borderRadius: 99,
                            bgcolor: colors.primaryAlpha10,
                            "& .MuiLinearProgress-bar": {
                                background: gradients.primary,
                                borderRadius: 99,
                            },
                        }}
                    />
                </Box>
            </Box>

            {/* Step list */}
            <Box sx={{ flex: 1, py: 1.5 }}>
                {STEPS.map((step, idx) => {
                    const isActive    = idx === activeStep;
                    const isVisited   = visitedSteps.has(idx);
                    const isCompleted = isVisited && idx < activeStep;

                    return (
                        <Tooltip key={step.key} title={t(step.descKey)} placement="right" arrow>
                            <Box
                                onClick={() => onStepClick(idx)}
                                sx={{
                                    display: "flex", alignItems: "center", gap: 1.5,
                                    px: 2, py: 1.3,
                                    cursor: "pointer", position: "relative",
                                    transition: "all 0.15s",
                                    bgcolor: isActive ? colors.primaryAlpha10 : "transparent",
                                    "&:hover": { bgcolor: isActive ? colors.primaryAlpha10 : colors.primaryAlpha06 },
                                    "&::before": isActive ? {
                                        content: '""', position: "absolute",
                                        left: 0, top: "15%", bottom: "15%",
                                        width: 3, borderRadius: "0 4px 4px 0",
                                        background: gradients.primary,
                                    } : {},
                                }}
                            >
                                <Box sx={{
                                    width: 28, height: 28, borderRadius: "50%",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    flexShrink: 0,
                                    bgcolor: isCompleted ? colors.success : isActive ? colors.primaryDark : colors.primaryAlpha10,
                                    color: isCompleted || isActive ? "#fff" : colors.primaryDark,
                                    transition: "all 0.2s", fontSize: 12, fontWeight: 800,
                                }}>
                                    {isCompleted
                                        ? <CheckIcon sx={{ fontSize: 15 }} />
                                        : <Box component="span" sx={{ display: "flex", alignItems: "center", color: "inherit" }}>
                                            {step.icon}
                                        </Box>
                                    }
                                </Box>

                                <Typography
                                    variant="body2"
                                    fontWeight={isActive ? 700 : 400}
                                    sx={{ color: isActive ? colors.primaryDark : isCompleted ? "text.primary" : "text.secondary" }}
                                >
                                    {t(step.labelKey)}
                                </Typography>

                                {isCompleted && (
                                    <CheckIcon sx={{ fontSize: 14, color: colors.success, ml: "auto" }} />
                                )}
                            </Box>
                        </Tooltip>
                    );
                })}
            </Box>

            {/* Back button */}
            <Box sx={{ p: 2, borderTop: `1px solid ${colors.border}` }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={onBack}
                    fullWidth variant="outlined" size="small"
                    sx={{ borderRadius: 2, fontWeight: 600, borderColor: colors.border, color: "text.secondary" }}
                >
                    {t("createListing.back")}
                </Button>
            </Box>
        </Box>
    );
}
