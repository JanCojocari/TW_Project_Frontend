import {
    Box,
    Button,
    Container,
    Paper,
    TextField,
    Typography,
    MenuItem,
    Stack,
} from "@mui/material";
import ApartmentIcon from "@mui/icons-material/Apartment";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { gradients, colors } from "../theme/gradients.ts";


const Register = () => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                pt: 15,
                pb: 10,
                minHeight: "100vh",
                bgcolor: "background.default",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Background Accent */}
            <Box
                sx={{
                    position: "absolute",
                    top: "-10%",
                    right: "-5%",
                    width: "40%",
                    height: "40%",
                    background: `radial-gradient(circle, ${colors.primaryAlpha10} 0%, transparent 70%)`,
                    zIndex: 0,
                }}
            />

            <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
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

                    <Typography
                        display={"flex"}
                        justifyContent={"center"}
                        variant="h5"
                        fontWeight={900}
                        mb={5}
                        sx={{ letterSpacing: "-0.5px" }}
                    >
                        Creează Cont Nou
                    </Typography>

                    <Stack spacing={2.5}>
                        {/* Name and Surname in same row */}
                        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2.5 }}>
                            <TextField
                                label="Nume"
                                type="text"
                                fullWidth
                                required
                            />
                            <TextField
                                label="Prenume"
                                type="text"
                                fullWidth
                                required
                            />
                        </Box>

                        <TextField
                            label="Email"
                            type="email"
                            fullWidth
                            required
                        />

                        <TextField
                            label="Telefon"
                            type="tel"
                            fullWidth
                            required
                        />

                        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2.5 }}>
                            <TextField
                                label="Data nașterii"
                                type="date"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                required
                            />

                            <TextField
                                select
                                label="Gen"
                                fullWidth
                                defaultValue=""
                                required
                                
                            >
                                <MenuItem value="">Nespecificat</MenuItem>
                                <MenuItem value="M">Masculin</MenuItem>
                                <MenuItem value="F">Feminin</MenuItem>
                            </TextField>
                        </Box>

                        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2.5 }}>
                            <TextField
                                label="Parolă"
                                type="password"
                                fullWidth
                                required
                            />

                            <TextField
                                label="Confirmă Parola"
                                type="password"
                                fullWidth
                                required
                            />
                        </Box>

                        <Button
                            fullWidth
                            size="large"
                            variant="contained"
                            sx={{ mt: 2, 
                                py: 1.8, 
                                borderRadius: 3, 
                                fontSize: "16px" }}

                            onClick={() => navigate("/login")}
                        >
                            Creează Contul
                        </Button>
                    </Stack>

                    <Typography
                        align="center"
                        mt={5}
                        fontSize={14}
                        color="text.secondary"

                    >
                        Ai deja un cont activ?{" "}
                        <Link
                            to="/login"
                            style={{ color: colors.primary, 
                                textDecoration: "none", 
                                fontWeight: 800, 
                                marginLeft: 4 }}
                        >
                            Autentifică-te
                        </Link>
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
};

export default Register;
