export type User = {
    Id_User: number;
    Name: string;
    Surname: string;
    Password: string;
    Email: string | null;
    Phone: string;
    Birthday: string;
    Gender: "male" | "female" | null;
    Account_sold: number;
};