// Tipuri care corespund exact cu backend-ul (C# enums ca numere, camelCase)

export const RentIntervalApi = { Hour: 0, Day: 1, Month: 2 } as const;
export type  RentIntervalApi = typeof RentIntervalApi[keyof typeof RentIntervalApi];

export const RentModeApi = { ShortTerm: 0, LongTerm: 1 } as const;
export type  RentModeApi = typeof RentModeApi[keyof typeof RentModeApi];

export const CancellationPolicyApi = { Flexible: 0, Moderate: 1, Strict: 2 } as const;
export type  CancellationPolicyApi = typeof CancellationPolicyApi[keyof typeof CancellationPolicyApi];

export const ApartmentStatusApi = { Pending: 0, Approved: 1, Declined: 2 } as const;
export type  ApartmentStatusApi = typeof ApartmentStatusApi[keyof typeof ApartmentStatusApi];

export interface MapLocationApi {
    lat:         number;
    lng:         number;
    city:        string;
    country:     string;
    fullAddress: string;
}

export interface AdditionalInfoApi {
    rooms:              number;
    bathrooms:          number;
    floor:              number;
    totalFloors:        number;
    area:               number;
    maxGuests:          number;
    description:        string;
    cancellationPolicy: CancellationPolicyApi;
}

export interface ApartmentApiDto {
    id:              number;
    ownedId:         number;
    renterId:        number | null;
    address:         string;
    imageUrl:        string | null;
    interval:        RentIntervalApi;
    costPerInterval: number;
    rentMode:        RentModeApi;
    status:          ApartmentStatusApi;
    location:        MapLocationApi;
    additionalInfo:  AdditionalInfoApi;
}

export interface ApartmentCreateApiDto {
    address:         string;
    imageUrl?:       string;
    interval:        RentIntervalApi;
    costPerInterval: number;
    rentMode:        RentModeApi;
    location:        MapLocationApi;
    additionalInfo:  AdditionalInfoApi;
}

export interface ApartmentUpdateApiDto {
    id:              number;
    address:         string;
    imageUrl?:       string;
    interval:        RentIntervalApi;
    costPerInterval: number;
    rentMode:        RentModeApi;
    location:        MapLocationApi;
    additionalInfo:  AdditionalInfoApi;
}