import type { Currency, RentInterval, Facilities, AdditionalInfo } from "../../types/apartment.types";

export type FormState = {
    address: string;
    cost: string;
    currency: Currency;
    interval: RentInterval;
    images: File[];
    imagePreviewUrls: string[];
    latitude: string;
    longitude: string;
    city: string;
    region: string;
    postalCode: string;
    landmarks: string[];
    landmarkInput: string;
    facilities: Facilities;
    rooms: string;
    bedrooms: string;
    bathrooms: string;
    beds: string;
    floor: string;
    totalFloors: string;
    surfaceArea: string;
    maxGuests: string;
    checkInFrom: string;
    checkInUntil: string;
    checkOutFrom: string;
    checkOutUntil: string;
    selfCheckIn: boolean;
    description: string;
    houseRules: string;
    cancellationPolicy: AdditionalInfo["cancellationPolicy"];
};

export type Errors = Partial<Record<string, string>>;

export const defaultFacilities: Facilities = {
    wifi: false, parking: false, parkingFree: false,
    ac: false, heating: false,
    washer: false, dryer: false, dishwasher: false, refrigerator: false,
    microwave: false, oven: false, stove: false, tv: false,
    balcony: false, terrace: false, garden: false, pool: false,
    gym: false, elevator: false,
    petFriendly: false, smokingAllowed: false,
    securityCamera: false, keypadEntry: false, safe: false,
};

export const initialForm: FormState = {
    address: "", cost: "", currency: "EUR", interval: "month",
    images: [], imagePreviewUrls: [],
    latitude: "", longitude: "", city: "Chișinău", region: "", postalCode: "",
    landmarks: [], landmarkInput: "",
    facilities: { ...defaultFacilities },
    rooms: "", bedrooms: "", bathrooms: "", beds: "",
    floor: "", totalFloors: "", surfaceArea: "", maxGuests: "",
    checkInFrom: "14:00", checkInUntil: "22:00",
    checkOutFrom: "08:00", checkOutUntil: "12:00",
    selfCheckIn: false,
    description: "", houseRules: "",
    cancellationPolicy: "flexible",
};

export const validate = (form: FormState): Errors => {
    const e: Errors = {};
    if (!form.address.trim())     e.address     = "Adresa este obligatorie";
    if (!form.cost || isNaN(Number(form.cost)) || Number(form.cost) <= 0)
        e.cost        = "Introduceți un preț valid";
    if (!form.city.trim())        e.city        = "Orașul este obligatoriu";
    if (!form.description.trim()) e.description = "Descrierea este obligatorie";
    if (form.images.length === 0) e.images      = "Adăugați cel puțin o imagine";
    return e;
};

export const toggleSx = {
    display: "flex", flexWrap: "wrap", gap: 1,
    "& .MuiToggleButton-root": {
        borderRadius: "10px !important",
        border: "1px solid var(--border) !important",
        fontWeight: 700, fontSize: 13, py: 1, px: 2,
        textTransform: "none",
        "&.Mui-selected": {
            background: "linear-gradient(135deg, #7096BE, #5a7fa8)",
            color: "white",
            borderColor: "transparent !important",
        },
    },
};