// components/admin/AdminSidebar.tsx
import { type ReactNode } from "react";
import {
    Box, Typography, Avatar,
    List, ListItemButton, ListItemIcon, ListItemText,
} from "@mui/material";
import { useTranslation }    from "react-i18next";
import { gradients, colors } from "../../theme/gradients";
import { resolveMediaUrl }   from "../../utils/mediaUrl";
import type { NavKey }       from "./PlatformTab";
import type { UserApiDto }   from "../../services/userService";

const NAVBAR_H  = 64;
const SIDEBAR_W = 240;

export interface AdminNavItem {
    key:        NavKey;
    label:      string;
    icon:       ReactNode;
    desc:       string;
    adminOnly?: boolean;
}

interface Props {
    nav:         AdminNavItem[];
    active:      NavKey;
    onNavigate:  (key: NavKey) => void;
    currentUser: UserApiDto | null;
    roleLabel:   string;
}

export default function AdminSidebar({ nav, active, onNavigate, currentUser, roleLabel }: Props) {
    const { t } = useTranslation();

    return (
        <Box sx={{
            width: SIDEBAR_W, flexShrink: 0,
            bgcolor: "background.paper",
            borderRight: `1px solid ${colors.border}`,
            position: "sticky",
            top: NAVBAR_H,
            height: `calc(100vh - ${NAVBAR_H}px)`,
            alignSelf: "flex-start",
            display: "flex", flexDirection: "column",
            zIndex: 900,
            overflowY: "auto",
        }}>
            {/* User header */}
            <Box sx={{
                px: 2.5, py: 2,
                borderBottom: `1px solid ${colors.border}`,
                display: "flex", alignItems: "center", gap: 1.5,
            }}>
                <Avatar
                    src={resolveMediaUrl(currentUser?.avatarUrl)}
                    sx={{ width: 34, height: 34, background: gradients.primary, fontSize: 13, fontWeight: 700 }}
                >
                    {!currentUser?.avatarUrl && (currentUser?.name?.[0]?.toUpperCase() ?? "A")}
                </Avatar>
                <Box>
                    <Typography fontSize={13} fontWeight={700} color="text.primary" lineHeight={1.2}>
                        {currentUser?.name} {currentUser?.surname}
                    </Typography>
                    <Typography fontSize={11} color="text.secondary" lineHeight={1.4}>
                        {roleLabel}
                    </Typography>
                </Box>
            </Box>

            {/* Menu title */}
            <Typography sx={{
                px: 2.5, pt: 2.5, pb: 1,
                fontSize: 10, fontWeight: 700, color: "text.disabled",
                letterSpacing: 1.2, textTransform: "uppercase",
            }}>
                {t("admin.nav.menuTitle")}
            </Typography>

            {/* Nav list */}
            <List sx={{ px: 1.5, pb: 2, flex: 1 }}>
                {nav.map(item => {
                    const isActive = active === item.key;
                    return (
                        <ListItemButton
                            key={item.key}
                            selected={isActive}
                            onClick={() => onNavigate(item.key)}
                            sx={{
                                borderRadius: 2, mb: 0.5, px: 1.5, py: 0.9,
                                position: "relative",
                                transition: "all 0.15s",
                                color:  isActive ? "primary.main" : "text.secondary",
                                bgcolor: isActive ? colors.primaryAlpha10 : "transparent",
                                "&:hover": { bgcolor: colors.primaryAlpha06, color: "primary.main" },
                                "&.Mui-selected": {
                                    bgcolor: colors.primaryAlpha10,
                                    "&:hover": { bgcolor: colors.primaryAlpha10 },
                                },
                                "&.Mui-selected::before": {
                                    content: '""',
                                    position: "absolute",
                                    left: -6, top: "20%", bottom: "20%",
                                    width: 3, borderRadius: 99,
                                    background: gradients.primary,
                                },
                            }}
                        >
                            <ListItemIcon sx={{ color: "inherit", minWidth: 34, "& svg": { fontSize: 19 } }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.label}
                                primaryTypographyProps={{ fontSize: 13.5, fontWeight: isActive ? 700 : 400, lineHeight: 1 }}
                            />
                        </ListItemButton>
                    );
                })}
            </List>
        </Box>
    );
}
