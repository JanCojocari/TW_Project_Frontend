// pages/Register.tsx
import { Box, Button, Container, Paper, TextField, Typography, MenuItem, Stack } from "@mui/material";
import ApartmentIcon from "@mui/icons-material/Apartment";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useState } from "react";
import { type Dayjs } from "dayjs";
import { gradients, colors } from "../theme/gradients.ts";

import { useAxios } from "../api/AxiosContext.tsx";
import type {AxiosError} from "axios";   // ← important

const Register = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
        const axios = useAxios();                       // ← folosești contextul

    // State pentru formular
    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        gender: "",
    });

    const [birthday, setBirthday] = useState<Dayjs | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleRegister = async () => {
        setError(null);

        // Validări simple
        if (formData.password !== formData.confirmPassword) {
            setError("Parolele nu coincid!");
            return;
        }

        if (!birthday) {
            setError("Data nașterii este obligatorie!");
            return;
        }

        const payload = {
            name: formData.name,
            surname: formData.surname,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            birthday: birthday.format("YYYY-MM-DD"),
            gender: formData.gender,
        };

        setLoading(true);

        try {
            await axios.post("/auth/register", payload);

            navigate("/login");
        } catch (err: AxiosError<{ message?: string }>) {
            const message = err?.response?.data?.message || err?.message || "A apărut o eroare la înregistrare";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{
                pt: 15, pb: 10, minHeight: "100vh", bgcolor: "background.default",
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative", overflow: "hidden",
            }}>
                {/* Background Accent */}
                <Box sx={{ position: "absolute", top: "-10%", right: "-5%", width: "40%", height: "40%", background: `radial-gradient(circle, ${colors.primaryAlpha10} 0%, transparent 70%)`, zIndex: 0 }} />

                <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
                    <Paper elevation={2} sx={{ p: 6, borderRadius: 6, border: `1px solid ${colors.border}` }}>

                        {/* Logo */}
                        <Box display="flex" alignItems="center" justifyContent="center" gap={1.5} mb={5}>
                            <Box sx={{ background: gradients.primary, p: 1.5, borderRadius: 2.5, boxShadow: `0 4px 14px ${colors.primaryAlpha25}` }}>
                                <ApartmentIcon sx={{ color: "#FFFFFF", fontSize: 30 }} />
                            </Box>
                            <Typography variant="h4" fontWeight={900} sx={{ letterSpacing: "-1px", background: gradients.textPrimary, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                Rentora
                            </Typography>
                        </Box>

                        <Typography display="flex" justifyContent="center" variant="h5" fontWeight={900} mb={5} sx={{ letterSpacing: "-0.5px" }}>
                            {t("auth.register.title")}
                        </Typography>

                        <Stack spacing={2.5}>
                            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2.5 }}>
                                <TextField
                                    name="name"
                                    label={t("auth.register.name")}
                                    value={formData.name}
                                    onChange={handleChange}
                                    fullWidth required
                                />
                                <TextField
                                    name="surname"
                                    label={t("auth.register.surname")}
                                    value={formData.surname}
                                    onChange={handleChange}
                                    fullWidth required
                                />
                            </Box>

                            <TextField
                                name="email"
                                label={t("auth.register.email")}
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                fullWidth required
                            />
                            <TextField
                                name="phone"
                                label={t("auth.register.phone")}
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                fullWidth required
                            />

                            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2.5 }}>
                                <DatePicker
                                    label={t("auth.register.birthday")}
                                    value={birthday}
                                    onChange={(d) => setBirthday(d)}
                                    disableFuture
                                    slotProps={{
                                        textField: { fullWidth: true, required: true },
                                        popper: { sx: { zIndex: 1400 } },
                                    }}
                                />
                                <TextField
                                    name="gender"
                                    select
                                    label={t("auth.register.gender")}
                                    value={formData.gender}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                >
                                    <MenuItem value="">{t("auth.register.genderDefault")}</MenuItem>
                                    <MenuItem value="M">{t("auth.register.genderMale")}</MenuItem>
                                    <MenuItem value="F">{t("auth.register.genderFemale")}</MenuItem>
                                </TextField>
                            </Box>

                            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2.5 }}>
                                <TextField
                                    name="password"
                                    label={t("auth.register.password")}
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    fullWidth required
                                />
                                <TextField
                                    name="confirmPassword"
                                    label={t("auth.register.confirmPassword")}
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    fullWidth required
                                />
                            </Box>

                            {error && (
                                <Typography color="error" variant="body2" align="center">
                                    {error}
                                </Typography>
                            )}

                            <Button
                                fullWidth
                                size="large"
                                variant="contained"
                                sx={{ mt: 2, py: 1.8, borderRadius: 3, fontSize: "16px" }}
                                onClick={handleRegister}
                                disabled={loading}
                            >
                                {loading ? "Se înregistrează..." : t("auth.register.submit")}
                            </Button>
                        </Stack>

                        <Typography align="center" mt={5} fontSize={14} color="text.secondary">
                            {t("auth.register.haveAccount")}{" "}
                            <Link to="/login" style={{ color: colors.primary, textDecoration: "none", fontWeight: 800, marginLeft: 4 }}>
                                {t("auth.register.loginLink")}
                            </Link>
                        </Typography>
                    </Paper>
                </Container>
            </Box>
        </LocalizationProvider>
    );
};

export default Register;