import axiosInstance from "../api/axiosInstance";

const BASE = "/reviews";

export interface ReviewApiDto {
    id: number;
    apartmentId: number;
    userId: number;
    userName?: string;
    userSurname?: string;
    comment?: string;
    ownerResponse?: string;
    rating: number;
    createdAt: string;
}

export interface ReviewCreateDto {
    apartmentId: number;
    rating: number;
    comment?: string;
}

export const reviewService = {
    getByApartment: (apartmentId: number): Promise<ReviewApiDto[]> =>
        axiosInstance.get<ReviewApiDto[]>(`${BASE}/apartment/${apartmentId}`).then(r => r.data),

    getById: (id: number): Promise<ReviewApiDto> =>
        axiosInstance.get<ReviewApiDto>(`${BASE}/${id}`).then(r => r.data),

    create: (userId: number, data: ReviewCreateDto): Promise<string> =>
        axiosInstance.post<string>(`${BASE}/${userId}`, data).then(r => r.data),

    addOwnerResponse: (id: number, ownerResponse: string): Promise<string> =>
        axiosInstance.patch<string>(`${BASE}/${id}/owner-response`, ownerResponse).then(r => r.data),

    delete: (id: number): Promise<string> =>
        axiosInstance.delete<string>(`${BASE}/${id}`).then(r => r.data),
};
