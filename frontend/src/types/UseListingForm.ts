import { useState, useCallback } from "react";
import type { Facilities } from "./apartment.types";
import { initialForm, validate, type FormState, type Errors } from "./CreateListingTypes.ts";

export const useListingForm = () => {
    const [form, setForm]           = useState<FormState>(initialForm);
    const [errors, setErrors]       = useState<Errors>({});
    const [submitted, setSubmitted] = useState(false);

    const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
        setForm(prev => ({ ...prev, [key]: value }));

    const clearError = (key: string) =>
        setErrors(prev => ({ ...prev, [key]: undefined }));

    const setFacility = (key: keyof Facilities) =>
        setForm(prev => ({ ...prev, facilities: { ...prev.facilities, [key]: !prev.facilities[key] } }));

    const handleImages = useCallback((files: FileList | null, currentCount: number) => {
        if (!files) return;
        const newFiles = Array.from(files).slice(0, 8 - currentCount);
        const newUrls  = newFiles.map(f => URL.createObjectURL(f));
        setForm(prev => ({
            ...prev,
            images:           [...prev.images, ...newFiles],
            imagePreviewUrls: [...prev.imagePreviewUrls, ...newUrls],
        }));
        clearError("images");
    }, []);

    const removeImage = (idx: number, previewUrls: string[]) => {
        URL.revokeObjectURL(previewUrls[idx]);
        setForm(prev => ({
            ...prev,
            images:           prev.images.filter((_, i) => i !== idx),
            imagePreviewUrls: prev.imagePreviewUrls.filter((_, i) => i !== idx),
        }));
    };

    const addLandmark = (input: string) => {
        const val = input.trim();
        if (!val) return;
        setForm(prev => ({ ...prev, landmarks: [...prev.landmarks, val], landmarkInput: "" }));
    };

    const removeLandmark = (i: number) =>
        setForm(prev => ({ ...prev, landmarks: prev.landmarks.filter((_, j) => j !== i) }));

    const submit = (onSuccess: () => void) => {
        const e = validate(form);
        setErrors(e);
        if (Object.keys(e).length > 0) return;
        setSubmitted(true);
        onSuccess();
    };

    const progress = (() => {
        const activeFacilities = Object.values(form.facilities).filter(Boolean).length;
        let filled = 0;
        if (form.address)           filled++;
        if (form.cost)              filled++;
        if (form.images.length > 0) filled++;
        if (form.city)              filled++;
        if (form.description)       filled++;
        if (activeFacilities > 0)   filled++;
        return Math.round((filled / 6) * 100);
    })();

    return {
        form, errors, submitted, progress,
        set, clearError, setFacility,
        handleImages, removeImage, addLandmark, removeLandmark,
        submit,
    };
};