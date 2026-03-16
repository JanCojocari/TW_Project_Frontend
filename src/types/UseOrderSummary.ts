import { useMemo } from "react";
import { apartments } from "..//mockdata/apartments";
import { SERVICE_FEE_RATE } from "./paymentPageConfig";
import type { OrderSummary } from "./paymentPageConfig";

const intervalLabels: Record<string, string> = { hour: "oră", day: "zi", month: "lună" };

export const useOrderSummary = (
    summaryProp: OrderSummary | undefined,
    apartmentId: string | null,
): OrderSummary =>
    useMemo(() => {
        if (summaryProp) return summaryProp;

        const apt = apartments.find((a) => a.Id_Apartment === Number(apartmentId));
        if (!apt) return { items: [], subtotal: 0, serviceFee: 0, discount: 0, total: 0, currency: "EUR" };

        const subtotal    = apt.Cost_per_interval;
        const serviceFee  = Math.round(subtotal * SERVICE_FEE_RATE * 100) / 100;

        return {
            currency: apt.Currency,
            items: [{
                id:        String(apt.Id_Apartment),
                title:     `Apartament – ${apt.Address}`,
                subtitle:  `Chirie / ${intervalLabels[apt.Interval] ?? apt.Interval}`,
                quantity:  1,
                unitPrice: apt.Cost_per_interval,
            }],
            subtotal,
            serviceFee,
            discount: 0,
            total: subtotal + serviceFee,
        };
    }, [summaryProp, apartmentId]);