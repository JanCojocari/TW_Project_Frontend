export type RentInterval    = "hour" | "day" | "month";
export type Currency        = "USD" | "EUR" | "MDL";
export type ApartmentStatus = "pending" | "approved" | "declined";

export type Apartment = {
    Id_Apartment:      number;
    Id_Owner:          number;
    Id_Renter:         number | null;
    Address:           string;
    image_url:         string;
    image_urls:        string[];
    status:            ApartmentStatus;
    Cost_per_interval: number;
    Currency:          Currency;
    Interval:          RentInterval;
    location:          MapLocation;
    facilities:        Facilities;
    additionalInfo:    AdditionalInfo;
    reviews:           Review[];
};

export type MapLocation = {
    latitude:          number;
    longitude:         number;
    city:              string;
    country:           string;
    region?:           string;
    postalCode?:       string;
    nearbyLandmarks?:  string[];
};

export type Facilities = {
    wifi:           boolean;
    parking:        boolean;
    parkingFree:    boolean;
    ac:             boolean;
    heating:        boolean;
    washer:         boolean;
    dryer:          boolean;
    dishwasher:     boolean;
    refrigerator:   boolean;
    microwave:      boolean;
    oven:           boolean;
    stove:          boolean;
    tv:             boolean;
    balcony:        boolean;
    terrace:        boolean;
    garden:         boolean;
    pool:           boolean;
    gym:            boolean;
    elevator:       boolean;
    petFriendly:    boolean;
    smokingAllowed: boolean;
    securityCamera: boolean;
    keypadEntry:    boolean;
    safe:           boolean;
};

export type AdditionalInfo = {
    rooms:              number;
    bedrooms:           number;
    bathrooms:          number;
    beds:               number;
    floor:              number;
    totalFloors:        number;
    surfaceArea:        number;
    maxGuests:          number;
    checkInFrom:        string;
    checkInUntil:       string;
    checkOutFrom:       string;
    checkOutUntil:      string;
    selfCheckIn:        boolean;
    description:        string;
    houseRules?:        string;
    cancellationPolicy: "flexible" | "moderate" | "strict";
};

export type Review = {
    Id_Review:        number;
    Id_Renter:        number;
    renterName:       string;
    renterAvatarUrl?: string;
    ratings: {
        overall:        number;
        cleanliness:    number;
        location:       number;
        valueForMoney:  number;
        comfort:        number;
        facilities:     number;
        communication:  number;
    };
    comment?:       string;
    ownerResponse?: string;
    createdAt:      string;
    stayDuration?:  number;
};