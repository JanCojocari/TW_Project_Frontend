// components/filters/filterTypes.ts
// Tipuri pure și constante — fără JSX, fără React imports

import type { Currency, Facilities } from "./apartment.types";

export type FilterState = {
    currency:     Currency | "ALL";
    priceRange:   [number, number];
    interval:     "hour" | "day" | "month" | "ALL";
    facilities:   Partial<Record<keyof Facilities, boolean>>;
    city:         string;
    checkIn:      string;
    checkOut:     string;
    minRating:    number | null;
    minReviews:   number | null;
};

export const defaultFilters: FilterState = {
    currency: "ALL", priceRange: [0, 50000], interval: "ALL",
    facilities: {}, city: "", checkIn: "", checkOut: "",
    minRating: null, minReviews: null,
};

export const priceConfig: Record<string, { min: number; max: number; step: number; symbol: string }> = {
    ALL: { min: 0, max: 2000, step: 10,  symbol: ""    },
    USD: { min: 0, max: 1000, step: 5,   symbol: "$"   },
    EUR: { min: 0, max: 1000, step: 5,   symbol: "€"   },
    MDL: { min: 0, max: 5000, step: 50,  symbol: "lei" },
};

export interface FacilityItem {
    key:   keyof Facilities;
    label: string;
    icon:  string;   // nume icon — instanțiat în FacilitiesFilter.tsx
}

export interface FacilityGroup {
    title: string;
    items: FacilityItem[];
}

// Configurație facilități — fără JSX, iconițele sunt string-uri cu numele componentei
export const facilityGroupsConfig: FacilityGroup[] = [
    { title: "Internet & Parcare", items: [
            { key: "wifi",        label: "Wi-Fi",            icon: "Wifi"           },
            { key: "parking",     label: "Parcare",          icon: "LocalParking"   },
            { key: "parkingFree", label: "Parcare gratuită", icon: "LocalParking"   },
        ]},
    { title: "Climă", items: [
            { key: "ac",      label: "Aer condiționat", icon: "AcUnit"              },
            { key: "heating", label: "Încălzire",       icon: "LocalFireDepartment" },
        ]},
    { title: "Electrocasnice", items: [
            { key: "washer",       label: "Mașină spălat", icon: "LocalLaundryService" },
            { key: "dryer",        label: "Uscător",       icon: "DryCleaning"         },
            { key: "dishwasher",   label: "Mașină vase",   icon: "Kitchen"             },
            { key: "refrigerator", label: "Frigider",      icon: "Kitchen"             },
            { key: "microwave",    label: "Microunde",     icon: "Kitchen"             },
            { key: "oven",         label: "Cuptor",        icon: "Kitchen"             },
            { key: "stove",        label: "Plită",         icon: "Kitchen"             },
            { key: "tv",           label: "TV",            icon: "Tv"                  },
        ]},
    { title: "Spații", items: [
            { key: "balcony",  label: "Balcon",       icon: "Balcony"      },
            { key: "terrace",  label: "Terasă",       icon: "Balcony"      },
            { key: "garden",   label: "Grădină",      icon: "Balcony"      },
            { key: "pool",     label: "Piscină",      icon: "Pool"         },
            { key: "gym",      label: "Sală fitness", icon: "FitnessCenter"},
            { key: "elevator", label: "Ascensor",     icon: "Elevator"     },
        ]},
    { title: "Politici", items: [
            { key: "petFriendly",    label: "Animale acceptate", icon: "Pets"         },
            { key: "smokingAllowed", label: "Fumat permis",      icon: "SmokingRooms" },
        ]},
    { title: "Securitate", items: [
            { key: "securityCamera", label: "Cameră securitate", icon: "Security" },
            { key: "keypadEntry",    label: "Intrare cod",       icon: "Lock"     },
            { key: "safe",           label: "Seif",              icon: "Lock"     },
        ]},
];