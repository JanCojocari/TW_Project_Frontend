import { Box, Container, Typography, Card, CardContent, Button, Paper } from "@mui/material";
import {
    Home as HomeIcon, TrendingUp as TrendingUpIcon,
    Security as SecurityIcon, Group as GroupIcon,
    ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import { useState } from "react";
import LoginForm from "../components/LoginForm.tsx";
import { gradients, colors } from "../theme/gradients.ts";

const features = [
    { icon: <HomeIcon sx={{ fontSize: 40 }} />,       title: "Anunțuri Imobiliare",    description: "Găsește proprietatea ideală cu o platformă modernă și ușor de utilizat." },
    { icon: <TrendingUpIcon sx={{ fontSize: 40 }} />, title: "Gestionare Eficientă",   description: "Gestionează proprietățile și chiriile cu instrumente intuitive." },
    { icon: <SecurityIcon sx={{ fontSize: 40 }} />,   title: "Securitate Garantată",   description: "Datele tale sunt protejate cu cele mai înalte standarde de securitate." },
    { icon: <GroupIcon sx={{ fontSize: 40 }} />,      title: "Comunitate Activă",      description: "Conectează-te cu proprietari și chiriași din toată țara." },
];

const Home = () => {
    const [showLoginModal, setShowLoginModal] = useState(false);

    return (
        <Box sx={{ pt: 5, minHeight: "100vh", bgcolor: "background.default" }}>

            {/* ── Hero ─────────────────────────────────────────────────── */}
            <Box
                sx={{
                    background:    gradients.hero,
                    py:            { xs: 8, md: 15 },
                    position:      "relative",
                    overflow:      "hidden",
                    borderBottom:  `1px solid ${colors.border}`,
                }}
            >
                <Container maxWidth="lg">
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 8, alignItems: "center" }}>

                        {/* Text */}
                        <Box sx={{ position: "relative", zIndex: 2 }}>
                            <Typography
                                variant="h2"
                                sx={{
                                    color:         "text.primary",
                                    fontWeight:     900,
                                    fontSize:       { xs: "40px", md: "62px" },
                                    mb:             3,
                                    lineHeight:     1.1,
                                    letterSpacing:  "-2px",
                                }}
                            >
                                Găsește Casa{" "}
                                <Box
                                    component="span"
                                    sx={{
                                        background:          gradients.textPrimary,
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                    }}
                                >
                                    Perfectă
                                </Box>
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{ color: "text.secondary", mb: 5, fontWeight: 400, lineHeight: 1.7, maxWidth: "500px" }}
                            >
                                Rentora este platforma ta de încredere pentru imobiliare. Conectăm proprietari și chiriași
                                printr-o experiență digitală premium, securizată și transparentă.
                            </Typography>
                            <Button
                                size="large"
                                variant="contained"
                                endIcon={<ArrowForwardIcon />}
                                onClick={() => setShowLoginModal(true)}
                                sx={{ fontSize: 16, px: 5, py: 1.8, borderRadius: 2.5 }}
                            >
                                Începe Căutarea
                            </Button>
                        </Box>

                        {/* Visual */}
                        <Box sx={{ position: "relative", height: { xs: "320px", md: "460px" }, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Box
                                sx={{
                                    position:  "absolute",
                                    width:     "100%",
                                    height:    "100%",
                                    background: `radial-gradient(circle, ${colors.primaryAlpha10} 0%, transparent 70%)`,
                                    animation: "pulse 4s infinite",
                                    "@keyframes pulse": {
                                        "0%":   { transform: "scale(0.85)", opacity: 0.5 },
                                        "50%":  { transform: "scale(1.15)", opacity: 0.85 },
                                        "100%": { transform: "scale(0.85)", opacity: 0.5 },
                                    },
                                }}
                            />
                            <Paper
                                elevation={3}
                                sx={{
                                    width:   "80%",
                                    height:  "80%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: 3,
                                    borderRadius: 6,
                                    border: `1px solid ${colors.border}`,
                                    backdropFilter: "blur(20px)",
                                }}
                            >
                                {[
                                    { label: "Proprietăți Active", value: "10,000+" },
                                    { label: "Utilizatori",        value: "50,000+" },
                                    { label: "Contracte",          value: "8,500+"  },
                                ].map((s) => (
                                    <Box key={s.label} textAlign="center">
                                        <Typography
                                            variant="h4"
                                            fontWeight={900}
                                            sx={{
                                                background: gradients.textPrimary,
                                                WebkitBackgroundClip: "text",
                                                WebkitTextFillColor: "transparent",
                                            }}
                                        >
                                            {s.value}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" fontWeight={600}>
                                            {s.label}
                                        </Typography>
                                    </Box>
                                ))}
                            </Paper>
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* ── Features ─────────────────────────────────────────────── */}
            <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "background.paper", borderBottom: `1px solid ${colors.border}` }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: "center", mb: 8 }}>
                        <Typography variant="h3" sx={{ fontWeight: 900, mb: 2, letterSpacing: "-1px" }}>
                            De ce să alegi{" "}
                            <Box component="span" sx={{ background: gradients.textPrimary, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                Rentora?
                            </Box>
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, maxWidth: "600px", mx: "auto" }}>
                            Beneficiezi de cea mai avansată platformă de imobiliare cu standarde enterprise.
                        </Typography>
                    </Box>

                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" }, gap: 4 }}>
                        {features.map((feature, i) => (
                            <Card key={i}>
                                <CardContent sx={{ textAlign: "center", p: 4 }}>
                                    <Box
                                        sx={{
                                            background:   gradients.primary,
                                            borderRadius: "16px",
                                            p:            2.5,
                                            display:      "inline-flex",
                                            mb:           3,
                                            color:        "#FFFFFF",
                                            boxShadow:    `0 6px 20px ${colors.primaryAlpha25}`,
                                        }}
                                    >
                                        {feature.icon}
                                    </Box>
                                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, letterSpacing: "-0.5px" }}>
                                        {feature.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, fontWeight: 500 }}>
                                        {feature.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                </Container>
            </Box>

            {/* ── CTA ──────────────────────────────────────────────────── */}
            <Box
                sx={{
                    py:         { xs: 10, md: 14 },
                    background: gradients.cta,
                    position:   "relative",
                    overflow:   "hidden",
                    borderTop:  `1px solid ${colors.border}`,
                }}
            >
                <Box
                    sx={{
                        position:  "absolute",
                        inset:     0,
                        background: `radial-gradient(circle at 50% 50%, ${colors.primaryAlpha06} 0%, transparent 70%)`,
                        pointerEvents: "none",
                    }}
                />
                <Container maxWidth="md">
                    <Box sx={{ textAlign: "center", position: "relative", zIndex: 2 }}>
                        <Typography variant="h3" sx={{ fontWeight: 900, mb: 3, letterSpacing: "-1.5px" }}>
                            Ești Gata să Transformi{" "}
                            <Box component="span" sx={{ background: gradients.textSunset, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                Viitorul?
                            </Box>
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 6, fontWeight: 400, lineHeight: 1.6 }}>
                            Alătură-te comunității noastre și descoperă o modalitate mai inteligentă, mai rapidă și mai sigură de a gestiona imobiliarele.
                        </Typography>
                        <Button
                            size="large"
                            variant="contained"
                            onClick={() => setShowLoginModal(true)}
                            sx={{ fontSize: 18, px: 6, py: 2, borderRadius: 2.5 }}
                        >
                            Începe Acum
                        </Button>
                    </Box>
                </Container>
            </Box>

            {/* ── Login Modal ───────────────────────────────────────────── */}
            {showLoginModal && (
                <Box
                    sx={{
                        position:  "fixed",
                        inset:     0,
                        bgcolor:   "rgba(31, 41, 55, 0.6)",
                        display:   "flex",
                        alignItems:"center",
                        justifyContent: "center",
                        zIndex:    1000,
                        backdropFilter: "blur(12px)",
                    }}
                    onClick={() => setShowLoginModal(false)}
                >
                    <Box
                        sx={{ maxWidth: { xs: "95%", md: "500px" }, width: "100%", maxHeight: "90vh", overflow: "auto", p: 1 }}
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