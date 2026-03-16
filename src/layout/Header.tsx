// layout/Header.tsx
import {
    AppBar, Box, Container, Toolbar, Button, Typography,
    Drawer, IconButton, List, ListItem, ListItemButton,
    ListItemText, Stack, Divider, Tooltip,
} from "@mui/material";
import ApartmentIcon from "@mui/icons-material/Apartment";
import MenuIcon      from "@mui/icons-material/Menu";
import CloseIcon     from "@mui/icons-material/Close";
import LogoutIcon    from "@mui/icons-material/Logout";
import DarkModeIcon  from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useNavigate }       from "react-router-dom";
import { useState }          from "react";
import { useTranslation }    from "react-i18next";
import { paths }             from "../app/paths";
import { useAuth }           from "../auth/AuthContext.tsx";
import { useThemeMode }      from "../theme/ThemeContext.tsx";
import { gradients, colors } from "../theme/gradients.ts";
import LanguageSwitcher      from "../components/general/LanguageSwitcher.tsx";

const Header = () => {
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen]  = useState(false);
    const { isAuthenticated, logout }  = useAuth();
    const { isDark, toggleMode }       = useThemeMode();
    const { t }                        = useTranslation();

    const menuItems = [
        !isAuthenticated ? { label: t("nav.home"),          path: paths.home          } : {},
        {                   label: t("nav.listings"),        path: paths.listings       },
        isAuthenticated  ? { label: t("nav.createListing"), path: paths.createListing  } : {},
        isAuthenticated  ? { label: t("nav.dashboard"),     path: paths.dashboard      } : {},
        !isAuthenticated ? { label: t("nav.about"),         path: paths.about          } : {},
        isAuthenticated  ? { label: t("nav.settings"), path: paths.settings } : {},
        {                   label: t("nav.support"),         path: paths.support        },
    ];

    const handleNavigation = (path: string) => { navigate(path); setMobileOpen(false); };

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

    const drawer = (
        <Box sx={{ width: 260, p: 3, height: "100%" }}>
            <Box display="flex" justifyContent="flex-end" mb={4}>
                <IconButton onClick={() => setMobileOpen(false)} color="primary"><CloseIcon /></IconButton>
            </Box>
            <List>
                {menuItems.map((item) => item.path && (
                    <ListItem key={item.path} disablePadding>
                        <ListItemButton onClick={() => handleNavigation(item.path)} sx={{ mb: 0.5 }}>
                            <ListItemText primary={item.label}
                                          primaryTypographyProps={{ fontWeight: 700, color: "text.secondary", fontSize: "1.05rem" }} />
                        </ListItemButton>
                    </ListItem>
                ))}
                {!isAuthenticated && (
                    <Stack spacing={2} sx={{ mt: 4, px: 2 }}>
                        <Button fullWidth variant="outlined"  onClick={() => handleNavigation(paths.login)}>{t("nav.login")}</Button>
                        <Button fullWidth variant="contained" onClick={() => handleNavigation(paths.register)}>{t("nav.register")}</Button>
                    </Stack>
                )}
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
                            <Box sx={{ background: gradients.primary, p: 1.2, borderRadius: 2, display: "flex", boxShadow: `0 4px 12px ${colors.primaryAlpha25}` }}>
                                <ApartmentIcon sx={{ color: "#FFFFFF", fontSize: 26 }} />
                            </Box>
                            <Typography variant="h5" fontWeight={900}
                                        sx={{ display: { xs: "none", sm: "block" }, letterSpacing: "-0.5px", background: gradients.textPrimary, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                Rentora
                            </Typography>
                        </Box>

                        {/* Desktop nav */}
                        <Stack direction="row" spacing={1} sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}>
                            {menuItems.map((item) => item.path && (
                                <Button key={item.path}
                                        sx={{ color: location.pathname === item.path ? "primary.main" : "text.secondary", fontWeight: 700, fontSize: "15px", px: 2, py: 1, position: "relative",
                                            "&::after": location.pathname === item.path ? { content: '""', position: "absolute", bottom: 4, left: 16, right: 16, height: "2px", background: gradients.primary, borderRadius: 2 } : {},
                                            "&:hover": { color: "primary.main" } }}
                                        onClick={() => navigate(item.path)}>
                                    {item.label}
                                </Button>
                            ))}

                            <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 24, alignSelf: "center" }} />

                            <ThemeToggleButton />
                            <LanguageSwitcher />

                            <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 24, alignSelf: "center" }} />

                            {!isAuthenticated ? (
                                <Stack direction="row" spacing={1.5}>
                                    <Button variant="text" onClick={() => navigate(paths.login)}
                                            sx={{ color: "text.primary", fontWeight: 700 }}>{t("nav.login")}</Button>
                                    <Button variant="contained" onClick={() => navigate(paths.register)}
                                            sx={{ px: 3 }}>{t("nav.register")}</Button>
                                </Stack>
                            ) : (
                                <Tooltip title={t("nav.logout")}>
                                    <IconButton onClick={() => logout()}
                                                sx={{ color: "#b23b3b", border: "1px solid #b23b3b", "&:hover": { background: "rgba(192,57,43,0.3)", borderColor: "#96281B", color: "#96281B" } }}>
                                        <LogoutIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            )}
                        </Stack>

                        <IconButton onClick={() => setMobileOpen(true)} color="primary" sx={{ display: { md: "none" } }}>
                            <MenuIcon />
                        </IconButton>
                    </Toolbar>
                </Container>
            </AppBar>

            <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)} sx={{ display: { md: "none" } }}>
                {drawer}
            </Drawer>
        </>
    );
};

export default Header;