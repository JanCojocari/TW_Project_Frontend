import {
    Box,
    Container,
    Typography,
} from "@mui/material";
import {
    Info as InfoIcon,
} from "@mui/icons-material";

const About = () => {
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
        </Box>
    );
};

export default About;
