import axios from "axios";

const BASE = "http://localhost:5062/api/reviews";

export interface ReviewApiDto {
    id: number;
    apartmentId: number;
    userId: number;
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
        axios.get<ReviewApiDto[]>(`${BASE}/apartment/${apartmentId}`).then(r => r.data),

    getById: (id: number): Promise<ReviewApiDto> =>
        axios.get<ReviewApiDto>(`${BASE}/${id}`).then(r => r.data),

    create: (userId: number, data: ReviewCreateDto): Promise<string> =>
        axios.post<string>(`${BASE}/${userId}`, data).then(r => r.data),

    addOwnerResponse: (id: number, ownerResponse: string): Promise<string> =>
        axios.patch<string>(`${BASE}/${id}/owner-response`, ownerResponse, {
            headers: { "Content-Type": "application/json" },
        }).then(r => r.data),

    delete: (id: number): Promise<string> =>
        axios.delete<string>(`${BASE}/${id}`).then(r => r.data),
};
