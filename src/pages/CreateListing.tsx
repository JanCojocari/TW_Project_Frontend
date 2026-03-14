import { useNavigate } from "react-router-dom";
import { Box, Container, Typography, Button, Alert, LinearProgress } from "@mui/material";
import { ArrowBack as ArrowBackIcon, Home as HomeIcon } from "@mui/icons-material";
import { gradients, colors } from "../theme/gradients.ts";
import { paths } from "../app/paths.ts";
import { useListingForm }  from "../types/UseListingForm.ts"
import SuccessScreen       from "../components/CreateListing/SuccessScreen.tsx"
import StepBasicInfo       from "../components/CreateListing/StepBasicInfo.tsx";
import StepPhotos          from "../components/CreateListing/StepPhotos.tsx";
import StepLocation        from "../components/CreateListing/StepLocation.tsx";
import StepFacilities      from "../components/CreateListing/StepFacilities.tsx";
import StepSpaceInfo       from "../components/CreateListing/StepSpaceInfo.tsx";
import StepDescription     from "../components/CreateListing/StepDescription.tsx";

const CreateListing = () => {
    const navigate = useNavigate();
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
                    Înapoi
                </Button>

                <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                        <Box sx={{ background: gradients.primary, p: 1.5, borderRadius: 2, display: "flex", color: "white" }}>
                            <HomeIcon sx={{ fontSize: 28 }} />
                        </Box>
                        <Box>
                            <Typography variant="h4" fontWeight={900}>Plasează un anunț</Typography>
                            <Typography variant="body2" color="text.secondary">Completează detaliile apartamentului tău</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ mt: 3, p: 2.5, borderRadius: 3, bgcolor: colors.bgPaper, border: `1px solid ${colors.border}` }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                            <Typography variant="caption" fontWeight={700} color="text.secondary">Completare formular</Typography>
                            <Typography variant="caption" fontWeight={800} color="primary.main">{progress}%</Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={progress} sx={{
                            height: 8, borderRadius: 4, bgcolor: colors.primaryAlpha10,
                            "& .MuiLinearProgress-bar": { background: gradients.primary, borderRadius: 4 },
                        }} />
                    </Box>
                </Box>

                {Object.keys(errors).length > 0 && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
                        Te rugăm să completezi câmpurile obligatorii marcate mai jos.
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
                        Anulează
                    </Button>
                    <Button variant="contained" size="large" fullWidth
                            onClick={() => submit(() => setTimeout(() => navigate(paths.apartmentDetail(1)), 1500))}
                            sx={{ py: 1.8, borderRadius: 2.5, fontWeight: 800, fontSize: 16 }}>
                        Publică anunțul
                    </Button>
                </Box>

            </Container>
        </Box>
    );
};

export default CreateListing;