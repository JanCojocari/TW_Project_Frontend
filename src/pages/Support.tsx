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
                border: "1px solid #12383D",
                borderRadius: 3,
                overflow: "hidden",
                transition: "all 0.3s ease",
                background: open
                    ? "linear-gradient(135deg, rgba(0, 224, 198, 0.03), rgba(0, 224, 198, 0.05))"
                    : "#0C2529",
                "&:hover": {
                    borderColor: "#00E0C6",
                    boxShadow: "0 4px 20px rgba(0, 224, 198, 0.1)",
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
                <Typography fontWeight={700} fontSize={16} sx={{ color: "#E6F7F5" }}>
                    {question}
                </Typography>
                <IconButton
                    size="small"
                    sx={{
                        background: open
                            ? "linear-gradient(135deg, #00E0C6, #00BFA6)"
                            : "#12383D",
                        color: open ? "#071A1D" : "#8FB5B1",
                        flexShrink: 0,
                        ml: 2,
                        transition: "all 0.3s ease",
                        "&:hover": {
                            background: open
                                ? "linear-gradient(135deg, #00FFF0, #00E0C6)"
                                : "#1a454a",
                        },
                    }}
                >
                    {open ? <RemoveIcon fontSize="small" /> : <AddIcon fontSize="small" />}
                </IconButton>
            </Box>

            <Collapse in={open}>
                <Box sx={{ px: 3, pb: 3 }}>
                    <Typography
                        variant="body2"
                        sx={{ color: "#8FB5B1", lineHeight: 1.8 }}
                    >
                        {answer}
                    </Typography>
                </Box>
            </Collapse>
        </Box>
    );
};

const Support = () => {
    const [formData, setFormData] = useState({
        subject: "",
        message: "",
        email: "",
    });
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.email || !formData.subject || !formData.message) {
            setError("Toate câmpurile sunt obligatorii");
            return;
        }

        console.log("Support request:", formData);
        setSubmitted(true);
        setFormData({ subject: "", message: "", email: "" });
        setError("");

        setTimeout(() => setSubmitted(false), 5000);
    };

    const handleChange =
        (field: string) =>
            (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                setFormData((prev) => ({ ...prev, [field]: e.target.value }));
                if (error) setError("");
            };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: "#071A1D",
                py: { xs: 3, md: 5 },
                mt: 10,
            }}
        >
            <Container maxWidth="lg">
                {/* Header */}
                <Box sx={{ mb: 8, textAlign: "center" }}>
                    <Box
                        sx={{
                            background: "linear-gradient(135deg, #00E0C6, #00BFA6)",
                            p: 2,
                            borderRadius: 2,
                            display: "inline-flex",
                            mb: 3,
                            boxShadow: "0 0 25px rgba(0, 224, 198, 0.3)",
                        }}
                    >
                        <SupportIcon sx={{ color: "#071A1D", fontSize: 40 }} />
                    </Box>
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 900,
                            mb: 2,
                            color: "#E6F7F5",
                            letterSpacing: "-1.5px",
                        }}
                    >
                        Suport & <Box component="span" sx={{ color: "#00E0C6" }}>Contact</Box>
                    </Typography>
                    <Typography sx={{ color: "#8FB5B1", fontSize: "16px" }}>
                        Ai întrebări? Suntem aici să te ajutăm!
                    </Typography>
                </Box>

                {/* Top Row — Form left, Cards right */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        gap: 4,
                        alignItems: "stretch",
                        mb: 6,
                    }}
                >
                    {/* Left — Contact Form */}
                    <Box sx={{ flex: "1 1 60%", display: "flex" }}>
                        <Paper
                            sx={{
                                p: 4,
                                borderRadius: 4,
                                width: "100%",
                                display: "flex",
                                flexDirection: "column",
                                height: "100%",
                                background: "#0F2F34",
                                border: "1px solid #12383D",
                            }}
                        >
                            <Typography
                                variant="h5"
                                fontWeight={700}
                                sx={{ mb: 3, color: "#E6F7F5" }}
                            >
                                Trimite-ne un mesaj
                            </Typography>

                            {submitted && (
                                <Alert
                                    severity="success"
                                    sx={{
                                        mb: 3,
                                        borderRadius: 2,
                                        background: "rgba(34, 227, 164, 0.1)",
                                        color: "#22E3A4",
                                        "& .MuiAlert-icon": { color: "#22E3A4" },
                                    }}
                                >
                                    Mesajul tău a fost trimis cu succes! Vom răspunde în cel mai scurt timp posibil.
                                </Alert>
                            )}

                            {error && (
                                <Alert
                                    severity="error"
                                    sx={{
                                        mb: 3,
                                        borderRadius: 2,
                                        background: "rgba(255, 77, 109, 0.1)",
                                        color: "#FF4D6D",
                                        "& .MuiAlert-icon": { color: "#FF4D6D" },
                                    }}
                                    onClose={() => setError("")}
                                >
                                    {error}
                                </Alert>
                            )}

                            <Box
                                component="form"
                                onSubmit={handleSubmit}
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 3,
                                    flex: 1,
                                }}
                            >
                                <TextField
                                    label="Email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange("email")}
                                    fullWidth
                                    required
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            color: "#E6F7F5",
                                            "& fieldset": { borderColor: "#12383D" },
                                            "&:hover fieldset": { borderColor: "#00E0C6" },
                                            "&.Mui-focused fieldset": {
                                                borderColor: "#00E0C6",
                                            },
                                        },
                                        "& .MuiInputBase-input::placeholder": {
                                            color: "#5C7A77",
                                            opacity: 1,
                                        },
                                        "& .MuiInputLabel-root": {
                                            color: "#8FB5B1",
                                            "&.Mui-focused": { color: "#00E0C6" },
                                        },
                                    }}
                                />

                                <TextField
                                    label="Subiect"
                                    value={formData.subject}
                                    onChange={handleChange("subject")}
                                    fullWidth
                                    required
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            color: "#E6F7F5",
                                            "& fieldset": { borderColor: "#12383D" },
                                            "&:hover fieldset": { borderColor: "#00E0C6" },
                                            "&.Mui-focused fieldset": {
                                                borderColor: "#00E0C6",
                                            },
                                        },
                                        "& .MuiInputBase-input::placeholder": {
                                            color: "#5C7A77",
                                            opacity: 1,
                                        },
                                        "& .MuiInputLabel-root": {
                                            color: "#8FB5B1",
                                            "&.Mui-focused": { color: "#00E0C6" },
                                        },
                                    }}
                                />

                                {/* Message field grows to fill remaining space */}
                                <TextField
                                    label="Mesaj"
                                    value={formData.message}
                                    onChange={handleChange("message")}
                                    multiline
                                    fullWidth
                                    required
                                    sx={{
                                        flex: 1,
                                        "& .MuiOutlinedInput-root": {
                                            color: "#E6F7F5",
                                            height: "100%",
                                            alignItems: "flex-start",
                                            "& fieldset": { borderColor: "#12383D" },
                                            "&:hover fieldset": { borderColor: "#00E0C6" },
                                            "&.Mui-focused fieldset": {
                                                borderColor: "#00E0C6",
                                            },
                                        },
                                        "& .MuiInputBase-input::placeholder": {
                                            color: "#5C7A77",
                                            opacity: 1,
                                        },
                                        "& .MuiInputLabel-root": {
                                            color: "#8FB5B1",
                                            "&.Mui-focused": { color: "#00E0C6" },
                                        },
                                        "& textarea": {
                                            minHeight: "80px",
                                        },
                                    }}
                                />

                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    startIcon={<SendIcon />}
                                    sx={{
                                        background: "linear-gradient(90deg, #00E0C6, #00BFA6)",
                                        color: "#071A1D",
                                        py: 1.5,
                                        borderRadius: 2,
                                        fontWeight: 700,
                                        fontSize: 16,
                                        boxShadow: "0 0 15px rgba(0, 224, 198, 0.2)",
                                        "&:hover": {
                                            background: "linear-gradient(90deg, #00FFF0, #00E0C6)",
                                            boxShadow: "0 0 25px rgba(0, 224, 198, 0.4)",
                                            transform: "translateY(-2px)",
                                        },
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
                        <Card
                            sx={{
                                borderRadius: 4,
                                flex: 1,
                                display: "flex",
                                background: "#0C2529",
                                border: "1px solid #12383D",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    borderColor: "#00E0C6",
                                    boxShadow: "0 10px 30px rgba(0, 224, 198, 0.1)",
                                },
                            }}
                        >
                            <CardContent sx={{ p: 3, flex: 1 }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                                    <Box
                                        sx={{
                                            background: "linear-gradient(135deg, #00E0C6, #00BFA6)",
                                            p: 1.5,
                                            borderRadius: 2,
                                            display: "flex",
                                        }}
                                    >
                                        <EmailIcon sx={{ color: "#071A1D", fontSize: 24 }} />
                                    </Box>
                                    <Box>
                                        <Typography
                                            variant="body2"
                                            sx={{ color: "#5C7A77" }}
                                        >
                                            Email
                                        </Typography>
                                        <Typography
                                            variant="h6"
                                            fontWeight={700}
                                            sx={{ color: "#E6F7F5" }}
                                        >
                                            support@rentora.com
                                        </Typography>
                                    </Box>
                                </Box>
                                <Typography
                                    variant="body2"
                                    sx={{ color: "#8FB5B1" }}
                                >
                                    Răspundem în maxim 24 ore
                                </Typography>
                            </CardContent>
                        </Card>

                        {/* Phone Card */}
                        <Card
                            sx={{
                                borderRadius: 4,
                                flex: 1,
                                display: "flex",
                                background: "#0C2529",
                                border: "1px solid #12383D",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    borderColor: "#00E0C6",
                                    boxShadow: "0 10px 30px rgba(0, 224, 198, 0.1)",
                                },
                            }}
                        >
                            <CardContent sx={{ p: 3, flex: 1 }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                                    <Box
                                        sx={{
                                            background: "linear-gradient(135deg, #00E0C6, #00BFA6)",
                                            p: 1.5,
                                            borderRadius: 2,
                                            display: "flex",
                                        }}
                                    >
                                        <PhoneIcon sx={{ color: "#071A1D", fontSize: 24 }} />
                                    </Box>
                                    <Box>
                                        <Typography
                                            variant="body2"
                                            sx={{ color: "#5C7A77" }}
                                        >
                                            Telefon
                                        </Typography>
                                        <Typography
                                            variant="h6"
                                            fontWeight={700}
                                            sx={{ color: "#E6F7F5" }}
                                        >
                                            +373 (60) 123-456
                                        </Typography>
                                    </Box>
                                </Box>
                                <Typography
                                    variant="body2"
                                    sx={{ color: "#8FB5B1" }}
                                >
                                    Luni - Vineri, 9:00 - 18:00
                                </Typography>
                            </CardContent>
                        </Card>

                        {/* Address Card */}
                        <Card
                            sx={{
                                borderRadius: 4,
                                flex: 1,
                                display: "flex",
                                minHeight: 0,
                                background: "#0C2529",
                                border: "1px solid #12383D",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    borderColor: "#00E0C6",
                                    boxShadow: "0 10px 30px rgba(0, 224, 198, 0.1)",
                                },
                            }}
                        >
                            <CardContent sx={{ p: 3, flex: 1 }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                                    <Box
                                        sx={{
                                            background: "linear-gradient(135deg, #00E0C6, #00BFA6)",
                                            p: 1.5,
                                            borderRadius: 2,
                                            display: "flex",
                                        }}
                                    >
                                        <LocationIcon sx={{ color: "#071A1D", fontSize: 24 }} />
                                    </Box>

                                    <Box>
                                        <Typography
                                            variant="body2"
                                            sx={{ color: "#5C7A77" }}
                                        >
                                            Adresă
                                        </Typography>
                                        <Typography
                                            variant="h6"
                                            fontWeight={700}
                                            sx={{ color: "#E6F7F5" }}
                                        >
                                            Str. Stefan cel Mare 1
                                        </Typography>
                                    </Box>
                                </Box>

                                <Typography
                                    variant="body2"
                                    sx={{ color: "#8FB5B1" }}
                                >
                                    Chișinău, Moldova MD-2001
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>
                </Box>

                {/* Bottom — FAQ full-width card */}
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 4, md: 6 },
                        borderRadius: 4,
                        border: "1px solid #12383D",
                        background: "#0F2F34",
                        boxShadow: "0 20px 60px rgba(0, 224, 198, 0.08)",
                    }}
                >
                    <Box sx={{ textAlign: "center", mb: 6 }}>
                        <Typography
                            variant="h4"
                            fontWeight={900}
                            sx={{
                                mb: 2,
                                color: "#E6F7F5",
                                letterSpacing: "-1px",
                            }}
                        >
                            Întrebări <Box component="span" sx={{ color: "#00E0C6" }}>Frecvente</Box>
                        </Typography>
                        <Typography sx={{ color: "#8FB5B1", fontSize: "16px" }}>
                            Găsește răspunsuri la cele mai comune întrebări despre Rentora
                        </Typography>
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {faqs.map((faq, index) => (
                            <FaqItem
                                key={index}
                                question={faq.question}
                                answer={faq.answer}
                            />
                        ))}
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default Support;