// utils/adminNotifHelper.ts
// Scrie notificari in localStorage-ul admin-ilor.
// Deoarece nu stim ID-urile tuturor adminilor, stocam notificarile admin
// intr-o cheie separata `rentora_admin_notifications` si la login
// le migreaza in cheia proprie a userului admin.

export type AdminNotifType =
    | "admin_new_payment"
    | "admin_new_listing"
    | "admin_new_user"
    | "admin_new_support"
    | "admin_new_review";

const ADMIN_QUEUE_KEY = "rentora_admin_notif_queue";

export function pushAdminQueueNotif(type: AdminNotifType, message: string) {
    const notif = {
        id:        `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        type,
        message,
        createdAt: new Date().toISOString(),
        read:      false,
    };
    try {
        const prev = JSON.parse(localStorage.getItem(ADMIN_QUEUE_KEY) ?? "[]");
        localStorage.setItem(ADMIN_QUEUE_KEY, JSON.stringify([notif, ...prev].slice(0, 50)));
    } catch { /* ignore */ }
}

/** Apelata din useStayExpiryCheck sau AuthContext la login admin */
export function flushAdminQueue(adminId: number) {
    try {
        const queue = JSON.parse(localStorage.getItem(ADMIN_QUEUE_KEY) ?? "[]");
        if (queue.length === 0) return;
        const key = `rentora_notifications_${adminId}`;
        const prev = JSON.parse(localStorage.getItem(key) ?? "[]");
        localStorage.setItem(key, JSON.stringify([...queue, ...prev].slice(0, 50)));
        localStorage.removeItem(ADMIN_QUEUE_KEY);
    } catch { /* ignore */ }
}