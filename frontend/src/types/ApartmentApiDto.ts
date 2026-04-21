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
    region?:     string;
    postalCode?: string;
}

export interface AdditionalInfoApi {
    rooms:              number;
    bedrooms:           number;
    bathrooms:          number;
    beds:               number;
    floor:              number;
    totalFloors:        number;
    area:               number;
    maxGuests:          number;
    description:        string;
    houseRules:         string;
    cancellationPolicy: CancellationPolicyApi;
}

export interface FacilitiesApiDto {
    apartmentId:     number;
    wifi:            boolean;
    parking:         boolean;
    parkingFree:     boolean;
    airConditioning: boolean;
    heating:         boolean;
    washer:          boolean;
    dryer:           boolean;
    dishwasher:      boolean;
    refrigerator:    boolean;
    microwave:       boolean;
    oven:            boolean;
    stove:           boolean;
    kitchen:         boolean;
    tv:              boolean;
    balcony:         boolean;
    terrace:         boolean;
    garden:          boolean;
    pool:            boolean;
    gym:             boolean;
    elevator:        boolean;
    petsAllowed:     boolean;
    smokingAllowed:  boolean;
    securityCamera:  boolean;
    keypadEntry:     boolean;
    safe:            boolean;
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
    facilities?:     FacilitiesApiDto;
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
    facilities?:     FacilitiesApiDto;
}