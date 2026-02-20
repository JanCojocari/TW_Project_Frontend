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

const Register = () => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                pt: 15,
                pb: 10,
                minHeight: "100vh",
                background: "#071A1D",
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
                    background: "radial-gradient(circle, rgba(0, 224, 198, 0.05) 0%, transparent 70%)",
                    zIndex: 0,
                }}
            />

            <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
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

                    <Typography
                        display={"flex"}
                        justifyContent={"center"}
                        variant="h5"
                        fontWeight={900}
                        mb={5}
                        sx={{ color: "#E6F7F5", letterSpacing: "-0.5px" }}
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
                                label="Prenume"
                                type="text"
                                fullWidth
                                required
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
                        </Box>

                        <TextField
                            label="Email"
                            type="email"
                            fullWidth
                            required
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
                            label="Telefon"
                            type="tel"
                            fullWidth
                            required
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

                        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2.5 }}>
                            <TextField
                                label="Data nașterii"
                                type="date"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                required
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
                                select
                                label="Gen"
                                fullWidth
                                defaultValue=""
                                required
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
                                    "& .MuiInputLabel-root.Mui-focused": { color: "#00E0C6" },
                                    "& .MuiSelect-icon": { color: "#00E0C6" }
                                }}
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
                                label="Confirmă Parola"
                                type="password"
                                fullWidth
                                required
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
                        </Box>

                        <Button
                            fullWidth
                            size="large"
                            variant="contained"
                            sx={{
                                mt: 3,
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
                            onClick={() => navigate("/login")}
                        >
                            Creează Contul
                        </Button>
                    </Stack>

                    <Typography
                        align="center"
                        mt={5}
                        fontSize={14}
                        sx={{ color: "#8FB5B1", fontWeight: 500 }}
                    >
                        Ai deja un cont activ?{" "}
                        <Link
                            to="/login"
                            style={{
                                color: "#00E0C6",
                                textDecoration: "none",
                                fontWeight: 800,
                                marginLeft: "4px"
                            }}
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
