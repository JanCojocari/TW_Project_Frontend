// src/components/createListing/StepSpaceInfo.tsx
import { memo }             from "react";
import React                from "react";
import { Box, Typography }  from "@mui/material";
import { MeetingRoom as RoomsIcon } from "@mui/icons-material";
import { AdapterDayjs }          from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider }  from "@mui/x-date-pickers/LocalizationProvider";
import { useTranslation }        from "react-i18next";
import Section             from "./Section.tsx";
import DebouncedTextField  from "../common/DebouncedTextField.tsx";
import SpaceStepper        from "./SpaceStepper.tsx";
import MaxGuestsControl    from "./MaxGuestsControl.tsx";
import CheckInOutSection   from "./CheckInOutSection.tsx";
import type { FormState, Errors } from "../../types/CreateListingTypes.ts";
import { colors }          from "../../theme/gradients.ts";

interface Props {
    rooms:         string;
    bedrooms:      string;
    bathrooms:     string;
    beds:          string;
    surfaceArea:   string;
    maxGuests:     string;
    floor:         string;
    totalFloors:   string;
    checkInFrom:   string;
    checkInUntil:  string;
    checkOutFrom:  string;
    checkOutUntil: string;
    selfCheckIn:   boolean;
    errors:        Errors;
    set:           <K extends keyof FormState>(key: K, value: FormState[K]) => void;
    clearError:    (key: string) => void;
}

const icon = <RoomsIcon sx={{ fontSize: 24 }} />;

const StepSpaceInfo = memo(({
    rooms, bedrooms, bathrooms, beds, surfaceArea,
    maxGuests, floor, totalFloors,
    checkInFrom, checkInUntil, checkOutFrom, checkOutUntil,
    selfCheckIn, errors, set, clearError,
}: Props) => {
    const { t } = useTranslation();

    const steppers: { key: keyof FormState; label: string }[] = [
        { key: "rooms",       label: t("components.steps.space.rooms")       },
        { key: "bedrooms",    label: t("components.steps.space.bedrooms")    },
        { key: "bathrooms",   label: t("components.steps.space.bathrooms")   },
        { key: "beds",        label: t("components.steps.space.beds")        },
        { key: "floor",       label: t("components.steps.space.floor")       },
        { key: "totalFloors", label: t("components.steps.space.totalFloors") },
    ];

    const values: Record<string, string> = { rooms, bedrooms, bathrooms, beds, floor, totalFloors };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Section icon={icon} title={t("createListing.steps.space.title")} subtitle={t("createListing.steps.space.subtitle")} step={5}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>

                    {/* Stepper grid */}
                    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 2 }}>
                        {steppers.map(f => (
                            <SpaceStepper
                                key={f.key}
                                label={f.label}
                                value={values[f.key]}
                                onChange={v => { set(f.key, v as FormState[typeof f.key]); clearError(f.key); }}
                                error={!!errors[f.key]}
                            />
                        ))}
                    </Box>

                    {/* Surface area + Max guests */}
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2, alignItems: "stretch" }}>
                        <Box sx={{
                            p: 2.5, borderRadius: 3,
                            border: `1px solid ${errors.surfaceArea ? "#d32f2f" : colors.border}`,
                            bgcolor: errors.surfaceArea ? "rgba(211,47,47,0.04)" : "background.paper",
                            display: "flex", flexDirection: "column", justifyContent: "space-between",
                        }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                                <Typography variant="caption" fontWeight={700} color="text.secondary"
                                            sx={{ textTransform: "uppercase", letterSpacing: 0.8 }}>
                                    {t("components.steps.space.surface")}
                                </Typography>
                            </Box>
                            <DebouncedTextField
                                type="number"
                                value={surfaceArea}
                                onChange={v => { set("surfaceArea", v as FormState["surfaceArea"]); clearError("surfaceArea"); }}
                                inputProps={{ min: 0, onWheel: (e: React.WheelEvent<HTMLInputElement>) => e.currentTarget.blur() }}
                                fullWidth
                                variant="standard"
                                InputProps={{ disableUnderline: true }}
                                sx={{ "& input": { fontSize: 28, fontWeight: 800, textAlign: "center", color: "text.primary", p: 0 } }}
                            />
                        </Box>

                        <MaxGuestsControl
                            value={maxGuests}
                            onChange={v => { set("maxGuests", v as FormState["maxGuests"]); clearError("maxGuests"); }}
                            error={!!errors.maxGuests}
                        />
                    </Box>

                    <CheckInOutSection
                        checkInFrom={checkInFrom}   checkInUntil={checkInUntil}
                        checkOutFrom={checkOutFrom} checkOutUntil={checkOutUntil}
                        selfCheckIn={selfCheckIn}
                        errors={errors}
                        set={set}
                        clearError={clearError}
                    />
                </Box>
            </Section>
        </LocalizationProvider>
    );
});

StepSpaceInfo.displayName = "StepSpaceInfo";
export default StepSpaceInfo;
