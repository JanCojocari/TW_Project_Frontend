import type { Currency, RentInterval, Facilities, AdditionalInfo } from "./apartment.types.ts";

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

const isPositiveInt = (val: string) => !!val && !isNaN(Number(val)) && Number(val) > 0;
const isPositiveNum = (val: string) => !!val && !isNaN(Number(val)) && Number(val) > 0;

// Validare per-step: verifica doar campurile relevante pentru step-ul curent
export const validateStep = (form: FormState, step: number): Errors => {
    const e: Errors = {};
    if (step === 0) {
        if (!form.address.trim())
            e.address = "Adresa este obligatorie";
        if (!isPositiveNum(form.cost))
            e.cost = "Introduceți un preț valid";
    }
    if (step === 1) {
        if (form.images.length === 0)
            e.images = "Adăugați cel puțin o imagine";
    }
    if (step === 2) {
        if (!form.city.trim())
            e.city = "Orașul este obligatoriu";
        if (!form.region.trim())
            e.region = "Districtul este obligatoriu";
        if (!form.postalCode.trim())
            e.postalCode = "Codul poștal este obligatoriu";
    }
    // step 3 (facilities) este optional
    if (step === 4) {
        if (!isPositiveInt(form.rooms))
            e.rooms = "Numărul de camere este obligatoriu";
        if (!isPositiveInt(form.bedrooms))
            e.bedrooms = "Numărul de dormitoare este obligatoriu";
        if (!isPositiveInt(form.bathrooms))
            e.bathrooms = "Numărul de băi este obligatoriu";
        if (!isPositiveInt(form.beds))
            e.beds = "Numărul de paturi este obligatoriu";
        if (!isPositiveInt(form.floor))
            e.floor = "Etajul este obligatoriu";
        if (!isPositiveInt(form.totalFloors))
            e.totalFloors = "Numărul total de etaje este obligatoriu";
        if (!isPositiveNum(form.surfaceArea))
            e.surfaceArea = "Suprafața este obligatorie";
        if (!isPositiveInt(form.maxGuests))
            e.maxGuests = "Numărul maxim de oaspeți este obligatoriu";
        if (!form.checkInFrom.trim())
            e.checkInFrom = "Ora de check-in (de la) este obligatorie";
        if (!form.checkInUntil.trim())
            e.checkInUntil = "Ora de check-in (până la) este obligatorie";
        if (!form.checkOutFrom.trim())
            e.checkOutFrom = "Ora de check-out (de la) este obligatorie";
        if (!form.checkOutUntil.trim())
            e.checkOutUntil = "Ora de check-out (până la) este obligatorie";
    }
    if (step === 5) {
        if (!form.description.trim())
            e.description = "Descrierea este obligatorie";
    }
    return e;
};

export const validate = (form: FormState): Errors => {
    const e: Errors = {};
    if (!form.address.trim())          e.address     = "Adresa este obligatorie";
    if (!isPositiveNum(form.cost))     e.cost        = "Introduceți un preț valid";
    if (form.images.length === 0)      e.images      = "Adăugați cel puțin o imagine";
    if (!form.city.trim())             e.city        = "Orașul este obligatoriu";
    if (!form.region.trim())           e.region      = "Districtul este obligatoriu";
    if (!form.postalCode.trim())       e.postalCode  = "Codul poștal este obligatoriu";
    if (!isPositiveInt(form.rooms))    e.rooms       = "Numărul de camere este obligatoriu";
    if (!isPositiveInt(form.bedrooms)) e.bedrooms    = "Numărul de dormitoare este obligatoriu";
    if (!isPositiveInt(form.bathrooms))e.bathrooms   = "Numărul de băi este obligatoriu";
    if (!isPositiveInt(form.beds))     e.beds        = "Numărul de paturi este obligatoriu";
    if (!isPositiveInt(form.floor))    e.floor       = "Etajul este obligatoriu";
    if (!isPositiveInt(form.totalFloors)) e.totalFloors = "Numărul total de etaje este obligatoriu";
    if (!isPositiveNum(form.surfaceArea)) e.surfaceArea = "Suprafața este obligatorie";
    if (!isPositiveInt(form.maxGuests))   e.maxGuests   = "Numărul maxim de oaspeți este obligatoriu";
    if (!form.checkInFrom.trim())      e.checkInFrom  = "Ora de check-in (de la) este obligatorie";
    if (!form.checkInUntil.trim())     e.checkInUntil = "Ora de check-in (până la) este obligatorie";
    if (!form.checkOutFrom.trim())     e.checkOutFrom = "Ora de check-out (de la) este obligatorie";
    if (!form.checkOutUntil.trim())    e.checkOutUntil = "Ora de check-out (până la) este obligatorie";
    if (!form.description.trim())      e.description  = "Descrierea este obligatorie";
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