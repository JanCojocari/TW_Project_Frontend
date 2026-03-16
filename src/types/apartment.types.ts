export type RentInterval = "hour" | "day" | "month";
export type Currency = "USD" | "EUR" | "MDL";

export type Apartment = {
    Id_Apartment: number;
    Id_Owner: number;
    Id_Renter: number | null;
    Address: string;
    image_url: string;
    Cost_per_interval: number;
    Currency: Currency;
    Interval: RentInterval;
    location: MapLocation;
    facilities: Facilities;
    additionalInfo: AdditionalInfo;
    reviews: Review[];
};

export type MapLocation = {
    latitude: number;
    longitude: number;
    city: string;
    country: string;
    region?: string;
    postalCode?: string;
    nearbyLandmarks?: string[];
};

export type Facilities = {
    // Internet
    wifi: boolean;

    // Parcare
    parking: boolean;
    parkingFree: boolean;

    // Temperatura
    ac: boolean;
    heating: boolean;

    // Electrocasnice
    washer: boolean;
    dryer: boolean;
    dishwasher: boolean;
    refrigerator: boolean;
    microwave: boolean;
    oven: boolean;
    stove: boolean;
    tv: boolean;

    // Spatiu
    balcony: boolean;
    terrace: boolean;
    garden: boolean;
    pool: boolean;
    gym: boolean;
    elevator: boolean;

    // Politici
    petFriendly: boolean;
    smokingAllowed: boolean;

    // Securitate
    securityCamera: boolean;
    keypadEntry: boolean;
    safe: boolean;
};

export type AdditionalInfo = {
    rooms: number;
    bedrooms: number;
    bathrooms: number;
    beds: number;
    floor: number;
    totalFloors: number;
    surfaceArea: number;
    maxGuests: number;
    checkInFrom: string;
    checkInUntil: string;
    checkOutFrom: string;
    checkOutUntil: string;
    selfCheckIn: boolean;
    description: string;
    houseRules?: string;
    cancellationPolicy: "flexible" | "moderate" | "strict";
};

export type Review = {
    Id_Review: number;
    Id_Renter: number;
    renterName: string;
    renterAvatarUrl?: string;
    ratings: {
        overall: number;
        cleanliness: number;
        location: number;
        valueForMoney: number;
        comfort: number;
        facilities: number;
        communication: number;
    };
    comment?: string;
    ownerResponse?: string;
    createdAt: string;
    stayDuration?: number;
};