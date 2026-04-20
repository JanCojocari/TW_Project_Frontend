// services/paymentService.ts
import axiosInstance from "../api/axiosInstance";
import { VALID_PROMO_CODES } from "../types/paymentPageConfig";
import type { PaymentPayload, PaymentResult, PromoResult } from "../types/paymentPageConfig";

const CURRENCY_TO_NUM: Record<string, number> = {
    USD: 0,
    EUR: 1,
    MDL: 2,
};

export const paymentService = {
    async createPayment(payload: PaymentPayload, renterId: number): Promise<PaymentResult> {
        const body = {
            apartmentId: payload.apartmentId,
            currency:    CURRENCY_TO_NUM[payload.summary.currency] ?? 1,
            startDate:   payload.startDate?.toISOString() ?? null,
            endDate:     payload.endDate?.toISOString()   ?? null,
        };

        const res = await axiosInstance.post(`/payments/${renterId}`, body);

        if (res.status === 200 || res.status === 201) {
            return { success: true, transactionId: String(res.data ?? "") };
        }
        return { success: false, error: "Payment failed." };
    },

    async validatePromo(code: string, subtotal: number): Promise<PromoResult> {
        const rate = VALID_PROMO_CODES[code.toUpperCase().trim()];
        if (rate === undefined) {
            return { valid: false, discount: 0, message: "Cod invalid sau expirat." };
        }
        const discount = Math.round(subtotal * rate * 100) / 100;
        return {
            valid: true,
            discount,
            message: `Cod aplicat - ${(rate * 100).toFixed(0)}% reducere`,
        };
    },
};