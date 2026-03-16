// utils/pdf/index.ts
// Barrel export — importuri curate din restul aplicației

export type { InvoiceData, InvoiceRenter, InvoiceApartment, InvoiceCostBreakdown } from "./invoiceTypes";
export type { PaymentDto } from "./buildInvoiceData";
export { buildInvoiceData }  from "./buildInvoiceData";
export { buildInvoiceHtml }  from "./invoiceTemplate";
export { generateInvoicePdf } from "./pdfGenerator";