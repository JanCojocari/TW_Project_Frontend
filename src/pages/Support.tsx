import { useState } from "react";
import { Box, Container, Typography, Paper, TextField, Button, Alert, Card, CardContent, Collapse, IconButton } from "@mui/material";
import {
    Support as SupportIcon, Email as EmailIcon, Phone as PhoneIcon,
    LocationOn as LocationIcon, Send as SendIcon, Add as AddIcon, Remove as RemoveIcon,
} from "@mui/icons-material";
import { gradients, colors } from "../theme/gradients.ts";

const faqs = [
    { question: "Cum pot să închiriez un apartament?",  answer: "Răsfoiește anunțurile, selectează apartamentul dorit, apasă 'Vezi Detalii' și apoi 'Închiriază Acum'. Vei fi ghidat prin procesul de plată." },
    { question: "Cum funcționează plata?",              answer: "După selectarea apartamentului, vei fi redirecționat către pagina de plată. La final, vei primi automat contractul și nota de plată în format PDF." },
    { question: "Pot anula o rezervare?",               answer: "Da, poți anula o rezervare contactându-ne la support@rentora.com. Politica de anulare depinde de proprietar și de condițiile contractului." },
    { question: "Cum adaug un apartament la favorite?", answer: "Pe pagina de anunțuri, apasă iconița de inimă de pe cardul apartamentului. Apartamentele favorite pot fi vizualizate în Dashboard-ul tău." },
];

const FaqItem = ({ question, answer }: { question: string; answer: string }) => {
    const [open, setOpen] = useState(false);

    return (
        <Box
            sx={{
                border:       `1px solid ${colors.border}`,
                borderRadius: 3,
                overflow:     "hidden",
                transition:   "all 0.3s ease",
                bgcolor:      open ? colors.primaryAlpha06 : "background.paper",
                "&:hover": {
                    borderColor: "primary.main",
                    boxShadow:   `0 4px 20px ${colors.primaryAlpha10}`,
                },
            }}
        >
            <Box
                onClick={() => setOpen(!open)}
                sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 3, cursor: "pointer", userSelect: "none" }}
            >
                <Typography fontWeight={700} fontSize={16} color="text.primary">{question}</Typography>
                <IconButton
                    size="small"
                    sx={{
                        background: open ? gradients.primary : colors.primaryAlpha10,
                        color:      open ? "#FFFFFF" : "text.secondary",
                        flexShrink: 0,
                        ml:         2,
                        transition: "all 0.3s ease",
                        "&:hover":  { background: open ? gradients.primaryHover : colors.primaryAlpha15 },
                    }}
                >
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

const contactItems = [
    { icon: <EmailIcon sx={{ fontSize: 24 }} />, label: "Email",   value: "support@rentora.com",  sub: "Răspundem în maxim 24 ore" },
    { icon: <PhoneIcon sx={{ fontSize: 24 }} />, label: "Telefon", value: "+373 (60) 123-456",    sub: "Luni - Vineri, 9:00 - 18:00" },
    { icon: <LocationIcon sx={{ fontSize: 24 }} />,label:"Adresă", value: "Str. Stefan cel Mare 1",sub: "Chișinău, Moldova MD-2001" },
];

const Support = () => {
    const [formData, setFormData] = useState({ subject: "", message: "", email: "" });
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.email || !formData.subject || !formData.message) { setError("Toate câmpurile sunt obligatorii"); return; }
        setSubmitted(true);
        setFormData({ subject: "", message: "", email: "" });
        setError("");
        setTimeout(() => setSubmitted(false), 5000);
    };

    const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));
        if (error) setError("");
    };

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: { xs: 3, md: 5 }, mt: 10 }}>
            <Container maxWidth="lg">

                {/* Header */}
                <Box sx={{ mb: 8, textAlign: "center" }}>
                    <Box sx={{ background: gradients.primary, p: 2, borderRadius: 2, display: "inline-flex", mb: 3, boxShadow: `0 0 25px ${colors.primaryAlpha25}` }}>
                        <SupportIcon sx={{ color: "#FFFFFF", fontSize: 40 }} />
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 900, mb: 2, letterSpacing: "-1.5px" }}>
                        Suport &{" "}
                        <Box component="span" sx={{ background: gradients.textPrimary, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Contact</Box>
                    </Typography>
                    <Typography color="text.secondary" sx={{ fontSize: "16px" }}>Ai întrebări? Suntem aici să te ajutăm!</Typography>
                </Box>

                {/* Top row */}
                <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4, alignItems: "stretch", mb: 6 }}>

                    {/* Contact Form */}
                    <Box sx={{ flex: "1 1 60%", display: "flex" }}>
                        <Paper
                            elevation={1}
                            sx={{ p: 4, borderRadius: 4, width: "100%", display: "flex", flexDirection: "column", height: "100%", border: `1px solid ${colors.border}` }}
                        >
                            <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>Trimite-ne un mesaj</Typography>

                            {submitted && <Alert severity="success" sx={{ mb: 3 }}>Mesajul tău a fost trimis cu succes! Vom răspunde în cel mai scurt timp posibil.</Alert>}
                            {error     && <Alert severity="error"   sx={{ mb: 3 }} onClose={() => setError("")}>{error}</Alert>}

                            <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3, flex: 1 }}>
                                <TextField label="Email"   type="email" value={formData.email}   onChange={handleChange("email")}   fullWidth required />
                                <TextField label="Subiect"             value={formData.subject} onChange={handleChange("subject")} fullWidth required />
                                <TextField
                                    label="Mesaj"
                                    value={formData.message}
                                    onChange={handleChange("message")}
                                    multiline fullWidth required
                                    sx={{ flex: 1, "& .MuiOutlinedInput-root": { height: "100%", alignItems: "flex-start" }, "& textarea": { minHeight: "80px" } }}
                                />
                                <Button type="submit" variant="contained" size="large" startIcon={<SendIcon />} sx={{ py: 1.5, borderRadius: 2, fontSize: 16 }}>
                                    Trimite Mesaj
                                </Button>
                            </Box>
                        </Paper>
                    </Box>

                    {/* Contact cards */}
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

                {/* FAQ */}
                <Paper elevation={1} sx={{ p: { xs: 4, md: 6 }, borderRadius: 4, border: `1px solid ${colors.border}` }}>
                    <Box sx={{ textAlign: "center", mb: 6 }}>
                        <Typography variant="h4" fontWeight={900} sx={{ mb: 2, letterSpacing: "-1px" }}>
                            Întrebări{" "}
                            <Box component="span" sx={{ background: gradients.textPrimary, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Frecvente</Box>
                        </Typography>
                        <Typography color="text.secondary" sx={{ fontSize: "16px" }}>Găsește răspunsuri la cele mai comune întrebări despre Rentora</Typography>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {faqs.map((faq, i) => <FaqItem key={i} question={faq.question} answer={faq.answer} />)}
                    </Box>
                </Paper>

            </Container>
        </Box>
    );
};

export default Support;