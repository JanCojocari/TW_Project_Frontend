import { useState, useEffect } from "react";
import { apartmentService } from "../services/apartmentService";
import { SERVICE_FEE_RATE } from "./paymentPageConfig";
import type { OrderSummary } from "./paymentPageConfig";

const intervalLabels: Record<string, string> = { hour: "oră", day: "zi", month: "lună" };

// calculeaza nr de intervale intre doua date
function calcIntervals(start: Date, end: Date, interval: string): number {
    const diffMs   = end.getTime() - start.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    if (interval === "hour")  return Math.ceil(diffMs / (1000 * 60 * 60));
    if (interval === "day")   return Math.ceil(diffDays);
    if (interval === "month") return Math.max(1, Math.floor(diffDays / 30));
    return 1;
}

export const useOrderSummary = (
    summaryProp: OrderSummary | undefined,
    apartmentId: string | null,
    startDate:   Date | null,
    endDate:     Date | null,
    hours?:      number,
): OrderSummary => {
    const [summary, setSummary] = useState<OrderSummary>(
        summaryProp ?? { items: [], subtotal: 0, serviceFee: 0, discount: 0, total: 0, currency: "EUR" }
        
    );

    useEffect(() => {
        if (summaryProp) { setSummary(summaryProp); return; }
        if (!apartmentId) return;

        apartmentService.getById(Number(apartmentId)).then(apt => {
            if (!apt) return;

            const intervals = hours
                ? hours
                : (startDate && endDate)
                    ? calcIntervals(startDate, endDate, apt.Interval)
                    : 1;

            const subtotal   = Math.round(apt.Cost_per_interval * intervals * 100) / 100;
            const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE * 100) / 100;

            setSummary({
                currency: apt.Currency as OrderSummary["currency"],
                items: [{
                    id:        String(apt.Id_Apartment),
                    title:     `Apartament – ${apt.Address}`,
                    subtitle:  startDate && endDate
                        ? `${intervals} ${intervalLabels[apt.Interval] ?? apt.Interval}(e)`
                        : `Chirie / ${intervalLabels[apt.Interval] ?? apt.Interval}`,
                    quantity:  intervals,
                    unitPrice: apt.Cost_per_interval,
                }],
                subtotal,
                serviceFee,
                discount: 0,
                total: subtotal + serviceFee,
            });
        }).catch(() => {});
    }, [summaryProp, apartmentId, startDate, endDate, hours]);

    return summary;
};