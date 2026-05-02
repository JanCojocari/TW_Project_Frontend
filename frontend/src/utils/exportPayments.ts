import * as XLSX from "xlsx";
import type { AdminPayment } from "../services/adminService.ts";

// Mapare date payment -> rand tabel
function toRows(payments: AdminPayment[], labels: Record<string, string>) {
    return payments.map(p => ({
        [labels.id]:        p.id,
        [labels.apartment]: p.apartmentAddress || `#${p.apartmentId}`,
        [labels.renter]:    `${p.renterName} ${p.renterSurname}`,
        [labels.email]:     p.renterEmail,
        [labels.owner]:     p.ownerName || `#${p.ownerId}`,
        [labels.amount]:    `${p.currency} ${p.totalCost.toFixed(2)}`,
        [labels.period]:    p.startDate && p.endDate
            ? `${p.startDate.slice(0, 10)} - ${p.endDate.slice(0, 10)}`
            : "—",
        [labels.date]:      p.createdAt.slice(0, 10),
    }));
}

export function exportToXlsx(payments: AdminPayment[], fileName: string, labels: Record<string, string>) {
    const rows      = toRows(payments, labels);
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook  = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");

    // Latime coloane automat
    const colWidths = Object.keys(rows[0] ?? {}).map(key => ({
        wch: Math.max(key.length, ...rows.map(r => String(r[key] ?? "").length)) + 2,
    }));
    worksheet["!cols"] = colWidths;

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
}

export function exportToCsv(payments: AdminPayment[], fileName: string, labels: Record<string, string>) {
    const rows      = toRows(payments, labels);
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const csv       = XLSX.utils.sheet_to_csv(worksheet);

    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href     = url;
    link.download = `${fileName}.csv`;
    link.click();
    URL.revokeObjectURL(url);
}