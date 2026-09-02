import prisma from "./prisma";

/**
 * Generate nomor keluhan unik format: KAI-YYYYMM-XXXXX
 * Contoh: KAI-202609-00001
 * Mendukung hingga 99999 keluhan per bulan
 */
export async function generateComplaintNumber(): Promise<string> {
  const now = new Date();
  const yearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}`;
  const prefix = `KAI-${yearMonth}`;

  const lastComplaint = await prisma.complaint.findFirst({
    where: {
      complaintNumber: {
        startsWith: prefix,
      },
    },
    orderBy: {
      complaintNumber: "desc",
    },
    select: {
      complaintNumber: true,
    },
  });

  let nextNumber = 1;
  if (lastComplaint) {
    const lastNumberStr = lastComplaint.complaintNumber.split("-").pop();
    if (lastNumberStr) {
      nextNumber = parseInt(lastNumberStr, 10) + 1;
    }
  }

  return `${prefix}-${String(nextNumber).padStart(5, "0")}`;
}

/**
 * Generate nomor dokumen format: FR.SM/TI/033.001/MM-YYYY
 * Contoh: FR.SM/TI/033.001/09-2026
 */
export async function generateDocumentNumber(
  date: Date = new Date()
): Promise<string> {
  const prefix = process.env.DOCUMENT_PREFIX || "FR.SM/TI/033.001";
  const monthYear = `${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;
  return `${prefix}/${monthYear}`;
}
