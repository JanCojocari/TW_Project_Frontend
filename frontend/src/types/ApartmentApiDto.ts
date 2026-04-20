// Tipuri care corespund exact cu backend-ul (C# enums ca numere, camelCase)

export const RentIntervalApi = { Hour: 0, Day: 1, Month: 2 } as const;
export type  RentIntervalApi = typeof RentIntervalApi[keyof typeof RentIntervalApi];

export const RentModeApi = { ShortTerm: 0, LongTerm: 1 } as const;
export type  RentModeApi = typeof RentModeApi[keyof typeof RentModeApi];

export const CurrencyApi = { USD: 0, EUR: 1, MDL: 2 } as const;
export type  CurrencyApi = typeof CurrencyApi[keyof typeof CurrencyApi];

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

export interface FacilitiesApiDto {
    apartmentId:     number;
    wifi:            boolean;
    parking:         boolean;
    airConditioning: boolean;
    heating:         boolean;
    washer:          boolean;
    dryer:           boolean;
    kitchen:         boolean;
    tv:              boolean;
    pool:            boolean;
    gym:             boolean;
    elevator:        boolean;
    petsAllowed:     boolean;
    balcony:         boolean;
}

export interface ApartmentApiDto {
    id:              number;
    ownedId:         number;
    renterId:        number | null;
    address:         string;
    imageUrl:        string | null;
    interval:        RentIntervalApi;
    costPerInterval: number;
    currency:        CurrencyApi;
    rentMode:        RentModeApi;
    status:          ApartmentStatusApi;
    location:        MapLocationApi;
    additionalInfo:  AdditionalInfoApi;
    facilities:      FacilitiesApiDto | null;
    avgRating:       number;
    reviewCount:     number;
}

export interface ApartmentCreateApiDto {
    address:         string;
    imageUrl?:       string;
    interval:        RentIntervalApi;
    costPerInterval: number;
    currency:        CurrencyApi;
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
    currency:        CurrencyApi;
    rentMode:        RentModeApi;
    location:        MapLocationApi;
    additionalInfo:  AdditionalInfoApi;
}