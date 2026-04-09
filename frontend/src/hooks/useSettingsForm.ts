// hooks/useSettingsForm.ts
import { useState } from "react";
import { userService } from "../services/userService";

export interface UserSettingsDto {
    id:             number;
    name:           string;
    surname:        string;
    email:          string;
    phone:          string;
    birthday:       string;   // ISO date string
    gender:         string;
    accountBalance: number;
    currency:       "EUR" | "USD" | "MDL";
    role:           string;
}

export interface PasswordForm {
    oldPassword:     string;
    newPassword:     string;
    confirmPassword: string;
}

const PASSWORD_INITIAL: PasswordForm = {
    oldPassword: "", newPassword: "", confirmPassword: "",
};

export function useSettingsForm(initial: UserSettingsDto) {
    const [profile, setProfile]   = useState(initial);
    const [password, setPassword] = useState<PasswordForm>(PASSWORD_INITIAL);
    const [saving, setSaving]     = useState(false);
    const [success, setSuccess]   = useState<string | null>(null);
    const [error, setError]       = useState<string | null>(null);

    function updateProfile(field: keyof UserSettingsDto, value: string) {
        setProfile((prev) => ({ ...prev, [field]: value }));
    }

    function updatePassword(field: keyof PasswordForm, value: string) {
        setPassword((prev) => ({ ...prev, [field]: value }));
    }

    async function saveProfile() {
        setSaving(true);
        try {
            await userService.update(profile.id, {
                name:     profile.name,
                surname:  profile.surname,
                email:    profile.email,
                phone:    profile.phone,
                birthday: profile.birthday,
                gender:   profile.gender,
            });
            setSuccess("Profilul a fost actualizat cu succes.");
        } catch {
            setError("Eroare la salvarea profilului. Încearcă din nou.");
        } finally {
            setSaving(false);
        }
    }

    // TODO: replace with POST /api/auth/change-password when endpoint is available
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

    async function deleteAccount() {
        setSaving(true);
        try {
            await userService.delete(profile.id);
            setSuccess("Contul a fost șters.");
        } catch {
            setError("Eroare la ștergerea contului. Încearcă din nou.");
        } finally {
            setSaving(false);
        }
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
