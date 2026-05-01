// services/userService.ts
import axiosInstance from "../api/axiosInstance";
import type { User } from "../types/user.types";

const BASE = "/users";

export interface UserApiDto {
    id: number;
    name: string;
    surname: string;
    email: string;
    phone: string;
    birthday: string;
    gender?: string | null;
    accountBalance: number;
    role: number;
    avatarUrl?: string | null;
}

export interface UserLoginResponseDto {
    token: string;
    user:  UserApiDto;
}

export interface UserUpdateDto {
    name?:     string;
    surname?:  string;
    email?:    string;
    phone?:    string;
    birthday?: string;
    gender?:   string;
}

export interface UserChangePasswordDto {
    oldPassword: string;
    newPassword: string;
}

export function mapUserApiToUser(dto: UserApiDto): User {
    return {
        Id_User:      dto.id,
        Name:         dto.name,
        Surname:      dto.surname,
        Password:     "",
        Email:        dto.email,
        Phone:        dto.phone,
        Birthday:     dto.birthday.split("T")[0],
        Gender:       dto.gender ?? "",
        Account_sold: Number(dto.accountBalance),
        AvatarUrl:    dto.avatarUrl ?? null,
    };
}

export const userService = {
    login: (email: string, password: string): Promise<UserLoginResponseDto> =>
        axiosInstance.post<UserLoginResponseDto>(`${BASE}/login`, { email, password }).then(r => r.data),

    getAll: (): Promise<UserApiDto[]> =>
        axiosInstance.get<UserApiDto[]>(BASE).then(r => r.data),

    getById: (id: number): Promise<UserApiDto> =>
        axiosInstance.get<UserApiDto>(`${BASE}/${id}`).then(r => r.data),

    update: (id: number, data: UserUpdateDto): Promise<string> =>
        axiosInstance.put<string>(`${BASE}/${id}`, data).then(r => r.data),

    changePassword: (id: number, data: UserChangePasswordDto): Promise<string> =>
        axiosInstance.put<string>(`${BASE}/${id}/password`, data).then(r => r.data),

    updateAvatar: (id: number, avatarUrl: string): Promise<string> =>
        axiosInstance.put<string>(`${BASE}/${id}/avatar`, { avatarUrl }).then(r => r.data),

    delete: (id: number): Promise<string> =>
        axiosInstance.delete<string>(`${BASE}/${id}`).then(r => r.data),
};