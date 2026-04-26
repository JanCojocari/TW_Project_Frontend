// components/notifications/notifMeta.ts
// Mapeaza tipul de notificare la icoana MUI si culoarea accent.

import PaymentIcon        from "@mui/icons-material/Payment";
import HouseIcon          from "@mui/icons-material/House";
import CheckCircleIcon    from "@mui/icons-material/CheckCircle";
import CancelIcon         from "@mui/icons-material/Cancel";
import EditIcon            from "@mui/icons-material/Edit";
import DeleteIcon         from "@mui/icons-material/Delete";
import EventBusyIcon      from "@mui/icons-material/EventBusy";
import PersonAddIcon      from "@mui/icons-material/PersonAdd";
import SupportAgentIcon   from "@mui/icons-material/SupportAgent";
import StarIcon           from "@mui/icons-material/Star";
import PendingIcon        from "@mui/icons-material/Pending";
import type { SvgIconComponent } from "@mui/icons-material";
import type { NotificationType } from "../../context/NotificationContext";

export function notifIcon(type: NotificationType): SvgIconComponent {
    const map: Record<NotificationType, SvgIconComponent> = {
        renter_payment_success:  PaymentIcon,
        renter_stay_expiring:    EventBusyIcon,
        owner_rented:            HouseIcon,
        owner_stay_expiring:     EventBusyIcon,
        owner_listing_submitted: PendingIcon,
        owner_listing_approved:  CheckCircleIcon,
        owner_listing_declined:  CancelIcon,
        owner_listing_edited:    EditIcon,
        owner_listing_deleted:   DeleteIcon,
        admin_new_payment:       PaymentIcon,
        admin_new_listing:       HouseIcon,
        admin_new_user:          PersonAddIcon,
        admin_new_support:       SupportAgentIcon,
        admin_new_review:        StarIcon,
    };
    return map[type] ?? HouseIcon;
}

export function notifColor(type: NotificationType): string {
    const map: Record<NotificationType, string> = {
        renter_payment_success:  "#22c55e",   // verde
        renter_stay_expiring:    "#f59e0b",   // amber
        owner_rented:            "#3b82f6",   // albastru
        owner_stay_expiring:     "#f59e0b",   // amber
        owner_listing_submitted: "#8b5cf6",   // violet
        owner_listing_approved:  "#22c55e",   // verde
        owner_listing_declined:  "#ef4444",   // rosu
        owner_listing_edited:    "#3b82f6",   // albastru
        owner_listing_deleted:   "#6b7280",   // gri
        admin_new_payment:       "#22c55e",   // verde
        admin_new_listing:       "#8b5cf6",   // violet
        admin_new_user:          "#3b82f6",   // albastru
        admin_new_support:       "#f59e0b",   // amber
        admin_new_review:        "#f59e0b",   // amber/gold
    };
    return map[type] ?? "#6b7280";
}