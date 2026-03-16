// layout/Footer.tsx
import { Box, Container, Typography, Divider } from "@mui/material";
import ApartmentIcon     from "@mui/icons-material/Apartment";
import { useNavigate }   from "react-router-dom";
import { useTranslation } from "react-i18next";
import { paths }         from "../app/paths";
import { useThemeMode }  from "../theme/ThemeContext.tsx";

const Footer = () => {
    const navigate    = useNavigate();
    const { isDark }  = useThemeMode();
    const { t }       = useTranslation();

    const f = isDark ? {
        bg: "linear-gradient(135deg, #0D1B2A 0%, #112030 40%, #0A1520 100%)",
        glow: "rgba(112,150,190,0.12)", logoBg: "rgba(255,255,255,0.08)",
        logoBorder: "rgba(255,255,255,0.12)", text: "rgba(255,255,255,0.5)",
        textHover: "#FFFFFF", textMuted: "rgba(255,255,255,0.25)",
        border: "rgba(255,255,255,0.08)", linkUnderline: "rgba(255,255,255,0.3)",
    } : {
        bg: "linear-gradient(135deg, #7096BE 0%, #3A5F82 40%, #1A2E42 100%)",
        glow: "rgba(112,150,190,0.25)", logoBg: "rgba(255,255,255,0.15)",
        logoBorder: "rgba(255,255,255,0.2)", text: "rgba(255,255,255,0.6)",
        textHover: "#FFFFFF", textMuted: "rgba(255,255,255,0.35)",
        border: "rgba(255,255,255,0.1)", linkUnderline: "rgba(255,255,255,0.4)",
    };

    const links = [
        { label: t("footer.terms"),   path: "#" },
        { label: t("footer.privacy"), path: "#" },
    ];

    return (
        <Box component="footer" sx={{ background: f.bg, position: "relative", overflow: "hidden",
            "&::before": { content: '""', position: "absolute", bottom: "-20%", left: "50%", transform: "translateX(-50%)", width: "60%", height: "200%", background: `radial-gradient(ellipse, ${f.glow} 0%, transparent 70%)`, pointerEvents: "none" } }}>
            <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "auto 1fr auto" }, alignItems: "center", gap: { xs: 3, md: 6 }, py: { xs: 4, md: 3.5 } }}>
                    <Box onClick={() => navigate(paths.home)} sx={{ display: "flex", alignItems: "center", gap: 1.5, cursor: "pointer", transition: "opacity 0.2s ease", "&:hover": { opacity: 0.8 } }}>
                        <Box sx={{ background: f.logoBg, backdropFilter: "blur(10px)", border: `1px solid ${f.logoBorder}`, p: 1, borderRadius: 2, display: "flex" }}>
                            <ApartmentIcon sx={{ color: f.textHover, fontSize: 22 }} />
                        </Box>
                        <Typography variant="h6" fontWeight={800} sx={{ color: f.textHover, letterSpacing: "-0.5px" }}>Rentora</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: f.text, lineHeight: 1.7, maxWidth: 420 }}>{t("footer.tagline")}</Typography>
                    <Box sx={{ display: "flex", gap: 3, alignItems: "center", flexWrap: "wrap" }}>
                        {links.map((link) => (
                            <Typography key={link.label} variant="body2" onClick={() => link.path !== "#" && navigate(link.path)}
                                        sx={{ color: f.text, cursor: "pointer", fontWeight: 500, position: "relative", transition: "color 0.2s ease",
                                            "&::after": { content: '""', position: "absolute", bottom: -2, left: 0, width: "100%", height: "1px", background: f.linkUnderline },
                                            "&:hover": { color: f.textHover } }}>
                                {link.label}
                            </Typography>
                        ))}
                    </Box>
                </Box>
                <Divider sx={{ borderColor: f.border }} />
                <Box sx={{ py: 2, textAlign: "center" }}>
                    <Typography variant="caption" sx={{ color: f.textMuted }}>
                        © {new Date().getFullYear()} Rentora. {t("footer.rights")}
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;