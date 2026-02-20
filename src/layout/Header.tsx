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
        <Box
            sx={{
                width: 250,
                p: 3,
                background: "#071A1D",
                height: "100%",
                borderLeft: "1px solid #12383D"
            }}
        >
            <Box display="flex" justifyContent="flex-end" mb={4}>
                <IconButton onClick={handleDrawerToggle} sx={{ color: "#00E0C6" }}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <List>
                {menuItems.map((item) =>
                    item.path &&
                    (
                        <ListItem key={item.path} disablePadding>
                            <ListItemButton
                                onClick={() => handleNavigation(item.path)}
                                sx={{
                                    borderRadius: 2,
                                    mb: 1,
                                    "&:hover": {
                                        background: "rgba(0, 224, 198, 0.05)",
                                        "& .MuiListItemText-primary": { color: "#00E0C6" }
                                    },
                                }}
                            >
                                <ListItemText
                                    primary={item.label}
                                    primaryTypographyProps={{
                                        fontWeight: 700,
                                        color: "#8FB5B1",
                                        fontSize: "1.1rem",
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                {
                    !isAuthenticated &&
                    <Stack spacing={2} sx={{ mt: 4, px: 2 }}>
                        <Button
                            fullWidth
                            variant="outlined"
                            sx={{
                                color: "#E6F7F5",
                                borderColor: "#12383D",
                                fontWeight: 700,
                                textTransform: "none",
                                "&:hover": { borderColor: "#00E0C6", background: "rgba(0, 224, 198, 0.05)" }
                            }}
                            onClick={() => handleNavigation(paths.login)}
                        >
                            Log In
                        </Button>
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{
                                background: "linear-gradient(90deg, #00E0C6, #00BFA6)",
                                color: "#071A1D",
                                fontWeight: 800,
                                textTransform: "none",
                                boxShadow: "0 0 12px rgba(0, 224, 198, 0.35)",
                            }}
                            onClick={() => handleNavigation(paths.register)}
                        >
                            Sign Up
                        </Button>
                    </Stack>
                }
            </List>
        </Box>
    );

    return (
        <>
            <AppBar
                elevation={0}
                sx={{
                    background: "rgba(7, 26, 29, 0.85)",
                    backdropFilter: "blur(12px)",
                    borderBottom: "1px solid #12383D",
                    py: 1,
                }}
            >
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
                                    background: "linear-gradient(135deg, #00E0C6, #00BFA6)",
                                    p: 1.2,
                                    borderRadius: 2,
                                    display: "flex",
                                    boxShadow: "0 0 15px rgba(0, 224, 198, 0.3)",
                                }}
                            >
                                <ApartmentIcon sx={{ color: "#071A1D", fontSize: 28 }} />
                            </Box>

                            <Typography
                                variant="h5"
                                fontWeight={900}
                                sx={{
                                    color: "#E6F7F5",
                                    letterSpacing: "-0.5px",
                                    display: { xs: "none", sm: "block" },
                                    background: "linear-gradient(90deg, #E6F7F5, #00E0C6)",
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
                                                color: location.pathname === item.path ? "#00E0C6" : "#8FB5B1",
                                                fontWeight: 700,
                                                textTransform: "none",
                                                fontSize: "15px",
                                                px: 2,
                                                py: 1,
                                                transition: "all 0.2s ease",
                                                position: "relative",
                                                "&::after": location.pathname === item.path ? {
                                                    content: '""',
                                                    position: "absolute",
                                                    bottom: 4,
                                                    left: 16,
                                                    right: 16,
                                                    height: "2px",
                                                    background: "#00E0C6",
                                                    boxShadow: "0 0 8px #00FFF0",
                                                    borderRadius: 2,
                                                } : {},
                                                "&:hover": {
                                                    color: "#00E0C6",
                                                    background: "rgba(0, 224, 198, 0.05)",
                                                },
                                            }}
                                            onClick={() => navigate(item.path)}
                                        >
                                            {item.label}
                                        </Button>
                                    )
                            )}

                            <Divider orientation="vertical" flexItem sx={{ mx: 2, height: 24, alignSelf: "center", borderColor: "#12383D" }} />

                            {!isAuthenticated ? (
                                <Stack direction="row" spacing={2}>
                                    <Button
                                        onClick={() => navigate(paths.login)}
                                        sx={{
                                            color: "#E6F7F5",
                                            fontWeight: 700,
                                            textTransform: "none",
                                            "&:hover": { color: "#00E0C6" }
                                        }}
                                    >
                                        Log In
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={() => navigate(paths.register)}
                                        sx={{
                                            background: "linear-gradient(90deg, #00E0C6, #00BFA6)",
                                            color: "#071A1D",
                                            fontWeight: 800,
                                            textTransform: "none",
                                            borderRadius: 2,
                                            px: 3,
                                            boxShadow: "0 0 12px rgba(0, 224, 198, 0.35)",
                                            "&:hover": {
                                                background: "linear-gradient(90deg, #00FFF0, #00E0C6)",
                                                boxShadow: "0 0 20px rgba(0, 224, 198, 0.5)",
                                            },
                                        }}
                                    >
                                        Sign Up
                                    </Button>
                                </Stack>
                            ) : (
                                <IconButton
                                    onClick={() => {logout()}}
                                    sx={{
                                        color: "#FF4D6D",
                                        border: "1px solid rgba(255, 77, 109, 0.2)",
                                        "&:hover": { background: "rgba(255, 77, 109, 0.1)" }
                                    }}
                                >
                                    <LogoutIcon fontSize="small" />
                                </IconButton>
                            )}
                        </Stack>

                        {/* Mobile Toggle */}
                        <IconButton
                            onClick={handleDrawerToggle}
                            sx={{ display: { md: "none" }, color: "#00E0C6" }}
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