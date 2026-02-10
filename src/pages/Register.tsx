import {
    Box,
    Button,
    Container,
    Paper,
    TextField,
    Typography,
    MenuItem,
    Grid,
} from "@mui/material";
import ApartmentIcon from "@mui/icons-material/Apartment";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                pt:12.5,
                minHeight: "100vh",
                background: "linear-gradient(135deg, #2563eb, #4f46e5, #7c3aed)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Container maxWidth="sm">
                <Paper
                    elevation={10}
                    sx={{
                        p: 5,
                        borderRadius: 10,
                    }}
                >
                    {/* Logo Rentora */}
                    <Box display="flex" alignItems="center" justifyContent={"center"} gap={1} mb={2}>
                        <Box
                            sx={{
                                background:
                                    "linear-gradient(135deg, #2563eb, #4f46e5, #7c3aed)",
                                p: 1.5,
                                borderRadius: 2,
                            }}
                        >
                            <ApartmentIcon sx={{ color: "white", fontSize: 28 }} />
                        </Box>
                        <Typography
                            variant="h4"
                            fontWeight={900}
                            sx={{
                                background:
                                    "linear-gradient(90deg, #2563eb, #4f46e5, #7c3aed)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            Rentora
                        </Typography>
                    </Box>

                    <Typography display={"flex"} justifyContent={"center"} variant="h6" fontWeight={600} mb={3}>
                        Înregistrare
                    </Typography>

                    {/* Name and Surname in same row */}
                    <Grid container spacing={2}>
                        <Grid>
                            <TextField
                                label="Nume"
                                type="text"
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid>
                            <TextField
                                label="Prenume"
                                type="text"
                                fullWidth
                                required
                            />
                        </Grid>
                    </Grid>

                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        margin="normal"
                        required
                    />

                    <TextField
                        label="Telefon"
                        type="tel"
                        fullWidth
                        margin="normal"
                        required
                    />

                    <TextField
                        label="Data nașterii"
                        type="date"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        required
                    />

                    <TextField
                        select
                        label="Gen"
                        fullWidth
                        margin="normal"
                        defaultValue=""
                        required
                    >
                        <MenuItem value="">Prefer să nu specific</MenuItem>
                        <MenuItem value="M">Masculin</MenuItem>
                        <MenuItem value="F">Feminin</MenuItem>
                    </TextField>

                    <TextField
                        label="Parolă"
                        type="password"
                        fullWidth
                        margin="normal"
                        required
                    />

                    <TextField
                        label="Confirmă parola"
                        type="password"
                        fullWidth
                        margin="normal"
                        required
                    />

                    <Button
                        fullWidth
                        size="large"
                        variant="contained"
                        sx={{
                            mt: 3,
                            py: 1.3,
                            borderRadius: 2,
                            background:
                                "linear-gradient(90deg, #2563eb, #4f46e5, #7c3aed)",
                        }}
                        onClick={() => {
                            // Logica de înregistrare
                            navigate("/login");
                        }}
                    >
                        Înregistrează-te
                    </Button>

                    <Typography
                        align="center"
                        mt={3}
                        fontSize={14}
                        color="text.secondary"
                    >
                        Ai deja cont?{" "}
                        <Link 
                            to="/login" 
                            style={{ 
                                color: "#2563eb", 
                                textDecoration: "none",
                                fontWeight: 500 
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
