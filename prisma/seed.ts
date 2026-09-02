// =====================================================
// SI-PKP Database Seeder
// Seed data for development & testing
// =====================================================

import { PrismaClient, UserRole, ComplaintStatus } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...\n");

  // ─── 1. USERS ──────────────────────────────────────
  console.log("👤 Creating users...");
  const passwordHash = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@kai.id" },
    update: {},
    create: {
      name: "Administrator Sistem",
      email: "admin@kai.id",
      passwordHash,
      role: UserRole.admin,
      phone: "08123456789",
      position: "System Administrator",
    },
  });

  const staff1 = await prisma.user.upsert({
    where: { email: "ahmad.sutrisno@kai.id" },
    update: {},
    create: {
      name: "Ahmad Sutrisno",
      email: "ahmad.sutrisno@kai.id",
      passwordHash,
      role: UserRole.staff,
      phone: "08234567890",
      position: "Staff Customer Service",
    },
  });

  const staff2 = await prisma.user.upsert({
    where: { email: "siti.rahmawati@kai.id" },
    update: {},
    create: {
      name: "Siti Rahmawati",
      email: "siti.rahmawati@kai.id",
      passwordHash,
      role: UserRole.staff,
      phone: "08345678901",
      position: "Staff Pelayanan",
    },
  });

  const pic1 = await prisma.user.upsert({
    where: { email: "budi.santosa@kai.id" },
    update: {},
    create: {
      name: "Budi Santosa",
      email: "budi.santosa@kai.id",
      passwordHash,
      role: UserRole.pic,
      phone: "08456789012",
      position: "Kepala Seksi Pelayanan",
    },
  });

  const pic2 = await prisma.user.upsert({
    where: { email: "dewi.lestari@kai.id" },
    update: {},
    create: {
      name: "Dewi Lestari",
      email: "dewi.lestari@kai.id",
      passwordHash,
      role: UserRole.pic,
      phone: "08567890123",
      position: "Kepala Seksi Operasional",
    },
  });

  const mgmtRep = await prisma.user.upsert({
    where: { email: "hendra.wijaya@kai.id" },
    update: {},
    create: {
      name: "Hendra Wijaya",
      email: "hendra.wijaya@kai.id",
      passwordHash,
      role: UserRole.management_rep,
      phone: "08678901234",
      position: "Management Representative",
    },
  });

  console.log(`  ✅ Created ${6} users`);

  // ─── 2. COMPLAINT SOURCES ─────────────────────────
  console.log("📋 Creating complaint sources...");
  const sources = await Promise.all([
    prisma.complaintSource.upsert({
      where: { name: "telepon" },
      update: {},
      create: { name: "telepon", label: "Via Telepon" },
    }),
    prisma.complaintSource.upsert({
      where: { name: "email" },
      update: {},
      create: { name: "email", label: "Via Email" },
    }),
    prisma.complaintSource.upsert({
      where: { name: "survey" },
      update: {},
      create: { name: "survey", label: "Survey Kepuasan Pelanggan" },
    }),
    prisma.complaintSource.upsert({
      where: { name: "langsung" },
      update: {},
      create: { name: "langsung", label: "Laporan Secara Langsung" },
    }),
    prisma.complaintSource.upsert({
      where: { name: "media_sosial" },
      update: {},
      create: { name: "media_sosial", label: "Media Sosial" },
    }),
    prisma.complaintSource.upsert({
      where: { name: "surat" },
      update: {},
      create: { name: "surat", label: "Surat Resmi" },
    }),
  ]);
  console.log(`  ✅ Created ${sources.length} complaint sources`);

  // ─── 3. SAMPLE COMPLAINTS ─────────────────────────
  console.log("📝 Creating sample complaints...");

  const sampleComplaints = [
    {
      complaintNumber: "KAI-202608-00001",
      reportDate: new Date("2026-08-05"),
      customerName: "PT Maju Bersama",
      sourceId: sources[0].id, // telepon
      description:
        "Keterlambatan pengiriman barang selama 3 hari dari jadwal yang dijanjikan. Nomor resi: KAI-CARGO-2026-1234. Pelanggan meminta penjelasan dan kompensasi.",
      correctiveAction:
        "1. Investigasi penyebab keterlambatan di gudang transit Cirebon.\n2. Koordinasi dengan tim operasional untuk percepatan pengiriman.\n3. Berikan kompensasi berupa diskon 15% untuk pengiriman berikutnya.",
      verificationDate: new Date("2026-08-08"),
      picId: pic1.id,
      verificationResult:
        "Tindakan perbaikan berhasil dilaksanakan. Pelanggan telah dikonfirmasi dan menerima kompensasi sesuai kebijakan. Proses internal di gudang transit telah diperbaiki.",
      remark: "Pelanggan puas dengan penanganan. Kasus ditutup.",
      status: ComplaintStatus.selesai,
      createdById: staff1.id,
    },
    {
      complaintNumber: "KAI-202608-00002",
      reportDate: new Date("2026-08-10"),
      customerName: "CV Jaya Abadi",
      sourceId: sources[1].id, // email
      description:
        "AC di gerbong ekonomi KA Taksaka (KA 7) rute Yogyakarta-Jakarta tanggal 10 Agustus tidak berfungsi dengan baik. Suhu ruangan sangat panas dan tidak nyaman.",
      correctiveAction:
        "1. Pemeriksaan unit AC gerbong oleh teknisi.\n2. Perbaikan kompresor AC yang mengalami kebocoran freon.\n3. Uji coba AC selama 24 jam sebelum gerbong dioperasikan kembali.",
      verificationDate: new Date("2026-08-13"),
      picId: pic2.id,
      verificationResult:
        "AC telah diperbaiki dan diuji coba. Suhu ruangan kembali normal (22-24°C). Gerbong telah beroperasi kembali.",
      remark: "Jadwal maintenance AC dipercepat menjadi 2 minggu sekali.",
      status: ComplaintStatus.selesai,
      createdById: staff2.id,
    },
    {
      complaintNumber: "KAI-202608-00003",
      reportDate: new Date("2026-08-15"),
      customerName: "Tn. Andi Prasetyo",
      sourceId: sources[3].id, // langsung
      description:
        "Toilet di Stasiun Tugu Yogyakarta sangat kotor dan tidak layak pakai. Sabun dan tisu habis. Lantai licin dan berbau tidak sedap.",
      correctiveAction:
        "1. Peningkatan frekuensi pembersihan toilet dari 3x menjadi 5x sehari.\n2. Penambahan petugas kebersihan khusus toilet.\n3. Pemasangan dispenser sabun otomatis dan tisu jumbo roll.",
      verificationDate: new Date("2026-08-18"),
      picId: pic1.id,
      verificationResult:
        "Toilet telah dibersihkan dan direnovasi. Semua perlengkapan (sabun, tisu, pengharum) telah dilengkapi. Jadwal pembersihan baru telah diimplementasikan.",
      remark: null,
      status: ComplaintStatus.selesai,
      createdById: staff1.id,
    },
    {
      complaintNumber: "KAI-202608-00004",
      reportDate: new Date("2026-08-20"),
      customerName: "Ny. Ratna Sari",
      sourceId: sources[4].id, // media_sosial
      description:
        "Keluhan via Twitter @KAI121 tentang keterlambatan KA Argo Lawu (KA 5) selama 2 jam tanpa informasi yang jelas dari petugas. Penumpang merasa tidak dihargai.",
      correctiveAction:
        "1. Investigasi penyebab keterlambatan (gangguan sinyal di Km 45).\n2. Pelatihan ulang petugas terkait prosedur informasi kepada penumpang.\n3. Implementasi sistem notifikasi otomatis ke penumpang via aplikasi KAI Access.",
      verificationDate: null,
      picId: pic2.id,
      verificationResult: null,
      remark: "Menunggu implementasi sistem notifikasi (target: September 2026)",
      status: ComplaintStatus.diproses,
      createdById: staff2.id,
    },
    {
      complaintNumber: "KAI-202608-00005",
      reportDate: new Date("2026-08-22"),
      customerName: "PT Logistik Nusantara",
      sourceId: sources[0].id, // telepon
      description:
        "Barang kiriman rusak (pecah) saat diterima. Diduga akibat penanganan kasar di gudang. Barang berupa perangkat elektronik senilai Rp 15.000.000.",
      correctiveAction:
        "1. Investigasi CCTV gudang handling.\n2. Proses klaim asuransi untuk pelanggan.\n3. Sosialisasi ulang SOP penanganan barang fragile kepada seluruh petugas.",
      verificationDate: null,
      picId: null,
      verificationResult: null,
      remark: null,
      status: ComplaintStatus.diproses,
      createdById: staff1.id,
    },
    {
      complaintNumber: "KAI-202609-00001",
      reportDate: new Date("2026-09-01"),
      customerName: "Tn. Bambang Hermawan",
      sourceId: sources[2].id, // survey
      description:
        "Melalui survey kepuasan pelanggan, Tn. Bambang menyampaikan bahwa WiFi gratis di KA Eksekutif sering terputus dan kecepatan sangat lambat, tidak sesuai yang dijanjikan.",
      correctiveAction: null,
      verificationDate: null,
      picId: null,
      verificationResult: null,
      remark: null,
      status: ComplaintStatus.baru,
      createdById: staff2.id,
    },
    {
      complaintNumber: "KAI-202609-00002",
      reportDate: new Date("2026-09-02"),
      customerName: "Nn. Dian Permata",
      sourceId: sources[3].id, // langsung
      description:
        "Petugas loket di Stasiun Lempuyangan bersikap tidak ramah saat melayani pembelian tiket. Pelanggan merasa dibentak ketika menanyakan tentang jadwal kereta.",
      correctiveAction: null,
      verificationDate: null,
      picId: null,
      verificationResult: null,
      remark: null,
      status: ComplaintStatus.baru,
      createdById: staff1.id,
    },
  ];

  for (const data of sampleComplaints) {
    await prisma.complaint.upsert({
      where: { complaintNumber: data.complaintNumber },
      update: {},
      create: data,
    });
  }
  console.log(`  ✅ Created ${sampleComplaints.length} sample complaints`);

  // ─── 4. SAMPLE AUDIT LOGS ─────────────────────────
  console.log("📊 Creating sample audit logs...");
  const complaint1 = await prisma.complaint.findUnique({
    where: { complaintNumber: "KAI-202608-00001" },
  });

  if (complaint1) {
    await prisma.auditLog.createMany({
      data: [
        {
          complaintId: complaint1.id,
          userId: staff1.id,
          action: "create",
          fieldChanged: null,
          oldValue: null,
          newValue: JSON.stringify({ status: "baru" }),
          ipAddress: "192.168.1.100",
          userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0",
        },
        {
          complaintId: complaint1.id,
          userId: staff1.id,
          action: "status_change",
          fieldChanged: "status",
          oldValue: "baru",
          newValue: "diproses",
          ipAddress: "192.168.1.100",
          userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0",
        },
        {
          complaintId: complaint1.id,
          userId: pic1.id,
          action: "status_change",
          fieldChanged: "status",
          oldValue: "diproses",
          newValue: "selesai",
          ipAddress: "192.168.1.105",
          userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0",
        },
      ],
      skipDuplicates: true,
    });
  }
  console.log("  ✅ Created sample audit logs");

  console.log("\n🎉 Seeding completed successfully!\n");
  console.log("📋 Login Credentials (all passwords: password123):");
  console.log("  Admin:          admin@kai.id");
  console.log("  Staff:          ahmad.sutrisno@kai.id");
  console.log("  Staff:          siti.rahmawati@kai.id");
  console.log("  PIC:            budi.santosa@kai.id");
  console.log("  PIC:            dewi.lestari@kai.id");
  console.log("  Management Rep: hendra.wijaya@kai.id");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
