import type { MapLocation, Facilities, AdditionalInfo, Review } from "../types/apartment.types";

/* ── MapLocation mock data ─────────────────────────────────────────────── */
export const apartmentLocations: Record<number, MapLocation> = {
    1: { latitude: 47.0245, longitude: 28.8322, city: "Chișinău", country: "Moldova", region: "Centru", postalCode: "MD-2001", nearbyLandmarks: ["Parcul Central 0.3 km", "bd. Ștefan cel Mare 0.1 km"] },
    2: { latitude: 47.0412, longitude: 28.8601, city: "Chișinău", country: "Moldova", region: "Buiucani", postalCode: "MD-2005", nearbyLandmarks: ["bd. Dacia 0.0 km", "Supermarket Nr.1 0.4 km"] },
    3: { latitude: 47.0198, longitude: 28.8765, city: "Chișinău", country: "Moldova", region: "Botanica", postalCode: "MD-2025", nearbyLandmarks: ["Grădina Botanică 1.2 km", "Mall Botanica 0.7 km"] },
};

/* ── Facilities mock data ──────────────────────────────────────────────── */
export const apartmentFacilities: Record<number, Facilities> = {
    1: {
        wifi: true, parking: true, parkingFree: true,
        ac: true, heating: true,
        washer: true, dryer: false, dishwasher: false, refrigerator: true, microwave: true, oven: true, stove: true, tv: true,
        balcony: true, terrace: false, garden: false, pool: false, gym: false, elevator: false,
        petFriendly: true, smokingAllowed: false,
        securityCamera: true, keypadEntry: true, safe: false,
    },
    2: {
        wifi: true, parking: true, parkingFree: false,
        ac: true, heating: true,
        washer: true, dryer: true, dishwasher: true, refrigerator: true, microwave: true, oven: true, stove: true, tv: true,
        balcony: true, terrace: true, garden: false, pool: true, gym: true, elevator: true,
        petFriendly: false, smokingAllowed: false,
        securityCamera: true, keypadEntry: true, safe: true,
    },
    3: {
        wifi: true, parking: false, parkingFree: false,
        ac: false, heating: true,
        washer: true, dryer: false, dishwasher: false, refrigerator: true, microwave: true, oven: false, stove: true, tv: false,
        balcony: false, terrace: false, garden: true, pool: false, gym: false, elevator: false,
        petFriendly: true, smokingAllowed: true,
        securityCamera: false, keypadEntry: false, safe: false,
    },
};

/* ── AdditionalInfo mock data ──────────────────────────────────────────── */
export const apartmentAdditionalInfo: Record<number, AdditionalInfo> = {
    1: {
        rooms: 3, bedrooms: 2, bathrooms: 1, beds: 2,
        floor: 4, totalFloors: 9, surfaceArea: 72, maxGuests: 4,
        checkInFrom: "14:00", checkInUntil: "22:00",
        checkOutFrom: "08:00", checkOutUntil: "12:00",
        selfCheckIn: true,
        description: "Apartament luminos și modern în inima orașului, renovat în 2022. Aproape de toate facilitățile urbane — magazine, restaurante și transport public.",
        houseRules: "Nu se fumează în interior. Animale de companie acceptate cu acordul prealabil. Liniște după ora 22:00.",
        cancellationPolicy: "flexible",
    },
    2: {
        rooms: 4, bedrooms: 3, bathrooms: 2, beds: 3,
        floor: 7, totalFloors: 12, surfaceArea: 110, maxGuests: 6,
        checkInFrom: "15:00", checkInUntil: "23:00",
        checkOutFrom: "09:00", checkOutUntil: "11:00",
        selfCheckIn: true,
        description: "Apartament de lux cu vedere panoramică asupra orașului. Mobilier premium, bucătărie echipată complet și acces la piscina și sala de fitness din bloc.",
        houseRules: "Nu se fumează. Nu se acceptă animale de companie. Maxim 6 persoane.",
        cancellationPolicy: "moderate",
    },
    3: {
        rooms: 2, bedrooms: 1, bathrooms: 1, beds: 1,
        floor: 2, totalFloors: 5, surfaceArea: 45, maxGuests: 2,
        checkInFrom: "13:00", checkInUntil: "21:00",
        checkOutFrom: "08:00", checkOutUntil: "12:00",
        selfCheckIn: false,
        description: "Apartament cozy pentru 1-2 persoane, într-un cartier liniștit cu acces ușor la grădina botanică. Ideal pentru sejururi lungi.",
        houseRules: "Fumatul permis pe balcon. Animale mici acceptate.",
        cancellationPolicy: "strict",
    },
};

/* ── Reviews mock data ─────────────────────────────────────────────────── */
export const apartmentReviews: Record<number, Review[]> = {
    1: [
        {
            Id_Review: 101, Id_Renter: 5, renterName: "Cojocari Jan", renterAvatarUrl: undefined,
            ratings: { overall: 9.2, cleanliness: 9.0, location: 9.5, valueForMoney: 8.8, comfort: 9.2, facilities: 9.0, communication: 9.5 },
            comment: "Apartament foarte curat și bine dotat. Proprietarul a fost extrem de receptiv și de ajutor. Locație perfectă, la câțiva pași de centru.",
            ownerResponse: "Mulțumesc frumos! A fost o plăcere să vă avem. Reveniți oricând!",
            createdAt: "2024-11-15", stayDuration: 3,
        },
        {
            Id_Review: 102, Id_Renter: 7, renterName: "Corman Gheorghe",
            ratings: { overall: 8.5, cleanliness: 8.0, location: 9.0, valueForMoney: 8.5, comfort: 8.5, facilities: 8.0, communication: 9.0 },
            comment: "Sejur plăcut. Apartamentul e exact cum apare în poze. Self check-in a mers perfect.",
            createdAt: "2024-10-22", stayDuration: 7,
        },
        {
            Id_Review: 103, Id_Renter: 3, renterName: "Istrati Cristian",
            ratings: { overall: 9.8, cleanliness: 10, location: 9.5, valueForMoney: 9.8, comfort: 10, facilities: 9.5, communication: 10 },
            comment: "Cel mai bun apartament în care am stat! Totul era impecabil, de la curățenie la dotări. Recomand cu căldură!",
            createdAt: "2024-09-10", stayDuration: 14,
        },
    ],
    2: [
        {
            Id_Review: 201, Id_Renter: 1, renterName: "Andrei Munteanu",
            ratings: { overall: 9.6, cleanliness: 9.5, location: 9.0, valueForMoney: 9.0, comfort: 10, facilities: 10, communication: 9.5 },
            comment: "Apartament de vis! Piscina și sala de fitness au fost un bonus extraordinar. Vedere superbă din etajul 7.",
            ownerResponse: "Vă mulțumim! Ne bucurăm că ați apreciat facilitățile. Sperăm să vă revedeți!",
            createdAt: "2024-12-01", stayDuration: 5,
        },
        {
            Id_Review: 202, Id_Renter: 9, renterName: "Cristina Luca",
            ratings: { overall: 8.8, cleanliness: 9.0, location: 8.5, valueForMoney: 8.0, comfort: 9.0, facilities: 9.5, communication: 9.0 },
            comment: "Apartament spațios și bine echipat. Parcarea cu plată e singurul minus, dar în rest totul excelent.",
            createdAt: "2024-11-20", stayDuration: 2,
        },
    ],
    3: [
        {
            Id_Review: 301, Id_Renter: 4, renterName: "Ion Vasile",
            ratings: { overall: 7.8, cleanliness: 8.0, location: 8.5, valueForMoney: 8.5, comfort: 7.5, facilities: 7.0, communication: 7.5 },
            comment: "Apartament simplu dar funcțional. Bun raport calitate-preț pentru un sejur mai lung. Zona e liniștită.",
            createdAt: "2024-10-05", stayDuration: 30,
        },
    ],
};

/* ── Helper: get data for apartment (fallback to apt 1 for mock purposes) ─ */
export const getApartmentLocation   = (id: number): MapLocation    => apartmentLocations[id]    ?? apartmentLocations[1];
export const getApartmentFacilities = (id: number): Facilities     => apartmentFacilities[id]   ?? apartmentFacilities[1];
export const getApartmentInfo       = (id: number): AdditionalInfo => apartmentAdditionalInfo[id] ?? apartmentAdditionalInfo[1];
export const getApartmentReviews    = (id: number): Review[]       => apartmentReviews[id]       ?? apartmentReviews[1];