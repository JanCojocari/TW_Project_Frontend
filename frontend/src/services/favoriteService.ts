import axiosInstance from "../api/axiosInstance";

export interface FavoriteDto {
    userId:      number;
    apartmentId: number;
}

export const favoriteService = {
    // GET /api/favorites/{userId} — returneaza lista de FavoriteDto
    getByUser: (userId: number): Promise<FavoriteDto[]> =>
        axiosInstance.get<FavoriteDto[]>(`/favorites/${userId}`)
            .then(r => r.data),

    // POST /api/favorites/{userId}/{apartmentId}
    add: (userId: number, apartmentId: number): Promise<void> =>
        axiosInstance.post(`/favorites/${userId}/${apartmentId}`)
            .then(() => undefined),

    // DELETE /api/favorites/{userId}/{apartmentId}
    remove: (userId: number, apartmentId: number): Promise<void> =>
        axiosInstance.delete(`/favorites/${userId}/${apartmentId}`)
            .then(() => undefined),
};