import puppeteer from "puppeteer";
import { formatDate } from "./utils";

export interface PdfDocumentData {
  documentNumber: string;
  documentDate: Date | string;
  version: string;
  title: string;
  periodStart: Date | string;
  periodEnd: Date | string;
  complaints: Array<{
    no: number;
    reportDate: Date | string;
    customerName: string;
    source: string;
    description: string;
    correctiveAction: string | null;
    verificationDate: Date | string | null;
    picName: string | null;
    verificationResult: string | null;
    remark: string | null;
  }>;
  signatures: Array<{
    role: "pelaksana" | "management_representative";
    userName: string;
    position?: string | null;
    signatureData?: string | null; // base64
    signedAt?: Date | string | null;
  }>;
}

export function generateHtmlTemplate(data: PdfDocumentData): string {
  const pelaksanaSig = data.signatures.find((s) => s.role === "pelaksana");
  const mgmtSig = data.signatures.find(
    (s) => s.role === "management_representative"
  );

  const rowsHtml =
    data.complaints.length === 0
      ? `<tr><td colspan="10" style="text-align: center; padding: 20px; color: #888;">Tidak ada data keluhan pada periode ini.</td></tr>`
      : data.complaints
          .map(
            (c) => `
    <tr>
      <td style="text-align: center; width: 30px;">${c.no}</td>
      <td style="text-align: center; width: 75px; white-space: nowrap;">${formatDate(c.reportDate)}</td>
      <td style="width: 130px; font-weight: 500;">${escapeHtml(c.customerName)}</td>
      <td style="width: 80px; text-align: center;">${escapeHtml(c.source)}</td>
      <td style="width: 180px;">${escapeHtml(c.description)}</td>
      <td style="width: 180px;">${escapeHtml(c.correctiveAction || "-")}</td>
      <td style="text-align: center; width: 75px; white-space: nowrap;">${c.verificationDate ? formatDate(c.verificationDate) : "-"}</td>
      <td style="text-align: center; width: 90px;">${escapeHtml(c.picName || "-")}</td>
      <td style="width: 140px;">${escapeHtml(c.verificationResult || "-")}</td>
      <td style="width: 100px;">${escapeHtml(c.remark || "-")}</td>
    </tr>
  `
          )
          .join("");

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(data.documentNumber)}</title>
  <style>
    @page {
      size: A4 landscape;
      margin: 12mm 15mm 15mm 15mm;
    }
    * {
      box-sizing: border-box;
      font-family: 'Calibri', 'Arial', sans-serif;
    }
    body {
      margin: 0;
      padding: 0;
      color: #000;
      font-size: 9.5pt;
      line-height: 1.25;
    }
    /* Header Container matching Excel Sheet1 cells A1:O4 */
    .header-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 8px;
    }
    .header-table td {
      border: 1px solid #000;
      padding: 4px 6px;
      vertical-align: middle;
    }
    .logo-cell {
      width: 90px;
      text-align: center;
      background: #fff;
    }
    .inst-cell {
      text-align: center;
      font-weight: bold;
      font-size: 11pt;
    }
    .inst-sub {
      font-size: 9pt;
      font-weight: bold;
      margin-top: 2px;
    }
    .title-cell {
      text-align: center;
      font-weight: bold;
      font-size: 11pt;
      padding: 8px;
      background-color: #f8f9fa;
    }
    .meta-label {
      width: 90px;
      font-size: 8.5pt;
      font-weight: 500;
    }
    .meta-val {
      width: 170px;
      font-size: 8.5pt;
      font-family: 'Courier New', monospace;
      font-weight: 600;
    }

    /* Main Table matching Row 7 to 10 of template */
    .content-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 6px;
      page-break-inside: auto;
    }
    .content-table th, .content-table td {
      border: 1px solid #000;
      padding: 5px 6px;
      font-size: 8.5pt;
      vertical-align: top;
    }
    .content-table th {
      background-color: #f2f2f2;
      text-align: center;
      font-weight: bold;
      vertical-align: middle;
    }
    .content-table tr {
      page-break-inside: avoid;
      page-break-after: auto;
    }
    .sub-th {
      font-size: 8pt;
    }

    /* Signature Section matching Excel E36:O43 */
    .footer-section {
      margin-top: 20px;
      width: 100%;
      page-break-inside: avoid;
    }
    .sig-table {
      width: 100%;
      border-collapse: collapse;
    }
    .sig-table td {
      width: 50%;
      text-align: center;
      vertical-align: top;
      padding: 4px;
    }
    .sig-title {
      font-size: 9pt;
      font-weight: bold;
      margin-bottom: 50px;
    }
    .sig-img {
      max-height: 55px;
      max-width: 150px;
      margin-bottom: 5px;
    }
    .sig-name {
      font-size: 9.5pt;
      font-weight: bold;
      text-decoration: underline;
    }
    .sig-role {
      font-size: 8.5pt;
      color: #333;
    }
  </style>
</head>
<body>

  <!-- DOCUMENT HEADER -->
  <table class="header-table">
    <tr>
      <td rowspan="2" class="logo-cell">
        <div style="font-weight: 900; font-size: 16pt; color: #1e3a8a; letter-spacing: 1px;">KAI</div>
      </td>
      <td rowspan="2" class="inst-cell">
        PT KERETA API INDONESIA (PERSERO)
        <div class="inst-sub">SISTEM INFORMASI</div>
      </td>
      <td class="meta-label">No. Dokumen</td>
      <td class="meta-val">: ${escapeHtml(data.documentNumber)}</td>
    </tr>
    <tr>
      <td class="meta-label">Tanggal</td>
      <td class="meta-val">: ${formatDate(data.documentDate)}</td>
    </tr>
    <tr>
      <td colspan="2" class="title-cell">
        ${escapeHtml(data.title)}
      </td>
      <td class="meta-label">Versi</td>
      <td class="meta-val">: ${escapeHtml(data.version)}</td>
    </tr>
  </table>

  <!-- TABLE DATA -->
  <table class="content-table">
    <thead>
      <tr>
        <th rowspan="3" style="width: 25px;">No</th>
        <th rowspan="3" style="width: 75px;">Tanggal</th>
        <th rowspan="3" style="width: 125px;">Pelanggan</th>
        <th rowspan="3" style="width: 75px;">Sumber</th>
        <th rowspan="3">Deskripsi Keluhan</th>
        <th rowspan="3">Tindakan perbaikan dan pencegahan yang diambil</th>
        <th colspan="3">Verification</th>
        <th rowspan="3" style="width: 100px;">Keterangan</th>
      </tr>
      <tr>
        <th style="width: 70px;" class="sub-th">Tgl</th>
        <th style="width: 80px;" class="sub-th">PIC</th>
        <th style="width: 130px;" class="sub-th">Hasil</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
  </table>

  <!-- FOOTER & SIGNATURES -->
  <div class="footer-section">
    <table class="sig-table">
      <tr>
        <td>
          <div class="sig-title">Dibuat Oleh,</div>
          ${
            pelaksanaSig?.signatureData
              ? `<img src="${pelaksanaSig.signatureData}" class="sig-img" alt="TTD Pelaksana" /><br>`
              : `<div style="height: 45px;"></div>`
          }
          <div class="sig-name">${escapeHtml(pelaksanaSig?.userName || "....................................................")}</div>
          <div class="sig-role">Pelaksana</div>
        </td>
        <td>
          <div class="sig-title">Mengetahui,</div>
          ${
            mgmtSig?.signatureData
              ? `<img src="${mgmtSig.signatureData}" class="sig-img" alt="TTD Management Rep" /><br>`
              : `<div style="height: 45px;"></div>`
          }
          <div class="sig-name">${escapeHtml(mgmtSig?.userName || "....................................................")}</div>
          <div class="sig-role">Management Representative</div>
        </td>
      </tr>
    </table>
  </div>

</body>
</html>`;
}

function escapeHtml(text: string): string {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function generatePdfFromData(data: PdfDocumentData): Promise<Uint8Array> {
  const html = generateHtmlTemplate(data);

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
    ],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "domcontentloaded" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      landscape: true,
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: `<div></div>`,
      footerTemplate: `
        <div style="font-size: 8pt; font-family: 'Calibri', 'Arial', sans-serif; width: 100%; text-align: right; padding-right: 15mm; color: #555;">
          Halaman <span class="pageNumber"></span> dari <span class="totalPages"></span>
        </div>
      `,
      margin: {
        top: "12mm",
        right: "12mm",
        bottom: "15mm",
        left: "12mm",
      },
    });

    return pdfBuffer;
  } finally {
    await browser.close();
  }
}
