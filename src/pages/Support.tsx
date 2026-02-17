import { useState } from "react";
import {
    Box,
    Container,
    Typography,
    Paper,
    TextField,
    Button,
    Alert,
    Card,
    CardContent,
    Collapse,
    IconButton,
} from "@mui/material";
import {
    Support as SupportIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    LocationOn as LocationIcon,
    Send as SendIcon,
    Add as AddIcon,
    Remove as RemoveIcon,
} from "@mui/icons-material";

const faqs = [
    {
        question: "Cum pot să închiriez un apartament?",
        answer: "Răsfoiește anunțurile, selectează apartamentul dorit, apasă 'Vezi Detalii' și apoi 'Închiriază Acum'. Vei fi ghidat prin procesul de plată.",
    },
    {
        question: "Cum funcționează plata?",
        answer: "După selectarea apartamentului, vei fi redirecționat către pagina de plată unde poți completa detaliile. La final, vei primi automat contractul și nota de plată în format PDF.",
    },
    {
        question: "Pot anula o rezervare?",
        answer: "Da, poți anula o rezervare contactându-ne la support@rentora.com. Politica de anulare depinde de proprietar și de condițiile contractului.",
    },
    {
        question: "Cum adaug un apartament la favorite?",
        answer: "Pe pagina de anunțuri, apasă iconița de inimă de pe cardul apartamentului. Apartamentele favorite pot fi vizualizate în Dashboard-ul tău.",
    },
];

const FaqItem = ({ question, answer }: { question: string; answer: string }) => {
    const [open, setOpen] = useState(false);

    return (
        <Box
            sx={{
                border: "1px solid #e5e7eb",
                borderRadius: 3,
                overflow: "hidden",
                transition: "all 0.3s ease",
                background: open
                    ? "linear-gradient(135deg, rgba(37,99,235,0.03), rgba(124,58,237,0.03))"
                    : "white",
                "&:hover": {
                    borderColor: "#2563eb",
                    boxShadow: "0 4px 20px rgba(37,99,235,0.08)",
                },
            }}
        >
            <Box
                onClick={() => setOpen(!open)}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 3,
                    cursor: "pointer",
                    userSelect: "none",
                }}
            >
                <Typography fontWeight={700} fontSize={16} color="#1f2937">
                    {question}
                </Typography>
                <IconButton
                    size="small"
                    sx={{
                        background: open
                            ? "linear-gradient(135deg, #2563eb, #7c3aed)"
                            : "#f3f4f6",
                        color: open ? "white" : "#6b7280",
                        flexShrink: 0,
                        ml: 2,
                        transition: "all 0.3s ease",
                        "&:hover": {
                            background: open
                                ? "linear-gradient(135deg, #1d4ed8, #6d28d9)"
                                : "#e5e7eb",
                        },
                    }}
                >
                    {open ? <RemoveIcon fontSize="small" /> : <AddIcon fontSize="small" />}
                </IconButton>
            </Box>

            <Collapse in={open}>
                <Box sx={{ px: 3, pb: 3 }}>
                    <Typography variant="body2" color="text.secondary" lineHeight={1.8}>
                        {answer}
                    </Typography>
                </Box>
            </Collapse>
        </Box>
    );
};

const Support = () => {
    const [formData, setFormData] = useState({
        subject: '',
        message: '',
        email: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.email || !formData.subject || !formData.message) {
            setError('Toate câmpurile sunt obligatorii');
            return;
        }

        console.log('Support request:', formData);
        setSubmitted(true);
        setFormData({ subject: '', message: '', email: '' });
        setError('');

        setTimeout(() => setSubmitted(false), 5000);
    };

    const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
        if (error) setError('');
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #f8f9fa 0%, #f0f4ff 100%)",
                py: { xs: 3, md: 5 },
                mt: 10,
            }}
        >
            <Container maxWidth="lg">
                {/* Header */}
                <Box sx={{ mb: 6, textAlign: "center" }}>
                    <Box
                        sx={{
                            background: "linear-gradient(135deg, #2563eb, #4f46e5, #7c3aed)",
                            p: 2,
                            borderRadius: 2,
                            display: "inline-flex",
                            mb: 2,
                        }}
                    >
                        <SupportIcon sx={{ color: "white", fontSize: 40 }} />
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
                        Suport & Contact
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Ai întrebări? Suntem aici să te ajutăm!
                    </Typography>
                </Box>

                {/* Top Row — Form left, Cards right, same height */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: 4,
                        alignItems: 'stretch',
                        mb: 4,
                    }}
                >
                    {/* Left — Contact Form stretches to match right column */}
                    <Box sx={{ flex: "1 1 60%", display: "flex" }}>
                        <Paper
                            sx={{
                                p: 4,
                                borderRadius: 3,
                                width: "100%",
                                display: "flex",
                                flexDirection: "column",
                                height: "100%", 
                            }}
                        >
                            <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
                                Trimite-ne un mesaj
                            </Typography>

                            {submitted && (
                                <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                                    Mesajul tău a fost trimis cu succes! Vom răspunde în cel mai scurt timp posibil.
                                </Alert>
                            )}

                            {error && (
                                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError('')}>
                                    {error}
                                </Alert>
                            )}

                            <Box
                                component="form"
                                onSubmit={handleSubmit}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 3,
                                    flex: 1,
                                }}
                            >
                                <TextField
                                    label="Email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange('email')}
                                    fullWidth
                                    required
                                />

                                <TextField
                                    label="Subiect"
                                    value={formData.subject}
                                    onChange={handleChange('subject')}
                                    fullWidth
                                    required
                                />

                                {/* Message field grows to fill all remaining space */}
                                <TextField
                                    label="Mesaj"
                                    value={formData.message}
                                    onChange={handleChange('message')}
                                    multiline
                                    fullWidth
                                    required
                                    sx={{
                                        flex: 1,
                                        '& .MuiInputBase-root': {
                                            height: '100%',
                                            alignItems: 'flex-start',
                                        },
                                        '& textarea': {
                                            minHeight: '80px',
                                        },
                                    }}
                                />

                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    startIcon={<SendIcon />}
                                    sx={{
                                        background: "linear-gradient(90deg, #2563eb, #4f46e5, #7c3aed)",
                                        py: 1.5,
                                        borderRadius: 2,
                                        fontWeight: 700,
                                    }}
                                >
                                    Trimite Mesaj
                                </Button>
                            </Box>
                        </Paper>
                    </Box>

                    {/* Right — Three contact cards stacked */}
                    <Box
                        sx={{
                            flex: "1 1 40%",
                            display: "flex",
                            flexDirection: "column",
                            gap: 3,
                            alignSelf: "stretch",
                            minHeight: 0,
                        }}
                    >
                        {/* Email Card */}
                        <Card sx={{ borderRadius: 3, flex: 1, display: "flex" }}>
                            <CardContent sx={{ p: 3, flex: 1 }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                                    <Box
                                        sx={{
                                            background: "linear-gradient(135deg, #2563eb, #4f46e5)",
                                            p: 1.5,
                                            borderRadius: 2,
                                            display: "flex",
                                        }}
                                    >
                                        <EmailIcon sx={{ color: "white", fontSize: 24 }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">
                                            Email
                                        </Typography>
                                        <Typography variant="h6" fontWeight={700}>
                                            support@rentora.com
                                        </Typography>
                                    </Box>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                    Răspundem în maxim 24 ore
                                </Typography>
                            </CardContent>
                        </Card>

                        {/* Phone Card */}
                        <Card sx={{ borderRadius: 3, flex: 1, display: "flex" }}>
                            <CardContent sx={{ p: 3, flex: 1 }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                                    <Box
                                        sx={{
                                            background: "linear-gradient(135deg, #10b981, #059669)",
                                            p: 1.5,
                                            borderRadius: 2,
                                            display: "flex",
                                        }}
                                    >
                                        <PhoneIcon sx={{ color: "white", fontSize: 24 }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">
                                            Telefon
                                        </Typography>
                                        <Typography variant="h6" fontWeight={700}>
                                            +373 (60) 123-456
                                        </Typography>
                                    </Box>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                    Luni - Vineri, 9:00 - 18:00
                                </Typography>
                            </CardContent>
                        </Card>

                        {/* Address Card */}
                        <Card sx={{ borderRadius: 3, flex: 1, display: "flex", minHeight: 0 }}>
                            <CardContent sx={{ p: 3, flex: 1 }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                                    <Box
                                        sx={{
                                            background: "linear-gradient(135deg, #f59e0b, #d97706)",
                                            p: 1.5,
                                            borderRadius: 2,
                                            display: "flex",
                                        }}
                                    >
                                        <LocationIcon sx={{ color: "white", fontSize: 24 }} />
                                    </Box>

                                    <Box>
                                        <Typography variant="body2" color="text.secondary">
                                            Adresă
                                        </Typography>
                                        <Typography variant="h6" fontWeight={700}>
                                            Str. Stefan cel Mare 1
                                        </Typography>
                                    </Box>
                                </Box>

                                <Typography variant="body2" color="text.secondary">
                                    Chișinău, Moldova MD-2001
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>
                </Box>
                
                {/* Bottom — FAQ full-width floating card */}
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 3, md: 5 },
                        borderRadius: 4,
                        border: "1px solid #e5e7eb",
                        boxShadow: "0 20px 60px rgba(37, 99, 235, 0.08)",
                    }}
                >
                    <Box sx={{ textAlign: "center", mb: 4 }}>
                        <Typography
                            variant="h4"
                            fontWeight={900}
                            sx={{
                                mb: 1,
                                background: "linear-gradient(90deg, #2563eb, #4f46e5, #7c3aed)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            Întrebări Frecvente
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Găsește răspunsuri la cele mai comune întrebări despre Rentora
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {faqs.map((faq, index) => (
                            <FaqItem key={index} question={faq.question} answer={faq.answer} />
                        ))}
                    </Box>
                </Paper>

            </Container>
        </Box>
    );
};

export default Support;
