# 🚀 Panduan Lengkap Publikasi Repositori `kai-sipkp` ke GitHub

Panduan langkah demi langkah untuk mengunggah proyek **SI-PKP PT KAI** ke GitHub agar terdokumentasi dengan rapi dan menjadi portofolio yang profesional.

---

## 📋 Langkah 1: Buat Repositori Baru di GitHub

1. Buka peramban dan masuk ke akun GitHub Anda: [https://github.com/new](https://github.com/new)
2. Isi formulir pembuatan repositori dengan detail berikut:
   - **Repository name**: `kai-sipkp`
   - **Description**:
     ```text
     Enterprise Customer Complaint Management System for PT KAI (Persero) with automated FR.SM/TI/033.001 PDF report generation, Excel migration, RBAC, and audit trail. Built with Next.js 16, TypeScript, PostgreSQL, Prisma, and Puppeteer.
     ```
   - **Visibility**: Pilih **Public** (agar dapat dilihat oleh recruiter/klien)
   - ⚠️ **PENTING**: **JANGAN** centang *"Add a README file"*, *"Add .gitignore"*, atau *"Choose a license"*, karena kita sudah menyiapkan berkas-berkas tersebut di lokal.
3. Klik tombol hijau **Create repository**.

---

## 💻 Langkah 2: Hubungkan Proyek Lokal ke GitHub

Buka terminal di direktori proyek (`/home/user/Projects/KAI/kai-sipkp`), lalu jalankan perintah berikut secara berurutan:

### 1. Masuk ke Direktori Proyek
```bash
cd /home/user/Projects/KAI/kai-sipkp
```

### 2. Tambahkan Seluruh Berkas ke Git Staging
```bash
git add .
```

### 3. Buat Commit Pertama
```bash
git commit -m "feat: initial commit for KAI SI-PKP complaint management system"
```

### 4. Pastikan Branch Utama Bernama `main`
```bash
git branch -M main
```

### 5. Hubungkan ke Remote GitHub Anda
Ganti `<username-github-anda>` dengan username akun GitHub Anda:

- **Jika menggunakan HTTPS**:
  ```bash
  git remote add origin https://github.com/<username-github-anda>/kai-sipkp.git
  ```
- **Jika menggunakan SSH**:
  ```bash
  git remote add origin git@github.com:<username-github-anda>/kai-sipkp.git
  ```

*(Catatan: Jika sebelumnya remote origin sudah ada, gunakan `git remote set-url origin <URL>`)*

### 6. Push Kode ke GitHub
```bash
git push -u origin main
```

---

## 🏷️ Langkah 3: Konfigurasi Tampilan Repositori di GitHub

Setelah kode berhasil terunggah, percantik halaman GitHub repository Anda:

1. **Atur Bagian "About"**:
   - Di sisi kanan halaman utama repositori, klik ikon gear (⚙️) di sebelah teks **About**.
   - Masukkan deskripsi:
     ```text
     Enterprise Customer Complaint Management System for PT KAI (Persero) with automated FR.SM/TI/033.001 PDF reporting, Excel migration, and audit trail.
     ```
   - Di kolom **Topics / Tags**, ketik dan tambahkan:
     ```text
     nextjs-16, typescript, tailwindcss, postgresql, prisma, puppeteer, pdf-generation, complaint-management, rbac, enterprise-architecture, portfolio-project
     ```
   - Centang opsi **Releases** dan **Packages** jika diinginkan.
   - Klik **Save changes**.

---

## 📝 Tips Tambahan untuk Portofolio CV & LinkedIn

Jika Anda menyertakan proyek ini di CV atau portofolio LinkedIn, gunakan template deskripsi berikut:

### Format Bullet Points (Untuk CV / Resume):
* **KAI SI-PKP — Enterprise Complaint Management & Automated Reporting System**
  * Mentransformasikan pengelolaan keluhan pelanggan manual berbasis spreadsheet (`FR.SM/TI/033.001`) menjadi sistem web full-stack terintegrasi menggunakan Next.js 16, TypeScript, PostgreSQL, dan Prisma.
  * Mengembangkan engine pelaporan PDF otomatis berbasis Puppeteer dengan layout A4 landscape pixel-perfect, penomoran halaman dinamis, dan tanda tangan digital.
  * Mengimplementasikan state machine workflow (`Baru` ➔ `Diproses` ➔ `Selesai`), Role-Based Access Control (4 peran), immutable audit trail, serta fitur migrasi data Excel lama secara instan.
