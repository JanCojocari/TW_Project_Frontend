// components/dashboard/DashboardMobileHeader.tsx
import { Box, Typography, Avatar } from "@mui/material";
import { gradients, colors }       from "../../theme/gradients";
import { resolveMediaUrl }         from "../../utils/mediaUrl";
import type { UserApiDto }         from "../../services/userService";

interface Props {
    currentUser: UserApiDto | null;
    initials:    string;
}

export default function DashboardMobileHeader({ currentUser, initials }: Props) {
    return (
        <Box sx={{
            display: "flex", alignItems: "center", gap: 1.5,
            mb: 3, p: 2,
            bgcolor: "background.paper",
            borderRadius: 2,
            border: `1px solid ${colors.border}`,
        }}>
            <Avatar
                src={resolveMediaUrl(currentUser?.avatarUrl)}
                sx={{ width: 42, height: 42, background: gradients.primary, fontSize: 14, fontWeight: 700 }}
            >
                {!currentUser?.avatarUrl && initials}
            </Avatar>
            <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography fontSize={14} fontWeight={700} color="text.primary" lineHeight={1.2} noWrap>
                    {currentUser?.name} {currentUser?.surname}
                </Typography>
                <Typography fontSize={12} color="text.secondary" lineHeight={1.4} noWrap>
                    {currentUser?.email}
                </Typography>
            </Box>
        </Box>
    );
}
