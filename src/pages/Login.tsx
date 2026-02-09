import {
    Box,
    Button,
    Container,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import ApartmentIcon from "@mui/icons-material/Apartment";
import {useAuth} from "../auth/AuthContext";
import {useNavigate, Link} from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const {login} = useAuth();
    // Trebuie de scris logica pentru stocarea 
    // datelor despre utilizator si mentinerea 
    // sesiunii active chiar si in caz ca se da refresh la pagina
    
    return (
        <Box
            sx={{
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
                    <Box display="flex" alignItems="center" justifyContent={"center"}  gap={1} mb={4}>
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
                        Autentificare
                    </Typography>

                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        margin="normal"
                    />

                    <TextField
                        label="Parolă"
                        type="password"
                        fullWidth
                        margin="normal"
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
                            login()
                            navigate("/home")
                        }}
                        
                    >
                        Login
                    </Button>

                    <Typography
                        align="center"
                        mt={3}
                        fontSize={14}
                        color="text.secondary"
                    >
                        Nu ai cont?{" "}
                        <Link 
                            to="/register" 
                            style={{ 
                                color: "#2563eb", 
                                textDecoration: "none",
                                fontWeight: 500 
                            }}
                        >
                            Înregistrează-te
                        </Link>
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
};

export default Login;
