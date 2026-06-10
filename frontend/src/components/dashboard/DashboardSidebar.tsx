// components/dashboard/DashboardSidebar.tsx
import { Box, Typography, Avatar } from "@mui/material";
import { gradients, colors }       from "../../theme/gradients";
import { resolveMediaUrl }         from "../../utils/mediaUrl";
import SidebarItem, { type NavKey, type NavItem } from "./SidebarItem";
import type { UserApiDto }         from "../../services/userService";

const NAVBAR_H  = 64;
const SIDEBAR_W = 130;

interface Props {
    nav:         NavItem[];
    active:      NavKey;
    onNavigate:  (key: NavKey) => void;
    currentUser: UserApiDto | null;
    initials:    string;
}

export default function DashboardSidebar({ nav, active, onNavigate, currentUser, initials }: Props) {
    return (
        <Box sx={{
            width: SIDEBAR_W, flexShrink: 0,
            bgcolor: "background.paper",
            borderRight: `1px solid ${colors.border}`,
            display: "flex", flexDirection: "column", alignItems: "center",
            position: "sticky",
            top: NAVBAR_H,
            height: `calc(100vh - ${NAVBAR_H}px)`,
            alignSelf: "flex-start",
            zIndex: 900,
            overflowY: "auto",
            pt: 3, pb: 2,
        }}>
            <Avatar
                src={resolveMediaUrl(currentUser?.avatarUrl)}
                sx={{
                    width: 50, height: 50,
                    background: gradients.primary,
                    fontSize: 17, fontWeight: 700,
                    mb: 0.8,
                    border: `2px solid ${colors.primaryAlpha25}`,
                    boxShadow: `0 4px 14px ${colors.primaryAlpha25}`,
                }}
            >
                {!currentUser?.avatarUrl && initials}
            </Avatar>

            <Typography sx={{ fontSize: 12, fontWeight: 700, color: "text.primary", textAlign: "center", px: 1, lineHeight: 1.3, mb: 0.2 }}>
                {currentUser?.name}
            </Typography>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: "text.primary", textAlign: "center", px: 1, lineHeight: 1.3, mb: 3 }}>
                {currentUser?.surname}
            </Typography>

            <Box sx={{ width: "60%", height: "1px", bgcolor: colors.border, mb: 2 }} />

            <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 0.25, flex: 1 }}>
                {nav.map(item => (
                    <SidebarItem
                        key={item.key}
                        item={item}
                        isActive={active === item.key}
                        onClick={() => onNavigate(item.key)}
                    />
                ))}
            </Box>

            <Typography sx={{ fontSize: 10, color: "text.disabled", mt: 2 }}>
                Rentora
            </Typography>
        </Box>
    );
}
