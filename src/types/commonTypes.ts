export const Role = {
    admin: 'admin',
    owner: 'owner',
    renter: 'renter',
} as const;

export type Role = typeof Role[keyof typeof Role];
