// src/pages/CreateListing.tsx
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth }        from "../auth/AuthContext.tsx";
import { useTranslation } from "react-i18next";
import {
    Box, Button, Alert, Typography, LinearProgress, Tooltip,
} from "@mui/material";
import {
    Home as HomeIcon,
    PhotoCamera as CameraIcon,
    LocationOn as LocationIcon,
    Star as FacilitiesIcon,
    MeetingRoom as SpaceIcon,
    Description as DescIcon,
    CheckCircle as CheckIcon,
    ArrowBack as ArrowBackIcon,
    ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import { apartmentService, buildCreatePayload } from "../services/apartmentService.ts";
import type { Apartment } from "../types/apartment.types.ts";
import { uploadService }   from "../services/uploadService.ts";
import { gradients, colors } from "../theme/gradients.ts";
import { paths }           from "../app/paths.ts";
import { useListingForm }  from "../types/UseListingForm.ts";
import { validateStep }   from "../types/CreateListingTypes.ts";
import SuccessScreen       from "../components/createListing/SuccessScreen.tsx";
import StepBasicInfo       from "../components/createListing/StepBasicInfo.tsx";
import StepPhotos          from "../components/createListing/StepPhotos.tsx";
import StepLocation        from "../components/createListing/StepLocation.tsx";
import StepFacilities      from "../components/createListing/StepFacilities.tsx";
import StepSpaceInfo       from "../components/createListing/StepSpaceInfo.tsx";
import StepDescription     from "../components/createListing/StepDescription.tsx";

/* ─── step config ─────────────────────────────────────────────────────── */
const NAVBAR_H = 64;
const SIDEBAR_W = 220;

interface StepMeta {
    key: string;
    labelKey: string;
    icon: React.ReactNode;
    descKey: string;
}

const STEPS: StepMeta[] = [
    { key: "basic",       labelKey: "createListing.steps.basic.title",       icon: <HomeIcon       sx={{ fontSize: 20 }} />, descKey: "createListing.steps.basic.subtitle"       },
    { key: "photos",      labelKey: "createListing.steps.photos.title",      icon: <CameraIcon     sx={{ fontSize: 20 }} />, descKey: "createListing.steps.photos.subtitle"      },
    { key: "location",    labelKey: "createListing.steps.location.title",    icon: <LocationIcon   sx={{ fontSize: 20 }} />, descKey: "createListing.steps.location.subtitle"    },
    { key: "facilities",  labelKey: "createListing.steps.facilities.title",  icon: <FacilitiesIcon sx={{ fontSize: 20 }} />, descKey: "createListing.steps.facilities.subtitle"  },
    { key: "space",       labelKey: "createListing.steps.space.title",       icon: <SpaceIcon      sx={{ fontSize: 20 }} />, descKey: "createListing.steps.space.subtitle"       },
    { key: "description", labelKey: "createListing.steps.description.title", icon: <DescIcon       sx={{ fontSize: 20 }} />, descKey: "createListing.steps.description.subtitle" },
];

const CreateListing = () => {
    const navigate        = useNavigate();
    const location        = useLocation();
    const { t }           = useTranslation();
    const { currentUser } = useAuth();

    // detecteaza modul edit — apartamentul vine prin navigate(..., { state })
    const editApt    = (location.state as { apartment?: Apartment } | null)?.apartment ?? null;
    const isEditMode = !!editApt;

    const {
        form, errors, submitted,
        set, clearError, setFacility, setErrors,
        handleImages, removeImage, addLandmark, removeLandmark,
        submit,
    } = useListingForm();

    // pre-populeaza form-ul o singura data cand suntem in modul edit
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
        if (editApt.facilities) {
            // setFacility face toggle, deci setam direct in form prin set()
            set("facilities", { ...editApt.facilities });
        }
        // afiseaza imaginile existente ca preview -- form.images ramane gol
        // la submit, daca nu s-au incarcat imagini noi, se pastreaza URL-urile originale
        if (editApt.image_urls.length > 0) {
            set("imagePreviewUrls", editApt.image_urls);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // intentionat fara dependente — ruleaza o singura data la mount

    const [activeStep, setActiveStep] = useState(0);
    const [visitedSteps, setVisitedSteps] = useState<Set<number>>(new Set([0]));
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

    const [apiError, setApiError]         = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const goToStep = (idx: number, fromSidebar = false) => {
        // navigare inapoi: fara validare in ambele moduri
        if (idx < activeStep) {
            setErrors({});
            setActiveStep(idx);
            setVisitedSteps(prev => new Set([...prev, idx]));
            if (contentRef.current) contentRef.current.scrollTop = 0;
            return;
        }
        // in modul edit: navigare libera fara restrictii
        if (isEditMode) {
            setErrors({});
            setActiveStep(idx);
            setVisitedSteps(prev => new Set([...prev, idx]));
            if (contentRef.current) contentRef.current.scrollTop = 0;
            return;
        }
        // in modul create: valideaza toate step-urile de la activeStep pana la idx (exclusiv)
        for (let step = activeStep; step < idx; step++) {
            const stepErrors = validateStep(form, step, false);
            if (Object.keys(stepErrors).length > 0) {
                // sari la primul step cu erori si afiseaza-le
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
                // daca nu s-au incarcat imagini noi, pastreaza URL-urile existente
                const imageUrls = form.images.length > 0
                    ? await uploadService.images(form.images)
                    : editApt?.image_urls ?? [];

                const payload = buildCreatePayload(form, imageUrls);

                if (isEditMode && editApt) {
                    await apartmentService.update({ id: editApt.Id_Apartment, ...payload });
                } else {
                    await apartmentService.create(currentUser?.id ?? 0, payload);
                }
                markDone();
                if (isEditMode) {
                    // forteaza re-fetch in Dashboard pentru a reflecta statusul Pending
                    setTimeout(() => navigate(paths.dashboard, { state: { refreshListings: true } }), 1500);
                } else {
                    setTimeout(() => navigate(paths.dashboard), 1500);
                }
            } catch {
                setApiError("Eroare la salvarea anunțului. Verificați conexiunea și încercați din nou.");
                setIsSubmitting(false);
            }
        }, isEditMode),
        [submit, navigate, form, currentUser, isSubmitting, isEditMode, editApt],
    );

    if (submitted) return <SuccessScreen />;

    /* progress = how far we've advanced / total steps */
    const progress = Math.round(((activeStep) / (STEPS.length - 1)) * 100);

    /* summary bar values */
    const summaryAddress  = form.address  || "—";
    const summaryPrice    = form.cost     ? `${form.cost} ${form.currency}` : "—";
    const summaryInterval = form.interval ? `/${form.interval}` : "";

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default", mt: `${NAVBAR_H}px` }}>

            {/* ── Sidebar ─────────────────────────────────────────────── */}
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
                {/* Sidebar header */}
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

                    {/* Progress bar */}
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

                {/* Step nav */}
                <Box sx={{ flex: 1, py: 1.5 }}>
                    {STEPS.map((step, idx) => {
                        const isActive    = idx === activeStep;
                        const isVisited   = visitedSteps.has(idx);
                        const isCompleted = isVisited && idx < activeStep;

                        return (
                            <Tooltip key={step.key} title={t(step.descKey)} placement="right" arrow>
                                <Box
                                    onClick={() => goToStep(idx, true)}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1.5,
                                        px: 2,
                                        py: 1.3,
                                        cursor: "pointer",
                                        position: "relative",
                                        transition: "all 0.15s",
                                        bgcolor: isActive ? colors.primaryAlpha10 : "transparent",
                                        "&:hover": { bgcolor: isActive ? colors.primaryAlpha10 : colors.primaryAlpha06 },
                                        // left accent bar for active
                                        "&::before": isActive ? {
                                            content: '""',
                                            position: "absolute",
                                            left: 0, top: "15%", bottom: "15%",
                                            width: 3,
                                            borderRadius: "0 4px 4px 0",
                                            background: gradients.primary,
                                        } : {},
                                    }}
                                >
                                    {/* Step number / check icon */}
                                    <Box sx={{
                                        width: 28, height: 28, borderRadius: "50%",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        flexShrink: 0,
                                        bgcolor: isCompleted
                                            ? colors.success
                                            : isActive
                                                ? colors.primaryDark
                                                : colors.primaryAlpha10,
                                        color: isCompleted || isActive ? "#fff" : colors.primaryDark,
                                        transition: "all 0.2s",
                                        fontSize: 12,
                                        fontWeight: 800,
                                    }}>
                                        {isCompleted
                                            ? <CheckIcon sx={{ fontSize: 15 }} />
                                            : <Box component="span" sx={{ display: "flex", alignItems: "center", color: "inherit" }}>
                                                {step.icon}
                                            </Box>
                                        }
                                    </Box>

                                    {/* Label */}
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

                {/* Back to listings button */}
                <Box sx={{ p: 2, borderTop: `1px solid ${colors.border}` }}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate(-1)}
                        fullWidth
                        variant="outlined"
                        size="small"
                        sx={{ borderRadius: 2, fontWeight: 600, borderColor: colors.border, color: "text.secondary" }}
                    >
                        {t("createListing.back")}
                    </Button>
                </Box>
            </Box>

            {/* ── Main content ─────────────────────────────────────────── */}
            <Box
                ref={contentRef}
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    maxWidth: "100%",
                    overflowY: "auto",
                    height: `calc(100vh - ${NAVBAR_H}px)`,
                }}
            >
                {/* Top progress bar (thin, full-width) */}
                <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                        height: 3,
                        borderRadius: 0,
                        bgcolor: "transparent",
                        "& .MuiLinearProgress-bar": {
                            background: gradients.primary,
                        },
                    }}
                />

                {/* Error alert */}
                {(Object.values(errors).some(Boolean) || apiError) && (
                    <Box sx={{ px: { xs: 3, md: 5 }, pt: 3 }}>
                        <Alert severity="error" sx={{ borderRadius: 3 }}>
                            {apiError ?? t("createListing.errorsAlert")}
                        </Alert>
                    </Box>
                )}

                {/* Step content */}
                <Box
                    sx={{
                        flex: 1,
                        px: { xs: 3, md: 5 },
                        py: 4,
                        pb: 12, // space for floating summary
                    }}
                >
                    {/* Step heading */}
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

                    {/* Rendered step */}
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

                {/* ── Floating summary + nav bar ───────────────────────── */}
                <Box sx={{
                    position: "sticky",
                    bottom: 0,
                    bgcolor: "background.paper",
                    borderTop: `1px solid ${colors.border}`,
                    px: { xs: 3, md: 5 },
                    py: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                    backdropFilter: "blur(8px)",
                    zIndex: 10,
                    boxShadow: "0 -4px 24px rgba(0,0,0,0.06)",
                }}>
                    {/* Live summary */}
                    <Box sx={{ flex: 1, display: { xs: "none", sm: "flex" }, gap: 3 }}>
                        {form.address && (
                            <Box>
                                <Typography variant="caption" color="text.disabled" sx={{ textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 700 }}>
                                    {t('components.infoPanel.address')}
                                </Typography>
                                <Typography variant="body2" fontWeight={600} sx={{ maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {summaryAddress}
                                </Typography>
                            </Box>
                        )}
                        {form.cost && (
                            <Box>
                                <Typography variant="caption" color="text.disabled" sx={{ textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 700 }}>
                                    {t('components.infoPanel.price')}
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
                                onClick={() => goToStep(activeStep - 1)}
                                sx={{ fontWeight: 600, borderRadius: 2, borderColor: colors.border, color: "text.secondary" }}
                            >
                                {t("createListing.back")}
                            </Button>
                        )}
                        {activeStep < STEPS.length - 1 ? (
                            <Button
                                variant="contained"
                                endIcon={<ArrowForwardIcon />}
                                onClick={() => goToStep(activeStep + 1)}
                                sx={{
                                    fontWeight: 700,
                                    borderRadius: 2,
                                    px: 3,
                                    background: gradients.primary,
                                    boxShadow: `0 4px 14px ${colors.primaryAlpha25}`,
                                }}
                            >{t('createListing.next') ?? 'Next'}</Button>
                        ) : (
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                sx={{
                                    fontWeight: 800,
                                    fontSize: 15,
                                    borderRadius: 2,
                                    px: 4,
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
            </Box>
        </Box>
    );
};

export default CreateListing;