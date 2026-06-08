import axiosInstance from "../../api/axiosInstance";
import type { Apartment } from "../../types/apartment.types";

export interface RenterPayment {
    id: number; apartmentId: number; renterId: number; ownerId: number;
    totalCost: number; currency: number; createdAt: string;
    startDate: string | null; endDate: string | null; invoiceUrl: string | null;
}

export interface StayEntry { apartment: Apartment; startDate: Date; endDate: Date }

export async function fetchRenterPayments(renterId: number): Promise<RenterPayment[]> {
    return axiosInstance.get<RenterPayment[]>(`/payments/renter/${renterId}`).then(r => r.data);
}

export function nightsCount(start: Date, end: Date): number {
    return Math.max(1, Math.round((end.getTime() - start.getTime()) / 86_400_000));
}

export function stayProgress(start: Date, end: Date): number {
    const now = Date.now();
    if (now <= start.getTime()) return 0;
    if (now >= end.getTime())   return 100;
    return Math.round(((now - start.getTime()) / (end.getTime() - start.getTime())) * 100);
}

export function isActive(start: Date, end: Date): boolean {
    const now = Date.now();
    return now >= start.getTime() && now <= end.getTime();
}
