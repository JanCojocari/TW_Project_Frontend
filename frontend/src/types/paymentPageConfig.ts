import type { Currency } from "./apartment.types";
import type { TFunction } from "i18next";

export type PaymentMethodId = "paypal" | "stripe" | "bank_transfer";

export interface OrderItem {
    id: string;
    title: string;
    subtitle?: string;
    quantity: number;
    unitPrice: number;
}

export interface OrderSummary {
    items: OrderItem[];
    subtotal: number;
    serviceFee: number;
    discount: number;
    total: number;
    currency: Currency;
}

export interface PaymentMethod {
    id: PaymentMethodId;
    icon: string;
}

export interface PaymentPayload {
    method: PaymentMethodId;
    formValues: Record<string, string | boolean>;
    summary: OrderSummary;
    promoCode?: string;
    apartmentId?: number;
    startDate?: Date;
    endDate?:   Date;
}

export interface PaymentResult {
    success: boolean;
    transactionId?: string;
    error?: string;
}

export interface PromoResult {
    valid: boolean;
    discount: number;
    message: string;
}

export interface FieldConfig {
    name: string;
    label: string;
    placeholder: string;
    type: "text" | "email" | "tel";
    autoComplete?: string;
    maxLength?: number;
    required: boolean;
    hint?: string;
    format?: (v: string) => string;
    validate?: (v: string) => string | undefined;
}

export const PAYMENT_METHODS: PaymentMethod[] = [
    { id: "paypal",        icon: "🅿️" },
    { id: "stripe",        icon: "⚡" },
    { id: "bank_transfer", icon: "🏦" },
];

export const getBankFields = (t: TFunction): FieldConfig[] => [
    {
        name:         "accountHolder",
        label:        t("payment.bankFields.accountHolder.label"),
        placeholder:  t("payment.bankFields.accountHolder.placeholder"),
        type:         "text",
        autoComplete: "name",
        required:     true,
        validate:     (v) => (v.trim().length < 2 ? t("payment.bankFields.accountHolder.errorMin") : undefined),
    },
    {
        name:         "iban",
        label:        t("payment.bankFields.iban.label"),
        placeholder:  t("payment.bankFields.iban.placeholder"),
        type:         "text",
        autoComplete: "off",
        required:     true,
        format:       (v) => v.replace(/\s/g, "").toUpperCase(),
        validate:     (v) => (v.length < 15 ? t("payment.bankFields.iban.errorInvalid") : undefined),
    },
    {
        name:         "reference",
        label:        t("payment.bankFields.reference.label"),
        placeholder:  t("payment.bankFields.reference.placeholder"),
        type:         "text",
        autoComplete: "off",
        required:     false,
        hint:         t("payment.bankFields.reference.hint"),
    },
];

// FIELDS_BY_METHOD pentru stripe si paypal (fara campuri manuale)
export const EMPTY_FIELDS: FieldConfig[] = [];

export const VALID_PROMO_CODES: Record<string, number> = {
    RENTORA10: 0.1,
    WELCOME20: 0.2,
    SAVE15:    0.15,
};

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
    USD: "$",
    EUR: "€",
    MDL: "lei",
};

export const SERVICE_FEE_RATE = 0.05;