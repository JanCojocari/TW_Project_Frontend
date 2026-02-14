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
} from "@mui/material";
import ApartmentIcon from "@mui/icons-material/Apartment";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {paths} from "../app/paths";
import {useAuth} from "../auth/AuthContext.tsx";

const Header = () => {
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const {isAuthenticated} = useAuth();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const menuItems = [
        !isAuthenticated ? {label: "Acasă", path: paths.home} : {},
        {label: "Anunțuri", path: paths.listings},
        isAuthenticated ? {label: "Dashboard", path: paths.dashboard} : {},
        !isAuthenticated?{label: "Despre", path: paths.about}:{},
    ];

    const handleNavigation = (path: string) => {
        navigate(path);
        setMobileOpen(false);
    };

    const drawer = (
        <Box
            sx={{
                width: 250,
                p: 2,
                background: "linear-gradient(180deg, #f8f9fa, #ffffff)",
            }}
        >
            <Box display="flex" justifyContent="flex-end" px={2} mb={2}>
                <IconButton onClick={handleDrawerToggle}>
                    <CloseIcon sx={{color: "#4f46e5"}}/>
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
                                    borderRadius: 1.5,
                                    mb: 1,
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                        background: "linear-gradient(90deg, rgba(37, 99, 235, 0.08), rgba(79, 70, 229, 0.08))",
                                    },
                                }}
                            >
                                <ListItemText
                                    primary={item.label}
                                    primaryTypographyProps={{
                                        fontWeight: 600,
                                        color: "#2563eb",
                                        fontSize: 15,
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                {
                    !isAuthenticated &&
                    <ListItem disablePadding sx={{mt: 3, flexDirection: "column", gap: 1.5}}>
                        <Button
                            fullWidth
                            variant="text"
                            sx={{
                                color: "#2563eb",
                                fontWeight: 600,
                                textTransform: "none",
                                fontSize: 15,
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    background: "rgba(37, 99, 235, 0.08)",
                                },
                            }}
                            onClick={() => handleNavigation(paths.login)}
                        >
                            Conectare
                        </Button>
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{
                                background: "linear-gradient(90deg, #2563eb, #4f46e5, #7c3aed)",
                                color: "white",
                                fontWeight: 600,
                                textTransform: "capitalize",
                                fontSize: 15,
                                borderRadius: 1.5,
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    boxShadow: "0 8px 16px rgba(37, 99, 235, 0.3)",
                                    transform: "translateY(-2px)",
                                },
                            }}
                            onClick={() => handleNavigation(paths.register)}
                        >
                            Înregistrare
                        </Button>
                    </ListItem>
                }
            </List>
        </Box>
    );

    return (
        <>
            <AppBar
                elevation={2}
                sx={{
                    background: "linear-gradient(135deg, #2563eb, #4f46e5, #7c3aed)",
                    py: 1.5,
                    mb: 0,
                    boxShadow: "0 4px 20px rgba(37, 99, 235, 0.15)",
                }}
            >
                <Container maxWidth="lg">
                    <Toolbar disableGutters sx={{justifyContent: "space-between"}}>
                        {/* Logo și Brand */}
                        <Box
                            display="flex"
                            alignItems="center"
                            gap={1.5}
                            sx={{
                                cursor: "pointer",
                                transition: "transform 0.3s ease",
                                "&:hover": {
                                    transform: "scale(1.05)",
                                },
                            }}
                            onClick={() => navigate(paths.home)}
                        >
                            <Box
                                sx={{
                                    background: "rgba(255, 255, 255, 0.2)",
                                    backdropFilter: "blur(10px)",
                                    p: 1.5,
                                    borderRadius: 2,
                                    border: "1.5px solid rgba(255, 255, 255, 0.3)",
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                        background: "rgba(255, 255, 255, 0.3)",
                                        border: "1.5px solid rgba(255, 255, 255, 0.5)",
                                    },
                                }}
                            >
                                <ApartmentIcon sx={{color: "white", fontSize: 28}}/>
                            </Box>

                            <Typography
                                variant="h6"
                                fontWeight={900}
                                sx={{
                                    color: "white",
                                    letterSpacing: 0.5,
                                    display: {xs: "none", sm: "block"},
                                    fontSize: {sm: "20px", md: "24px"},
                                }}
                            >
                                Rentora
                            </Typography>
                        </Box>

                        {/* Desktop Navigation */}
                        <Box
                            display="flex"
                            gap={1}
                            sx={{display: {xs: "none", md: "flex"}}}
                        >
                            {menuItems.map((item) =>

                                item.path &&
                                (
                                    <Button
                                        key={item.path}
                                        color="inherit"
                                        sx={{
                                            fontSize: 15,
                                            fontWeight: 600,
                                            textTransform: "none",
                                            px: 2,
                                            py: 1,
                                            transition: "all 0.3s ease",
                                            "&:hover": {
                                                background: "rgba(255, 255, 255, 0.15)",
                                                borderRadius: 1.5,
                                            },
                                        }}
                                        onClick={() => navigate(item.path)}
                                    >
                                        {item.label}
                                    </Button>
                                ))}
                        </Box>

                        {/* Desktop Auth Buttons */}

                        {
                            !isAuthenticated &&
                            <Box
                                display="flex"
                                gap={1.5}
                                sx={{display: {xs: "none", md: "flex"}}}
                            >
                                <Button
                                    variant="text"
                                    sx={{
                                        color: "white",
                                        fontSize: 15,
                                        fontWeight: 600,
                                        textTransform: "none",
                                        px: 2.5,
                                        transition: "all 0.3s ease",
                                        "&:hover": {
                                            background: "rgba(255, 255, 255, 0.15)",
                                            borderRadius: 1.5,
                                        },
                                    }}
                                    onClick={() => navigate(paths.login)}
                                >
                                    Conectare
                                </Button>
                                <Button
                                    variant="contained"
                                    sx={{
                                        background: "rgba(255, 255, 255, 0.25)",
                                        color: "white",
                                        fontSize: 15,
                                        fontWeight: 600,
                                        textTransform: "none",
                                        px: 2.5,
                                        border: "1.5px solid rgba(255, 255, 255, 0.4)",
                                        borderRadius: 1.5,
                                        transition: "all 0.3s ease",
                                        backdropFilter: "blur(10px)",
                                        "&:hover": {
                                            background: "rgba(255, 255, 255, 0.35)",
                                            border: "1.5px solid rgba(255, 255, 255, 0.6)",
                                            boxShadow: "0 8px 16px rgba(255, 255, 255, 0.2)",
                                            transform: "translateY(-2px)",
                                        },
                                    }}
                                    onClick={() => navigate(paths.register)}
                                >
                                    Înregistrare
                                </Button>
                            </Box>
                        }

                        {/* Mobile Hamburger Menu */}
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="end"
                            onClick={handleDrawerToggle}
                            sx={{
                                display: {xs: "block", md: "none"},
                                "&:hover": {
                                    background: "rgba(255, 255, 255, 0.15)",
                                },
                            }}
                        >
                            <MenuIcon/>
                        </IconButton>
                    </Toolbar>
                </Container>
            </AppBar>

            {/* Mobile Drawer */}
            <Drawer
                anchor="right"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                sx={{
                    display: {xs: "block", md: "none"},
                }}
            >
                {drawer}
            </Drawer>
        </>
    );
};

export default Header;