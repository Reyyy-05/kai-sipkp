import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import * as XLSX from "xlsx";
import { generateComplaintNumber } from "@/lib/complaint-number";
import { logComplaintCreate } from "@/lib/audit";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "File Excel wajib diunggah" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const workbook = XLSX.read(buffer, { type: "buffer", cellDates: true });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert to 2D array of rows
    const rows = XLSX.utils.sheet_to_json<any[]>(sheet, { header: 1 });

    // Look for data rows (rows where Col A is numeric or rows after header row)
    // In FR.SM/TI/033.001, row 7 is header (0-indexed: row 6), row 10 is instructions (index 9),
    // data begins at row index 10 (row 11) or any row where col A has a valid number / col C has customer name.
    const importedComplaints: any[] = [];
    const sources = await prisma.complaintSource.findMany();

    // Default source if not found
    let defaultSource = sources.find((s) => s.name === "langsung") || sources[0];

    for (let r = 6; r < rows.length; r++) {
      const row = rows[r];
      if (!row || row.length === 0) continue;

      // Skip instruction row (row 10, index 9) or footer rows
      const customer = row[2]?.toString().trim();
      const description = row[4]?.toString().trim();

      if (!customer || !description) continue;
      if (customer.startsWith("(") || customer.includes("nama personil")) continue;
      if (customer.includes("Dibuat Oleh") || customer.includes("Mengetahui")) break;

      // Extract report date
      let reportDate = new Date();
      if (row[1]) {
        const parsed = new Date(row[1]);
        if (!isNaN(parsed.getTime())) reportDate = parsed;
      }

      // Match source
      const rawSource = row[3]?.toString().toLowerCase() || "";
      let matchedSource = sources.find(
        (s) =>
          rawSource.includes(s.name) ||
          rawSource.includes(s.label.toLowerCase()) ||
          s.label.toLowerCase().includes(rawSource)
      );
      if (!matchedSource) {
        matchedSource = defaultSource;
      }

      // Corrective action
      const correctiveAction = row[5]?.toString().trim() || null;

      // Verification fields
      let verificationDate: Date | null = null;
      if (row[6]) {
        const parsed = new Date(row[6]);
        if (!isNaN(parsed.getTime())) verificationDate = parsed;
      }

      const picName = row[7]?.toString().trim() || null;
      const verificationResult = row[8]?.toString().trim() || null;
      const remark = row[10]?.toString().trim() || null;

      // Determine status
      let status: "baru" | "diproses" | "selesai" = "baru";
      if (verificationResult || verificationDate) {
        status = "selesai";
      } else if (correctiveAction) {
        status = "diproses";
      }

      const complaintNumber = await generateComplaintNumber();

      const newComplaint = await prisma.complaint.create({
        data: {
          complaintNumber,
          reportDate,
          customerName: customer,
          sourceId: matchedSource.id,
          description,
          correctiveAction,
          verificationDate,
          verificationResult,
          remark,
          status,
          createdById: parseInt(session.user.id),
        },
      });

      await logComplaintCreate(
        newComplaint.id,
        parseInt(session.user.id),
        { source: "Excel Import", filename: file.name },
        {
          ip: request.headers.get("x-forwarded-for") || "unknown",
          userAgent: request.headers.get("user-agent") || "unknown",
        }
      );

      importedComplaints.push(newComplaint);
    }

    return NextResponse.json({
      success: true,
      count: importedComplaints.length,
      data: importedComplaints,
    });
  } catch (error) {
    console.error("Import Excel error:", error);
    return NextResponse.json(
      { error: "Gagal memproses berkas Excel", details: String(error) },
      { status: 500 }
    );
  }
}
