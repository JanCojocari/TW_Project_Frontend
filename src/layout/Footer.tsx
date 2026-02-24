import { Box, Container, Typography, Divider } from "@mui/material";
import ApartmentIcon from "@mui/icons-material/Apartment";
import { useNavigate } from "react-router-dom";
import { paths } from "../app/paths";
import { raw } from "../theme/theme";

const Footer = () => {
    const navigate = useNavigate();

    const links = [
        { label: "Termeni & Condiții",              path: "#" },
        { label: "Politică de Confidențialitate",   path: "#" },
    ];

    return (
        <Box
            component="footer"
            sx={{
                background: `linear-gradient(135deg, ${raw.footerGradientStart} 0%, ${raw.footerGradientMid} 40%, ${raw.footerGradientEnd} 100%)`,
                position:   "relative",
                overflow:   "hidden",
                "&::before": {
                    content:        '""',
                    position:       "absolute",
                    bottom:         "-20%",
                    left:           "50%",
                    transform:      "translateX(-50%)",
                    width:          "60%",
                    height:         "200%",
                    background:     `radial-gradient(ellipse, ${raw.footerGlow} 0%, transparent 70%)`,
                    pointerEvents:  "none",
                },
            }}
        >
            <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
                <Box
                    sx={{
                        display:               "grid",
                        gridTemplateColumns:   { xs: "1fr", md: "auto 1fr auto" },
                        alignItems:            "center",
                        gap:                   { xs: 3, md: 6 },
                        py:                    { xs: 4, md: 3.5 },
                    }}
                >
                    {/* Logo */}
                    <Box
                        onClick={() => navigate(paths.home)}
                        sx={{
                            display:    "flex",
                            alignItems: "center",
                            gap:        1.5,
                            cursor:     "pointer",
                            transition: "opacity 0.2s ease",
                            "&:hover":  { opacity: 0.8 },
                        }}
                    >
                        <Box
                            sx={{
                                background:     raw.footerLogoBg,
                                backdropFilter: "blur(10px)",
                                border:         `1px solid ${raw.footerLogoBorder}`,
                                p:              1,
                                borderRadius:   2,
                                display:        "flex",
                            }}
                        >
                            <ApartmentIcon sx={{ color: raw.footerTextHover, fontSize: 22 }} />
                        </Box>
                        <Typography
                            variant="h6"
                            fontWeight={800}
                            sx={{ color: raw.footerTextHover, letterSpacing: "-0.5px" }}
                        >
                            Rentora
                        </Typography>
                    </Box>

                    {/* Tagline */}
                    <Typography
                        variant="body2"
                        sx={{
                            color:     raw.footerText,
                            lineHeight: 1.7,
                            maxWidth:   420,
                        }}
                    >
                        Platforma ta de încredere pentru găsirea și gestionarea
                        proprietăților imobiliare în Moldova.
                    </Typography>

                    {/* Links */}
                    <Box sx={{ display: "flex", gap: 3, alignItems: "center", flexWrap: "wrap" }}>
                        {links.map((link) => (
                            <Typography
                                key={link.label}
                                variant="body2"
                                onClick={() => link.path !== "#" && navigate(link.path)}
                                sx={{
                                    color:      raw.footerText,
                                    cursor:     "pointer",
                                    fontWeight: 500,
                                    position:   "relative",
                                    transition: "color 0.2s ease",
                                    "&::after": {
                                        content:    '""',
                                        position:   "absolute",
                                        bottom:     -2,
                                        left:       0,
                                        width:      "100%",
                                        height:     "1px",
                                        background: raw.footerLinkUnderline,
                                    },
                                    "&:hover": { color: raw.footerTextHover },
                                }}
                            >
                                {link.label}
                            </Typography>
                        ))}
                    </Box>
                </Box>

                <Divider sx={{ borderColor: raw.footerBorder }} />

                <Box sx={{ py: 2, textAlign: "center" }}>
                    <Typography variant="caption" sx={{ color: raw.footerTextMuted }}>
                        © {new Date().getFullYear()} Rentora. Toate drepturile rezervate.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;