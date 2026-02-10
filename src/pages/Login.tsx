import {Box} from "@mui/material";
import LoginForm from "../components/LoginForm.tsx";

const Login = () => {
    return (
        <Box
            sx={{
                pt:1,
                minHeight: "100vh",
                background: "linear-gradient(135deg, #2563eb, #4f46e5, #7c3aed)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <LoginForm/>
        </Box>
    );
};

export default Login;
