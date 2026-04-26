// utils/pdf/buildInvoiceData.ts
// Mapare PaymentDto → InvoiceData.
// invoiceUrl este opțional — dacă există, hook-ul face download direct fără regenerare.

import type { InvoiceData } from "./invoiceTypes";

export interface PaymentDto {
    id:               number;
    apartmentId:      number;
    ownerId:          number;
    renterId:         number;
    apartmentAddress: string;
    ownerName?:       string;
    renterName:       string;
    renterSurname:    string;
    renterEmail:      string;
    totalCost:        number;
    currency:         "EUR" | "USD" | "MDL";
    interval?:        "Hour" | "Day" | "Month";
    promoCode?:       string;
    discount?:        number;
    taxes?:           number;
    paymentMethod?:   string;
    createdAt:        string;
    rentedFrom?:      string;
    rentedTo?:        string;
    invoiceUrl?:      string;   // populat de backend după primul upload
}

const INTERVAL_LABELS: Record<string, string> = {
    Hour:  "Orar",
    Day:   "Zilnic",
    Month: "Lunar",
};

function padId(id: number): string {
    return String(id).padStart(5, "0");
}

export function buildInvoiceData(payment: PaymentDto): InvoiceData {
    const subtotal =
        payment.totalCost
        + (payment.discount ?? 0)
        - (payment.taxes   ?? 0);

    return {
        invoiceNumber: `INV-${new Date(payment.createdAt).getFullYear()}-${padId(payment.id)}`,
        createdAt:     payment.createdAt,

        renter: {
            name:    payment.renterName,
            surname: payment.renterSurname,
            email:   payment.renterEmail,
        },

        apartment: {
            id:        payment.apartmentId,
            address:   payment.apartmentAddress,
            ownerName: payment.ownerName ?? "Proprietar",
            interval:  INTERVAL_LABELS[payment.interval ?? "Month"] ?? "Lunar",
            rentedFrom: payment.rentedFrom,
            rentedTo:   payment.rentedTo,
        },

        cost: {
            subtotal:  subtotal > 0 ? subtotal : payment.totalCost,
            discount:  payment.discount,
            promoCode: payment.promoCode,
            taxes:     payment.taxes,
            total:     payment.totalCost,
            currency:  payment.currency,
        },

        paymentMethod: payment.paymentMethod,
    };
}