import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    Paper,
    Divider,
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
        <Box sx={{ pt: 5, minHeight: "100vh", background: "#071A1D" }}>
            {/* Hero Section */}
            <Box
                sx={{
                    background: "radial-gradient(circle at 70% 30%, rgba(0, 224, 198, 0.08), transparent 50%), linear-gradient(135deg, #071A1D 0%, #0C2529 100%)",
                    py: { xs: 8, md: 15 },
                    position: "relative",
                    overflow: "hidden",
                    borderBottom: "1px solid #12383D",
                    "&::before": {
                        content: '""',
                        position: "absolute",
                        top: "-50%",
                        right: "-10%",
                        width: "600px",
                        height: "600px",
                        background: "rgba(0, 224, 198, 0.03)",
                        borderRadius: "50%",
                        filter: "blur(100px)",
                    },
                }}
            >
                <Container maxWidth="lg">
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 8, alignItems: "center" }}>
                        {/* Text Content */}
                        <Box sx={{ position: "relative", zIndex: 2 }}>
                            <Typography
                                variant="h2"
                                sx={{
                                    color: "#E6F7F5",
                                    fontWeight: 900,
                                    fontSize: { xs: "40px", md: "64px" },
                                    mb: 3,
                                    lineHeight: 1.1,
                                    letterSpacing: "-2px",
                                }}
                            >
                                Găsește Casa <Box component="span" sx={{ color: "#00E0C6", textShadow: "0 0 20px rgba(0, 224, 198, 0.4)" }}>Perfectă</Box>
                            </Typography>
                            <Typography
                                variant="h5"
                                sx={{
                                    color: "#8FB5B1",
                                    mb: 5,
                                    fontSize: { xs: "18px", md: "22px" },
                                    fontWeight: 400,
                                    lineHeight: 1.6,
                                    maxWidth: "500px",
                                }}
                            >
                                Rentora este platforma ta de încredere pentru imobiliare. Conectăm proprietari și chiriași printr-o experiență digitală premium, securizată și transparentă.
                            </Typography>

                            <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                                <Button
                                    size="large"
                                    variant="contained"
                                    endIcon={<ArrowForwardIcon />}
                                    onClick={() => setShowLoginModal(true)}
                                    sx={{
                                        background: "linear-gradient(90deg, #00E0C6, #00BFA6)",
                                        color: "#071A1D",
                                        fontWeight: 800,
                                        fontSize: 16,
                                        px: 5,
                                        py: 2,
                                        borderRadius: 2,
                                        boxShadow: "0 0 25px rgba(0, 224, 198, 0.4)",
                                        transition: "all 0.3s ease",
                                        "&:hover": {
                                            background: "linear-gradient(90deg, #00FFF0, #00E0C6)",
                                            boxShadow: "0 0 35px rgba(0, 224, 198, 0.6)",
                                            transform: "translateY(-3px)",
                                        },
                                    }}
                                >
                                    Începe Căutarea
                                </Button>
                            </Box>
                        </Box>

                        {/* Visual Element */}
                        <Box
                            sx={{
                                position: "relative",
                                height: { xs: "350px", md: "500px" },
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Box
                                sx={{
                                    position: "absolute",
                                    width: "100%",
                                    height: "100%",
                                    background: "radial-gradient(circle, rgba(0, 224, 198, 0.1) 0%, transparent 70%)",
                                    animation: "pulse 4s infinite",
                                    "@keyframes pulse": {
                                        "0%": { transform: "scale(0.8)", opacity: 0.5 },
                                        "50%": { transform: "scale(1.2)", opacity: 0.8 },
                                        "100%": { transform: "scale(0.8)", opacity: 0.5 },
                                    },
                                }}
                            />
                            <Paper
                                elevation={0}
                                sx={{
                                    background: "rgba(15, 47, 52, 0.4)",
                                    backdropFilter: "blur(40px)",
                                    border: "1px solid rgba(0, 224, 198, 0.15)",
                                    borderRadius: 6,
                                    p: 6,
                                    width: "80%",
                                    height: "80%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: 4,
                                    boxShadow: "0 40px 100px rgba(0, 0, 0, 0.5)",
                                }}
                            >
                                <Box
                                    sx={{
                                        width: "120px",
                                        height: "120px",
                                        background: "linear-gradient(135deg, #00E0C6, #00BFA6)",
                                        borderRadius: "30px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "60px",
                                        boxShadow: "0 0 30px rgba(0, 224, 198, 0.4)",
                                    }}
                                >
                                    🏘️
                                </Box>
                                <Box sx={{ textAlign: "center" }}>
                                    <Typography variant="h4" sx={{ color: "#E6F7F5", fontWeight: 900, mb: 1 }}>10K+</Typography>
                                    <Typography variant="body1" sx={{ color: "#8FB5B1", fontWeight: 600 }}>Proprietăți Verificate</Typography>
                                </Box>
                            </Paper>
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* Features Section */}
            <Box sx={{ py: { xs: 10, md: 15 }, background: "#0C2529" }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: "center", mb: 8 }}>
                        <Typography
                            variant="h3"
                            sx={{
                                color: "#E6F7F5",
                                fontWeight: 900,
                                mb: 2,
                                letterSpacing: "-1px",
                            }}
                        >
                            De ce <Box component="span" sx={{ color: "#00E0C6" }}>Rentora?</Box>
                        </Typography>
                        <Divider sx={{ width: 60, height: 4, background: "#00E0C6", mx: "auto", borderRadius: 2, mb: 3, border: "none", boxShadow: "0 0 10px #00FFF0" }} />
                        <Typography
                            variant="h6"
                            sx={{
                                color: "#8FB5B1",
                                fontWeight: 500,
                                maxWidth: "600px",
                                mx: "auto",
                            }}
                        >
                            Beneficiază de cea mai avansată platformă de imobiliare cu standarde enterprise de securitate și performanță.
                        </Typography>
                    </Box>

                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr 1fr" }, gap: 4 }}>
                        {features.map((feature, index) => (
                            <Card
                                key={index}
                                sx={{
                                    background: "#0F2F34",
                                    border: "1px solid #12383D",
                                    borderRadius: 4,
                                    height: "100%",
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                        transform: "translateY(-10px)",
                                        borderColor: "#00E0C6",
                                        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4), 0 0 15px rgba(0, 224, 198, 0.1)",
                                    },
                                }}
                            >
                                <CardContent sx={{ textAlign: "center", p: 4 }}>
                                    <Box
                                        sx={{
                                            background: "rgba(0, 224, 198, 0.08)",
                                            borderRadius: "16px",
                                            p: 2.5,
                                            display: "inline-flex",
                                            mb: 3,
                                            color: "#00E0C6",
                                            border: "1px solid rgba(0, 224, 198, 0.2)",
                                        }}
                                    >
                                        {feature.icon}
                                    </Box>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 800,
                                            mb: 2,
                                            color: "#E6F7F5",
                                            letterSpacing: "-0.5px",
                                        }}
                                    >
                                        {feature.title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: "#8FB5B1",
                                            lineHeight: 1.7,
                                            fontWeight: 500,
                                        }}
                                    >
                                        {feature.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                </Container>
            </Box>

            {/* CTA Section */}
            <Box
                sx={{
                    py: { xs: 10, md: 12 },
                    background: "linear-gradient(135deg, #071A1D 0%, #0F2F34 100%)",
                    position: "relative",
                    overflow: "hidden",
                    borderTop: "1px solid #12383D",
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "radial-gradient(circle at 50% 50%, rgba(0, 224, 198, 0.05) 0%, transparent 70%)",
                    }}
                />
                <Container maxWidth="md">
                    <Box sx={{ textAlign: "center", position: "relative", zIndex: 2 }}>
                        <Typography
                            variant="h3"
                            sx={{
                                color: "#E6F7F5",
                                fontWeight: 900,
                                mb: 3,
                                letterSpacing: "-1.5px",
                            }}
                        >
                            Ești Gata să Transformi <Box component="span" sx={{ color: "#00E0C6" }}>Viitorul?</Box>
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                color: "#8FB5B1",
                                mb: 6,
                                fontWeight: 400,
                                lineHeight: 1.6,
                            }}
                        >
                            Alătură-te comunității noastre și descoperă o modalitate mai inteligentă, mai rapidă și mai sigură de a gestiona imobiliarele.
                        </Typography>
                        <Button
                            size="large"
                            variant="contained"
                            onClick={() => setShowLoginModal(true)}
                            sx={{
                                background: "#E6F7F5",
                                color: "#071A1D",
                                fontWeight: 800,
                                fontSize: 18,
                                px: 6,
                                py: 2,
                                borderRadius: 2,
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    background: "#00E0C6",
                                    boxShadow: "0 0 30px rgba(0, 224, 198, 0.5)",
                                    transform: "scale(1.05)",
                                },
                            }}
                        >
                            Începe Acum
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
                        background: "rgba(7, 26, 29, 0.9)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000,
                        backdropFilter: "blur(20px)",
                    }}
                    onClick={() => setShowLoginModal(false)}
                >
                    <Box
                        sx={{
                            maxWidth: { xs: "95%", md: "500px" },
                            width: "100%",
                            maxHeight: "90vh",
                            overflow: "auto",
                            p: 1,
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <LoginForm />
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default Home;