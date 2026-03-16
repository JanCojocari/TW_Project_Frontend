// pages/CreateListing.tsx
import { useNavigate }    from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Box, Container, Typography, Button, Alert, LinearProgress } from "@mui/material";
import { ArrowBack as ArrowBackIcon, Home as HomeIcon } from "@mui/icons-material";
import { gradients, colors } from "../theme/gradients.ts";
import { paths }             from "../app/paths.ts";
import { useListingForm }    from "../types/UseListingForm.ts";
import SuccessScreen         from "../components/createListing/SuccessScreen.tsx";
import StepBasicInfo         from "../components/createListing/StepBasicInfo.tsx";
import StepPhotos            from "../components/createListing/StepPhotos.tsx";
import StepLocation          from "../components/createListing/StepLocation.tsx";
import StepFacilities        from "../components/createListing/StepFacilities.tsx";
import StepSpaceInfo         from "../components/createListing/StepSpaceInfo.tsx";
import StepDescription       from "../components/createListing/StepDescription.tsx";

const CreateListing = () => {
    const navigate = useNavigate();
    const { t }    = useTranslation();
    const {
        form, errors, submitted, progress,
        set, clearError, setFacility,
        handleImages, removeImage, addLandmark, removeLandmark,
        submit,
    } = useListingForm();

    if (submitted) return <SuccessScreen />;

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: { xs: 3, md: 5 }, mt: 10 }}>
            <Container maxWidth="md">

                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 3, fontWeight: 600 }}>
                    {t("createListing.back")}
                </Button>

                <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                        <Box sx={{ background: gradients.primary, p: 1.5, borderRadius: 2, display: "flex", color: "white" }}>
                            <HomeIcon sx={{ fontSize: 28 }} />
                        </Box>
                        <Box>
                            <Typography variant="h4" fontWeight={900}>{t("createListing.title")}</Typography>
                            <Typography variant="body2" color="text.secondary">{t("createListing.subtitle")}</Typography>
                        </Box>
                    </Box>

                    <Box sx={{ mt: 3, p: 2.5, borderRadius: 3, bgcolor: "background.paper", border: `1px solid ${colors.border}` }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                            <Typography variant="caption" fontWeight={700} color="text.secondary">
                                {t("createListing.progress")}
                            </Typography>
                            <Typography variant="caption" fontWeight={800} color="primary.main">
                                {progress}%
                            </Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={progress}
                                        sx={{ height: 8, borderRadius: 4, bgcolor: colors.primaryAlpha10,
                                            "& .MuiLinearProgress-bar": { background: gradients.primary, borderRadius: 4 } }}
                        />
                    </Box>
                </Box>

                {Object.keys(errors).length > 0 && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
                        {t("createListing.errorsAlert")}
                    </Alert>
                )}

                <StepBasicInfo   form={form} errors={errors} set={set} clearError={clearError} />
                <StepPhotos      form={form} errors={errors}
                                 onAddImages={(files) => handleImages(files, form.images.length)}
                                 onRemoveImage={(idx) => removeImage(idx, form.imagePreviewUrls)} />
                <StepLocation    form={form} errors={errors} set={set} clearError={clearError}
                                 onAddLandmark={() => addLandmark(form.landmarkInput)}
                                 onRemoveLandmark={removeLandmark} />
                <StepFacilities  facilities={form.facilities} onToggle={setFacility} />
                <StepSpaceInfo   form={form} set={set} />
                <StepDescription form={form} errors={errors} set={set} clearError={clearError} />

                <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, mb: 6 }}>
                    <Button variant="outlined" size="large" fullWidth onClick={() => navigate(-1)}
                            sx={{ py: 1.8, borderRadius: 2.5, fontWeight: 700 }}>
                        {t("createListing.cancel")}
                    </Button>
                    <Button variant="contained" size="large" fullWidth
                            onClick={() => submit(() => setTimeout(() => navigate(paths.apartmentDetail(1)), 1500))}
                            sx={{ py: 1.8, borderRadius: 2.5, fontWeight: 800, fontSize: 16 }}>
                        {t("createListing.publish")}
                    </Button>
                </Box>

            </Container>
        </Box>
    );
};

export default CreateListing;