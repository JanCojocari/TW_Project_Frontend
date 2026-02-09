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
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Header = () => {
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const menuItems = [
        { label: "Acasă", path: "/home" },
        { label: "Anunțuri", path: "/listings" },
        { label: "Despre", path: "/about" },
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
            }}
        >
            <Box display="flex" justifyContent="flex-end" px={2} mb={2}>
                <IconButton onClick={handleDrawerToggle}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <List>
                {menuItems.map((item) => (
                    <ListItem key={item.path} disablePadding>
                        <ListItemButton
                            onClick={() => handleNavigation(item.path)}
                            sx={{
                                "&:hover": {
                                    background: "rgba(37, 99, 235, 0.1)",
                                },
                            }}
                        >
                            <ListItemText
                                primary={item.label}
                                primaryTypographyProps={{
                                    fontWeight: 600,
                                    color: "#1e40af",
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
                <ListItem disablePadding sx={{ mt: 2, flexDirection: "column", gap: 1 }}>
                    <Button
                        fullWidth
                        variant="text"
                        sx={{
                            color: "#1e40af",
                            fontWeight: 600,
                            textTransform: "none",
                            fontSize: 15,
                        }}
                        onClick={() => handleNavigation("/login")}
                    >
                        Conectare
                    </Button>
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{
                            background: "linear-gradient(90deg, #2563eb, #4f46e5)",
                            color: "white",
                            fontWeight: 600,
                            textTransform: "none",
                            fontSize: 15,
                        }}
                        onClick={() => handleNavigation("/register")}
                    >
                        Înregistrare
                    </Button>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <>
            <AppBar
                elevation={0}
                sx={{
                    background: "#1e40af",
                    py: 1,
                    mb: 2,
                }}
            >
                <Container maxWidth="lg">
                    <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
                        {/* Logo și Brand */}
                        <Box
                            display="flex"
                            alignItems="center"
                            gap={1.5}
                            sx={{ cursor: "pointer" }}
                            onClick={() => navigate("/")}
                        >
                            <Box
                                sx={{
                                    background:
                                        "linear-gradient(135deg, #2563eb, #4f46e5, #7c3aed)",
                                    p: 1.5,
                                    borderRadius: 2,
                                }}
                            >
                                <ApartmentIcon sx={{ color: "white", fontSize: 28 }} />
                            </Box>

                            <Typography
                                variant="h6"
                                fontWeight={900}
                                sx={{
                                    color: "white",
                                    letterSpacing: 0.5,
                                    display: { xs: "none", sm: "block" },
                                }}
                            >
                                Rentora
                            </Typography>
                        </Box>

                        {/* Desktop Navigation */}
                        <Box
                            display="flex"
                            gap={2}
                            sx={{ display: { xs: "none", md: "flex" } }}
                        >
                            {menuItems.map((item) => (
                                <Button
                                    key={item.path}
                                    color="inherit"
                                    sx={{
                                        fontSize: 15,
                                        fontWeight: 600,
                                        textTransform: "none",
                                        "&:hover": {
                                            background: "rgba(255, 255, 255, 0.1)",
                                            borderRadius: 1,
                                        },
                                    }}
                                    onClick={() => navigate(item.path)}
                                >
                                    {item.label}
                                </Button>
                            ))}
                        </Box>

                        {/* Desktop Auth Buttons */}
                        <Box
                            display="flex"
                            gap={1.5}
                            sx={{ display: { xs: "none", md: "flex" } }}
                        >
                            <Button
                                variant="text"
                                sx={{
                                    color: "white",
                                    fontSize: 15,
                                    fontWeight: 600,
                                    textTransform: "none",
                                    "&:hover": {
                                        background: "rgba(255, 255, 255, 0.1)",
                                    },
                                }}
                                onClick={() => navigate("/login")}
                            >
                                Conectare
                            </Button>
                            <Button
                                variant="contained"
                                sx={{
                                    background: "rgba(255, 255, 255, 0.2)",
                                    color: "white",
                                    fontSize: 15,
                                    fontWeight: 600,
                                    textTransform: "none",
                                    border: "2px solid rgba(255, 255, 255, 0.3)",
                                    "&:hover": {
                                        background: "rgba(255, 255, 255, 0.3)",
                                        border: "2px solid rgba(255, 255, 255, 0.5)",
                                    },
                                }}
                                onClick={() => navigate("/register")}
                            >
                                Înregistrare
                            </Button>
                        </Box>

                        {/* Mobile Hamburger Menu */}
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="end"
                            onClick={handleDrawerToggle}
                            sx={{ display: { xs: "block", md: "none" } }}
                        >
                            <MenuIcon />
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
                    display: { xs: "block", md: "none" },
                }}
            >
                {drawer}
            </Drawer>
        </>
    );
};

export default Header;