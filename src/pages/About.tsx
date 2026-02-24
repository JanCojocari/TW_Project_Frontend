import { Box, Container, Typography, Card, CardContent, Button, Paper } from "@mui/material";
import {
    Info as InfoIcon, Visibility as VisibilityIcon,
    EmojiObjects as EmojiObjectsIcon, Favorite as FavoriteIcon,
    Speed as SpeedIcon, VerifiedUser as VerifiedUserIcon,
    Groups as GroupsIcon, TrendingUp as TrendingUpIcon,
    ArrowForward as ArrowForwardIcon, Apartment as ApartmentIcon,
    People as PeopleIcon, CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { paths } from "../app/paths";
import { gradients, colors } from "../theme/gradients.ts";

const About = () => {
    const navigate = useNavigate();

    const missionCards = [
        { icon: <VisibilityIcon sx={{ fontSize: 40 }} />,    title: "Viziunea Noastră",        description: "Să devenim cea mai de încredere platformă imobiliară din Moldova, unde fiecare persoană găsește locuința ideală cu ușurință și transparență." },
        { icon: <EmojiObjectsIcon sx={{ fontSize: 40 }} />,  title: "Inovație Continuă",       description: "Utilizăm cele mai moderne tehnologii pentru a oferi o experiență superioară utilizatorilor noștri, simplificând procesul de căutare și închiriere." },
        { icon: <FavoriteIcon sx={{ fontSize: 40 }} />,      title: "Orientare către Client",  description: "Prioritizăm nevoile utilizatorilor noștri, oferind suport dedicat și soluții personalizate pentru fiecare situație." },
    ];

    const values = [
        { icon: <SpeedIcon sx={{ fontSize: 32 }} />,         title: "Rapiditate",   description: "Platformă optimizată pentru căutări rapide și eficiente" },
        { icon: <VerifiedUserIcon sx={{ fontSize: 32 }} />,  title: "Transparență", description: "Informații clare și verificate despre fiecare proprietate" },
        { icon: <GroupsIcon sx={{ fontSize: 32 }} />,        title: "Comunitate",   description: "Conectăm oameni și construim relații de încredere" },
        { icon: <TrendingUpIcon sx={{ fontSize: 32 }} />,    title: "Creștere",     description: "Îmbunătățire continuă și evoluție constantă" },
    ];

    const stats = [
        { icon: <ApartmentIcon sx={{ fontSize: 48 }} />, value: "10,000+", label: "Proprietăți active" },
        { icon: <PeopleIcon sx={{ fontSize: 48 }} />,    value: "50,000+", label: "Utilizatori înregistrați" },
        { icon: <CheckCircleIcon sx={{ fontSize: 48 }} />,value: "8,500+", label: "Contracte încheiate" },
    ];

    return (
        <Box sx={{ pt: 5, minHeight: "100vh", bgcolor: "background.default" }}>

            {/* ── Hero ───────────────────────────────────────────────────── */}
            <Box
                sx={{
                    background:   gradients.hero,
                    py:           { xs: 8, md: 12 },
                    position:     "relative",
                    overflow:     "hidden",
                    borderBottom: `1px solid ${colors.border}`,
                }}
            >
                <Container maxWidth="lg">
                    <Box sx={{ position: "relative", zIndex: 2, textAlign: "center" }}>
                        <Box
                            sx={{
                                display:      "inline-flex",
                                background:   colors.primaryAlpha10,
                                p:            2,
                                borderRadius: "16px",
                                border:       `1.5px solid ${colors.primaryAlpha25}`,
                                mb:           3,
                            }}
                        >
                            <InfoIcon sx={{ fontSize: 48, color: "primary.main" }} />
                        </Box>

                        <Typography
                            variant="h2"
                            sx={{ fontWeight: 900, fontSize: { xs: "36px", md: "56px" }, mb: 3, lineHeight: 1.2, letterSpacing: "-1.5px" }}
                        >
                            Despre{" "}
                            <Box component="span" sx={{ background: gradients.textPrimary, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                Rentora
                            </Box>
                        </Typography>

                        <Typography variant="h5" color="text.secondary" sx={{ mb: 2, fontWeight: 400, lineHeight: 1.6, maxWidth: "800px", mx: "auto" }}>
                            Platforma ta de încredere pentru găsirea locuinței perfecte în Moldova
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 300, lineHeight: 1.8, maxWidth: "700px", mx: "auto" }}>
                            Rentora conectează proprietari cu chiriași, oferind o experiență modernă, sigură și eficientă în căutarea și gestionarea proprietăților imobiliare.
                        </Typography>
                    </Box>
                </Container>
            </Box>

            {/* ── Mission ──────────────────────────────────────────────── */}
            <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: "background.paper", borderBottom: `1px solid ${colors.border}` }}>
                <Container maxWidth="lg">
                    <Typography variant="h3" sx={{ textAlign: "center", mb: 2, fontWeight: 900, letterSpacing: "-1px" }}>
                        Misiunea{" "}
                        <Box component="span" sx={{ background: gradients.textPrimary, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                            Noastră
                        </Box>
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ textAlign: "center", mb: 6, fontWeight: 400, maxWidth: "700px", mx: "auto" }}>
                        Ne dedicăm să transformăm experiența de căutare a locuințelor în Moldova
                    </Typography>

                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" }, gap: 3 }}>
                        {missionCards.map((card, i) => (
                            <Card key={i}>
                                <CardContent sx={{ textAlign: "center", pt: 4, pb: 4 }}>
                                    <Box
                                        sx={{
                                            background:   gradients.primary,
                                            borderRadius: "12px",
                                            p:            2,
                                            display:      "inline-flex",
                                            mb:           3,
                                            color:        "#FFFFFF",
                                            boxShadow:    `0 6px 20px ${colors.primaryAlpha25}`,
                                        }}
                                    >
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

            {/* ── Values ───────────────────────────────────────────────── */}
            <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: "background.default", borderBottom: `1px solid ${colors.border}` }}>
                <Container maxWidth="lg">
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 6, alignItems: "center" }}>
                        <Box>
                            <Typography variant="h3" sx={{ mb: 3, fontWeight: 900, letterSpacing: "-1px" }}>
                                Valorile{" "}
                                <Box component="span" sx={{ background: gradients.textPrimary, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                    Noastre
                                </Box>
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, fontSize: "17px", mb: 3 }}>
                                La Rentora, credem în puterea transparenței și a inovației. Ne ghidăm după principii solide care ne permit să oferim cea mai bună experiență utilizatorilor noștri.
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, fontSize: "17px" }}>
                                Fiecare decizie pe care o luăm este orientată către construirea unei platforme de care comunitatea să fie mândră.
                            </Typography>
                        </Box>

                        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 3 }}>
                            {values.map((value, i) => (
                                <Box
                                    key={i}
                                    sx={{
                                        background:  colors.primaryAlpha06,
                                        border:      `1px solid ${colors.border}`,
                                        borderRadius: 4,
                                        p:           3,
                                        transition:  "all 0.3s ease",
                                        "&:hover": {
                                            transform:   "translateY(-4px)",
                                            boxShadow:   `0 12px 24px ${colors.primaryAlpha15}`,
                                            borderColor: "primary.main",
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            background:   gradients.primary,
                                            borderRadius: "10px",
                                            p:            1.5,
                                            display:      "inline-flex",
                                            mb:           2,
                                            color:        "#FFFFFF",
                                        }}
                                    >
                                        {value.icon}
                                    </Box>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontSize: "18px" }}>{value.title}</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>{value.description}</Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* ── Stats ────────────────────────────────────────────────── */}
            <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: "background.paper", borderBottom: `1px solid ${colors.border}` }}>
                <Container maxWidth="lg">
                    <Typography variant="h3" sx={{ textAlign: "center", mb: 2, fontWeight: 900, letterSpacing: "-1px" }}>
                        Rentora în{" "}
                        <Box component="span" sx={{ background: gradients.textPrimary, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                            Cifre
                        </Box>
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ textAlign: "center", mb: 6, fontWeight: 400, maxWidth: "700px", mx: "auto" }}>
                        Succesul nostru se reflectă în încrederea pe care utilizatorii o acordă platformei
                    </Typography>

                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" }, gap: 4 }}>
                        {stats.map((stat, i) => (
                            <Paper
                                key={i}
                                elevation={1}
                                sx={{ p: 4, textAlign: "center", border: `1px solid ${colors.border}`, borderRadius: 4 }}
                            >
                                <Box sx={{ display: "inline-flex", background: gradients.primary, borderRadius: "16px", p: 2, mb: 3, color: "#FFFFFF", boxShadow: `0 6px 20px ${colors.primaryAlpha25}` }}>
                                    {stat.icon}
                                </Box>
                                <Typography
                                    variant="h3"
                                    sx={{ fontWeight: 900, mb: 1, background: gradients.textPrimary, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                                >
                                    {stat.value}
                                </Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                                    {stat.label}
                                </Typography>
                            </Paper>
                        ))}
                    </Box>
                </Container>
            </Box>

            {/* ── CTA ──────────────────────────────────────────────────── */}
            <Box sx={{ py: { xs: 6, md: 10 }, background: gradients.cta, position: "relative", overflow: "hidden", borderTop: `1px solid ${colors.border}` }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: "center", position: "relative", zIndex: 2 }}>
                        <Typography variant="h3" sx={{ fontWeight: 900, mb: 3, fontSize: { xs: "28px", md: "44px" }, letterSpacing: "-1.5px" }}>
                            Alătură-te Comunității{" "}
                            <Box component="span" sx={{ background: gradients.textPrimary, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                Rentora
                            </Box>
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 4, fontWeight: 300, maxWidth: "700px", mx: "auto" }}>
                            Descoperă mii de proprietăți verificate și începe călătoria către locuința ta ideală astăzi
                        </Typography>
                        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
                            <Button size="large" variant="contained" endIcon={<ArrowForwardIcon />} onClick={() => navigate(paths.listings)} sx={{ fontSize: 16, px: 5, py: 1.7, borderRadius: 2.5 }}>
                                Explorează Anunțuri
                            </Button>
                            <Button size="large" variant="outlined" onClick={() => navigate(paths.register)} sx={{ fontSize: 16, px: 5, py: 1.7, borderRadius: 2.5 }}>
                                Creează Cont
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default About;