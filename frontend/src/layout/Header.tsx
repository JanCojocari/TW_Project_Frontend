// layout/Header.tsx
import {
    AppBar, Avatar, Box, Container, Toolbar, Button, Typography,
    Drawer, IconButton, List, ListItem, ListItemButton,
    ListItemText, Stack, Divider,
} from "@mui/material";
import ApartmentIcon          from "@mui/icons-material/Apartment";
import MenuIcon               from "@mui/icons-material/Menu";
import CloseIcon              from "@mui/icons-material/Close";
import DarkModeIcon           from "@mui/icons-material/DarkMode";
import LightModeIcon          from "@mui/icons-material/LightMode";
import DashboardIcon          from "@mui/icons-material/Dashboard";
import AddHomeIcon            from "@mui/icons-material/AddHome";
import SettingsIcon           from "@mui/icons-material/Settings";
import LogoutIcon             from "@mui/icons-material/Logout";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { useNavigate }        from "react-router-dom";
import { useState }           from "react";
import { useTranslation }     from "react-i18next";
import { paths }              from "../app/paths";
import { useAuth }            from "../auth/AuthContext.tsx";
import { useThemeMode }       from "../theme/ThemeContext.tsx";
import { gradients, colors }  from "../theme/gradients.ts";
import LanguageSwitcher       from "../components/general/LanguageSwitcher.tsx";
import UserMenu               from "../components/header/UserMenu.tsx";
import { resolveMediaUrl }    from "../utils/mediaUrl.ts";

const Header = () => {
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const { isAuthenticated, isAdmin, logout, currentUser } = useAuth();
    const { isDark, toggleMode } = useThemeMode();
    const { t } = useTranslation();

    // Linkuri publice (pentru userii neautentificati) - apar si in desktop si in mobile drawer
    const publicItems = [
        { label: t("nav.home"),     path: paths.home     },
        { label: t("nav.listings"), path: paths.listings  },
        { label: t("nav.about"),    path: paths.about     },
        { label: t("nav.support"),  path: paths.support   },
    ];

    // Linkuri pentru mobile drawer cand userul e autentificat
    const authMobileItems = [
        { label: t("nav.listings"),      path: paths.listings,      icon: null               },
        { label: t("nav.support"),       path: paths.support,       icon: null               },
        { label: t("nav.dashboard"),     path: paths.dashboard,     icon: <DashboardIcon fontSize="small" /> },
        { label: t("nav.createListing"), path: paths.createListing, icon: <AddHomeIcon   fontSize="small" /> },
        { label: t("nav.settings"),      path: paths.settings,      icon: <SettingsIcon  fontSize="small" /> },
    ];

    const handleNav = (path: string) => { navigate(path); setMobileOpen(false); };

    const ThemeToggleButton = () => (
        <IconButton onClick={toggleMode} sx={{
            color:  isDark ? "#FCD34D" : "#4E7AA6",
            border: `1px solid ${isDark ? "rgba(252,211,77,0.3)" : colors.border}`,
            transition: "all 0.3s ease",
            "&:hover": {
                background: isDark ? "rgba(252,211,77,0.1)" : "rgba(76,139,245,0.08)",
                transform:  "rotate(20deg)",
            },
        }}>
            {isDark ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
        </IconButton>
    );

    // Drawer pentru mobile - autentificat
    const authDrawer = (
        <Box sx={{ width: 260, p: 3, height: "100%" }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                {/* Info user in drawer */}
                <Box display="flex" alignItems="center" gap={1.5}>
                    <Avatar
                        src={resolveMediaUrl(currentUser?.avatarUrl)}
                        sx={{ width: 40, height: 40 }}
                    >
                        {currentUser?.name?.[0]?.toUpperCase()}
                    </Avatar>
                    <Box>
                        <Typography fontWeight={700} fontSize="0.9rem" noWrap>
                            {currentUser?.name} {currentUser?.surname}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" noWrap>
                            {currentUser?.email}
                        </Typography>
                    </Box>
                </Box>
                <IconButton onClick={() => setMobileOpen(false)} color="primary">
                    <CloseIcon />
                </IconButton>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <List>
                {isAdmin && (
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => handleNav(paths.admin)} sx={{ mb: 0.5, borderRadius: 1 }}>
                            <AdminPanelSettingsIcon sx={{ mr: 1.5, color: "warning.main", fontSize: 20 }} />
                            <ListItemText primary="Admin"
                                          primaryTypographyProps={{ fontWeight: 700, color: "warning.main", fontSize: "1rem" }} />
                        </ListItemButton>
                    </ListItem>
                )}

                {authMobileItems.map((item) => (
                    <ListItem key={item.path} disablePadding>
                        <ListItemButton onClick={() => handleNav(item.path)} sx={{ mb: 0.5, borderRadius: 1 }}>
                            {item.icon && (
                                <Box component="span" sx={{ mr: 1.5, display: "flex", color: "text.secondary" }}>
                                    {item.icon}
                                </Box>
                            )}
                            <ListItemText primary={item.label}
                                          primaryTypographyProps={{ fontWeight: 600, color: "text.primary", fontSize: "1rem" }} />
                        </ListItemButton>
                    </ListItem>
                ))}

                <Divider sx={{ my: 1.5 }} />

                <ListItem disablePadding>
                    <ListItemButton
                        onClick={() => { logout(); setMobileOpen(false); }}
                        sx={{ borderRadius: 1, color: "error.main",
                            "&:hover": { bgcolor: "error.main", color: "#fff",
                                "& svg": { color: "#fff" } },
                            transition: "background 0.2s, color 0.2s" }}
                    >
                        <LogoutIcon sx={{ mr: 1.5, fontSize: 20, color: "error.main" }} />
                        <ListItemText primary={t("nav.logout")}
                                      primaryTypographyProps={{ fontWeight: 700, fontSize: "1rem" }} />
                    </ListItemButton>
                </ListItem>
            </List>

            <Box sx={{ mt: 3, px: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <ThemeToggleButton />
                    <LanguageSwitcher />
                </Stack>
            </Box>
        </Box>
    );

    // Drawer pentru mobile - neautentificat (comportament original)
    const publicDrawer = (
        <Box sx={{ width: 260, p: 3, height: "100%" }}>
            <Box display="flex" justifyContent="flex-end" mb={4}>
                <IconButton onClick={() => setMobileOpen(false)} color="primary"><CloseIcon /></IconButton>
            </Box>
            <List>
                {publicItems.map((item) => (
                    <ListItem key={item.path} disablePadding>
                        <ListItemButton onClick={() => handleNav(item.path)} sx={{ mb: 0.5 }}>
                            <ListItemText primary={item.label}
                                          primaryTypographyProps={{ fontWeight: 700, color: "text.secondary", fontSize: "1.05rem" }} />
                        </ListItemButton>
                    </ListItem>
                ))}

                <Stack spacing={2} sx={{ mt: 4, px: 2 }}>
                    <Button fullWidth variant="outlined"  onClick={() => handleNav(paths.login)}>{t("nav.login")}</Button>
                    <Button fullWidth variant="contained" onClick={() => handleNav(paths.register)}>{t("nav.register")}</Button>
                </Stack>

                <Box sx={{ mt: 4, px: 2 }}>
                    <Divider sx={{ mb: 2 }} />
                    <Stack direction="row" spacing={1} alignItems="center">
                        <ThemeToggleButton />
                        <LanguageSwitcher />
                    </Stack>
                </Box>
            </List>
        </Box>
    );

    return (
        <>
            <AppBar elevation={0} sx={{ py: 0.5 }}>
                <Container maxWidth="lg">
                    <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
                        {/* Logo */}
                        <Box display="flex" alignItems="center" gap={1.5}
                             sx={{ cursor: "pointer", transition: "all 0.3s ease", "&:hover": { transform: "scale(1.02)" } }}
                             onClick={() => navigate(paths.home)}>
                            <Box sx={{ background: gradients.primary, p: 1.2, borderRadius: 2, display: "flex",
                                boxShadow: `0 4px 12px ${colors.primaryAlpha25}` }}>
                                <ApartmentIcon sx={{ color: "#FFFFFF", fontSize: 26 }} />
                            </Box>
                            <Typography variant="h5" fontWeight={900}
                                        sx={{ display: { xs: "none", sm: "block" }, letterSpacing: "-0.5px",
                                            background: gradients.textPrimary, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                Rentora
                            </Typography>
                        </Box>

                        {/* Desktop nav - folosim flex: 1 pentru a centra linkurile */}
                        <Stack direction="row" spacing={1} sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", flex: 1, justifyContent: "center" }}>
                            {/* Anunturi - vizibil pentru toti */}
                            <Button
                                sx={{ color: location.pathname === paths.listings ? "primary.main" : "text.secondary",
                                    fontWeight: 700, fontSize: "15px", px: 2, py: 1, position: "relative",
                                    "&::after": location.pathname === paths.listings
                                        ? { content: '""', position: "absolute", bottom: 4, left: 16, right: 16,
                                            height: "2px", background: gradients.primary, borderRadius: 2 }
                                        : {},
                                    "&:hover": { color: "primary.main" } }}
                                onClick={() => navigate(paths.listings)}>
                                {t("nav.listings")}
                            </Button>

                            {/* Suport si Home/About - doar pentru neautentificati */}
                            {!isAuthenticated && [
                                { label: t("nav.support"), path: paths.support },
                                { label: t("nav.home"),    path: paths.home    },
                                { label: t("nav.about"),   path: paths.about   },
                            ].map((item) => (
                                <Button key={item.path}
                                        sx={{ color: location.pathname === item.path ? "primary.main" : "text.secondary",
                                            fontWeight: 700, fontSize: "15px", px: 2, py: 1, position: "relative",
                                            "&::after": location.pathname === item.path
                                                ? { content: '""', position: "absolute", bottom: 4, left: 16, right: 16,
                                                    height: "2px", background: gradients.primary, borderRadius: 2 }
                                                : {},
                                            "&:hover": { color: "primary.main" } }}
                                        onClick={() => navigate(item.path)}>
                                    {item.label}
                                </Button>
                            ))}
                        </Stack>

                        {/* Dreapta: theme, lang, auth */}
                        <Stack direction="row" spacing={1} sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}>
                            <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 24, alignSelf: "center" }} />
                            <ThemeToggleButton />
                            <LanguageSwitcher />
                            <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 24, alignSelf: "center" }} />

                            {/* Auth zone */}
                            {!isAuthenticated ? (
                                <Stack direction="row" spacing={1.5}>
                                    <Button variant="text" onClick={() => navigate(paths.login)}
                                            sx={{ color: "text.primary", fontWeight: 700 }}>{t("nav.login")}</Button>
                                    <Button variant="contained" onClick={() => navigate(paths.register)}
                                            sx={{ px: 3 }}>{t("nav.register")}</Button>
                                </Stack>
                            ) : (
                                // Avatar + dropdown menu
                                <UserMenu />
                            )}
                        </Stack>

                        {/* Mobile: burger (neautentificat) sau avatar (autentificat) */}
                        {isAuthenticated ? (
                            <Box sx={{ display: { md: "none" } }}>
                                <IconButton onClick={() => setMobileOpen(true)} size="small" sx={{ p: 0 }}>
                                    <Avatar
                                        src={resolveMediaUrl(currentUser?.avatarUrl)}
                                        sx={{ width: 38, height: 38, border: "2px solid", borderColor: "primary.main" }}
                                    >
                                        {currentUser?.name?.[0]?.toUpperCase()}
                                    </Avatar>
                                </IconButton>
                            </Box>
                        ) : (
                            <IconButton onClick={() => setMobileOpen(true)} color="primary"
                                        sx={{ display: { md: "none" } }}>
                                <MenuIcon />
                            </IconButton>
                        )}
                    </Toolbar>
                </Container>
            </AppBar>

            <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}
                    sx={{ display: { md: "none" } }}>
                {isAuthenticated ? authDrawer : publicDrawer}
            </Drawer>
        </>
    );
};

export default Header;