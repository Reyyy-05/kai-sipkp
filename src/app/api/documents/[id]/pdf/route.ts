import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generatePdfFromData, PdfDocumentData } from "@/lib/pdf-generator";

// GET /api/documents/[id]/pdf — Download or stream PDF
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const docId = parseInt(id);

    const doc = await prisma.document.findUnique({
      where: { id: docId },
      include: {
        complaints: {
          include: {
            complaint: {
              include: {
                source: true,
                pic: true,
              },
            },
          },
          orderBy: { displayOrder: "asc" },
        },
        signatures: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!doc) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // Format data for PDF generator
    const pdfData: PdfDocumentData = {
      documentNumber: doc.documentNumber,
      documentDate: doc.documentDate,
      version: doc.version,
      title: doc.title,
      periodStart: doc.periodStart,
      periodEnd: doc.periodEnd,
      complaints: doc.complaints.map((item, index) => ({
        no: index + 1,
        reportDate: item.complaint.reportDate,
        customerName: item.complaint.customerName,
        source: item.complaint.source.label,
        description: item.complaint.description,
        correctiveAction: item.complaint.correctiveAction,
        verificationDate: item.complaint.verificationDate,
        picName: item.complaint.pic?.name || null,
        verificationResult: item.complaint.verificationResult,
        remark: item.complaint.remark,
      })),
      signatures: doc.signatures.map((s) => ({
        role: s.role as "pelaksana" | "management_representative",
        userName: s.user.name,
        position: s.user.position,
        signatureData: s.signatureData,
        signedAt: s.signedAt,
      })),
    };

    const pdfBuffer = await generatePdfFromData(pdfData);

    const filename = `${doc.documentNumber.replace(/[\/\\]/g, "_")}.pdf`;

    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${filename}"`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF document", details: String(error) },
      { status: 500 }
    );
  }
}
