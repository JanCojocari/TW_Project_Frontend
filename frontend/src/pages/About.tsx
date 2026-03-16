// pages/About.tsx
import { Box, Container, Typography, Card, CardContent, Button, Paper } from "@mui/material";
import {
    Info as InfoIcon, Visibility as VisibilityIcon,
    EmojiObjects as EmojiObjectsIcon, Favorite as FavoriteIcon,
    Speed as SpeedIcon, VerifiedUser as VerifiedUserIcon,
    Groups as GroupsIcon, TrendingUp as TrendingUpIcon,
    ArrowForward as ArrowForwardIcon, Apartment as ApartmentIcon,
    People as PeopleIcon, CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { useNavigate }       from "react-router-dom";
import { useTranslation }    from "react-i18next";
import { paths }             from "../app/paths";
import { gradients, colors } from "../theme/gradients.ts";
import { useThemeMode }      from "../theme/ThemeContext.tsx";

const About = () => {
    const navigate   = useNavigate();
    const { isDark } = useThemeMode();
    const { t }      = useTranslation();

    const heroBg = isDark
        ? "radial-gradient(circle at 70% 30%, rgba(76,139,245,0.07), transparent 55%), linear-gradient(135deg, #0F1724 0%, #172033 100%)"
        : gradients.hero;
    const ctaBg  = isDark
        ? "linear-gradient(135deg, #0F1724 0%, #1C2A40 60%, #0F1724 100%)"
        : gradients.cta;
    const valueBg = isDark ? "rgba(112, 150, 190, 0.08)" : colors.primaryAlpha06;

    const missionCards = [
        { icon: <VisibilityIcon sx={{ fontSize: 40 }} />,   title: t("about.mission.vision.title"),     description: t("about.mission.vision.desc")     },
        { icon: <EmojiObjectsIcon sx={{ fontSize: 40 }} />, title: t("about.mission.innovation.title"), description: t("about.mission.innovation.desc") },
        { icon: <FavoriteIcon sx={{ fontSize: 40 }} />,     title: t("about.mission.client.title"),     description: t("about.mission.client.desc")     },
    ];

    const values = [
        { icon: <SpeedIcon sx={{ fontSize: 32 }} />,        title: t("about.values.speed.title"),        description: t("about.values.speed.desc")        },
        { icon: <VerifiedUserIcon sx={{ fontSize: 32 }} />, title: t("about.values.transparency.title"), description: t("about.values.transparency.desc") },
        { icon: <GroupsIcon sx={{ fontSize: 32 }} />,       title: t("about.values.community.title"),    description: t("about.values.community.desc")    },
        { icon: <TrendingUpIcon sx={{ fontSize: 32 }} />,   title: t("about.values.growth.title"),       description: t("about.values.growth.desc")       },
    ];

    const stats = [
        { icon: <ApartmentIcon sx={{ fontSize: 48 }} />,   value: t("about.stats.properties.value"), label: t("about.stats.properties.label") },
        { icon: <PeopleIcon sx={{ fontSize: 48 }} />,      value: t("about.stats.users.value"),      label: t("about.stats.users.label")      },
        { icon: <CheckCircleIcon sx={{ fontSize: 48 }} />, value: t("about.stats.contracts.value"),  label: t("about.stats.contracts.label")  },
    ];

    return (
        <Box sx={{ pt: 5, minHeight: "100vh", bgcolor: "background.default" }}>

            {/* ── Hero ── */}
            <Box sx={{ background: heroBg, py: { xs: 8, md: 12 }, position: "relative", overflow: "hidden", borderBottom: `1px solid ${colors.border}` }}>
                <Container maxWidth="lg">
                    <Box sx={{ position: "relative", zIndex: 2, textAlign: "center" }}>
                        <Box sx={{ display: "inline-flex", bgcolor: colors.primaryAlpha10, p: 2, borderRadius: "16px", border: `1.5px solid ${colors.primaryAlpha25}`, mb: 3 }}>
                            <InfoIcon sx={{ fontSize: 48, color: "primary.main" }} />
                        </Box>
                        <Typography variant="h2" sx={{ fontWeight: 900, fontSize: { xs: "36px", md: "56px" }, mb: 3, lineHeight: 1.2, letterSpacing: "-1.5px" }}>
                            {t("about.heroTitle")}{" "}
                            <Box component="span" sx={{ background: gradients.textPrimary, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                {t("about.heroSpan")}
                            </Box>
                        </Typography>
                        <Typography variant="h5" color="text.secondary" sx={{ mb: 2, fontWeight: 400, lineHeight: 1.6, maxWidth: "800px", mx: "auto" }}>
                            {t("about.heroSubtitle")}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 300, lineHeight: 1.8, maxWidth: "700px", mx: "auto" }}>
                            {t("about.heroDesc")}
                        </Typography>
                    </Box>
                </Container>
            </Box>

            {/* ── Mission ── */}
            <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: "background.paper", borderBottom: `1px solid ${colors.border}` }}>
                <Container maxWidth="lg">
                    <Typography variant="h3" sx={{ textAlign: "center", mb: 2, fontWeight: 900, letterSpacing: "-1px" }}>
                        {t("about.missionTitle")}{" "}
                        <Box component="span" sx={{ background: gradients.textPrimary, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                            {t("about.missionSpan")}
                        </Box>
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ textAlign: "center", mb: 6, fontWeight: 400, maxWidth: "700px", mx: "auto" }}>
                        {t("about.missionSub")}
                    </Typography>
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" }, gap: 3 }}>
                        {missionCards.map((card, i) => (
                            <Card key={i}>
                                <CardContent sx={{ textAlign: "center", pt: 4, pb: 4 }}>
                                    <Box sx={{ background: gradients.primary, borderRadius: "12px", p: 2, display: "inline-flex", mb: 3, color: "#FFFFFF", boxShadow: `0 6px 20px ${colors.primaryAlpha25}` }}>
                                        {card.icon}
                                    </Box>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>{card.title}</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>{card.description}</Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                </Container>
            </Box>

            {/* ── Values ── */}
            <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: "background.default", borderBottom: `1px solid ${colors.border}` }}>
                <Container maxWidth="lg">
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 6, alignItems: "center" }}>
                        <Box>
                            <Typography variant="h3" sx={{ mb: 3, fontWeight: 900, letterSpacing: "-1px" }}>
                                {t("about.valuesTitle")}{" "}
                                <Box component="span" sx={{ background: gradients.textPrimary, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                    {t("about.valuesSpan")}
                                </Box>
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, fontSize: "17px", mb: 3 }}>{t("about.valuesDesc1")}</Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, fontSize: "17px" }}>{t("about.valuesDesc2")}</Typography>
                        </Box>
                        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 3 }}>
                            {values.map((value, i) => (
                                <Box key={i} sx={{ background: valueBg, border: `1px solid ${colors.border}`, borderRadius: 4, p: 3, transition: "all 0.3s ease",
                                    "&:hover": { transform: "translateY(-4px)", boxShadow: `0 12px 24px ${colors.primaryAlpha15}`, borderColor: "primary.main" } }}>
                                    <Box sx={{ background: gradients.primary, borderRadius: "10px", p: 1.5, display: "inline-flex", mb: 2, color: "#FFFFFF" }}>{value.icon}</Box>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontSize: "18px" }}>{value.title}</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>{value.description}</Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* ── Stats ── */}
            <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: "background.paper", borderBottom: `1px solid ${colors.border}` }}>
                <Container maxWidth="lg">
                    <Typography variant="h3" sx={{ textAlign: "center", mb: 2, fontWeight: 900, letterSpacing: "-1px" }}>
                        {t("about.statsTitle")}{" "}
                        <Box component="span" sx={{ background: gradients.textPrimary, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                            {t("about.statsSpan")}
                        </Box>
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ textAlign: "center", mb: 6, fontWeight: 400, maxWidth: "700px", mx: "auto" }}>
                        {t("about.statsSub")}
                    </Typography>
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" }, gap: 4 }}>
                        {stats.map((stat, i) => (
                            <Paper key={i} elevation={1} sx={{ p: 4, textAlign: "center", border: `1px solid ${colors.border}`, borderRadius: 4, bgcolor: "background.paper" }}>
                                <Box sx={{ display: "inline-flex", background: gradients.primary, borderRadius: "16px", p: 2, mb: 3, color: "#FFFFFF", boxShadow: `0 6px 20px ${colors.primaryAlpha25}` }}>
                                    {stat.icon}
                                </Box>
                                <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, background: gradients.textPrimary, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                    {stat.value}
                                </Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>{stat.label}</Typography>
                            </Paper>
                        ))}
                    </Box>
                </Container>
            </Box>

            {/* ── CTA ── */}
            <Box sx={{ py: { xs: 6, md: 10 }, background: ctaBg, position: "relative", overflow: "hidden", borderTop: `1px solid ${colors.border}` }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: "center", position: "relative", zIndex: 2 }}>
                        <Typography variant="h3" sx={{ fontWeight: 900, mb: 3, fontSize: { xs: "28px", md: "44px" }, letterSpacing: "-1.5px" }}>
                            {t("about.ctaTitle")}{" "}
                            <Box component="span" sx={{ background: gradients.textPrimary, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                {t("about.ctaSpan")}
                            </Box>
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 4, fontWeight: 300, maxWidth: "700px", mx: "auto" }}>
                            {t("about.ctaSub")}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
                            <Button size="large" variant="contained" endIcon={<ArrowForwardIcon />} onClick={() => navigate(paths.listings)} sx={{ fontSize: 16, px: 5, py: 1.7, borderRadius: 2.5 }}>
                                {t("about.ctaExplore")}
                            </Button>
                            <Button size="large" variant="outlined" onClick={() => navigate(paths.register)} sx={{ fontSize: 16, px: 5, py: 1.7, borderRadius: 2.5 }}>
                                {t("about.ctaRegister")}
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default About;