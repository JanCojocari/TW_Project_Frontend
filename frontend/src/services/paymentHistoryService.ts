// services/paymentHistoryService.ts
import axiosInstance from "../api/axiosInstance";
import type { PaymentDto } from "../utils/pdf/buildInvoiceData";

const BASE = "/payments";

export interface PaymentApiDto {
    id:               number;
    ownerId:          number;
    renterId:         number;
    apartmentId:      number;
    totalCost:        number;
    currency:         string;   // backend returneaza acum string ("EUR", "USD", "MDL")
    createdAt:        string;
    startDate?:       string | null;
    endDate?:         string | null;
    invoiceUrl?:      string | null;
    // campuri noi populate de backend
    apartmentAddress: string;
    renterName:       string;
    renterSurname:    string;
    renterEmail:      string;
    ownerName:        string;
}

export interface BookedPeriodDto {
    startDate: string;
    endDate:   string;
}

export function mapToPaymentDto(api: PaymentApiDto): PaymentDto {
    return {
        id:               api.id,
        apartmentId:      api.apartmentId,
        ownerId:          api.ownerId,
        renterId:         api.renterId,
        apartmentAddress: api.apartmentAddress,
        renterName:       api.renterName,
        renterSurname:    api.renterSurname,
        renterEmail:      api.renterEmail,
        ownerName:        api.ownerName,
        totalCost:        api.totalCost,
        currency:         (api.currency as "EUR" | "USD" | "MDL") ?? "EUR",
        createdAt:        api.createdAt,
        rentedFrom:       api.startDate ?? undefined,
        rentedTo:         api.endDate   ?? undefined,
        invoiceUrl:       api.invoiceUrl ?? undefined,
    };
}

export const paymentHistoryService = {
    getByUser: (userId: number): Promise<PaymentDto[]> =>
        axiosInstance.get<PaymentApiDto[]>(`${BASE}/user/${userId}`)
            .then(r => r.data.map(mapToPaymentDto)),

    // returneaza raw DTO ca UpcomingStaysTab are nevoie de startDate/endDate
    getByRenter: (renterId: number): Promise<PaymentApiDto[]> =>
        axiosInstance.get<PaymentApiDto[]>(`${BASE}/renter/${renterId}`)
            .then(r => r.data),

    getByApartment: (apartmentId: number): Promise<PaymentDto[]> =>
        axiosInstance.get<PaymentApiDto[]>(`${BASE}/apartment/${apartmentId}`)
            .then(r => r.data.map(mapToPaymentDto)),

    hasPaid: (apartmentId: number): Promise<boolean> =>
        axiosInstance.get<{ hasPaid: boolean }>(`${BASE}/has-paid/${apartmentId}`)
            .then(r => r.data.hasPaid),

    getBookedPeriods: (apartmentId: number): Promise<BookedPeriodDto[]> =>
        axiosInstance.get<BookedPeriodDto[]>(`${BASE}/booked-periods/${apartmentId}`)
            .then(r => r.data),
};