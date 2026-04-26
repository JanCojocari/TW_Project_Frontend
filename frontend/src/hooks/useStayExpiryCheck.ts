// hooks/useStayExpiryCheck.ts  [VERSIUNE FINALA]
import { useEffect, useRef } from "react";
import { useAuth }           from "../auth/AuthContext";
import { useNotifications }  from "../context/NotificationContext";
import { renterNotifications, ownerNotifications } from "../services/notificationService";
import { paymentHistoryService } from "../services/paymentHistoryService";
import { apartmentService }      from "../services/apartmentService";
import { flushAdminQueue }       from "../utils/adminNotifHelper";

function isTomorrow(dateStr: string | null | undefined): boolean {
    if (!dateStr) return false;
    const end      = new Date(dateStr);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return (
        end.getFullYear() === tomorrow.getFullYear() &&
        end.getMonth()    === tomorrow.getMonth()    &&
        end.getDate()     === tomorrow.getDate()
    );
}

export function useStayExpiryCheck() {
    const { currentUser }                    = useAuth();
    const { addNotification, notifications } = useNotifications();
    const checked = useRef(false);

    useEffect(() => {
        if (!currentUser || checked.current) return;
        checked.current = true;

        const role = currentUser.role;

        // Admin: importa notificarile din coada globala
        if (role === 0) {
            flushAdminQueue(currentUser.id);
            // Fortam reincarcarea contextului prin storage event
            window.dispatchEvent(new StorageEvent("storage", {
                key: `rentora_notifications_${currentUser.id}`,
            }));
        }

        // Renter: sejur care expira maine
        if (role === 2) {
            paymentHistoryService
                .getByRenter(currentUser.id)
                .then(payments => {
                    payments.forEach(p => {
                        if (!isTomorrow(p.endDate)) return;
                        const alreadySent = notifications.some(
                            n => n.type === "renter_stay_expiring" &&
                                p.endDate && n.message.includes(p.endDate.slice(0, 10)),
                        );
                        if (alreadySent) return;
                        apartmentService.getById(p.apartmentId).then(apt => {
                            if (!apt) return;
                            renterNotifications.stayExpiring(
                                addNotification, apt.Address, new Date(p.endDate!),
                            );
                        }).catch(() => {});
                    });
                })
                .catch(() => {});
        }

        // Owner: sejur pe apartamentele sale care expira maine
        if (role === 1) {
            apartmentService.getByOwner(currentUser.id).then(apts => {
                apts
                    .filter(a => a.Id_Renter !== null && a.Id_Renter !== undefined)
                    .forEach(apt => {
                        paymentHistoryService.getByApartment(apt.Id_Apartment)
                            .then(payments => {
                                const active = payments.find(
                                    p => p.rentedTo && isTomorrow(p.rentedTo),
                                );
                                if (!active?.rentedTo) return;
                                const alreadySent = notifications.some(
                                    n => n.type === "owner_stay_expiring" &&
                                        active.rentedTo && n.message.includes(active.rentedTo.slice(0, 10)),
                                );
                                if (!alreadySent) {
                                    ownerNotifications.stayExpiring(
                                        addNotification, apt.Address, new Date(active.rentedTo),
                                    );
                                }
                            }).catch(() => {});
                    });
            }).catch(() => {});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser?.id]);
}