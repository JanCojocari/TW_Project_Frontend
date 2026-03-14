import { Box, Typography, LinearProgress } from "@mui/material";
import { CheckCircle as CheckIcon } from "@mui/icons-material";
import { gradients, colors } from "../../theme/gradients.ts";

const SuccessScreen = () => (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "background.default" }}>
        <Box sx={{ textAlign: "center" }}>
            <Box sx={{
                width: 80, height: 80, borderRadius: "50%",
                background: gradients.success,
                display: "flex", alignItems: "center", justifyContent: "center",
                mx: "auto", mb: 3,
                boxShadow: `0 8px 24px ${colors.successAlpha15}`,
            }}>
                <CheckIcon sx={{ fontSize: 40, color: "white" }} />
            </Box>
            <Typography variant="h5" fontWeight={800} sx={{ mb: 1 }}>Anunț creat cu succes!</Typography>
            <Typography variant="body1" color="text.secondary">Ești redirecționat către anunțul tău...</Typography>
            <LinearProgress sx={{ mt: 3, width: 200, mx: "auto", borderRadius: 2 }} />
        </Box>
    </Box>
);

export default SuccessScreen;