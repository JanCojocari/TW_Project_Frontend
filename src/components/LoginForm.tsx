import { Box, Button, Container, Paper, TextField, Typography, Tabs, Tab, Stack } from "@mui/material";
import ApartmentIcon from "@mui/icons-material/Apartment";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.tsx";
import { useState } from "react";

const LoginForm = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [userType, setUserType] = useState<'proprietar' | 'chirias'>('proprietar');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ email?: string, password?: string }>({});

    const handleTabChange = (e: React.SyntheticEvent, newValue: 'proprietar' | 'chirias') => {
        e.preventDefault();
        setUserType(newValue);
    };

    const validateForm = () => {
        const newErrors: { email?: string, password?: string } = {};

        // Validare email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            newErrors.email = 'Email-ul este obligatoriu';
        } else if (!emailRegex.test(email)) {
            newErrors.email = 'Email invalid';
        }

        // Validare parolă
        if (!password.trim()) {
            newErrors.password = 'Parola este obligatorie';
        } else if (password.length < 6) {
            newErrors.password = 'Parola trebuie să aibă minimum 6 caractere';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            login();
            navigate("/home");
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper
                elevation={0}
                sx={{
                    p: 6,
                    borderRadius: 8,
                    background: "#0F2F34",
                    border: "1px solid #12383D",
                    boxShadow: "0 40px 100px rgba(0, 0, 0, 0.6)",
                }}
            >
                {/* Logo Rentora */}
                <Box display="flex" alignItems="center" justifyContent={"center"} gap={1.5} mb={5}>
                    <Box
                        sx={{
                            background: "rgba(0, 224, 198, 0.1)",
                            p: 1.5,
                            borderRadius: 2.5,
                            border: "1px solid rgba(0, 224, 198, 0.2)",
                        }}
                    >
                        <ApartmentIcon sx={{ color: "#00E0C6", fontSize: 32 }} />
                    </Box>
                    <Typography
                        variant="h4"
                        fontWeight={900}
                        sx={{
                            color: "#E6F7F5",
                            letterSpacing: "-1px",
                        }}
                    >
                        Rentora
                    </Typography>
                </Box>

                {/* Tabs pentru selectare tip utilizator */}
                <Tabs
                    value={userType}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    sx={{
                        mb: 4,
                        borderBottom: "1px solid #12383D",
                        "& .MuiTab-root": {
                            textTransform: "none",
                            fontWeight: 800,
                            fontSize: 15,
                            color: "#5C7A77",
                            pb: 2,
                            "&.Mui-selected": {
                                color: "#00E0C6",
                            },
                        },
                        "& .MuiTabs-indicator": {
                            background: "#00E0C6",
                            height: 3,
                            borderRadius: "3px 3px 0 0",
                            boxShadow: "0 0 10px rgba(0, 224, 198, 0.5)",
                        },
                    }}
                >
                    <Tab label="Proprietari" value="proprietar" />
                    <Tab label="Chiriași" value="chirias" />
                </Tabs>

                <Typography
                    display={"flex"}
                    justifyContent={"center"}
                    variant="h5"
                    fontWeight={900}
                    mb={4}
                    sx={{ color: "#E6F7F5", letterSpacing: "-0.5px" }}
                >
                    {userType === 'proprietar' ? 'Portal Proprietar' : 'Portal Chiriaș'}
                </Typography>

                <Stack spacing={2.5}>
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (errors.email) setErrors({ ...errors, email: undefined });
                        }}
                        error={!!errors.email}
                        helperText={errors.email}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                color: "#E6F7F5",
                                background: "#0C2529",
                                borderRadius: 3,
                                "& fieldset": { borderColor: "#12383D" },
                                "&:hover fieldset": { borderColor: "#00E0C6" },
                                "&.Mui-focused fieldset": { borderColor: "#00E0C6" }
                            },
                            "& .MuiInputLabel-root": { color: "#5C7A77" },
                            "& .MuiInputLabel-root.Mui-focused": { color: "#00E0C6" }
                        }}
                    />

                    <TextField
                        label="Parolă"
                        type="password"
                        fullWidth
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            if (errors.password) setErrors({ ...errors, password: undefined });
                        }}
                        error={!!errors.password}
                        helperText={errors.password}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                color: "#E6F7F5",
                                background: "#0C2529",
                                borderRadius: 3,
                                "& fieldset": { borderColor: "#12383D" },
                                "&:hover fieldset": { borderColor: "#00E0C6" },
                                "&.Mui-focused fieldset": { borderColor: "#00E0C6" }
                            },
                            "& .MuiInputLabel-root": { color: "#5C7A77" },
                            "& .MuiInputLabel-root.Mui-focused": { color: "#00E0C6" }
                        }}
                    />

                    <Button
                        fullWidth
                        size="large"
                        variant="contained"
                        sx={{
                            mt: 2,
                            py: 2,
                            borderRadius: 3,
                            fontWeight: 900,
                            fontSize: "16px",
                            textTransform: "none",
                            background: "linear-gradient(90deg, #00E0C6, #00BFA6)",
                            color: "#071A1D",
                            boxShadow: "0 0 20px rgba(0, 224, 198, 0.3)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                                transform: "translateY(-3px)",
                                boxShadow: "0 0 30px rgba(0, 224, 198, 0.5)",
                                background: "linear-gradient(90deg, #00FFF0, #00E0C6)",
                            }
                        }}
                        onClick={handleSubmit}
                    >
                        Conectează-te acum
                    </Button>
                </Stack>

                <Typography
                    align="center"
                    mt={5}
                    fontSize={14}
                    sx={{ color: "#8FB5B1", fontWeight: 500 }}
                >
                    Nu ai un cont valid? <Box
                    component="span"
                    onClick={() => navigate("/register")}
                    sx={{
                        color: "#00E0C6",
                        cursor: "pointer",
                        fontWeight: 800,
                        ml: 0.5,
                        "&:hover": { textDecoration: "underline" }
                    }}
                >
                    Creează cont
                </Box>
                </Typography>
            </Paper>
        </Container>
    );
};

export default LoginForm;