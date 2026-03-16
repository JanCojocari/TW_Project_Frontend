// pages/Home.tsx
import { Box, Container, Typography, Card, CardContent, Button, Paper } from "@mui/material";
import {
    Home as HomeIcon, TrendingUp as TrendingUpIcon,
    Security as SecurityIcon, Group as GroupIcon,
    ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import { useState }          from "react";
import { useTranslation }    from "react-i18next";
import LoginForm             from "../components/login/LoginForm.tsx";
import { gradients, colors } from "../theme/gradients.ts";
import { useThemeMode }      from "../theme/ThemeContext.tsx";

const Home = () => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const { isDark }  = useThemeMode();
    const { t }       = useTranslation();

    const heroBg = isDark
        ? "radial-gradient(circle at 70% 30%, rgba(76,139,245,0.07), transparent 55%), linear-gradient(135deg, #0F1724 0%, #172033 100%)"
        : gradients.hero;

    const ctaBg = isDark
        ? "linear-gradient(135deg, #0F1724 0%, #1C2A40 60%, #0F1724 100%)"
        : gradients.cta;

    const features = [
        { icon: <HomeIcon sx={{ fontSize: 40 }} />,       title: t("home.features.listings.title"),   description: t("home.features.listings.desc")   },
        { icon: <TrendingUpIcon sx={{ fontSize: 40 }} />, title: t("home.features.management.title"), description: t("home.features.management.desc") },
        { icon: <SecurityIcon sx={{ fontSize: 40 }} />,   title: t("home.features.security.title"),   description: t("home.features.security.desc")   },
        { icon: <GroupIcon sx={{ fontSize: 40 }} />,      title: t("home.features.community.title"),  description: t("home.features.community.desc")  },
    ];

    const stats = [
        { label: t("home.stats.properties"), value: "10,000+" },
        { label: t("home.stats.users"),       value: "50,000+" },
        { label: t("home.stats.contracts"),   value: "8,500+"  },
    ];

    return (
        <Box sx={{ pt: 5, minHeight: "100vh", bgcolor: "background.default" }}>

            {/* ── Hero ── */}
            <Box sx={{ background: heroBg, py: { xs: 8, md: 15 }, position: "relative", overflow: "hidden", borderBottom: `1px solid ${colors.border}` }}>
                <Container maxWidth="lg">
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 8, alignItems: "center" }}>
                        <Box sx={{ position: "relative", zIndex: 2 }}>
                            <Typography variant="h2" sx={{ color: "text.primary", fontWeight: 900, fontSize: { xs: "40px", md: "62px" }, mb: 3, lineHeight: 1.1, letterSpacing: "-2px" }}>
                                {t("home.heroTitle")}{" "}
                                <Box component="span" sx={{ background: gradients.textPrimary, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                    {t("home.heroSpan")}
                                </Box>
                            </Typography>
                            <Typography variant="h6" sx={{ color: "text.secondary", mb: 5, fontWeight: 400, lineHeight: 1.7, maxWidth: "500px" }}>
                                {t("home.heroSubtitle")}
                            </Typography>
                            <Button size="large" variant="contained" endIcon={<ArrowForwardIcon />}
                                    onClick={() => setShowLoginModal(true)}
                                    sx={{ fontSize: 16, px: 5, py: 1.8, borderRadius: 2.5 }}>
                                {t("home.heroBtn")}
                            </Button>
                        </Box>

                        <Box sx={{ position: "relative", height: { xs: "320px", md: "460px" }, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Box sx={{ position: "absolute", width: "100%", height: "100%", background: `radial-gradient(circle, ${colors.primaryAlpha10} 0%, transparent 70%)`, animation: "pulse 4s infinite",
                                "@keyframes pulse": { "0%": { transform: "scale(0.85)", opacity: 0.5 }, "50%": { transform: "scale(1.15)", opacity: 0.85 }, "100%": { transform: "scale(0.85)", opacity: 0.5 } } }} />
                            <Paper elevation={3} sx={{ width: "80%", height: "80%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 3, borderRadius: 6, border: `1px solid ${colors.border}`, bgcolor: "background.paper", backdropFilter: "blur(20px)" }}>
                                {stats.map((s) => (
                                    <Box key={s.label} textAlign="center">
                                        <Typography variant="h4" fontWeight={900} sx={{ background: gradients.textPrimary, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                            {s.value}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" fontWeight={600}>{s.label}</Typography>
                                    </Box>
                                ))}
                            </Paper>
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* ── Features ── */}
            <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "background.paper", borderBottom: `1px solid ${colors.border}` }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: "center", mb: 8 }}>
                        <Typography variant="h3" sx={{ fontWeight: 900, mb: 2, letterSpacing: "-1px" }}>
                            {t("home.whyTitle")}{" "}
                            <Box component="span" sx={{ background: gradients.textPrimary, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                {t("home.whySpan")}
                            </Box>
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, maxWidth: "600px", mx: "auto" }}>
                            {t("home.whySubtitle")}
                        </Typography>
                    </Box>
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" }, gap: 4 }}>
                        {features.map((feature, i) => (
                            <Card key={i}>
                                <CardContent sx={{ textAlign: "center", p: 4 }}>
                                    <Box sx={{ background: gradients.primary, borderRadius: "16px", p: 2.5, display: "inline-flex", mb: 3, color: "#FFFFFF", boxShadow: `0 6px 20px ${colors.primaryAlpha25}` }}>
                                        {feature.icon}
                                    </Box>
                                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, letterSpacing: "-0.5px" }}>{feature.title}</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, fontWeight: 500 }}>{feature.description}</Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                </Container>
            </Box>

            {/* ── CTA ── */}
            <Box sx={{ py: { xs: 10, md: 14 }, background: ctaBg, position: "relative", overflow: "hidden", borderTop: `1px solid ${colors.border}` }}>
                <Box sx={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 50%, ${colors.primaryAlpha06} 0%, transparent 70%)`, pointerEvents: "none" }} />
                <Container maxWidth="md">
                    <Box sx={{ textAlign: "center", position: "relative", zIndex: 2 }}>
                        <Typography variant="h3" sx={{ fontWeight: 900, mb: 3, letterSpacing: "-1.5px" }}>
                            {t("home.ctaTitle")}{" "}
                            <Box component="span" sx={{ background: gradients.textSunset, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                {t("home.ctaSpan")}
                            </Box>
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 6, fontWeight: 400, lineHeight: 1.6 }}>
                            {t("home.ctaSubtitle")}
                        </Typography>
                        <Button size="large" variant="contained" onClick={() => setShowLoginModal(true)} sx={{ fontSize: 18, px: 6, py: 2, borderRadius: 2.5 }}>
                            {t("home.ctaBtn")}
                        </Button>
                    </Box>
                </Container>
            </Box>

            {/* ── Login Modal ── */}
            {showLoginModal && (
                <Box sx={{ position: "fixed", inset: 0, bgcolor: "rgba(31,41,55,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(12px)" }}
                     onClick={() => setShowLoginModal(false)}>
                    <Box sx={{ maxWidth: { xs: "95%", md: "500px" }, width: "100%", maxHeight: "90vh", overflow: "auto", p: 1 }}
                         onClick={(e) => e.stopPropagation()}>
                        <LoginForm />
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default Home;