// tokenStore — token persistent in localStorage, supravietuieste refresh-ului
const TOKEN_KEY = "token";

export const tokenStore = {
    get: (): string | null => localStorage.getItem(TOKEN_KEY),
    set: (token: string): void => { localStorage.setItem(TOKEN_KEY, token); },
    clear: (): void => { localStorage.removeItem(TOKEN_KEY); },
};