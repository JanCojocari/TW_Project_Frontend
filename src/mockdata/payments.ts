// components/dashboard/payments/mockPayments.ts
// Date hardcodate temporare — se înlocuiesc cu userService.getPayments()

import type { PaymentDto } from "../utils/pdf/buildInvoiceData.ts";

export const MOCK_PAYMENTS: PaymentDto[] = [
    {
        id:               442,
        apartmentId:      442,
        apartmentAddress: "Bd. Ștefan cel Mare 80, Mun. Chișinău",
        ownerName:        "Ion Popescu",
        renterName:       "Alexandru",
        renterSurname:    "Moraru",
        renterEmail:      "alex.moraru@email.com",
        totalCost:        850,
        currency:         "EUR",
        interval:         "Month",
        paymentMethod:    "Card bancar",
        createdAt:        "2026-02-01T10:00:00Z",
        rentedFrom:       "2026-02-01T00:00:00Z",
        rentedTo:         "2026-03-01T00:00:00Z",
        invoiceUrl:       undefined,
    },
    {
        id:               119,
        apartmentId:      119,
        apartmentAddress: "Str. Pușkin 12, Mun. Chișinău",
        ownerName:        "Maria Ionescu",
        renterName:       "Alexandru",
        renterSurname:    "Moraru",
        renterEmail:      "alex.moraru@email.com",
        totalCost:        420,
        currency:         "EUR",
        interval:         "Month",
        promoCode:        "WINTER10",
        discount:         42,
        paymentMethod:    "PayPal",
        createdAt:        "2026-01-03T14:30:00Z",
        rentedFrom:       "2026-01-05T00:00:00Z",
        rentedTo:         "2026-02-05T00:00:00Z",
        invoiceUrl:       undefined,
    },
];