// src/pages/CreateListing.tsx
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth }          from "../auth/AuthContext.tsx";
import { useTranslation }   from "react-i18next";
import { getResponseData }  from "../utils/errorUtils";
import { Box, Alert, LinearProgress, Typography } from "@mui/material";
import { apartmentService, buildCreatePayload } from "../services/apartmentService.ts";
import type { Apartment }   from "../types/apartment.types.ts";
import { uploadService }    from "../services/uploadService.ts";
import { gradients, colors } from "../theme/gradients.ts";
import { paths }            from "../app/paths.ts";
import { useListingForm }   from "../types/UseListingForm.ts";
import { validateStep, STEPS, NAVBAR_H } from "../types/CreateListingTypes.ts";
import SuccessScreen        from "../components/createListing/SuccessScreen.tsx";
import StepBasicInfo        from "../components/createListing/StepBasicInfo.tsx";
import StepPhotos           from "../components/createListing/StepPhotos.tsx";
import StepLocation         from "../components/createListing/StepLocation.tsx";
import StepFacilities       from "../components/createListing/StepFacilities.tsx";
import StepSpaceInfo        from "../components/createListing/StepSpaceInfo.tsx";
import StepDescription      from "../components/createListing/StepDescription.tsx";
import CreateListingSidebar    from "../components/createListing/CreateListingSidebar.tsx";
import CreateListingBottomBar  from "../components/createListing/CreateListingBottomBar.tsx";
import { useNotifications }    from "../context/NotificationContext.tsx";
import { ownerNotifications }  from "../services/notificationService.ts";
import { pushAdminQueueNotif } from "../utils/adminNotifHelper.ts";

const CreateListing = () => {
    const navigate        = useNavigate();
    const location        = useLocation();
    const { t }           = useTranslation();
    const { currentUser } = useAuth();
    const { addNotification } = useNotifications();

    const editApt    = (location.state as { apartment?: Apartment } | null)?.apartment ?? null;
    const isEditMode = !!editApt;

    const {
        form, errors, submitted,
        set, clearError, setFacility, setErrors,
        handleImages, removeImage, addLandmark, removeLandmark,
        submit,
    } = useListingForm();

    // Pre-populeaza form-ul o singura data in modul edit
    const editInitialized = useRef(false);
    useEffect(() => {
        if (!editApt || editInitialized.current) return;
        editInitialized.current = true;
        set("address",            editApt.Address);
        set("cost",               String(editApt.Cost_per_interval));
        set("currency",           editApt.Currency);
        set("interval",           editApt.Interval);
        set("city",               editApt.location.city);
        set("region",             editApt.location.region     ?? "");
        set("postalCode",         editApt.location.postalCode ?? "");
        set("latitude",           String(editApt.location.latitude  ?? ""));
        set("longitude",          String(editApt.location.longitude ?? ""));
        set("description",        editApt.additionalInfo.description);
        set("houseRules",         editApt.additionalInfo.houseRules        ?? "");
        set("cancellationPolicy", editApt.additionalInfo.cancellationPolicy);
        set("rooms",              String(editApt.additionalInfo.rooms));
        set("bedrooms",           String(editApt.additionalInfo.bedrooms   ?? ""));
        set("bathrooms",          String(editApt.additionalInfo.bathrooms));
        set("beds",               String(editApt.additionalInfo.beds       ?? ""));
        set("floor",              String(editApt.additionalInfo.floor));
        set("totalFloors",        String(editApt.additionalInfo.totalFloors));
        set("surfaceArea",        String(editApt.additionalInfo.surfaceArea));
        set("maxGuests",          String(editApt.additionalInfo.maxGuests));
        set("checkInFrom",        editApt.additionalInfo.checkInFrom   || "14:00");
        set("checkInUntil",       editApt.additionalInfo.checkInUntil  || "22:00");
        set("checkOutFrom",       editApt.additionalInfo.checkOutFrom  || "08:00");
        set("checkOutUntil",      editApt.additionalInfo.checkOutUntil || "12:00");
        set("selfCheckIn",        editApt.additionalInfo.selfCheckIn   ?? false);
        if (editApt.facilities)          set("facilities",       { ...editApt.facilities });
        if (editApt.image_urls.length > 0) set("imagePreviewUrls", editApt.image_urls);
    }, [editApt, set]);

    const [activeStep,    setActiveStep]    = useState(0);
    const [visitedSteps,  setVisitedSteps]  = useState<Set<number>>(new Set([0]));
    const [apiError,      setApiError]      = useState<string | null>(null);
    const [isSubmitting,  setIsSubmitting]  = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

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

    const goToStep = (idx: number) => {
        if (idx < activeStep || isEditMode) {
            setErrors({});
            setActiveStep(idx);
            setVisitedSteps(prev => new Set([...prev, idx]));
            if (contentRef.current) contentRef.current.scrollTop = 0;
            return;
        }
        for (let step = activeStep; step < idx; step++) {
            const stepErrors = validateStep(form, step, false);
            if (Object.keys(stepErrors).length > 0) {
                setErrors(stepErrors);
                setActiveStep(step);
                setVisitedSteps(prev => new Set([...prev, step]));
                if (contentRef.current) contentRef.current.scrollTop = 0;
                return;
            }
        }
        setErrors({});
        setActiveStep(idx);
        setVisitedSteps(prev => new Set([...prev, idx]));
        if (contentRef.current) contentRef.current.scrollTop = 0;
    };

    const handleSubmit = useCallback(
        () => submit(async (markDone) => {
            if (isSubmitting) return;
            setApiError(null);
            setIsSubmitting(true);
            try {
                const imageUrls = form.images.length > 0
                    ? await uploadService.images(form.images)
                    : editApt?.image_urls ?? [];

                const payload = buildCreatePayload(form, imageUrls);

                if (isEditMode && editApt) {
                    await apartmentService.update({ id: editApt.Id_Apartment, ...payload });
                    ownerNotifications.listingEdited(addNotification, form.address);
                } else {
                    await apartmentService.create(currentUser?.id ?? 0, payload);
                    ownerNotifications.listingSubmitted(addNotification, form.address);
                    pushAdminQueueNotif("admin_new_listing", `Anunt nou spre evaluare: "${form.address}".`);
                }
                markDone();
                setTimeout(
                    () => navigate(isEditMode
                        ? paths.dashboard
                        : paths.dashboard,
                        isEditMode ? { state: { refreshListings: true } } : undefined,
                    ),
                    1500,
                );
            } catch (err: unknown) {
                const data = getResponseData(err);
                const isActiveBooking =
                    (typeof data === "object" && data !== null && (data as { message?: string })?.message?.toLowerCase().includes("booking")) ||
                    (typeof data === "string" && data.toLowerCase().includes("booking"));
                setApiError(isActiveBooking
                    ? t("dashboard.myListings.editErrorActive")
                    : t("createListing.saveError"),
                );
                setIsSubmitting(false);
            }
        }, isEditMode),
        [submit, navigate, form, currentUser, isSubmitting, isEditMode, editApt, addNotification],
    );

    if (submitted) return <SuccessScreen />;

    const progress        = Math.round((activeStep / (STEPS.length - 1)) * 100);
    const summaryAddress  = form.address || "—";
    const summaryPrice    = form.cost    ? `${form.cost} ${form.currency}` : "—";
    const summaryInterval = form.interval ? `/${form.interval}` : "";

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default", mt: `${NAVBAR_H}px` }}>

            <CreateListingSidebar
                isEditMode={isEditMode}
                activeStep={activeStep}
                visitedSteps={visitedSteps}
                progress={progress}
                onStepClick={goToStep}
                onBack={() => navigate(-1)}
            />

            <Box
                ref={contentRef}
                sx={{
                    flex: 1, display: "flex", flexDirection: "column",
                    maxWidth: "100%", overflowY: "auto",
                    height: `calc(100vh - ${NAVBAR_H}px)`,
                }}
            >
                <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                        height: 3, borderRadius: 0, bgcolor: "transparent",
                        "& .MuiLinearProgress-bar": { background: gradients.primary },
                    }}
                />

                {(Object.values(errors).some(Boolean) || apiError) && (
                    <Box sx={{ px: { xs: 3, md: 5 }, pt: 3 }}>
                        <Alert severity="error" sx={{ borderRadius: 3 }}>
                            {apiError ?? t("createListing.errorsAlert")}
                        </Alert>
                    </Box>
                )}

                <Box sx={{ flex: 1, px: { xs: 3, md: 5 }, py: 4, pb: 12 }}>
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h5" fontWeight={900} sx={{
                            letterSpacing: "-0.5px",
                            background: gradients.textPrimary,
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}>
                            {t(STEPS[activeStep].labelKey)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.4 }}>
                            {t(STEPS[activeStep].descKey)}
                        </Typography>
                    </Box>

                    {activeStep === 0 && (
                        <StepBasicInfo
                            address={form.address} cost={form.cost}
                            currency={form.currency} interval={form.interval}
                            errors={errors} set={set} clearError={clearError}
                        />
                    )}
                    {activeStep === 1 && (
                        <StepPhotos
                            images={form.images} imagePreviewUrls={form.imagePreviewUrls}
                            errors={errors} onAddImages={handleAddImages} onRemoveImage={handleRemoveImage}
                        />
                    )}
                    {activeStep === 2 && (
                        <StepLocation
                            city={form.city} region={form.region} postalCode={form.postalCode}
                            latitude={form.latitude} longitude={form.longitude}
                            landmarks={form.landmarks} landmarkInput={form.landmarkInput}
                            errors={errors} set={set} clearError={clearError}
                            onAddLandmark={handleAddLandmark} onRemoveLandmark={removeLandmark}
                        />
                    )}
                    {activeStep === 3 && (
                        <StepFacilities facilities={form.facilities} onToggle={setFacility} />
                    )}
                    {activeStep === 4 && (
                        <StepSpaceInfo
                            rooms={form.rooms} bedrooms={form.bedrooms} bathrooms={form.bathrooms}
                            beds={form.beds} surfaceArea={form.surfaceArea} maxGuests={form.maxGuests}
                            floor={form.floor} totalFloors={form.totalFloors}
                            checkInFrom={form.checkInFrom} checkInUntil={form.checkInUntil}
                            checkOutFrom={form.checkOutFrom} checkOutUntil={form.checkOutUntil}
                            selfCheckIn={form.selfCheckIn} errors={errors} set={set} clearError={clearError}
                        />
                    )}
                    {activeStep === 5 && (
                        <StepDescription
                            description={form.description} houseRules={form.houseRules}
                            cancellationPolicy={form.cancellationPolicy}
                            errors={errors} set={set} clearError={clearError}
                        />
                    )}
                </Box>

                <CreateListingBottomBar
                    activeStep={activeStep}
                    isSubmitting={isSubmitting}
                    isEditMode={isEditMode}
                    summaryAddress={summaryAddress}
                    summaryPrice={summaryPrice}
                    summaryInterval={summaryInterval}
                    onPrev={() => goToStep(activeStep - 1)}
                    onNext={() => goToStep(activeStep + 1)}
                    onSubmit={handleSubmit}
                />
            </Box>
        </Box>
    );
};

export default CreateListing;
