// components/dashboard/ProfileTab.tsx
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { useNavigate }    from "react-router-dom";
import { useTranslation } from "react-i18next";
import { colors }         from "../../theme/gradients";
import { paths }          from "../../app/paths";
import type { User }      from "../../types/user.types";

interface Props {
    currentUser:    User | null;
    onEditProfile?: () => void;
}

const labelStyle = {
    color: "text.disabled",
    fontSize: "11px",
    textTransform: "uppercase" as const,
    fontWeight: 800,
    letterSpacing: "1px",
};

export default function ProfileTab({ currentUser }: Props) {
    const navigate = useNavigate();
    const { t }    = useTranslation();

    if (!currentUser) return (
        <Typography color="text.disabled" sx={{ textAlign: "center", py: 10 }}>
            {t("dashboard.profile.invalidSession")}
        </Typography>
    );

    const fields = [
        { label: t("dashboard.profile.email"),    value: currentUser.Email    || "—" },
        { label: t("dashboard.profile.phone"),    value: currentUser.Phone    || "—" },
        { label: t("dashboard.profile.birthday"), value: currentUser.Birthday || "—" },
    ];

    return (
        <Stack spacing={4}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, bgcolor: "background.default", border: `1px solid ${colors.border}` }}>
                <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between"
                       alignItems={{ xs: "flex-start", sm: "center" }} gap={3}>
                    <Box>
                        <Typography variant="h5" fontWeight={900} sx={{ mb: 2 }}>
                            {currentUser.Name} {currentUser.Surname}
                        </Typography>
                        <Stack spacing={1}>
                            {fields.map(({ label, value }) => (
                                <Box key={label} sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                                    <Typography sx={{ ...labelStyle, minWidth: "60px" }}>{label}</Typography>
                                    <Typography fontWeight={600} color="text.primary">{value}</Typography>
                                </Box>
                            ))}
                        </Stack>
                    </Box>

                    <Stack spacing={1.5}>
                        <Button variant="contained" onClick={() => navigate(paths.settings)} sx={{ whiteSpace: "nowrap" }}>
                            {t("dashboard.profile.edit")}
                        </Button>
                        <Button variant="outlined" onClick={() => navigate(paths.settings)}>
                            {t("dashboard.profile.changePassword")}
                        </Button>
                    </Stack>
                </Stack>
            </Paper>
        </Stack>
    );
}