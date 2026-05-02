import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Box, Button, CircularProgress, Alert, Typography, useTheme } from "@mui/material";
import { Lock as LockIcon } from "@mui/icons-material";
import axiosInstance from "../../api/axiosInstance";
import { useTranslation } from "react-i18next";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string);

interface Props {
    amount:      number;
    currency:    string;
    apartmentId: number;
    startDate:   Date | null;
    endDate:     Date | null;
    disabled?:   boolean;
    onSuccess:   (transactionId: string) => void;
    onError:     (msg: string) => void;
}

const StripeForm = ({ amount, currency, apartmentId, startDate, endDate, disabled, onSuccess, onError }: Props) => {
    const stripe   = useStripe();
    const elements = useElements();
    const theme    = useTheme();
    const { t }    = useTranslation();

    const [loading, setLoading]     = useState(false);
    const [cardError, setCardError] = useState<string | null>(null);

    // Culorile vin din paleta temei curente (light/dark)
    const textColor        = theme.palette.text.primary;
    const placeholderColor = theme.palette.text.disabled;
    const errorColor       = theme.palette.error.main;

    const handlePay = async () => {
        if (!stripe || !elements) return;
        setLoading(true);
        setCardError(null);

        try {
            const intentRes = await axiosInstance.post("/stripe/create-intent", { amount, currency });
            const { clientSecret } = intentRes.data;

            const cardEl = elements.getElement(CardElement);
            if (!cardEl) throw new Error(t("stripe.errorCardElement"));

            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: { card: cardEl },
            });

            if (error) {
                setCardError(error.message ?? t("stripe.errorCard"));
                return;
            }

            if (paymentIntent?.status !== "succeeded") {
                setCardError(t("stripe.errorNotConfirmed"));
                return;
            }

            const confirmRes = await axiosInstance.post("/stripe/confirm", {
                paymentIntentId: paymentIntent.id,
                apartmentId,
                amount,
                currency,
                startDate: startDate?.toISOString() ?? null,
                endDate:   endDate?.toISOString()   ?? null,
            });

            if (confirmRes.data.success) {
                onSuccess(confirmRes.data.transactionId);
            } else {
                setCardError(t("stripe.errorConfirmBackend"));
            }
        } catch (err: any) {
            const msg = err?.response?.data?.error ?? t("stripe.errorUnexpected");
            setCardError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
                {t("stripe.cardLabel")}
            </Typography>
            <Box
                sx={{
                    border: "1px solid",
                    borderColor: cardError ? "error.main" : "divider",
                    borderRadius: 1.5,
                    p: "12px 14px",
                    mb: cardError ? 1 : 2,
                    bgcolor: "background.paper",
                    "&:focus-within": { borderColor: "primary.main" },
                }}
            >
                <CardElement
                    options={{
                        hidePostalCode: true,
                        style: {
                            base: {
                                fontSize: "15px",
                                fontFamily: theme.typography.fontFamily,
                                color: textColor,
                                "::placeholder": { color: placeholderColor },
                            },
                            invalid: { color: errorColor },
                        },
                    }}
                />
            </Box>

            {cardError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {cardError}
                </Alert>
            )}

            <Button
                variant="contained"
                size="large"
                fullWidth
                disabled={loading || disabled || !stripe}
                onClick={handlePay}
                startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <LockIcon />}
                sx={{ py: 1.8, fontSize: 16, fontWeight: 800, borderRadius: 2.5 }}
            >
                {loading ? t("stripe.processing") : t("stripe.payButton")}
            </Button>

            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block", textAlign: "center" }}>
                {t("stripe.testCardHint")}
            </Typography>
        </Box>
    );
};

const StripeButton = (props: Props) => (
    <Elements stripe={stripePromise}>
        <StripeForm {...props} />
    </Elements>
);

export default StripeButton;