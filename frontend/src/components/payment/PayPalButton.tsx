import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { Box } from "@mui/material";
import axios from "axios";

interface Props {
    amount:      number;
    currency:    string;
    apartmentId: number;
    onSuccess:   (transactionId: string) => void;
    onError:     (msg: string) => void;
}

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID as string;

const PayPalButton = ({ amount, currency, apartmentId, onSuccess, onError }: Props) => (
    <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency }}>
        <Box sx={{ mt: 2 }}>
            <PayPalButtons
                style={{ layout: "vertical", shape: "rect" }}
                createOrder={async () => {
                    const res = await axios.post("/api/paypal/create-order", { amount, currency });
                    return res.data.orderId;
                }}
                onApprove={async (data) => {
                    try {
                        const res = await axios.post(
                            `/api/paypal/capture-order/${data.orderID}`,
                            { apartmentId, renterId: 1, amount, currency }
                        );
                        if (res.data.success)
                            onSuccess(res.data.transactionId);
                        else
                            onError("Capturarea plății a eșuat.");
                    } catch {
                        onError("Eroare la confirmarea plății PayPal.");
                    }
                }}
                onError={() => onError("Plata PayPal a eșuat. Încearcă din nou.")}
                onCancel={() => onError("Plata a fost anulată.")}
            />
        </Box>
    </PayPalScriptProvider>
);

export default PayPalButton;