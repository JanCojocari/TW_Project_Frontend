// pages/settings/SettingsPage.tsx
import { Alert, Snackbar, Stack, Typography } from "@mui/material";
import { useTranslation }      from "react-i18next";
import { useAuth }             from "../auth/AuthContext";
import { useSettingsForm }     from "../hooks/useSettingsForm";
import type { UserSettingsDto } from "../hooks/useSettingsForm";
import ProfileSection          from "../components/settings/ProfileSection";
import SecuritySection         from "../components/settings/SecuritySection";
import BalanceSection          from "../components/settings/BalanceSection";
import DangerZoneSection       from "../components/settings/DangerZoneSection";

export default function SettingsPage() {
    const { t }           = useTranslation();
    const { currentUser } = useAuth();

    const initialProfile: UserSettingsDto = currentUser ? {
        id:             currentUser.id,
        name:           currentUser.name,
        surname:        currentUser.surname,
        email:          currentUser.email,
        phone:          currentUser.phone,
        birthday:       currentUser.birthday?.split("T")[0] ?? "",
        gender:         currentUser.gender ?? "male",
        accountBalance: Number(currentUser.accountBalance),
        currency:       "EUR",
        role:           String(currentUser.role),
    } : {
        id: 0, name: "", surname: "", email: "", phone: "",
        birthday: "", gender: "", accountBalance: 0, currency: "EUR", role: "",
    };

    const {
        profile, updateProfile, password, updatePassword,
        saving, success, error, clearSuccess, clearError,
        saveProfile, savePassword, deleteAccount,
    } = useSettingsForm(initialProfile);

    return (
        <Stack spacing={3} sx={{ maxWidth: 720, mx: "auto", py: 4, px: { xs: 2, md: 0 } }}>
            <Typography variant="h5" fontWeight={900}>{t("settings.title")}</Typography>

            <ProfileSection  profile={profile}  saving={saving} onUpdate={updateProfile} onSave={saveProfile} />
            <SecuritySection password={password} saving={saving} onUpdate={updatePassword} onSave={savePassword} />
            <BalanceSection  balance={profile.accountBalance} currency={profile.currency} />
            <DangerZoneSection email={profile.email} saving={saving} onDelete={deleteAccount} />

            <Snackbar open={!!success} autoHideDuration={4000} onClose={clearSuccess} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                <Alert severity="success" variant="filled" onClose={clearSuccess}>{success}</Alert>
            </Snackbar>
            <Snackbar open={!!error} autoHideDuration={5000} onClose={clearError} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                <Alert severity="error" variant="filled" onClose={clearError}>{error}</Alert>
            </Snackbar>
        </Stack>
    );
}
