export type RentInterval = "hour" | "day" | "month";
export type Currency = "USD" | "EUR" | "MDL";

export type Apartment = {
    Id_Apartment: number;
    Id_Owner: number;
    Id_Renter: number | null;
    Address: string;
    Cost_per_interval: number;
    Currency: Currency;
    Interval: RentInterval;
};
