import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
} from "@mui/material";
import {
    Info as InfoIcon,
    Visibility as VisibilityIcon,
    EmojiObjects as EmojiObjectsIcon,
    Favorite as FavoriteIcon,
} from "@mui/icons-material";

const About = () => {
    const missionCards = [
        {
            icon: <VisibilityIcon sx={{ fontSize: 40 }} />,
            title: "Viziunea Noastră",
            description: "Să devenim cea mai de încredere platformă imobiliară din Moldova, unde fiecare persoană găsește locuința ideală cu ușurință și transparență.",
        },
        {
            icon: <EmojiObjectsIcon sx={{ fontSize: 40 }} />,
            title: "Inovație Continuă",
            description: "Utilizăm cele mai moderne tehnologii pentru a oferi o experiență superioară utilizatorilor noștri, simplificând procesul de căutare și închiriere.",
        },
        {
            icon: <FavoriteIcon sx={{ fontSize: 40 }} />,
            title: "Orientare către Client",
            description: "Prioritizăm nevoile utilizatorilor noștri, oferind suport dedicat și soluții personalizate pentru fiecare situație.",
        },
    ];

    return (
        <Box sx={{ pt: 5, minHeight: "100vh", background: "#ffffff" }}>
            {/* Hero Section */}
            <Box
                sx={{
                    background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 50%, #7c3aed 100%)",
                    py: { xs: 8, md: 12 },
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
                    <Box
                        sx={{
                            position: "relative",
                            zIndex: 2,
                            textAlign: "center",
                        }}
                    >
                        <Box
                            sx={{
                                display: "inline-flex",
                                background: "rgba(255, 255, 255, 0.2)",
                                backdropFilter: "blur(10px)",
                                p: 2,
                                borderRadius: "16px",
                                border: "1.5px solid rgba(255, 255, 255, 0.3)",
                                mb: 3,
                            }}
                        >
                            <InfoIcon sx={{ fontSize: 48, color: "white" }} />
                        </Box>

                        <Typography
                            variant="h2"
                            sx={{
                                color: "white",
                                fontWeight: 900,
                                fontSize: { xs: "36px", md: "56px" },
                                mb: 3,
                                lineHeight: 1.2,
                                textShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            Despre Rentora
                        </Typography>

                        <Typography
                            variant="h5"
                            sx={{
                                color: "rgba(255, 255, 255, 0.95)",
                                mb: 2,
                                fontSize: { xs: "18px", md: "24px" },
                                fontWeight: 400,
                                lineHeight: 1.6,
                                maxWidth: "800px",
                                mx: "auto",
                            }}
                        >
                            Platforma ta de încredere pentru găsirea locuinței perfecte în Moldova
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{
                                color: "rgba(255, 255, 255, 0.85)",
                                fontSize: { xs: "16px", md: "18px" },
                                fontWeight: 300,
                                lineHeight: 1.8,
                                maxWidth: "700px",
                                mx: "auto",
                            }}
                        >
                            Rentora conectează proprietari cu chiriași, oferind o experiență modernă,
                            sigură și eficientă în căutarea și gestionarea proprietăților imobiliare.
                        </Typography>
                    </Box>
                </Container>
            </Box>

            {/* Mission Section */}
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
                        Misiunea Noastră
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            textAlign: "center",
                            color: "#6b7280",
                            mb: 6,
                            fontWeight: 400,
                            maxWidth: "700px",
                            mx: "auto",
                        }}
                    >
                        Ne dedicăm să transformăm experiența de căutare a locuințelor în Moldova
                    </Typography>

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
                            gap: 3,
                        }}
                    >
                        {missionCards.map((card, index) => (
                            <Card
                                key={index}
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
                                <CardContent sx={{ textAlign: "center", pt: 4, pb: 4 }}>
                                    <Box
                                        sx={{
                                            background: "linear-gradient(135deg, #2563eb, #4f46e5)",
                                            borderRadius: "12px",
                                            p: 2,
                                            display: "inline-flex",
                                            mb: 3,
                                            color: "white",
                                        }}
                                    >
                                        {card.icon}
                                    </Box>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 700,
                                            mb: 2,
                                            color: "#1f2937",
                                        }}
                                    >
                                        {card.title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: "#6b7280",
                                            lineHeight: 1.7,
                                        }}
                                    >
                                        {card.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default About;
