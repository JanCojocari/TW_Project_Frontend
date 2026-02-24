import { Box, Button, Container, Paper, TextField, Typography, Tabs, Tab, Stack } from "@mui/material";
import ApartmentIcon from "@mui/icons-material/Apartment";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.tsx";
import { useState } from "react";
import { gradients, colors } from "../theme/gradients.ts";


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
                elevation={2}
                sx={{
                    p: 6,
                    borderRadius: 6,
                    border: `1px solid ${colors.border}`,
                }}
            >
                {/* Logo Rentora */}
                <Box display="flex" alignItems="center" justifyContent={"center"} gap={1.5} mb={5}>
                    <Box
                        sx={{
                            background: gradients.primary,
                            p: 1.5,
                            borderRadius: 2.5,
                            boxShadow: `0 4px 14px ${colors.primaryAlpha25}`,
                        }}
                    >
                        <ApartmentIcon sx={{ color: "#FFFFFF", fontSize: 30 }}
                        />
                    </Box>
                    <Typography
                        variant="h4"
                        fontWeight={900}
                        sx={{
                            letterSpacing: "-1px",
                            background: gradients.textPrimary,
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
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
                        borderBottom: `1px solid ${colors.border}` }}
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
                    sx={{ letterSpacing: "-0.5px" }}

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
                    />

                    <Button
                        fullWidth
                        size="large"
                        variant="contained"
                        sx={{ mt: 1, py: 1.8, borderRadius: 3, fontSize: "16px" }}
                        onClick={handleSubmit}
                    >
                        Conectează-te acum
                    </Button>
                </Stack>

                <Typography
                    align="center"
                    mt={5}
                    fontSize={14}
                    color="text.secondary"
                >
                    Nu ai un cont valid? 
                    <Box
                    component="span"
                    onClick={() => navigate("/register")}
                    sx={{
                        color: "primary.main",
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