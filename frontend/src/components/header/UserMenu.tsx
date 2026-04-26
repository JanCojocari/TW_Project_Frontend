// layout/UserMenu.tsx
import {
    Avatar, Box, Divider, IconButton, ListItemIcon,
    Menu, MenuItem, Typography,
} from "@mui/material";
import DashboardIcon      from "@mui/icons-material/Dashboard";
import AddHomeIcon        from "@mui/icons-material/AddHome";
import SettingsIcon       from "@mui/icons-material/Settings";
import SupportAgentIcon  from "@mui/icons-material/SupportAgent";
import LogoutIcon         from "@mui/icons-material/Logout";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { useNavigate }    from "react-router-dom";
import { useState }       from "react";
import { useTranslation } from "react-i18next";
import { useAuth }        from "../../auth/AuthContext";
import { paths }          from "../../app/paths";
import { resolveMediaUrl } from "../../utils/mediaUrl";

const UserMenu = () => {
    const navigate             = useNavigate();
    const { currentUser, isAdmin, logout } = useAuth();
    const { t }                = useTranslation();
    const [anchor, setAnchor]  = useState<null | HTMLElement>(null);

    const open      = Boolean(anchor);
    const handleOpen  = (e: React.MouseEvent<HTMLElement>) => setAnchor(e.currentTarget);
    const handleClose = () => setAnchor(null);

    const go = (path: string) => { navigate(path); handleClose(); };

    const fullName = currentUser
        ? `${currentUser.name} ${currentUser.surname}`
        : "";

    return (
        <>
            <IconButton onClick={handleOpen} size="small" sx={{ p: 0 }}>
                <Avatar
                    src={resolveMediaUrl(currentUser?.avatarUrl)}
                    alt={fullName}
                    sx={{ width: 38, height: 38, cursor: "pointer",
                        border: "2px solid",
                        borderColor: open ? "primary.main" : "divider",
                        transition: "border-color 0.2s ease",
                    }}
                >
                    {/* fallback cu initiala */}
                    {!currentUser?.avatarUrl && currentUser?.name?.[0]?.toUpperCase()}
                </Avatar>
            </IconButton>

            <Menu
                anchorEl={anchor}
                open={open}
                onClose={handleClose}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                slotProps={{
                    paper: {
                        elevation: 4,
                        sx: {
                            mt: 1.5,
                            minWidth: 220,
                            borderRadius: 2,
                            overflow: "visible",
                            // sageata decorativa
                            "&::before": {
                                content: '""',
                                display: "block",
                                position: "absolute",
                                top: 0, right: 14,
                                width: 10, height: 10,
                                bgcolor: "background.paper",
                                transform: "translateY(-50%) rotate(45deg)",
                                zIndex: 0,
                                borderTop: "1px solid",
                                borderLeft: "1px solid",
                                borderColor: "divider",
                            },
                        },
                    },
                }}
            >
                {/* Sectiunea cu informatii user */}
                <Box sx={{ px: 2, pt: 1.5, pb: 1 }}>
                    <Typography fontWeight={700} noWrap>{fullName}</Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                        {currentUser?.email}
                    </Typography>
                </Box>

                <Divider />

                {isAdmin && (
                    <MenuItem onClick={() => go(paths.admin)}>
                        <ListItemIcon>
                            <AdminPanelSettingsIcon fontSize="small" sx={{ color: "warning.main" }} />
                        </ListItemIcon>
                        <Typography fontWeight={600} color="warning.main">Admin</Typography>
                    </MenuItem>
                )}

                <MenuItem onClick={() => go(paths.dashboard)}>
                    <ListItemIcon><DashboardIcon fontSize="small" /></ListItemIcon>
                    {t("nav.dashboard")}
                </MenuItem>

                <MenuItem onClick={() => go(paths.createListing)}>
                    <ListItemIcon><AddHomeIcon fontSize="small" /></ListItemIcon>
                    {t("nav.createListing")}
                </MenuItem>

                <MenuItem onClick={() => go(paths.settings)}>
                    <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
                    {t("nav.settings")}
                </MenuItem>

                <MenuItem onClick={() => go(paths.support)}>
                    <ListItemIcon><SupportAgentIcon fontSize="small" /></ListItemIcon>
                    {t("nav.support")}
                </MenuItem>

                <Divider />

                <MenuItem
                    onClick={() => { logout(); handleClose(); }}
                    sx={{
                        color: "error.main",
                        "& .MuiListItemIcon-root": { color: "error.main" },
                        "&:hover": { bgcolor: "error.main", color: "#fff",
                            "& .MuiListItemIcon-root": { color: "#fff" } },
                        transition: "background 0.2s ease, color 0.2s ease",
                    }}
                >
                    <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
                    {t("nav.logout")}
                </MenuItem>
            </Menu>
        </>
    );
};

export default UserMenu;