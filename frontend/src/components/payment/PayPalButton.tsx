import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
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

export default function PayPalButton({ amount, currency, apartmentId, startDate, endDate, onSuccess, onError }: Props) {
    const { t } = useTranslation();

    return (
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
                                onError(t("payment.paypalCaptureFailed"));
                        } catch (err: unknown) {
                            const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
                            onError(msg ?? t("payment.paypalConfirmError"));
                        }
                    }}
                    onError={() => onError(t("payment.paypalFailed"))}
                    onCancel={() => onError(t("payment.paypalCancelled"))}
                />
            </Box>
        </PayPalScriptProvider>
    );
}
