import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    Paper,
} from "@mui/material";
import {
    Home as HomeIcon,
    TrendingUp as TrendingUpIcon,
    Security as SecurityIcon,
    Group as GroupIcon,
    ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import { useState } from "react";
import LoginForm from "../components/LoginForm.tsx";

const Home = () => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const features = [
        {
            icon: <HomeIcon sx={{ fontSize: 40 }} />,
            title: "Anunțuri Imobiliare",
            description: "Găsește proprietatea ideală cu o platformă modernă și ușor de utilizat.",
        },
        {
            icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
            title: "Gestionare Eficientă",
            description: "Gestionează proprietățile și chiriile cu instrumente intuitive.",
        },
        {
            icon: <SecurityIcon sx={{ fontSize: 40 }} />,
            title: "Securitate Garantată",
            description: "Datele tale sunt protejate cu cele mai înalte standarde de securitate.",
        },
        {
            icon: <GroupIcon sx={{ fontSize: 40 }} />,
            title: "Comunitate Activă",
            description: "Conectează-te cu proprietari și chiriași din toată țara.",
        },
    ];

    return (
        <Box sx={{pt:5, minHeight: "100vh", background: "#ffffff" }}>
            {/* Hero Section */}
            <Box
                sx={{
                    background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 50%, #7c3aed 100%)",
                    py: { xs: 6, md: 10 },
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                        content: '""',
                        position: "absolute",
                        top: "-50%",
                        right: "-10%",
                        width: "600px",
                        height: "600px",
                        background: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "50%",
                        filter: "blur(80px)",
                    },
                    "&::after": {
                        content: '""',
                        position: "absolute",
                        bottom: "-40%",
                        left: "-5%",
                        width: "500px",
                        height: "500px",
                        background: "rgba(255, 255, 255, 0.08)",
                        borderRadius: "50%",
                        filter: "blur(60px)",
                    },
                }}
            >
                <Container maxWidth="lg">
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 4, alignItems: "center" }}>
                        {/* Text Content */}
                        <Box  sx={{ position: "relative", zIndex: 2 }}>
                            <Typography
                                variant="h2"
                                sx={{
                                    color: "white",
                                    fontWeight: 900,
                                    fontSize: { xs: "32px", md: "52px" },
                                    mb: 2,
                                    lineHeight: 1.2,
                                    textShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                                }}
                            >
                                Găsește Casa Perfectă
                            </Typography>
                            <Typography
                                variant="h5"
                                sx={{
                                    color: "rgba(255, 255, 255, 0.9)",
                                    mb: 4,
                                    fontSize: { xs: "16px", md: "20px" },
                                    fontWeight: 300,
                                    lineHeight: 1.6,
                                }}
                            >
                                Rentora este platforma ta de încredere pentru găsirea apartamentelor și caselor perfecte. Connectează proprietari cu chiriași în mod simplu și transparent.
                            </Typography>

                            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                                <Button
                                    size="large"
                                    variant="contained"
                                    endIcon={<ArrowForwardIcon />}
                                    onClick={() => setShowLoginModal(true)}
                                    sx={{
                                        background: "rgba(255, 255, 255, 0.25)",
                                        color: "white",
                                        fontWeight: 600,
                                        fontSize: 15,
                                        px: 4,
                                        py: 1.5,
                                        border: "1.5px solid rgba(255, 255, 255, 0.4)",
                                        backdropFilter: "blur(10px)",
                                        transition: "all 0.3s ease",
                                        "&:hover": {
                                            background: "rgba(255, 255, 255, 0.35)",
                                            border: "1.5px solid rgba(255, 255, 255, 0.6)",
                                            boxShadow: "0 8px 32px rgba(255, 255, 255, 0.2)",
                                            transform: "translateY(-2px)",
                                        },
                                    }}
                                >
                                    începe căutarea
                                </Button>
                            </Box>
                        </Box>

                        {/* Illustration/Visual Element */}
                        <Box
                            sx={{
                                position: "relative",
                                height: { xs: "300px", md: "400px" },
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Paper
                                elevation={0}
                                sx={{
                                    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)",
                                    backdropFilter: "blur(20px)",
                                    border: "1.5px solid rgba(255, 255, 255, 0.3)",
                                    borderRadius: 4,
                                    p: 4,
                                    width: "100%",
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: 3,
                                }}
                            >
                                <Box
                                    sx={{
                                        width: "100px",
                                        height: "100px",
                                        background: "linear-gradient(135deg, #2563eb, #4f46e5, #7c3aed)",
                                        borderRadius: "20px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "50px",
                                    }}
                                >
                                    🏠
                                </Box>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        color: "white",
                                        fontWeight: 600,
                                        textAlign: "center",
                                    }}
                                >
                                    Peste 10,000 proprietăți disponibile
                                </Typography>
                            </Paper>
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* Features Section */}
            <Box sx={{ py: { xs: 6, md: 10 }, background: "#f8f9fa" }}>
                <Container maxWidth="lg">
                    <Typography
                        variant="h3"
                        sx={{
                            textAlign: "center",
                            mb: 2,
                            fontWeight: 900,
                            background: "linear-gradient(90deg, #2563eb, #4f46e5, #7c3aed)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        De ce Rentora?
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            textAlign: "center",
                            color: "#6b7280",
                            mb: 6,
                            fontWeight: 400,
                            maxWidth: "600px",
                            mx: "auto",
                        }}
                    >
                        Beneficiază de cea mai avansată platformă de imobiliare din Moldova
                    </Typography>
            
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr 1fr" }, gap: 3 }}>
                        {features.map((feature, index) => (
                            <Box key={index}>
                                <Card
                                    sx={{
                                        background: "white",
                                        border: "1px solid #e5e7eb",
                                        borderRadius: 3,
                                        height: "100%",
                                        transition: "all 0.3s ease",
                                        "&:hover": {
                                            transform: "translateY(-8px)",
                                            boxShadow: "0 20px 40px rgba(37, 99, 235, 0.1)",
                                            borderColor: "#2563eb",
                                        },
                                    }}
                                >
                                    <CardContent sx={{ textAlign: "center", pt: 4 }}>
                                        <Box
                                            sx={{
                                                background: "linear-gradient(135deg, #2563eb, #4f46e5)",
                                                borderRadius: "12px",
                                                p: 2,
                                                display: "inline-flex",
                                                mb: 2,
                                                color: "white",
                                            }}
                                        >
                                            {feature.icon}
                                        </Box>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 700,
                                                mb: 1,
                                                color: "#1f2937",
                                            }}
                                        >
                                            {feature.title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: "#6b7280",
                                                lineHeight: 1.6,
                                            }}
                                        >
                                            {feature.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Box>
                        ))}
                    </Box>
                </Container>
            </Box>

            {/* CTA Section */}
            <Box
                sx={{
                    py: { xs: 6, md: 8 },
                    background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 50%, #7c3aed 100%)",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <Container maxWidth="lg">
                    <Box
                        sx={{
                            textAlign: "center",
                            position: "relative",
                            zIndex: 2,
                        }}
                    >
                        <Typography
                            variant="h3"
                            sx={{
                                color: "white",
                                fontWeight: 900,
                                mb: 2,
                                fontSize: { xs: "28px", md: "44px" },
                            }}
                        >
                            Gata să începi?
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                color: "rgba(255, 255, 255, 0.9)",
                                mb: 4,
                                fontWeight: 300,
                            }}
                        >
                            Alătură-te miilor de utilizatori mulțumiți și găsește casa ta ideală astazi
                        </Typography>
                        <Button
                            size="large"
                            variant="contained"
                            onClick={() => setShowLoginModal(true)}
                            sx={{
                                background: "white",
                                color: "#2563eb",
                                fontWeight: 700,
                                fontSize: 16,
                                px: 5,
                                py: 1.7,
                                borderRadius: 2,
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    background: "rgba(255, 255, 255, 0.95)",
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 12px 32px rgba(0, 0, 0, 0.15)",
                                },
                            }}
                        >
                            Începe acum
                        </Button>
                    </Box>
                </Container>
            </Box>

            {/* Login Modal */}
            {showLoginModal && (
                <Box
                    sx={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000,
                        backdropFilter: "blur(5px)",
                        animation: "fadeIn 0.3s ease",
                        "@keyframes fadeIn": {
                            from: { opacity: 0 },
                            to: { opacity: 1 },
                        },
                    }}
                    onClick={() => setShowLoginModal(false)}
                >
                    <Box
                        sx={{
                            position: "relative",
                            animation: "slideUp 0.3s ease",
                            "@keyframes slideUp": {
                                from: {
                                    opacity: 0,
                                    transform: "translateY(20px)",
                                },
                                to: {
                                    opacity: 1,
                                    transform: "translateY(0)",
                                },
                            },
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Box
                            sx={{
                                mt:5,
                                maxWidth: { xs: "90%", md: "500px" },
                                maxHeight: "90vh",
                                overflow: "auto",
                            }}
                        >
                            <LoginForm />
                        </Box>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default Home;