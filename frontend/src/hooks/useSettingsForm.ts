// hooks/useSettingsForm.ts
// State + handlers pentru toate secțiunile din Settings.
// Înlocuiește funcțiile mock cu apeluri reale la API când e gata.

import { useState } from "react";
import type { UserSettingsDto } from "../mockdata/settingsMock";

export interface PasswordForm {
    oldPassword:     string;
    newPassword:     string;
    confirmPassword: string;
}

const PASSWORD_INITIAL: PasswordForm = {
    oldPassword: "", newPassword: "", confirmPassword: "",
};

export function useSettingsForm(initial: UserSettingsDto) {
    const [profile, setProfile]     = useState(initial);
    const [password, setPassword]   = useState<PasswordForm>(PASSWORD_INITIAL);
    const [saving, setSaving]       = useState(false);
    const [success, setSuccess]     = useState<string | null>(null);
    const [error, setError]         = useState<string | null>(null);

    function updateProfile(field: keyof UserSettingsDto, value: string) {
        setProfile((prev) => ({ ...prev, [field]: value }));
    }

    function updatePassword(field: keyof PasswordForm, value: string) {
        setPassword((prev) => ({ ...prev, [field]: value }));
    }

    // TODO: înlocuiește cu PUT /api/users/{id}
    async function saveProfile() {
        setSaving(true);
        await new Promise((r) => setTimeout(r, 800));   // simulare request
        setSaving(false);
        setSuccess("Profilul a fost actualizat cu succes.");
    }

    // TODO: înlocuiește cu POST /api/auth/change-password
    async function savePassword(): Promise<boolean> {
        if (password.newPassword !== password.confirmPassword) {
            setError("Parolele nu coincid.");
            return false;
        }
        if (password.newPassword.length < 6) {
            setError("Parola trebuie să aibă cel puțin 6 caractere.");
            return false;
        }
        setSaving(true);
        await new Promise((r) => setTimeout(r, 800));
        setSaving(false);
        setPassword(PASSWORD_INITIAL);
        setSuccess("Parola a fost schimbată cu succes.");
        return true;
    }

    // TODO: înlocuiește cu DELETE /api/users/{id}
    async function deleteAccount() {
        setSaving(true);
        await new Promise((r) => setTimeout(r, 1000));
        setSaving(false);
        setSuccess("Contul a fost șters.");
    }

    return {
        profile, updateProfile,
        password, updatePassword,
        saving, success, error,
        clearSuccess: () => setSuccess(null),
        clearError:   () => setError(null),
        saveProfile, savePassword, deleteAccount,
    };
}