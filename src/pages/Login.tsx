import { Box } from "@mui/material";
import LoginForm from "../components/LoginForm.tsx";

const Login = () => {
    return (
        <Box
            sx={{
                pt: 5,
                minHeight: "100vh",
                background: "#071A1D",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <LoginForm />
        </Box>
    );
};

export default Login;
