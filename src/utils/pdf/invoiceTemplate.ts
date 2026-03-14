// utils/pdf/invoiceTemplate.ts

import type { InvoiceData } from "./invoiceTypes";

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString("ro-RO", {
        day:   "2-digit",
        month: "long",
        year:  "numeric",
    });
}

function formatCurrency(amount: number, currency: string): string {
    return new Intl.NumberFormat("ro-RO", {
        style:                 "currency",
        currency,
        minimumFractionDigits: 2,
    }).format(amount);
}

export function buildInvoiceHtml(data: InvoiceData): string {
    const { invoiceNumber, createdAt, renter, apartment, cost, paymentMethod } = data;
    const fmt = (n: number) => formatCurrency(n, cost.currency);

    const discountRow = cost.discount && cost.discount > 0 ? `
        <tr>
            <td>Reducere${cost.promoCode ? ` <span class="promo">${cost.promoCode}</span>` : ""}</td>
            <td class="amount green">-${fmt(cost.discount)}</td>
        </tr>` : "";

    const taxesRow = cost.taxes && cost.taxes > 0 ? `
        <tr>
            <td>Taxe & comisioane</td>
            <td class="amount">${fmt(cost.taxes)}</td>
        </tr>` : "";

    const periodCell = apartment.rentedFrom && apartment.rentedTo ? `
        <div class="info-row">
            <span class="info-label">Perioadă</span>
            <span class="info-value">${formatDate(apartment.rentedFrom)} – ${formatDate(apartment.rentedTo)}</span>
        </div>` : "";

    const methodCell = paymentMethod ? `
        <div class="meta-item">
            <div class="meta-label">Metodă de plată</div>
            <div class="meta-value">${paymentMethod}</div>
        </div>` : "";

    return `<!DOCTYPE html>
<html lang="ro">
<head>
<meta charset="UTF-8"/>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    color: #1a1a2e;
    background: #f4f6fb;
    font-size: 13px;
    line-height: 1.6;
    padding: 48px 32px;
  }

  /* ── Outer wrapper — centat cu latime maxima ── */
  .page {
    max-width: 680px;
    margin: 0 auto;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 32px rgba(76,139,245,0.08);
    overflow: hidden;
  }

  /* ── Header band ── */
  .header {
    background: #fff;
    padding: 36px 48px 24px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 3px solid #4c8bf5;
  }

  .logo {
    font-size: 30px;
    font-weight: 900;
    letter-spacing: -1.5px;
    color: #4c8bf5;
  }
  .logo span { color: #1a1a2e; }

  .header-right { text-align: right; }
  .invoice-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #aaa;
    margin-bottom: 4px;
  }
  .invoice-number {
    font-size: 19px;
    font-weight: 900;
    color: #1a1a2e;
    letter-spacing: -0.5px;
  }

  /* ── Body padding ── */
  .body { padding: 32px 48px 40px; }

  /* ── Divider ── */
  .divider {
    border: none;
    border-top: 1px solid #e8eef8;
    margin: 24px 0;
  }

  /* ── Meta row ── */
  .meta-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .meta-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #aaa;
    margin-bottom: 3px;
  }
  .meta-value { font-size: 13px; font-weight: 700; color: #1a1a2e; }

  .badge-paid {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: #e8f5e9;
    color: #2e7d32;
    border-radius: 20px;
    padding: 5px 14px;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  /* ── Parties ── */
  .parties {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }

  .party {
    background: #f8faff;
    border: 1px solid #e8eef8;
    border-radius: 8px;
    padding: 16px 20px;
  }

  .party-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #4c8bf5;
    margin-bottom: 6px;
  }
  .party-name {
    font-size: 15px;
    font-weight: 800;
    color: #1a1a2e;
    margin-bottom: 2px;
  }
  .party-detail { font-size: 12px; color: #777; }

  /* ── Property ── */
  .section-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #aaa;
    margin-bottom: 10px;
  }

  .property-box {
    background: #f8faff;
    border: 1px solid #e8eef8;
    border-radius: 8px;
    padding: 20px 24px;
  }

  .property-address {
    font-size: 16px;
    font-weight: 800;
    color: #1a1a2e;
    margin-bottom: 16px;
  }

  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 12px;
  }

  .info-row { display: flex; flex-direction: column; gap: 3px; }
  .info-label {
    font-size: 10px;
    color: #aaa;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .info-value { font-size: 13px; color: #1a1a2e; font-weight: 700; }

  /* ── Payment table ── */
  table { width: 100%; border-collapse: collapse; }

  thead tr { border-bottom: 1.5px solid #1a1a2e; }
  thead th {
    padding: 6px 0 10px;
    text-align: left;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #aaa;
  }
  thead th:last-child { text-align: right; }

  tbody tr { border-bottom: 1px solid #f0f4ff; }
  tbody td { padding: 13px 0; font-size: 13px; color: #444; }

  td.amount { text-align: right; font-weight: 700; color: #1a1a2e; }
  td.green  { color: #2e7d32; }

  .promo {
    display: inline-block;
    background: #e8f5e9;
    color: #2e7d32;
    padding: 1px 7px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 800;
    margin-left: 6px;
    letter-spacing: 0.5px;
  }

  /* ── Total ── */
  .total-section {
    display: flex;
    justify-content: flex-end;
    padding-top: 16px;
  }

  .total-box {
    min-width: 220px;
    border-top: 2px solid #1a1a2e;
    padding-top: 12px;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 24px;
  }

  .total-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #aaa;
  }

  .total-amount {
    font-size: 24px;
    font-weight: 900;
    color: #4c8bf5;
    letter-spacing: -1px;
  }

  /* ── Footer ── */
  .footer {
    background: #f8faff;
    border-top: 1px solid #e8eef8;
    padding: 20px 48px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .footer-note { font-size: 11px; color: #bbb; font-style: italic; }
  .footer-brand { font-size: 15px; font-weight: 900; color: #4c8bf5; letter-spacing: -0.5px; }
</style>
</head>
<body>
<div class="page">

  <!-- HEADER -->
  <div class="header">
    <div class="logo">Rent<span>ora</span></div>
    <div class="header-right">
      <div class="invoice-label">Notă de plată</div>
      <div class="invoice-number">${invoiceNumber}</div>
    </div>
  </div>

  <div class="body">

    <!-- META -->
    <div class="meta-row">
      <div class="meta-item">
        <div class="meta-label">Data emiterii</div>
        <div class="meta-value">${formatDate(createdAt)}</div>
      </div>
      ${methodCell}
      <div class="badge-paid">&#10003;&nbsp;Achitat</div>
    </div>

    <hr class="divider"/>

    <!-- PARTIES -->
    <div class="parties">
      <div class="party">
        <div class="party-label">Primit de la</div>
        <div class="party-name">${renter.name} ${renter.surname}</div>
        <div class="party-detail">${renter.email}</div>
      </div>
      <div class="party">
        <div class="party-label">Proprietar</div>
        <div class="party-name">${apartment.ownerName}</div>
        <div class="party-detail">Apartament #${apartment.id}</div>
      </div>
    </div>

    <hr class="divider"/>

    <!-- PROPERTY -->
    <div class="section-label">Proprietate închiriată</div>
    <div class="property-box">
      <div class="property-address">${apartment.address}</div>
      <div class="info-grid">
        <div class="info-row">
          <span class="info-label">ID Proprietate</span>
          <span class="info-value">#${apartment.id}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Interval chirie</span>
          <span class="info-value">${apartment.interval}</span>
        </div>
        ${periodCell}
      </div>
    </div>

    <hr class="divider"/>

    <!-- PAYMENT TABLE -->
    <div class="section-label">Detalii plată</div>
    <table>
      <thead>
        <tr>
          <th>Descriere</th>
          <th style="text-align:right">Sumă</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Chirie — ${apartment.address} (${apartment.interval})</td>
          <td class="amount">${fmt(cost.subtotal)}</td>
        </tr>
        ${discountRow}
        ${taxesRow}
      </tbody>
    </table>

    <div class="total-section">
      <div class="total-box">
        <span class="total-label">Total achitat</span>
        <span class="total-amount">${fmt(cost.total)}</span>
      </div>
    </div>

  </div>

  <!-- FOOTER -->
  <div class="footer">
    <div class="footer-note">Mulțumim pentru încredere. Document generat automat.</div>
    <div class="footer-brand">Rentora</div>
  </div>

</div>
</body>
</html>`;
}