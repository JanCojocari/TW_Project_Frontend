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
        <Box sx={{ pt: 5, minHeight: "100vh", background: "#071A1D" }}>
            {/* Hero Section */}
            <Box
                sx={{
                    background: "linear-gradient(135deg, #071A1D 0%, #0C2529 50%, #0F2F34 100%)",
                    py: { xs: 8, md: 12 },
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
                        background: "rgba(0, 224, 198, 0.08)",
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
                        background: "rgba(0, 224, 198, 0.05)",
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
                                background: "rgba(0, 224, 198, 0.1)",
                                backdropFilter: "blur(10px)",
                                p: 2,
                                borderRadius: "16px",
                                border: "1.5px solid rgba(0, 224, 198, 0.2)",
                                mb: 3,
                            }}
                        >
                            <InfoIcon sx={{ fontSize: 48, color: "#00E0C6" }} />
                        </Box>

                        <Typography
                            variant="h2"
                            sx={{
                                color: "#E6F7F5",
                                fontWeight: 900,
                                fontSize: { xs: "36px", md: "56px" },
                                mb: 3,
                                lineHeight: 1.2,
                                letterSpacing: "-1.5px",
                            }}
                        >
                            Despre <Box component="span" sx={{ color: "#00E0C6" }}>Rentora</Box>
                        </Typography>

                        <Typography
                            variant="h5"
                            sx={{
                                color: "#8FB5B1",
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
                                color: "#8FB5B1",
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
            <Box sx={{ py: { xs: 6, md: 10 }, background: "#0C2529", borderBottom: "1px solid #12383D" }}>
                <Container maxWidth="lg">
                    <Typography
                        variant="h3"
                        sx={{
                            textAlign: "center",
                            mb: 2,
                            fontWeight: 900,
                            color: "#E6F7F5",
                            letterSpacing: "-1px",
                        }}
                    >
                        Misiunea <Box component="span" sx={{ color: "#00E0C6" }}>Noastră</Box>
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            textAlign: "center",
                            color: "#8FB5B1",
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
                                    background: "#0F2F34",
                                    border: "1px solid #12383D",
                                    borderRadius: 4,
                                    height: "100%",
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                        transform: "translateY(-8px)",
                                        boxShadow: "0 20px 40px rgba(0, 224, 198, 0.1)",
                                        borderColor: "#00E0C6",
                                    },
                                }}
                            >
                                <CardContent sx={{ textAlign: "center", pt: 4, pb: 4 }}>
                                    <Box
                                        sx={{
                                            background: "linear-gradient(135deg, #00E0C6, #00BFA6)",
                                            borderRadius: "12px",
                                            p: 2,
                                            display: "inline-flex",
                                            mb: 3,
                                            color: "#071A1D",
                                        }}
                                    >
                                        {card.icon}
                                    </Box>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 700,
                                            mb: 2,
                                            color: "#E6F7F5",
                                        }}
                                    >
                                        {card.title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: "#8FB5B1",
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
            <Box sx={{ py: { xs: 6, md: 10 }, background: "#071A1D", borderBottom: "1px solid #12383D" }}>
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
                                    color: "#E6F7F5",
                                    letterSpacing: "-1px",
                                }}
                            >
                                Valorile <Box component="span" sx={{ color: "#00E0C6" }}>Noastre</Box>
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    color: "#8FB5B1",
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
                                    color: "#8FB5B1",
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
                                        background: "rgba(0, 224, 198, 0.03)",
                                        border: "1px solid #12383D",
                                        borderRadius: 4,
                                        p: 3,
                                        transition: "all 0.3s ease",
                                        "&:hover": {
                                            transform: "translateY(-4px)",
                                            boxShadow: "0 12px 24px rgba(0, 224, 198, 0.08)",
                                            borderColor: "#00E0C6",
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            background: "linear-gradient(135deg, #00E0C6, #00BFA6)",
                                            borderRadius: "10px",
                                            p: 1.5,
                                            display: "inline-flex",
                                            mb: 2,
                                            color: "#071A1D",
                                        }}
                                    >
                                        {value.icon}
                                    </Box>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 700,
                                            mb: 1,
                                            color: "#E6F7F5",
                                            fontSize: "18px",
                                        }}
                                    >
                                        {value.title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: "#8FB5B1",
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
            <Box sx={{ py: { xs: 6, md: 10 }, background: "#0C2529", borderBottom: "1px solid #12383D" }}>
                <Container maxWidth="lg">
                    <Typography
                        variant="h3"
                        sx={{
                            textAlign: "center",
                            mb: 2,
                            fontWeight: 900,
                            color: "#E6F7F5",
                            letterSpacing: "-1px",
                        }}
                    >
                        Rentora în <Box component="span" sx={{ color: "#00E0C6" }}>Cifre</Box>
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            textAlign: "center",
                            color: "#8FB5B1",
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
                                    background: "#0F2F34",
                                    border: "1px solid #12383D",
                                    borderRadius: 4,
                                    p: 4,
                                    textAlign: "center",
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                        transform: "translateY(-8px)",
                                        borderColor: "#00E0C6",
                                        boxShadow: "0 20px 40px rgba(0, 224, 198, 0.1)",
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "inline-flex",
                                        background: "linear-gradient(135deg, #00E0C6, #00BFA6)",
                                        borderRadius: "16px",
                                        p: 2,
                                        mb: 3,
                                        color: "#071A1D",
                                    }}
                                >
                                    {stat.icon}
                                </Box>
                                <Typography
                                    variant="h3"
                                    sx={{
                                        fontWeight: 900,
                                        mb: 1,
                                        color: "#00E0C6",
                                    }}
                                >
                                    {stat.value}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        color: "#8FB5B1",
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
                    background: "linear-gradient(135deg, #071A1D 0%, #0C2529 50%, #0F2F34 100%)",
                    position: "relative",
                    overflow: "hidden",
                    borderTop: "1px solid #12383D",
                    "&::before": {
                        content: '""',
                        position: "absolute",
                        top: "-30%",
                        right: "-10%",
                        width: "500px",
                        height: "500px",
                        background: "rgba(0, 224, 198, 0.08)",
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
                                color: "#E6F7F5",
                                fontWeight: 900,
                                mb: 3,
                                fontSize: { xs: "28px", md: "44px" },
                                letterSpacing: "-1.5px",
                            }}
                        >
                            Alătură-te Comunității <Box component="span" sx={{ color: "#00E0C6" }}>Rentora</Box>
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                color: "#8FB5B1",
                                mb: 4,
                                fontWeight: 300,
                                maxWidth: "700px",
                                mx: "auto",
                            }}
                        >
                            Descoperă mii de proprietăți verificate și începe călătoria către locuința ta ideală astăzi
                        </Typography>
                        <Box
                            sx={{
                                display: "flex",
                                gap: 2,
                                justifyContent: "center",
                                flexWrap: "wrap",
                            }}
                        >
                            <Button
                                size="large"
                                variant="contained"
                                endIcon={<ArrowForwardIcon />}
                                onClick={() => navigate(paths.listings)}
                                sx={{
                                    background: "linear-gradient(90deg, #00E0C6, #00BFA6)",
                                    color: "#071A1D",
                                    fontWeight: 700,
                                    fontSize: 16,
                                    px: 5,
                                    py: 1.7,
                                    borderRadius: 2,
                                    boxShadow: "0 0 20px rgba(0, 224, 198, 0.3)",
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                        background: "linear-gradient(90deg, #00FFF0, #00E0C6)",
                                        transform: "translateY(-2px)",
                                        boxShadow: "0 12px 32px rgba(0, 224, 198, 0.4)",
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
                                    color: "#00E0C6",
                                    borderColor: "#00E0C6",
                                    fontWeight: 600,
                                    fontSize: 16,
                                    px: 5,
                                    py: 1.7,
                                    borderRadius: 2,
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                        borderColor: "#00FFF0",
                                        background: "rgba(0, 224, 198, 0.1)",
                                        color: "#00FFF0",
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