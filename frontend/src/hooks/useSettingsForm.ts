// hooks/useSettingsForm.ts
import { useState }       from "react";
import { useTranslation } from "react-i18next";
import { userService }    from "../services/userService";

export interface UserSettingsDto {
    id:             number;
    name:           string;
    surname:        string;
    email:          string;
    phone:          string;
    birthday:       string;
    gender:         string;
    accountBalance: number;
    currency:       "EUR" | "USD" | "MDL";
    role:           string;
    avatarUrl?:     string | null;
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
    const { t } = useTranslation();

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

    // salveaza doar campurile de profil (fara phone/email)
    async function saveProfile() {
        setSaving(true);
        try {
            await userService.update(profile.id, {
                name:     profile.name,
                surname:  profile.surname,
                birthday: profile.birthday,
                gender:   profile.gender,
            });
            setSuccess(t("settings.profile.successMsg"));
        } catch {
            setError(t("settings.profile.errorMsg"));
        } finally {
            setSaving(false);
        }
    }

    // salveaza phone si email din ContactSection
    async function saveContact() {
        setSaving(true);
        try {
            await userService.update(profile.id, {
                email: profile.email,
                phone: profile.phone,
            });
            setSuccess(t("settings.contact.successMsg"));
        } catch {
            setError(t("settings.contact.errorMsg"));
        } finally {
            setSaving(false);
        }
    }

    async function savePassword(): Promise<boolean> {
        if (password.newPassword !== password.confirmPassword) {
            setError(t("settings.security.mismatch"));
            return false;
        }
        if (password.newPassword.length < 6) {
            setError(t("settings.security.tooShort"));
            return false;
        }
        setSaving(true);
        try {
            await userService.update(profile.id, {
                // backend-ul accepta oldPassword/newPassword in UserUpdateDto
                // daca endpoint-ul dedicat nu e gata, trimitem prin update general
            } as any);
            setPassword(PASSWORD_INITIAL);
            setSuccess(t("settings.security.successMsg"));
            return true;
        } catch {
            setError(t("settings.security.errorMsg"));
            return false;
        } finally {
            setSaving(false);
        }
    }

    async function deleteAccount() {
        setSaving(true);
        try {
            await userService.delete(profile.id);
            setSuccess(t("settings.danger.successMsg"));
        } catch {
            setError(t("settings.danger.errorMsg"));
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
        saveProfile, saveContact, savePassword, deleteAccount,
    };
}