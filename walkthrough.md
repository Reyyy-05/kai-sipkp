# 🚂 Walkthrough: Sistem Informasi Pengelolaan Keluhan Pelanggan (SI-PKP)

> **Implementasi Berhasil:** Aplikasi web full-stack untuk pengelolaan dan penanganan keluhan pelanggan PT Kereta Api Indonesia (Persero) serta otomasi pencetakan laporan resmi PDF sesuai formulir **FR.SM/TI/033.001**.

---

## 📸 Visual Showcase & Demo

### 1. Dashboard Utama & Metrik Eksekutif
Dashboard menyajikan metrik KPI (Total Keluhan, Status Baru, Diproses, Selesai), grafik tren bulanan, diagram distribusi saluran pelaporan, dan tabel 5 keluhan terakhir secara real-time:

![Dashboard Overview](file:///home/user/.gemini/antigravity-ide/brain/e4903d7d-c252-4a70-bafd-608849a07667/dashboard_top_1788336004756.png)
![Dashboard Chart & Tables](file:///home/user/.gemini/antigravity-ide/brain/e4903d7d-c252-4a70-bafd-608849a07667/dashboard_overview_1788335960689.png)

---

### 2. Daftar Keluhan Pelanggan & Fitur Migrasi Excel
Halaman daftar keluhan dilengkapi filter komprehensif, pencarian keyword, penomoran `KAI-YYYYMM-XXXXX` (5 digit), serta tombol **Import Excel** untuk migrasi data formulir legacy PT KAI:

![Complaints List](file:///home/user/.gemini/antigravity-ide/brain/e4903d7d-c252-4a70-bafd-608849a07667/complaints_list_1788336105341.png)

---

### 3. Detail Keluhan (Standar FR.SM/TI/033.001)
Struktur tampilan detail keluhan dipetakan langsung dengan baris dan kolom formulir Excel:
- **Header:** Identitas Dokumen, Nomor Keluhan, Tanggal, Sumber
- **Col E:** Deskripsi Keluhan
- **Col F:** Tindakan Perbaikan dan Pencegahan (dengan tombol aksi *"Tetapkan Tindakan"*)
- **Col G–J:** Verifikasi Hasil Tindakan (dengan tombol aksi *"Verifikasi Hasil"*)
- **Audit Trail:** Riwayat perubahan transparan mencakup nama staf, aksi, nilai lama/baru, dan timestamp.

![Complaint Detail](file:///home/user/.gemini/antigravity-ide/brain/e4903d7d-c252-4a70-bafd-608849a07667/complaint_detail_1788336193502.png)

---

### 4. Modul Dokumen Laporan & Generate PDF
Modul pengelolaan dokumen memungkinkan staf memilih periode (Bulanan, Triwulan, Tahunan, Kustom) untuk dihimpun otomatis menjadi berkas laporan PDF resmi berstandar PT KAI:

![Documents Page](file:///home/user/.gemini/antigravity-ide/brain/e4903d7d-c252-4a70-bafd-608849a07667/documents_page_1788336387788.png)
![Generate Document Form](file:///home/user/.gemini/antigravity-ide/brain/e4903d7d-c252-4a70-bafd-608849a07667/generate_document_form_1788336492105.png)

---

## 🛠️ Fitur Teknis yang Diimplementasikan

| Modul | Komponen Kunci | Deskripsi |
|---|---|---|
| **Arsitektur** | Next.js 16 + React 19 + TypeScript | Monolith App Router dengan integrasi API Routes |
| **Database** | PostgreSQL 15 (Docker) + Prisma ORM | 7 tabel ternormalisasi (`users`, `complaints`, `complaint_sources`, `audit_logs`, `documents`, `document_complaints`, `document_signatures`) |
| **Autentikasi** | NextAuth v5 + BCrypt | Session JWT, Role-Based Access Control (`admin`, `staff`, `pic`, `management_rep`) |
| **PDF Engine** | Puppeteer (Headless Chromium) | Render HTML template persis layout Excel FR.SM/TI/033.001, margin A4 landscape, penomoran *"Halaman X dari N"*, tanda tangan digital |
| **Migrasi Excel** | SheetJS (`xlsx`) API Handler | Import otomatis berkas `.xlsx` formulir KAI dengan auto-detect baris data dan mapping kolom |
| **Workflow State** | State Machine & Audit Logger | Transisi status `baru` → `diproses` → `selesai`/`perlu_tindak_lanjut` dengan pencatatan audit log otomatis |

---

## 🚀 Kredensial Demo Akun

Semua akun terdaftar menggunakan password standar: `password123`

- **Administrator:** `admin@kai.id`
- **Staff Customer Service:** `ahmad.sutrisno@kai.id`
- **Staff Pelayanan:** `siti.rahmawati@kai.id`
- **PIC Verifikator (Seksi Pelayanan):** `budi.santosa@kai.id`
- **PIC Verifikator (Seksi Operasional):** `dewi.lestari@kai.id`
- **Management Representative:** `hendra.wijaya@kai.id`

---

## 🎬 Rekaman Verifikasi Browser

Sesi interaksi dan pengujian aplikasi secara otomatis direkam dan tersedia di:
- [sipkp_demo_recording_1788335707166.webp](file:///home/user/.gemini/antigravity-ide/brain/e4903d7d-c252-4a70-bafd-608849a07667/sipkp_demo_recording_1788335707166.webp)
