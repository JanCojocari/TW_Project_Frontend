// utils/pdf/invoiceTypes.ts
// Tipuri centralizate pentru generarea notei de plată

export interface InvoiceRenter {
    name: string;
    surname: string;
    email: string;
}

export interface InvoiceApartment {
    id: number;
    address: string;
    ownerName: string;
    interval: string;       // "Lunar" | "Zilnic" | "Orar"
    rentedFrom?: string;    // ISO date string, opțional
    rentedTo?: string;
}

export interface InvoiceCostBreakdown {
    subtotal: number;
    discount?: number;      // reducere promo în valoare absolută
    promoCode?: string;
    taxes?: number;
    total: number;
    currency: string;       // "EUR" | "USD" | "MDL"
}

export interface InvoiceData {
    invoiceNumber: string;  // ex: "INV-2026-00442"
    createdAt: string;      // ISO date string
    renter: InvoiceRenter;
    apartment: InvoiceApartment;
    cost: InvoiceCostBreakdown;
    paymentMethod?: string; // ex: "Card bancar", "PayPal", "Transfer"
}