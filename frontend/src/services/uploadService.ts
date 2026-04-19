import axiosInstance from "../api/axiosInstance";

// Trimite fisierele si returneaza lista de URL-uri salvate pe server
export const uploadService = {
    images: async (files: File[]): Promise<string[]> => {
        const formData = new FormData();
        files.forEach(file => formData.append("files", file));

        const response = await axiosInstance.post<string[]>("/uploads/images", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        return response.data;
    },
};