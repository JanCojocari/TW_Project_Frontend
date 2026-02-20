import type {Role} from "./commonTypes.ts";

export type User = {
    Id_User: number;
    Name: string;
    Surname: string;
    Password: string;
    Email: string | null;
    Phone: string;
    Birthday: string;
    Gender: string;
    Account_sold: number;
    Role?: Role
};


