// mockdata/settingsMock.ts
// Date mock temporare — se înlocuiesc cu răspunsul de la GET /api/users/{id}

export interface UserSettingsDto {
    id:             number;
    name:           string;
    surname:        string;
    email:          string;
    phone:          string;
    birthday:       string;   // ISO date string
    gender:         string;
    accountBalance: number;
    currency:       "EUR" | "USD" | "MDL";
    role:           "Renter" | "Owner" | "Admin";
}

export const MOCK_USER: UserSettingsDto = {
    id:             1,
    name:           "Alexandru",
    surname:        "Moraru",
    email:          "alex.moraru@email.com",
    phone:          "+373 69 123 456",
    birthday:       "1999-05-14",
    gender:         "male",
    accountBalance: 1240.00,
    currency:       "EUR",
    role:           "Renter",
};