import { useState, useEffect } from "react";
import { apartmentService } from "../services/apartmentService";
import { SERVICE_FEE_RATE } from "./paymentPageConfig";
import type { OrderSummary } from "./paymentPageConfig";
import { useTranslation } from "react-i18next";

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
    const { t } = useTranslation();

    const [summary, setSummary] = useState<OrderSummary>(
        summaryProp ?? { items: [], subtotal: 0, serviceFee: 0, discount: 0, total: 0, currency: "EUR" }
    );

    useEffect(() => {
        if (summaryProp) { setSummary(summaryProp); return; }
        if (!apartmentId) return;

        apartmentService.getById(Number(apartmentId)).then(apt => {
            if (!apt) return;

            const intervalLabels: Record<string, string> = {
                hour:  t("payment.intervalHour"),
                day:   t("payment.intervalDay"),
                month: t("payment.intervalMonth"),
            };

            const intervals = hours
                ? hours
                : (startDate && endDate)
                    ? calcIntervals(startDate, endDate, apt.Interval)
                    : 1;

            const subtotal   = Math.round(apt.Cost_per_interval * intervals * 100) / 100;
            const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE * 100) / 100;
            const intervalLabel = intervalLabels[apt.Interval] ?? apt.Interval;

            setSummary({
                currency: apt.Currency as OrderSummary["currency"],
                items: [{
                    id:       String(apt.Id_Apartment),
                    title:    `${t("payment.itemTitle")} – ${apt.Address}`,
                    subtitle: startDate && endDate
                        ? `${intervals} ${intervalLabel}${t("payment.intervalPlural")}`
                        : `${t("payment.itemSubtitleRent")} / ${intervalLabel}`,
                    quantity:  intervals,
                    unitPrice: apt.Cost_per_interval,
                }],
                subtotal,
                serviceFee,
                discount: 0,
                total: subtotal + serviceFee,
            });
        }).catch(() => {});
    }, [summaryProp, apartmentId, startDate, endDate, hours, t]);

    return summary;
};