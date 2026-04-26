// context/NotificationContext.tsx
import {
    createContext, useContext, useState, useCallback,
    useEffect, type ReactNode,
} from "react";
import { useAuth } from "../auth/AuthContext";

// ── Tipuri ──────────────────────────────────────────────────────────────────

export type NotificationType =
// renter
    | "renter_payment_success"
    | "renter_stay_expiring"
    // owner
    | "owner_rented"
    | "owner_stay_expiring"
    | "owner_listing_submitted"
    | "owner_listing_approved"
    | "owner_listing_declined"
    | "owner_listing_edited"
    | "owner_listing_deleted"
    // admin
    | "admin_new_payment"
    | "admin_new_listing"
    | "admin_new_user"
    | "admin_new_support"
    | "admin_new_review";

export interface AppNotification {
    id:        string;
    type:      NotificationType;
    message:   string;
    createdAt: string;
    read:      boolean;
}

interface NotificationContextType {
    notifications: AppNotification[];
    unreadCount:   number;
    addNotification:    (type: NotificationType, message: string) => void;
    markRead:           (id: string) => void;
    markAllRead:        () => void;
    removeNotification: (id: string) => void;
    clearAll:           () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

function storageKey(userId: number) {
    return `rentora_notifications_${userId}`;
}

function loadFromStorage(userId: number): AppNotification[] {
    try {
        const raw = localStorage.getItem(storageKey(userId));
        if (!raw) return [];
        return JSON.parse(raw) as AppNotification[];
    } catch {
        return [];
    }
}

function saveToStorage(userId: number, items: AppNotification[]) {
    localStorage.setItem(storageKey(userId), JSON.stringify(items.slice(0, 50)));
}

// ── Provider ────────────────────────────────────────────────────────────────

export function NotificationProvider({ children }: { children: ReactNode }) {
    const { currentUser } = useAuth();
    const [notifications, setNotifications] = useState<AppNotification[]>([]);

    // incarca din localStorage cand userul se schimba (login/logout)
    useEffect(() => {
        if (currentUser?.id) {
            setNotifications(loadFromStorage(currentUser.id));
        } else {
            setNotifications([]);
        }
    }, [currentUser?.id]);

    // asculta modificari din alte taburi (ex: admin scrie in localStorage-ul ownerului)
    useEffect(() => {
        if (!currentUser?.id) return;

        const key = storageKey(currentUser.id);

        const handleStorageEvent = (e: StorageEvent) => {
            // reactionam doar la cheia acestui user
            if (e.key !== key) return;
            setNotifications(loadFromStorage(currentUser.id));
        };

        window.addEventListener("storage", handleStorageEvent);
        return () => window.removeEventListener("storage", handleStorageEvent);
    }, [currentUser?.id]);

    // salveaza in localStorage la orice schimbare locala
    useEffect(() => {
        if (currentUser?.id) {
            saveToStorage(currentUser.id, notifications);
        }
    }, [notifications, currentUser?.id]);

    const addNotification = useCallback(
        (type: NotificationType, message: string) => {
            const notif: AppNotification = {
                id:        `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
                type,
                message,
                createdAt: new Date().toISOString(),
                read:      false,
            };
            setNotifications(prev => [notif, ...prev]);
        },
        [],
    );

    const markRead = useCallback((id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    }, []);

    const markAllRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }, []);

    const removeNotification = useCallback((id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const clearAll = useCallback(() => {
        setNotifications([]);
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                addNotification,
                markRead,
                markAllRead,
                removeNotification,
                clearAll,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

// ── Hook ────────────────────────────────────────────────────────────────────

export function useNotifications() {
    const ctx = useContext(NotificationContext);
    if (!ctx) throw new Error("useNotifications must be used inside NotificationProvider");
    return ctx;
}