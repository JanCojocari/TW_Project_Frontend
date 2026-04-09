import axios from "axios";
import type { PaymentDto } from "../utils/pdf/buildInvoiceData";

const BASE = "http://localhost:5062/api/payments";

/** Shape returned by the backend PaymentController */
export interface PaymentApiDto {
    id:          number;
    ownerId:     number;
    renterId:    number;
    apartmentId: number;
    totalCost:   number;
    currency:    number;   // 0=USD 1=EUR 2=MDL (Currency enum)
    createdAt:   string;
    invoiceUrl?: string | null;
}

const CURRENCY_MAP: Record<number, "USD" | "EUR" | "MDL"> = {
    0: "USD",
    1: "EUR",
    2: "MDL",
};

/** Maps backend PaymentApiDto → frontend PaymentDto (for PaymentRow / invoice generation) */
export function mapToPaymentDto(api: PaymentApiDto): PaymentDto {
    return {
        id:               api.id,
        apartmentId:      api.apartmentId,
        apartmentAddress: `Apartment #${api.apartmentId}`,
        renterName:       `User`,
        renterSurname:    `#${api.renterId}`,
        renterEmail:      "",
        totalCost:        api.totalCost,
        currency:         CURRENCY_MAP[api.currency] ?? "EUR",
        createdAt:        api.createdAt,
        invoiceUrl:       api.invoiceUrl ?? undefined,
    };
}

export const paymentHistoryService = {
    getByUser: (userId: number): Promise<PaymentDto[]> =>
        axios.get<PaymentApiDto[]>(`${BASE}/user/${userId}`)
            .then(r => r.data.map(mapToPaymentDto)),

    getByApartment: (apartmentId: number): Promise<PaymentDto[]> =>
        axios.get<PaymentApiDto[]>(`${BASE}/apartment/${apartmentId}`)
            .then(r => r.data.map(mapToPaymentDto)),
};
