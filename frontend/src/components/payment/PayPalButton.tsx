import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { Box } from "@mui/material";
import axiosInstance from "../../api/axiosInstance";

interface Props {
    amount:      number;
    currency:    string;
    apartmentId: number;
    startDate:   Date | null;
    endDate:     Date | null;
    onSuccess:   (transactionId: string) => void;
    onError:     (msg: string) => void;
}

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID as string;

const PayPalButton = ({ amount, currency, apartmentId, startDate, endDate, onSuccess, onError }: Props) => (
    <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency }}>
        <Box sx={{ mt: 2 }}>
            <PayPalButtons
                style={{ layout: "vertical", shape: "rect" }}
                createOrder={async () => {
                    const res = await axiosInstance.post("/paypal/create-order", { amount, currency });
                    return res.data.orderId;
                }}
                onApprove={async (data) => {
                    try {
                        // renterId se extrage din JWT pe backend
                        const res = await axiosInstance.post(
                            `/paypal/capture-order/${data.orderID}`,
                            {
                                apartmentId,
                                amount,
                                currency,
                                startDate: startDate?.toISOString() ?? null,
                                endDate:   endDate?.toISOString()   ?? null,
                            }
                        );
                        if (res.data.success)
                            onSuccess(res.data.transactionId);
                        else
                            onError("Capturarea plătii a eșuat.");
                    } catch (err: any) {
                        onError(err?.response?.data?.error ?? "Eroare la confirmarea plătii PayPal.");
                    }
                }}
                onError={() => onError("Plata PayPal a eșuat. Încearcă din nou.")}
                onCancel={() => onError("Plata a fost anulată.")}
            />
        </Box>
    </PayPalScriptProvider>
);

export default PayPalButton;