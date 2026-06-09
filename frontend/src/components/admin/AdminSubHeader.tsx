// components/admin/AdminSubHeader.tsx
import { Box, Typography, Avatar, Breadcrumbs, Link } from "@mui/material";
import { gradients, colors } from "../../theme/gradients";
import { resolveMediaUrl }   from "../../utils/mediaUrl";
import type { AdminNavItem } from "./AdminSidebar";
import type { UserApiDto }   from "../../services/userService";

interface Props {
    current:        AdminNavItem;
    dashboardTitle: string;
    isMobile:       boolean;
    currentUser:    UserApiDto | null;
    onHome:         () => void;
}

export default function AdminSubHeader({ current, dashboardTitle, isMobile, currentUser, onHome }: Props) {
    return (
        <Box sx={{
            px: { xs: 2, md: 4 }, py: 2,
            borderBottom: `1px solid ${colors.border}`,
            bgcolor: "background.paper",
            display: "flex", alignItems: "center", gap: 2,
        }}>
            {/* Avatar compact pe mobile */}
            {isMobile && (
                <Avatar
                    src={resolveMediaUrl(currentUser?.avatarUrl)}
                    sx={{ width: 36, height: 36, background: gradients.primary, fontSize: 13, fontWeight: 700, flexShrink: 0 }}
                >
                    {!currentUser?.avatarUrl && (currentUser?.name?.[0]?.toUpperCase() ?? "A")}
                </Avatar>
            )}

            <Box sx={{ minWidth: 0, flex: 1 }}>
                <Breadcrumbs sx={{ mb: 0.5, "& .MuiBreadcrumbs-separator": { color: "text.disabled" } }}>
                    <Link
                        underline="hover"
                        sx={{ fontSize: 12, color: "text.secondary", cursor: "pointer", fontWeight: 500 }}
                        onClick={onHome}
                    >
                        {dashboardTitle}
                    </Link>
                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: "text.primary" }}>
                        {current.label}
                    </Typography>
                </Breadcrumbs>

                <Typography
                    variant="h6" fontWeight={800}
                    sx={{
                        fontSize: { xs: 16, md: 18 },
                        background: gradients.textPrimary,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        letterSpacing: "-0.5px",
                    }}
                >
                    {current.label}
                </Typography>

                <Typography
                    fontSize={{ xs: 12, md: 13 }} color="text.secondary" mt={0.3}
                    sx={{ display: { xs: "none", sm: "block" } }}
                >
                    {current.desc}
                </Typography>
            </Box>
        </Box>
    );
}
