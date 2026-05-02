import { Box, Paper, Typography } from "@mui/material";
import { CheckCircle as CheckCircleIcon } from "@mui/icons-material";
import { gradients, colors } from "../../theme/gradients.ts";
import { useTranslation } from "react-i18next";

const PaymentSuccessScreen = () => {
    const { t } = useTranslation();

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "background.default", display: "flex", alignItems: "center", justifyContent: "center", pt: 8 }}>
            <Paper elevation={2} sx={{ p: { xs: 4, md: 6 }, borderRadius: 4, textAlign: "center", maxWidth: 460, mx: 2, border: `1px solid ${colors.border}` }}>
                <Box sx={{ width: 80, height: 80, borderRadius: "50%", background: gradients.success, display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 3, boxShadow: "0 8px 24px rgba(125,170,146,0.3)" }}>
                    <CheckCircleIcon sx={{ fontSize: 40, color: "#fff" }} />
                </Box>
                <Typography variant="h5" fontWeight={900} mb={1} letterSpacing="-0.5px">{t("payment.successTitle")}</Typography>
                <Typography color="text.secondary" mb={3}>{t("payment.successMessage")}</Typography>
                <Typography variant="body2" color="text.secondary">{t("payment.redirecting")}</Typography>
            </Paper>
        </Box>
    );
};

export default PaymentSuccessScreen;