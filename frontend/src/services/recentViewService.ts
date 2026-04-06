import axios from "axios";

const BASE = "http://localhost:5062/api/recent-views";

export interface RecentViewApiDto {
    userId: number;
    apartmentId: number;
    viewedAt: string;
}

export const recentViewService = {
    getByUser: (userId: number): Promise<RecentViewApiDto[]> =>
        axios.get<RecentViewApiDto[]>(`${BASE}/${userId}`).then(r => r.data),

    add: (userId: number, apartmentId: number): Promise<string> =>
        axios.post<string>(`${BASE}/${userId}/${apartmentId}`).then(r => r.data),

    clearAll: (userId: number): Promise<string> =>
        axios.delete<string>(`${BASE}/${userId}`).then(r => r.data),
};
