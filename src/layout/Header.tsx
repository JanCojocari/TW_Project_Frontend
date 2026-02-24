import {
    AppBar,
    Box,
    Container,
    Toolbar,
    Button,
    Typography,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Stack,
    Divider,
} from "@mui/material";
import ApartmentIcon from "@mui/icons-material/Apartment";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { paths } from "../app/paths";
import { useAuth } from "../auth/AuthContext.tsx";
import { gradients, colors } from "../theme/gradients.ts";

const Header = () => {
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const { isAuthenticated,logout } = useAuth();
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const menuItems = [
        !isAuthenticated ? { label: "Acasă", path: paths.home } : {},
        { label: "Anunțuri", path: paths.listings },
        isAuthenticated ? { label: "Dashboard", path: paths.dashboard } : {},
        !isAuthenticated ? { label: "Despre", path: paths.about } : {},
        { label: "Suport", path: paths.support },
    ];

    const handleNavigation = (path: string) => {
        navigate(path);
        setMobileOpen(false);
    };

    const drawer = (
        <Box sx={{ width: 260, p: 3, height: "100%" }}>
            <Box display="flex" justifyContent="flex-end" mb={4}>
                <IconButton onClick={handleDrawerToggle} color="primary">                    <CloseIcon />
                </IconButton>
            </Box>
            <List>
                {menuItems.map((item) =>
                    item.path &&
                    (
                        <ListItem key={item.path} disablePadding>
                            <ListItemButton onClick={() => handleNavigation(item.path)} sx={{ mb: 0.5 }}>

                            <ListItemText
                                    primary={item.label}
                                    primaryTypographyProps={{ 
                                        fontWeight: 700, 
                                        color: "text.secondary", 
                                        fontSize: "1.05rem" }}
                            />
                            </ListItemButton>
                        </ListItem>
                    ))}
                {
                    !isAuthenticated &&
                    <Stack spacing={2} sx={{ mt: 4, px: 2 }}>
                        <Button fullWidth variant="outlined" onClick={() => handleNavigation(paths.login)}>
                            Log In
                        </Button>
                        <Button fullWidth variant="contained" onClick={() => handleNavigation(paths.register)}>
                            Sign Up
                        </Button>
                    </Stack>
                }
            </List>
        </Box>
    );

    return (
        <>
            <AppBar elevation={0} sx={{ py: 0.5 }}>
            <Container maxWidth="lg">
                    <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
                        {/* Logo */}
                        <Box
                            display="flex"
                            alignItems="center"
                            gap={1.5}
                            sx={{
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                "&:hover": { transform: "scale(1.02)" },
                            }}
                            onClick={() => navigate(paths.home)}
                        >
                            <Box
                                sx={{
                                    background: gradients.primary,
                                    p: 1.2,
                                    borderRadius: 2,
                                    display: "flex",
                                    boxShadow: `0 4px 12px ${colors.primaryAlpha25}`,
                                }}
                            >
                                <ApartmentIcon sx={{ color: "#FFFFFF", fontSize: 26 }} />
                            </Box>

                            <Typography
                                variant="h5"
                                fontWeight={900}
                                sx={{
                                    display: { xs: "none", sm: "block" },
                                    letterSpacing: "-0.5px",
                                    background: gradients.textPrimary,
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                }}
                            >
                                Rentora
                            </Typography>
                        </Box>

                        {/* Navigation */}
                        <Stack
                            direction="row"
                            spacing={1}
                            sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}
                        >
                            {menuItems.map((item) =>
                                    item.path && (
                                        <Button
                                            key={item.path}
                                            sx={{
                                                color: location.pathname === item.path ? "primary.main" : "text.secondary",
                                                fontWeight: 700,
                                                fontSize: "15px",
                                                px: 2,
                                                py: 1,
                                                position: "relative",
                                                "&::after": location.pathname === item.path ? {
                                                    content: '""',
                                                    position: "absolute",
                                                    bottom: 4,
                                                    left: 16,
                                                    right: 16,
                                                    height: "2px",
                                                    background: gradients.primary,
                                                    borderRadius: 2,
                                                } : {},
                                                "&:hover": { color: "primary.main" },
                                            }}
                                            onClick={() => navigate(item.path)}
                                        >
                                            {item.label}
                                        </Button>
                                    )
                            )}

                            <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 24, alignSelf: "center" }} />

                            {!isAuthenticated ? (
                                <Stack direction="row" spacing={1.5}>
                                    <Button
                                        variant="text"
                                        onClick={() => navigate(paths.login)}
                                        sx={{ color: "text.primary", fontWeight: 700 }}
                                    >
                                        Log In
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={() => navigate(paths.register)}
                                        sx={{ px: 3 }}
                                    >
                                        Sign Up
                                    </Button>
                                </Stack>
                            ) : (
                                <IconButton
                                    onClick={() => {logout()}}
                                    sx={{
                                        color: "#b23b3b",
                                        border: "1px solid #b23b3b",
                                        "&:hover": {
                                            background: "rgba(192, 57, 43, 0.3)",
                                            borderColor: "#96281B",
                                            color: "#96281B",
                                        },
                                    }}
                                >
                                    <LogoutIcon fontSize="small" />
                                </IconButton>
                            )}
                        </Stack>

                        {/* Mobile Toggle */}
                        <IconButton
                            onClick={handleDrawerToggle}
                            color="primary"
                            sx={{ display: { md: "none" } }}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Toolbar>
                </Container>
            </AppBar>

            <Drawer
                anchor="right"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                sx={{ display: { md: "none" } }}
            >
                {drawer}
            </Drawer>
        </>
    );
};


export default Header;