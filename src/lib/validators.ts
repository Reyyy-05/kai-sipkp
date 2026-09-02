import { z } from "zod";

// ─── COMPLAINT SCHEMAS ────────────────────────────────

export const createComplaintSchema = z.object({
  reportDate: z.string().min(1, "Tanggal lapor wajib diisi"),
  customerName: z
    .string()
    .min(2, "Nama pelanggan minimal 2 karakter")
    .max(150, "Nama pelanggan maksimal 150 karakter"),
  sourceId: z.number().int().positive("Sumber keluhan wajib dipilih"),
  description: z
    .string()
    .min(10, "Deskripsi keluhan minimal 10 karakter")
    .max(5000, "Deskripsi keluhan maksimal 5000 karakter"),
});

export const updateComplaintSchema = z.object({
  reportDate: z.string().optional(),
  customerName: z.string().min(2).max(150).optional(),
  sourceId: z.number().int().positive().optional(),
  description: z.string().min(10).max(5000).optional(),
  correctiveAction: z.string().max(5000).optional(),
  remark: z.string().max(2000).optional(),
});

export const assignActionSchema = z.object({
  correctiveAction: z
    .string()
    .min(10, "Tindakan perbaikan minimal 10 karakter")
    .max(5000, "Tindakan perbaikan maksimal 5000 karakter"),
});

export const verifyComplaintSchema = z.object({
  verificationDate: z.string().min(1, "Tanggal verifikasi wajib diisi"),
  verificationResult: z
    .string()
    .min(10, "Hasil verifikasi minimal 10 karakter")
    .max(5000, "Hasil verifikasi maksimal 5000 karakter"),
  remark: z.string().max(2000).optional(),
});

// ─── DOCUMENT SCHEMAS ─────────────────────────────────

export const createDocumentSchema = z.object({
  periodType: z.enum(["monthly", "quarterly", "yearly", "custom"]),
  periodStart: z.string().min(1, "Periode awal wajib diisi"),
  periodEnd: z.string().min(1, "Periode akhir wajib diisi"),
  title: z.string().optional(),
  complaintIds: z.array(z.number().int().positive()).optional(),
});

// ─── USER SCHEMAS ─────────────────────────────────────

export const createUserSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter").max(100),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  role: z.enum(["admin", "staff", "pic", "management_rep"]),
  phone: z.string().max(20).optional(),
  position: z.string().max(100).optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

// ─── TYPES ────────────────────────────────────────────

export type CreateComplaintInput = z.infer<typeof createComplaintSchema>;
export type UpdateComplaintInput = z.infer<typeof updateComplaintSchema>;
export type AssignActionInput = z.infer<typeof assignActionSchema>;
export type VerifyComplaintInput = z.infer<typeof verifyComplaintSchema>;
export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
