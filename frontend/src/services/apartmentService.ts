import axiosInstance from "../api/axiosInstance";
import type { Apartment, ApartmentStatus } from "../types/apartment.types";
import { defaultFacilities } from "../types/CreateListingTypes";
import type { FormState } from "../types/CreateListingTypes";
import {
    RentIntervalApi,
    RentModeApi,
    CancellationPolicyApi,
    ApartmentStatusApi,
    type ApartmentApiDto,
    type ApartmentCreateApiDto,
    type ApartmentUpdateApiDto,
} from "../types/ApartmentApiDto";

// ── Helpers imagini ───────────────────────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace("/api", "") ?? "http://localhost:5231";

function parseImageUrls(raw: string | null): string[] {
    if (!raw) return [];
    try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed))
            return parsed.filter(Boolean).map(url => `${BASE_URL}${url}`);
    } catch {
        return raw.startsWith("http") ? [raw] : [`${BASE_URL}${raw}`];
    }
    return [];
}

// ── Mappere enum → tip frontend ───────────────────────────────────────────────

const INTERVAL_MAP: Record<RentIntervalApi, Apartment["Interval"]> = {
    [RentIntervalApi.Hour]:  "hour",
    [RentIntervalApi.Day]:   "day",
    [RentIntervalApi.Month]: "month",
};

const CANCELLATION_MAP: Record<CancellationPolicyApi, Apartment["additionalInfo"]["cancellationPolicy"]> = {
    [CancellationPolicyApi.Flexible]: "flexible",
    [CancellationPolicyApi.Moderate]: "moderate",
    [CancellationPolicyApi.Strict]:   "strict",
};

const STATUS_MAP: Record<ApartmentStatusApi, ApartmentStatus> = {
    [ApartmentStatusApi.Pending]:  "pending",
    [ApartmentStatusApi.Approved]: "approved",
    [ApartmentStatusApi.Declined]: "declined",
};

// ── Mapper API DTO → tip frontend ────────────────────────────────────────────

export function mapToApartment(dto: ApartmentApiDto): Apartment {
    return {
        Id_Apartment:      dto.id,
        Id_Owner:          dto.ownedId,
        Id_Renter:         dto.renterId,
        Address:           dto.address,
        image_url:         dto.imageUrl ?? "",
        image_urls:        parseImageUrls(dto.imageUrl),
        status:            STATUS_MAP[dto.status] ?? "pending",
        Cost_per_interval: dto.costPerInterval,
        Currency:          "MDL",
        Interval:          INTERVAL_MAP[dto.interval] ?? "month",
        location: {
            latitude:  dto.location.lat,
            longitude: dto.location.lng,
            city:      dto.location.city,
            country:   dto.location.country,
        },
        facilities: { ...defaultFacilities },
        additionalInfo: {
            rooms:              dto.additionalInfo.rooms,
            bedrooms:           0,
            bathrooms:          dto.additionalInfo.bathrooms,
            beds:               0,
            floor:              dto.additionalInfo.floor,
            totalFloors:        dto.additionalInfo.totalFloors,
            surfaceArea:        dto.additionalInfo.area,
            maxGuests:          dto.additionalInfo.maxGuests,
            checkInFrom:        "14:00",
            checkInUntil:       "22:00",
            checkOutFrom:       "08:00",
            checkOutUntil:      "12:00",
            selfCheckIn:        false,
            description:        dto.additionalInfo.description,
            cancellationPolicy: CANCELLATION_MAP[dto.additionalInfo.cancellationPolicy] ?? "flexible",
        },
        reviews: [],
    };
}

// ── Mapper FormState → ApartmentCreateApiDto ─────────────────────────────────

const INTERVAL_TO_API: Record<Apartment["Interval"], RentIntervalApi> = {
    hour:  RentIntervalApi.Hour,
    day:   RentIntervalApi.Day,
    month: RentIntervalApi.Month,
};

const CANCELLATION_TO_API: Record<Apartment["additionalInfo"]["cancellationPolicy"], CancellationPolicyApi> = {
    flexible: CancellationPolicyApi.Flexible,
    moderate: CancellationPolicyApi.Moderate,
    strict:   CancellationPolicyApi.Strict,
};

export function buildCreatePayload(form: FormState, imageUrls: string[]): ApartmentCreateApiDto {
    return {
        address:         form.address,
        imageUrl:        imageUrls.length > 0 ? JSON.stringify(imageUrls) : undefined,
        interval:        INTERVAL_TO_API[form.interval],
        costPerInterval: parseFloat(form.cost) || 0,
        rentMode:        RentModeApi.ShortTerm,
        location: {
            lat:         parseFloat(form.latitude)    || 0,
            lng:         parseFloat(form.longitude)   || 0,
            city:        form.city,
            country:     "Moldova",
            fullAddress: form.address,
        },
        additionalInfo: {
            rooms:              parseInt(form.rooms)        || 0,
            bathrooms:          parseInt(form.bathrooms)    || 0,
            floor:              parseInt(form.floor)        || 0,
            totalFloors:        parseInt(form.totalFloors)  || 0,
            area:               parseFloat(form.surfaceArea) || 0,
            maxGuests:          parseInt(form.maxGuests)    || 0,
            description:        form.description,
            cancellationPolicy: CANCELLATION_TO_API[form.cancellationPolicy],
        },
    };
}

export interface ActionResponse {
    isSuccess: boolean;
    message:   string;
    id:        number | null;
}

// ── API calls ─────────────────────────────────────────────────────────────────

export const apartmentService = {
    getAll: (): Promise<Apartment[]> =>
        axiosInstance.get<ApartmentApiDto[]>("/apartments")
            .then(r => r.data.map(mapToApartment)),

    getById: (id: number): Promise<Apartment | null> =>
        axiosInstance.get<ApartmentApiDto>(`/apartments/${id}`)
            .then(r => mapToApartment(r.data))
            .catch(() => null),

    getByOwner: (ownerId: number): Promise<Apartment[]> =>
        axiosInstance.get<ApartmentApiDto[]>(`/apartments/owner/${ownerId}`)
            .then(r => r.data.map(mapToApartment)),

    create: (ownerId: number, data: ApartmentCreateApiDto): Promise<ActionResponse> =>
        axiosInstance.post<ActionResponse>(`/apartments/${ownerId}`, data)
            .then(r => r.data),

    update: (data: ApartmentUpdateApiDto): Promise<string> =>
        axiosInstance.put<string>("/apartments", data)
            .then(r => r.data),

    delete: (id: number): Promise<string> =>
        axiosInstance.delete<string>(`/apartments/${id}`)
            .then(r => r.data),

    assignRenter: (apartmentId: number, renterId: number): Promise<string> =>
        axiosInstance.patch<string>(`/apartments/${apartmentId}/renter/${renterId}`)
            .then(r => r.data),

    removeRenter: (apartmentId: number): Promise<string> =>
        axiosInstance.patch<string>(`/apartments/${apartmentId}/renter/remove`)
            .then(r => r.data),
};