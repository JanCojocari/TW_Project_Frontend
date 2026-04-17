import axiosInstance from "../api/axiosInstance";

const BASE = "/admin";

// ── Types ────────────────────────────────────────────────────────────────────

export interface AdminUser {
    id: number;
    name: string;
    surname: string;
    email: string;
    phone: string;
    birthday: string;
    gender: string | null;
    accountBalance: number;
    role: number; // 0=Admin, 1=Owner, 2=Renter
}

export interface AdminApartment {
    id: number;
    ownedId: number;
    renterId: number | null;
    address: string;
    imageUrl: string | null;
    interval: number;
    costPerInterval: number;
    rentMode: number;
    status: number; // 0=Pending, 1=Approved, 2=Declined
    location: object;
    additionalInfo: object;
}

export interface AdminSupportRequest {
    id: number;
    userId: number | null;
    email: string;
    subject: string;
    message: string;
    createdAt: string;
    status: number; // 0=Open, 1=InProgress, 2=Resolved, 3=Closed
}

export interface AdminReview {
    id: number;
    apartmentId: number;
    userId: number;
    comment: string | null;
    ownerResponse: string | null;
    rating: number;
    createdAt: string;
}

export interface AdminPayment {
    id: number;
    ownerId: number;
    renterId: number;
    apartmentId: number;
    totalCost: number;
    currency: number;
    createdAt: string;
    invoiceUrl: string | null;
}

export interface AdminStats {
    totalUsers: number;
    totalApartments: number;
    pendingApartments: number;
    approvedApartments: number;
    declinedApartments: number;
    totalPayments: number;
    totalReviews: number;
    totalSupportRequests: number;
    openSupportRequests: number;
}

// ── API calls ────────────────────────────────────────────────────────────────

export const adminService = {
    // Stats
    getStats: () =>
        axiosInstance.get<AdminStats>(`${BASE}/stats`).then(r => r.data),

    // Users
    getUsers: () =>
        axiosInstance.get<AdminUser[]>(`${BASE}/users`).then(r => r.data),
    deleteUser: (id: number) =>
        axiosInstance.delete(`${BASE}/users/${id}`),
    updateUserRole: (id: number, role: number) =>
        axiosInstance.patch(`${BASE}/users/${id}/role`, role, {
            headers: { "Content-Type": "application/json" },
        }),

    // Apartments
    getApartments: () =>
        axiosInstance.get<AdminApartment[]>(`${BASE}/apartments`).then(r => r.data),
    approveApartment: (id: number) =>
        axiosInstance.patch(`${BASE}/apartments/${id}/approve`),
    declineApartment: (id: number) =>
        axiosInstance.patch(`${BASE}/apartments/${id}/decline`),
    deleteApartment: (id: number) =>
        axiosInstance.delete(`${BASE}/apartments/${id}`),

    // Support
    getSupportRequests: () =>
        axiosInstance.get<AdminSupportRequest[]>(`${BASE}/support`).then(r => r.data),
    updateSupportStatus: (id: number, status: string) =>
        axiosInstance.patch(`${BASE}/support/${id}/status`, JSON.stringify(status), {
            headers: { "Content-Type": "application/json" },
        }),
    deleteSupport: (id: number) =>
        axiosInstance.delete(`${BASE}/support/${id}`),

    // Reviews
    getReviews: () =>
        axiosInstance.get<AdminReview[]>(`${BASE}/reviews`).then(r => r.data),
    deleteReview: (id: number) =>
        axiosInstance.delete(`${BASE}/reviews/${id}`),

    // Payments
    getPayments: () =>
        axiosInstance.get<AdminPayment[]>(`${BASE}/payments`).then(r => r.data),
};
