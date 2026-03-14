// pages/settings/SettingsPage.tsx
import { Alert, Snackbar, Stack, Typography } from "@mui/material";
import { useTranslation }        from "react-i18next";
import { MOCK_USER }             from "../mockdata/settingsMock.ts";
import { useSettingsForm }       from "../hooks/useSettingsForm";
import ProfileSection            from "../components/settings/ProfileSection";
import SecuritySection           from "../components/settings/SecuritySection";
import BalanceSection            from "../components/settings/BalanceSection";
import DangerZoneSection         from "../components/settings/DangerZoneSection";

export default function SettingsPage() {
    const { t } = useTranslation();
    const {
        profile, updateProfile, password, updatePassword,
        saving, success, error, clearSuccess, clearError,
        saveProfile, savePassword, deleteAccount,
    } = useSettingsForm(MOCK_USER);

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