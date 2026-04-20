// components/dashboard/ProfileTab.tsx
import { Avatar, Box, Button, Paper, Stack, Typography } from "@mui/material";
import { useNavigate }    from "react-router-dom";
import { useTranslation } from "react-i18next";
import { colors }         from "../../theme/gradients";
import { resolveMediaUrl } from "../../utils/mediaUrl";
import { paths }          from "../../app/paths";
import type { UserApiDto } from "../../services/userService";

interface Props {
    currentUser:    UserApiDto | null;
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
        { label: t("dashboard.profile.email"),    value: currentUser.email    || "—" },
        { label: t("dashboard.profile.phone"),    value: currentUser.phone    || "—" },
        { label: t("dashboard.profile.birthday"), value: currentUser.birthday?.split("T")[0] || "—" },
    ];

    const initials = `${currentUser.name?.[0] ?? ""}${currentUser.surname?.[0] ?? ""}`.toUpperCase();

    return (
        <Stack spacing={4}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, bgcolor: "background.default", border: `1px solid ${colors.border}` }}>
                <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between"
                       alignItems={{ xs: "flex-start", sm: "center" }} gap={3}>
                    <Stack direction="row" alignItems="center" gap={3}>
                        <Avatar
                            src={resolveMediaUrl(currentUser.avatarUrl)}
                            sx={{ width: 72, height: 72, fontSize: 26 }}
                        >
                            {!currentUser.avatarUrl && initials}
                        </Avatar>

                        <Box>
                            <Typography variant="h5" fontWeight={900} sx={{ mb: 2 }}>
                                {currentUser.name} {currentUser.surname}
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
                    </Stack>

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