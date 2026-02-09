import {Box, Button, Container, Paper, TextField, Typography, Tabs, Tab} from "@mui/material";
import ApartmentIcon from "@mui/icons-material/Apartment";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../auth/AuthContext.tsx";
import { useState } from "react";

const LoginForm = () => {
    const navigate = useNavigate();
    const {login} = useAuth();
    const [userType, setUserType] = useState<'proprietar' | 'chirias'>('proprietar');
    
    const handleTabChange = (e: React.SyntheticEvent,newValue: 'proprietar' | 'chirias') => {
        e.preventDefault();
        setUserType(newValue);
    };

    return (
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

                {/* Tabs pentru selectare tip utilizator */}
                <Tabs
                    value={userType}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    sx={{
                        mb: 3,
                        borderBottom: "2px solid #e5e7eb",
                        "& .MuiTab-root": {
                            textTransform: "none",
                            fontWeight: 600,
                            fontSize: 15,
                            color: "#9ca3af",
                            "&.Mui-selected": {
                                color: "#2563eb",
                            },
                        },
                        "& .MuiTabs-indicator": {
                            background: "linear-gradient(90deg, #2563eb, #4f46e5)",
                        },
                    }}
                >
                    <Tab label="Proprietari" value="proprietar" />
                    <Tab label="Chiriași" value="chirias" />
                </Tabs>

                <Typography display={"flex"} justifyContent={"center"} variant="h6" fontWeight={600} mb={3}>
                    {userType === 'proprietar' ? 'Bun venit, Proprietar!' : 'Bun venit, Chirias!'}
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
                    Conectare {userType === 'proprietar' ? 'Proprietar' : 'Chirias'}
                </Button>

                <Typography
                    align="center"
                    mt={3}
                    fontSize={14}
                    color="text.secondary"
                >
                    Nu ai cont? <span 
                    style={{ color: "#2563eb", cursor: "pointer" }}
                    onClick={()=>navigate("/register")}
                >Înregistrează-te</span>
                </Typography>
            </Paper>
        </Container>
    );
};

export default LoginForm;