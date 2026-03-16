import { VALID_PROMO_CODES } from "../types/paymentPageConfig";
import type { PaymentPayload, PaymentResult, PromoResult } from "../types/paymentPageConfig";

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export const paymentService = {
    async createPayment(payload: PaymentPayload): Promise<PaymentResult> {
        console.info("[paymentService] createPayment", payload);
        await delay(1500);
        return {
            success: true,
            transactionId: `TXN-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
        };
    },

    async validatePromo(code: string, subtotal: number): Promise<PromoResult> {
        console.info("[paymentService] validatePromo", code);
        await delay(600);
        const rate = VALID_PROMO_CODES[code.toUpperCase().trim()];
        if (rate === undefined) {
            return { valid: false, discount: 0, message: "Cod invalid sau expirat." };
        }
        const discount = Math.round(subtotal * rate * 100) / 100;
        return {
            valid: true,
            discount,
            message: `Cod aplicat – ${(rate * 100).toFixed(0)}% reducere`,
        };
    },
};