import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { paths } from "../app/paths";

export default function ServerError() {
    const navigate = useNavigate();

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
            gap={2}
        >
            <Typography variant="h1" fontWeight="bold" color="error">
                500
            </Typography>
            <Typography variant="h5">Serverul este indisponibil</Typography>
            <Typography variant="body1" color="text.secondary">
                Backend-ul nu raspunde. Incearca din nou mai tarziu.
            </Typography>
            <Button variant="contained" onClick={() => navigate(paths.home)}>
                Inapoi la pagina principala
            </Button>
        </Box>
    );
}
