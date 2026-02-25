import type { Currency } from "./apartment.types";

export type PaymentMethodId = "card" | "paypal" | "bank_transfer";

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
    label: string;
    icon: string;
    description: string;
}

export interface PaymentPayload {
    method: PaymentMethodId;
    formValues: Record<string, string | boolean>;
    summary: OrderSummary;
    promoCode?: string;
    apartmentId?: number;
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
    { id: "card",          label: "Card",            icon: "💳", description: "Visa, Mastercard, Amex" },
    { id: "paypal",        label: "PayPal",          icon: "🅿️", description: "Plată rapidă cu PayPal" },
    { id: "bank_transfer", label: "Transfer bancar", icon: "🏦", description: "Virament IBAN" },
];

export const CARD_FIELDS: FieldConfig[] = [
    {
        name: "nameOnCard",
        label: "Nume pe card",
        placeholder: "Ion Popescu",
        type: "text",
        autoComplete: "cc-name",
        required: true,
        validate: (v) => (v.trim().length < 2 ? "Introdu numele complet" : undefined),
    },
    {
        name: "cardNumber",
        label: "Număr card",
        placeholder: "1234 5678 9012 3456",
        type: "tel",
        autoComplete: "cc-number",
        maxLength: 19,
        required: true,
        format: (v) =>
            v
                .replace(/\D/g, "")
                .slice(0, 16)
                .replace(/(.{4})/g, "$1 ")
                .trim(),
        validate: (v) =>
            v.replace(/\s/g, "").length !== 16
                ? "Numărul cardului are 16 cifre"
                : undefined,
    },
    {
        name: "expiry",
        label: "Data expirare",
        placeholder: "MM/AA",
        type: "tel",
        autoComplete: "cc-exp",
        maxLength: 5,
        required: true,
        format: (v) => {
            const d = v.replace(/\D/g, "").slice(0, 4);
            return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
        },
        validate: (v) => {
            const parts = v.split("/");
            if (parts.length !== 2) return "Format invalid (MM/AA)";
            const m = parseInt(parts[0], 10);
            if (m < 1 || m > 12) return "Lună invalidă";
            const exp = new Date(2000 + parseInt(parts[1], 10), m - 1, 1);
            if (exp < new Date()) return "Cardul a expirat";
            return undefined;
        },
    },
    {
        name: "cvc",
        label: "CVC",
        placeholder: "123",
        type: "tel",
        autoComplete: "cc-csc",
        maxLength: 4,
        required: true,
        format: (v) => v.replace(/\D/g, "").slice(0, 4),
        validate: (v) => (v.length < 3 ? "CVC are minim 3 cifre" : undefined),
    },
];

export const PAYPAL_FIELDS: FieldConfig[] = [
    {
        name: "email",
        label: "Email PayPal",
        placeholder: "exemplu@email.com",
        type: "email",
        autoComplete: "email",
        required: true,
        validate: (v) =>
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Email invalid" : undefined,
    },
];

export const BANK_FIELDS: FieldConfig[] = [
    {
        name: "accountHolder",
        label: "Titular cont",
        placeholder: "Ion Popescu",
        type: "text",
        autoComplete: "name",
        required: true,
        validate: (v) => (v.trim().length < 2 ? "Introdu numele titularului" : undefined),
    },
    {
        name: "iban",
        label: "IBAN",
        placeholder: "MD24AG000225100013104168",
        type: "text",
        autoComplete: "off",
        required: true,
        format: (v) => v.replace(/\s/g, "").toUpperCase(),
        validate: (v) => (v.length < 15 ? "IBAN invalid" : undefined),
    },
    {
        name: "reference",
        label: "Referință plată",
        placeholder: "Chirie Apartament",
        type: "text",
        autoComplete: "off",
        required: false,
        hint: "Opțional – apare pe extrasul bancar",
    },
];

export const FIELDS_BY_METHOD: Record<PaymentMethodId, FieldConfig[]> = {
    card:          CARD_FIELDS,
    paypal:        PAYPAL_FIELDS,
    bank_transfer: BANK_FIELDS,
};

export const BILLING_ADDRESS_FIELDS: FieldConfig[] = [
    {
        name: "billingAddress",
        label: "Adresă",
        placeholder: "Str. Exemplu, nr. 1",
        type: "text",
        autoComplete: "street-address",
        required: true,
        validate: (v) => (v.trim().length < 5 ? "Introdu adresa completă" : undefined),
    },
    {
        name: "billingCity",
        label: "Oraș",
        placeholder: "Chișinău",
        type: "text",
        autoComplete: "address-level2",
        required: true,
        validate: (v) => (v.trim().length < 2 ? "Introdu orașul" : undefined),
    },
    {
        name: "billingPostal",
        label: "Cod poștal",
        placeholder: "MD-2001",
        type: "text",
        autoComplete: "postal-code",
        required: true,
        validate: (v) => (v.trim().length < 4 ? "Cod poștal invalid" : undefined),
    },
];

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

export const LABELS = {
    pay:              "Plătește acum",
    back:             "Înapoi",
    processing:       "Se procesează...",
    successTitle:     "Plată efectuată cu succes!",
    successMessage:   "Vei primi o confirmare pe email.",
    orderSummary:     "Sumar comandă",
    paymentMethod:    "Metodă de plată",
    billingAddress:   "Adresă facturare",
    sameAsProfile:    "Aceeași ca în profil",
    subtotal:         "Subtotal",
    serviceFee:       "Taxă serviciu (5%)",
    discount:         "Reducere",
    total:            "Total",
    promoPlaceholder: "Cod promoțional",
    applyPromo:       "Aplică",
};