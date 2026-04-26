// services/notificationService.ts
// Helper-e pentru fiecare tip de notificare. Apelate din paginile relevante.

import type { NotificationType } from "../context/NotificationContext";
import { formatDate } from "../utils/formatDate";

type AddFn = (type: NotificationType, message: string) => void;

// ── Renter ───────────────────────────────────────────────────────────────────

export const renterNotifications = {
    /** Notificare dupa un payment reusit */
    paymentSuccess(add: AddFn, address: string, startDate: Date | null, endDate: Date | null) {
        const period = startDate && endDate
            ? `${formatDate(startDate)} - ${formatDate(endDate)}`
            : "—";
        add(
            "renter_payment_success",
            `Ai inchiriat cu succes ${address} in perioada ${period}.`,
        );
    },

    /** Notificare cand sejurul expira maine (conditia: utcNow + 1zi = endDate) */
    stayExpiring(add: AddFn, address: string, endDate: Date) {
        add(
            "renter_stay_expiring",
            `Sejurul tau pe ${address} se va finaliza maine, ${formatDate(endDate)}.`,
        );
    },
};

// ── Owner ────────────────────────────────────────────────────────────────────

export const ownerNotifications = {
    /** Apartamentul a fost inchiriat de un renter */
    apartmentRented(add: AddFn, address: string, startDate: Date | null, endDate: Date | null) {
        const period = startDate && endDate
            ? `${formatDate(startDate)} - ${formatDate(endDate)}`
            : "—";
        add(
            "owner_rented",
            `${address} a fost inchiriat pe perioada ${period}.`,
        );
    },

    /** Sejurul de pe apartamentul sau expira maine */
    stayExpiring(add: AddFn, address: string, endDate: Date) {
        add(
            "owner_stay_expiring",
            `Sejurul pe ${address} se va incheia maine, ${formatDate(endDate)}.`,
        );
    },

    /** Anuntul a fost trimis spre evaluare (la creare) */
    listingSubmitted(add: AddFn, address: string) {
        add(
            "owner_listing_submitted",
            `Anuntul tau "${address}" a fost trimis catre evaluare. Vei primi o notificare odata ce administratorii valideaza anuntul.`,
        );
    },

    /** Administratorii au aprobat anuntul */
    listingApproved(add: AddFn, address: string) {
        add(
            "owner_listing_approved",
            `Administratorii au acceptat anuntul tau "${address}".`,
        );
    },

    /** Administratorii au refuzat anuntul */
    listingDeclined(add: AddFn, address: string) {
        add(
            "owner_listing_declined",
            `Administratorii au refuzat anuntul tau "${address}".`,
        );
    },

    /** Anuntul a fost modificat cu succes */
    listingEdited(add: AddFn, address: string) {
        add(
            "owner_listing_edited",
            `Anuntul tau "${address}" a fost modificat cu succes.`,
        );
    },

    /** Anuntul a fost sters */
    listingDeleted(add: AddFn, address: string) {
        add(
            "owner_listing_deleted",
            `Anuntul tau "${address}" a fost sters cu succes.`,
        );
    },
};

// ── Admin ────────────────────────────────────────────────────────────────────

export const adminNotifications = {
    newPayment(add: AddFn, info?: string) {
        add(
            "admin_new_payment",
            info
                ? `Plata noua inregistrata: ${info}.`
                : "O noua plata a fost inregistrata pe platforma.",
        );
    },

    newListing(add: AddFn, address?: string) {
        add(
            "admin_new_listing",
            address
                ? `Anunt nou spre evaluare: "${address}".`
                : "Un nou anunt a fost postat si asteapta aprobare.",
        );
    },

    newUser(add: AddFn, name?: string) {
        add(
            "admin_new_user",
            name
                ? `Utilizator nou inregistrat: ${name}.`
                : "Un nou utilizator s-a inregistrat pe platforma.",
        );
    },

    newSupportRequest(add: AddFn, subject?: string) {
        add(
            "admin_new_support",
            subject
                ? `Cerere noua de suport: "${subject}".`
                : "O noua cerere de suport a fost primita.",
        );
    },

    newReview(add: AddFn, address?: string) {
        add(
            "admin_new_review",
            address
                ? `Recenzie noua adaugata pentru "${address}".`
                : "O noua recenzie a fost adaugata pe platforma.",
        );
    },
};