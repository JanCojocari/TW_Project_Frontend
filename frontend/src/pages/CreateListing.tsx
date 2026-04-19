// src/pages/CreateListing.tsx
import { useCallback, useState } from "react";
import { useNavigate }    from "react-router-dom";
import { useAuth }        from "../auth/AuthContext.tsx";
import { useTranslation } from "react-i18next";
import { Box, Container, Typography, Button, Alert } from "@mui/material";
import { apartmentService, buildCreatePayload } from "../services/apartmentService.ts";
import { uploadService }  from "../services/uploadService.ts";
import { ArrowBack as ArrowBackIcon, Home as HomeIcon } from "@mui/icons-material";
import { gradients } from "../theme/gradients.ts";
import { paths }     from "../app/paths.ts";
import { useListingForm } from "../types/UseListingForm.ts";
import SuccessScreen      from "../components/createListing/SuccessScreen.tsx";
import StepBasicInfo      from "../components/createListing/StepBasicInfo.tsx";
import StepPhotos         from "../components/createListing/StepPhotos.tsx";
import StepLocation       from "../components/createListing/StepLocation.tsx";
import StepFacilities     from "../components/createListing/StepFacilities.tsx";
import StepSpaceInfo      from "../components/createListing/StepSpaceInfo.tsx";
import StepDescription    from "../components/createListing/StepDescription.tsx";

const headerIcon = <HomeIcon sx={{ fontSize: 28 }} />;

const CreateListing = () => {
    const navigate        = useNavigate();
    const { t }           = useTranslation();
    const { currentUser } = useAuth();
    const {
        form, errors, submitted,
        set, clearError, setFacility,
        handleImages, removeImage, addLandmark, removeLandmark,
        submit,
    } = useListingForm();

    const handleAddImages   = useCallback(
        (files: FileList | null) => handleImages(files, form.images.length),
        [handleImages, form.images.length],
    );
    const handleRemoveImage = useCallback(
        (idx: number) => removeImage(idx, form.imagePreviewUrls),
        [removeImage, form.imagePreviewUrls],
    );
    const handleAddLandmark = useCallback(
        () => addLandmark(form.landmarkInput),
        [addLandmark, form.landmarkInput],
    );

    const [apiError, setApiError]     = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = useCallback(
        () => submit(async (markDone) => {
            if (isSubmitting) return;
            setApiError(null);
            try {
                // 1. Upload imagini — daca userul a selectat fisiere
                let imageUrls: string[] = [];
                if (form.images.length > 0) {
                    imageUrls = await uploadService.images(form.images);
                }

                // 2. Creeaza apartamentul cu URL-urile rezultate
                await apartmentService.create(
                    currentUser?.id ?? 0,
                    buildCreatePayload(form, imageUrls),
                );

                markDone();

                // 3. Redirect la dashboard — anuntul e Pending, apare in "Proprietatile mele"
                setTimeout(() => navigate(paths.dashboard), 1500);
            } catch {
                setApiError("Eroare la salvarea anunțului. Verificați conexiunea și încercați din nou.");
                setIsSubmitting(false);
            }
        }),
        [submit, navigate, form, currentUser],
    );

    if (submitted) return <SuccessScreen />;

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: { xs: 3, md: 5 }, mt: 10 }}>
            <Container maxWidth="md">

                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 3, fontWeight: 600 }}>
                    {t("createListing.back")}
                </Button>

                <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Box sx={{ background: gradients.primary, p: 1.5, borderRadius: 2, display: "flex", color: "white" }}>
                            {headerIcon}
                        </Box>
                        <Box>
                            <Typography variant="h4" fontWeight={900}>{t("createListing.title")}</Typography>
                            <Typography variant="body2" color="text.secondary">{t("createListing.subtitle")}</Typography>
                        </Box>
                    </Box>
                </Box>

                {Object.values(errors).some(Boolean) && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
                        {t("createListing.errorsAlert")}
                    </Alert>
                )}
                {apiError && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
                        {apiError}
                    </Alert>
                )}

                <StepBasicInfo
                    address={form.address}
                    cost={form.cost}
                    currency={form.currency}
                    interval={form.interval}
                    errors={errors}
                    set={set}
                    clearError={clearError}
                />
                <StepPhotos
                    images={form.images}
                    imagePreviewUrls={form.imagePreviewUrls}
                    errors={errors}
                    onAddImages={handleAddImages}
                    onRemoveImage={handleRemoveImage}
                />
                <StepLocation
                    city={form.city}
                    region={form.region}
                    postalCode={form.postalCode}
                    latitude={form.latitude}
                    longitude={form.longitude}
                    landmarks={form.landmarks}
                    landmarkInput={form.landmarkInput}
                    errors={errors}
                    set={set}
                    clearError={clearError}
                    onAddLandmark={handleAddLandmark}
                    onRemoveLandmark={removeLandmark}
                />
                <StepFacilities
                    facilities={form.facilities}
                    onToggle={setFacility}
                />
                <StepSpaceInfo
                    rooms={form.rooms}
                    bedrooms={form.bedrooms}
                    bathrooms={form.bathrooms}
                    beds={form.beds}
                    surfaceArea={form.surfaceArea}
                    maxGuests={form.maxGuests}
                    floor={form.floor}
                    totalFloors={form.totalFloors}
                    checkInFrom={form.checkInFrom}
                    checkInUntil={form.checkInUntil}
                    checkOutFrom={form.checkOutFrom}
                    checkOutUntil={form.checkOutUntil}
                    selfCheckIn={form.selfCheckIn}
                    set={set}
                />
                <StepDescription
                    description={form.description}
                    houseRules={form.houseRules}
                    cancellationPolicy={form.cancellationPolicy}
                    errors={errors}
                    set={set}
                    clearError={clearError}
                />

                <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, mb: 6 }}>
                    <Button variant="outlined" size="large" fullWidth onClick={() => navigate(-1)}
                            sx={{ py: 1.8, borderRadius: 2.5, fontWeight: 700 }}>
                        {t("createListing.cancel")}
                    </Button>
                    <Button
                        variant="contained" size="large" fullWidth
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        sx={{ py: 1.8, borderRadius: 2.5, fontWeight: 800, fontSize: 16 }}
                    >
                        {isSubmitting ? "Se publică..." : t("createListing.publish")}
                    </Button>
                </Box>

            </Container>
        </Box>
    );
};

export default CreateListing;