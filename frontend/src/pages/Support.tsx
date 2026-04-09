// src/pages/Support.tsx
import { useState }          from "react";
import { Box, Container, Typography, Paper, Button, Alert, Card, CardContent, Collapse, IconButton } from "@mui/material";
import {
    Support as SupportIcon, Email as EmailIcon, Phone as PhoneIcon,
    LocationOn as LocationIcon, Send as SendIcon, Add as AddIcon, Remove as RemoveIcon,
} from "@mui/icons-material";
import { useTranslation }    from "react-i18next";
import { gradients, colors } from "../theme/gradients.ts";
import DebouncedTextField    from "../components/common/DebouncedTextField.tsx";
import { supportService }    from "../services/supportService.ts";

const FaqItem = ({ question, answer }: { question: string; answer: string }) => {
    const [open, setOpen] = useState(false);
    return (
        <Box sx={{ border: `1px solid ${colors.border}`, borderRadius: 3, overflow: "hidden", transition: "all 0.3s ease", bgcolor: open ? colors.primaryAlpha06 : "background.paper",
            "&:hover": { borderColor: "primary.main", boxShadow: `0 4px 20px ${colors.primaryAlpha10}` } }}>
            <Box onClick={() => setOpen(!open)} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 3, cursor: "pointer", userSelect: "none" }}>
                <Typography fontWeight={700} fontSize={16} color="text.primary">{question}</Typography>
                <IconButton size="small" sx={{ background: open ? gradients.primary : colors.primaryAlpha10, color: open ? "#FFFFFF" : "text.secondary", flexShrink: 0, ml: 2, transition: "all 0.3s ease", "&:hover": { background: open ? gradients.primaryHover : colors.primaryAlpha15 } }}>
                    {open ? <RemoveIcon fontSize="small" /> : <AddIcon fontSize="small" />}
                </IconButton>
            </Box>
            <Collapse in={open}>
                <Box sx={{ px: 3, pb: 3 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>{answer}</Typography>
                </Box>
            </Collapse>
        </Box>
    );
};

const Support = () => {
    const { t } = useTranslation();
    const [formData, setFormData]   = useState({ subject: "", message: "", email: "" });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading]     = useState(false);
    const [error, setError]         = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.email || !formData.subject || !formData.message) { setError(t("support.errorMsg")); return; }
        setLoading(true);
        setError("");
        supportService.create({ email: formData.email, subject: formData.subject, message: formData.message })
            .then(() => {
                setSubmitted(true);
                setFormData({ subject: "", message: "", email: "" });
                setTimeout(() => setSubmitted(false), 5000);
            })
            .catch(() => setError("Eroare la trimiterea mesajului. Încearcă din nou."))
            .finally(() => setLoading(false));
    };

    const handleChange = (field: string) => (value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (error) setError("");
    };

    const contactItems = [
        { icon: <EmailIcon sx={{ fontSize: 24 }} />,    label: t("support.contact.email.label"),   value: t("support.contact.email.value"),   sub: t("support.contact.email.sub")   },
        { icon: <PhoneIcon sx={{ fontSize: 24 }} />,    label: t("support.contact.phone.label"),   value: t("support.contact.phone.value"),   sub: t("support.contact.phone.sub")   },
        { icon: <LocationIcon sx={{ fontSize: 24 }} />, label: t("support.contact.address.label"), value: t("support.contact.address.value"), sub: t("support.contact.address.sub") },
    ];

    const faqs = (t("support.faqs", { returnObjects: true }) as { q: string; a: string }[]);

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: { xs: 3, md: 5 }, mt: 10 }}>
            <Container maxWidth="lg">

                <Box sx={{ mb: 8, textAlign: "center" }}>
                    <Box sx={{ background: gradients.primary, p: 2, borderRadius: 2, display: "inline-flex", mb: 3, boxShadow: `0 0 25px ${colors.primaryAlpha25}` }}>
                        <SupportIcon sx={{ color: "#FFFFFF", fontSize: 40 }} />
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 900, mb: 2, letterSpacing: "-1.5px" }}>
                        {t("support.title")}{" "}
                        <Box component="span" sx={{ background: gradients.textPrimary, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                            {t("support.titleSpan")}
                        </Box>
                    </Typography>
                    <Typography color="text.secondary" sx={{ fontSize: "16px" }}>{t("support.subtitle")}</Typography>
                </Box>

                <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4, alignItems: "stretch", mb: 6 }}>
                    <Box sx={{ flex: "1 1 60%", display: "flex" }}>
                        <Paper elevation={1} sx={{ p: 4, borderRadius: 4, width: "100%", display: "flex", flexDirection: "column", height: "100%", border: `1px solid ${colors.border}` }}>
                            <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>{t("support.formTitle")}</Typography>
                            {submitted && <Alert severity="success" sx={{ mb: 3 }}>{t("support.successMsg")}</Alert>}
                            {error     && <Alert severity="error"   sx={{ mb: 3 }} onClose={() => setError("")}>{error}</Alert>}
                            <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3, flex: 1 }}>
                                <DebouncedTextField label={t("support.email")}   type="email" value={formData.email}   onChange={handleChange("email")}   fullWidth required />
                                <DebouncedTextField label={t("support.subject")}              value={formData.subject} onChange={handleChange("subject")} fullWidth required />
                                <DebouncedTextField label={t("support.message")} value={formData.message} onChange={handleChange("message")} multiline fullWidth required
                                                    sx={{ flex: 1, "& .MuiOutlinedInput-root": { height: "100%", alignItems: "flex-start" }, "& textarea": { minHeight: "80px" } }} />
                                <Button type="submit" variant="contained" size="large" startIcon={<SendIcon />} disabled={loading} sx={{ py: 1.5, borderRadius: 2, fontSize: 16 }}>
                                    {loading ? "..." : t("support.send")}
                                </Button>
                            </Box>
                        </Paper>
                    </Box>

                    <Box sx={{ flex: "1 1 40%", display: "flex", flexDirection: "column", gap: 3 }}>
                        {contactItems.map((item, i) => (
                            <Card key={i} sx={{ flex: 1 }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                                        <Box sx={{ background: gradients.primary, p: 1.5, borderRadius: 2, display: "flex", color: "#FFFFFF" }}>{item.icon}</Box>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">{item.label}</Typography>
                                            <Typography variant="h6" fontWeight={700}>{item.value}</Typography>
                                        </Box>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">{item.sub}</Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                </Box>

                <Paper elevation={1} sx={{ p: { xs: 4, md: 6 }, borderRadius: 4, border: `1px solid ${colors.border}` }}>
                    <Box sx={{ textAlign: "center", mb: 6 }}>
                        <Typography variant="h4" fontWeight={900} sx={{ mb: 2, letterSpacing: "-1px" }}>
                            {t("support.faqTitle")}{" "}
                            <Box component="span" sx={{ background: gradients.textPrimary, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                {t("support.faqSpan")}
                            </Box>
                        </Typography>
                        <Typography color="text.secondary" sx={{ fontSize: "16px" }}>{t("support.faqSubtitle")}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {faqs.map((faq, i) => <FaqItem key={i} question={faq.q} answer={faq.a} />)}
                    </Box>
                </Paper>

            </Container>
        </Box>
    );
};

export default Support;