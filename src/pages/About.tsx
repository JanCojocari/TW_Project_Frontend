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
    Info as InfoIcon,
    Visibility as VisibilityIcon,
    EmojiObjects as EmojiObjectsIcon,
    Favorite as FavoriteIcon,
    Speed as SpeedIcon,
    VerifiedUser as VerifiedUserIcon,
    Groups as GroupsIcon,
    TrendingUp as TrendingUpIcon,
    ArrowForward as ArrowForwardIcon,
    Apartment as ApartmentIcon,
    People as PeopleIcon,
    CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { paths } from "../app/paths";

const About = () => {
    const navigate = useNavigate();

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

    const values = [
        {
            icon: <SpeedIcon sx={{ fontSize: 32 }} />,
            title: "Rapiditate",
            description: "Platformă optimizată pentru căutări rapide și eficiente",
        },
        {
            icon: <VerifiedUserIcon sx={{ fontSize: 32 }} />,
            title: "Transparență",
            description: "Informații clare și verificate despre fiecare proprietate",
        },
        {
            icon: <GroupsIcon sx={{ fontSize: 32 }} />,
            title: "Comunitate",
            description: "Conectăm oameni și construim relații de încredere",
        },
        {
            icon: <TrendingUpIcon sx={{ fontSize: 32 }} />,
            title: "Creștere",
            description: "Îmbunătățire continuă și evoluție constantă",
        },
    ];

    const stats = [
        {
            icon: <ApartmentIcon sx={{ fontSize: 48 }} />,
            value: "10,000+",
            label: "Proprietăți active",
        },
        {
            icon: <PeopleIcon sx={{ fontSize: 48 }} />,
            value: "50,000+",
            label: "Utilizatori înregistrați",
        },
        {
            icon: <CheckCircleIcon sx={{ fontSize: 48 }} />,
            value: "8,500+",
            label: "Contracte încheiate",
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

            {/* Values Section */}
            <Box sx={{ py: { xs: 6, md: 10 }, background: "#ffffff" }}>
                <Container maxWidth="lg">
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                            gap: 6,
                            alignItems: "center",
                        }}
                    >
                        {/* Left Side - Text Content */}
                        <Box>
                            <Typography
                                variant="h3"
                                sx={{
                                    mb: 3,
                                    fontWeight: 900,
                                    background: "linear-gradient(90deg, #2563eb, #4f46e5, #7c3aed)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                }}
                            >
                                Valorile Noastre
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    color: "#6b7280",
                                    lineHeight: 1.8,
                                    fontSize: "17px",
                                    mb: 3,
                                }}
                            >
                                La Rentora, credem în puterea transparenței și a inovației. Ne ghidăm după
                                principii solide care ne permit să oferim cea mai bună experiență utilizatorilor noștri.
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    color: "#6b7280",
                                    lineHeight: 1.8,
                                    fontSize: "17px",
                                }}
                            >
                                Fiecare decizie pe care o luăm este orientată către construirea unei platforme
                                de care comunitatea să fie mândră și pe care să se poată baza.
                            </Typography>
                        </Box>

                        {/* Right Side - Values Grid */}
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                                gap: 3,
                            }}
                        >
                            {values.map((value, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        background: "linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(79, 70, 229, 0.05) 100%)",
                                        border: "1px solid #e5e7eb",
                                        borderRadius: 3,
                                        p: 3,
                                        transition: "all 0.3s ease",
                                        "&:hover": {
                                            transform: "translateY(-4px)",
                                            boxShadow: "0 12px 24px rgba(37, 99, 235, 0.08)",
                                            borderColor: "#2563eb",
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            background: "linear-gradient(135deg, #2563eb, #4f46e5)",
                                            borderRadius: "10px",
                                            p: 1.5,
                                            display: "inline-flex",
                                            mb: 2,
                                            color: "white",
                                        }}
                                    >
                                        {value.icon}
                                    </Box>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 700,
                                            mb: 1,
                                            color: "#1f2937",
                                            fontSize: "18px",
                                        }}
                                    >
                                        {value.title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: "#6b7280",
                                            lineHeight: 1.6,
                                            fontSize: "14px",
                                        }}
                                    >
                                        {value.description}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* Statistics Section */}
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
                        Rentora în Cifre
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
                        Succesul nostru se reflectă în încrederea pe care utilizatorii o acordă platformei
                    </Typography>

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
                            gap: 4,
                        }}
                    >
                        {stats.map((stat, index) => (
                            <Paper
                                key={index}
                                elevation={0}
                                sx={{
                                    background: "white",
                                    border: "2px solid #e5e7eb",
                                    borderRadius: 3,
                                    p: 4,
                                    textAlign: "center",
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                        transform: "translateY(-8px)",
                                        borderColor: "#2563eb",
                                        boxShadow: "0 20px 40px rgba(37, 99, 235, 0.12)",
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "inline-flex",
                                        background: "linear-gradient(135deg, #2563eb, #4f46e5)",
                                        borderRadius: "16px",
                                        p: 2,
                                        mb: 3,
                                        color: "white",
                                    }}
                                >
                                    {stat.icon}
                                </Box>
                                <Typography
                                    variant="h3"
                                    sx={{
                                        fontWeight: 900,
                                        mb: 1,
                                        background: "linear-gradient(90deg, #2563eb, #4f46e5, #7c3aed)",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                    }}
                                >
                                    {stat.value}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        color: "#6b7280",
                                        fontWeight: 500,
                                        fontSize: "16px",
                                    }}
                                >
                                    {stat.label}
                                </Typography>
                            </Paper>
                        ))}
                    </Box>
                </Container>
            </Box>

            {/* CTA Section */}
            <Box
                sx={{
                    py: { xs: 6, md: 10 },
                    background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 50%, #7c3aed 100%)",
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                        content: '""',
                        position: "absolute",
                        top: "-30%",
                        right: "-10%",
                        width: "500px",
                        height: "500px",
                        background: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "50%",
                        filter: "blur(80px)",
                    },
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
                                mb: 3,
                                fontSize: { xs: "28px", md: "44px" },
                            }}
                        >
                            Alătură-te Comunității Rentora
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                color: "rgba(255, 255, 255, 0.9)",
                                mb: 4,
                                fontWeight: 300,
                                maxWidth: "700px",
                                mx: "auto",
                            }}
                        >
                            Descoperă mii de proprietăți verificate și începe călătoria către locuința ta ideală astăzi
                        </Typography>
                        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
                            <Button
                                size="large"
                                variant="contained"
                                endIcon={<ArrowForwardIcon />}
                                onClick={() => navigate(paths.listings)}
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
                                Explorează Anunțuri
                            </Button>
                            <Button
                                size="large"
                                variant="outlined"
                                onClick={() => navigate(paths.register)}
                                sx={{
                                    color: "white",
                                    borderColor: "rgba(255, 255, 255, 0.5)",
                                    fontWeight: 600,
                                    fontSize: 16,
                                    px: 5,
                                    py: 1.7,
                                    borderRadius: 2,
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                        borderColor: "white",
                                        background: "rgba(255, 255, 255, 0.1)",
                                        transform: "translateY(-2px)",
                                    },
                                }}
                            >
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
