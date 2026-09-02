import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { generateDocumentNumber } from "@/lib/complaint-number";
import { createDocumentSchema } from "@/lib/validators";

// GET /api/documents — List all generated documents
export async function GET() {
  try {
    const documents = await prisma.document.findMany({
      include: {
        createdBy: { select: { id: true, name: true } },
        approvedBy: { select: { id: true, name: true } },
        _count: { select: { complaints: true } },
        signatures: {
          select: { role: true, signedAt: true, user: { select: { name: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error("List documents error:", error);
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}

// POST /api/documents — Generate new document for given period
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createDocumentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const docDate = new Date();
    const docNumber = await generateDocumentNumber(docDate);

    // Check if docNumber already exists, if so append sequence
    let finalDocNumber = docNumber;
    const existing = await prisma.document.findUnique({
      where: { documentNumber: finalDocNumber },
    });
    if (existing) {
      finalDocNumber = `${docNumber}-${Date.now().toString().slice(-4)}`;
    }

    const start = new Date(parsed.data.periodStart);
    const end = new Date(parsed.data.periodEnd);

    // Fetch complaints in this period or matching complaintIds
    let complaintIds = parsed.data.complaintIds;
    if (!complaintIds || complaintIds.length === 0) {
      const found = await prisma.complaint.findMany({
        where: {
          reportDate: {
            gte: start,
            lte: end,
          },
        },
        select: { id: true },
        orderBy: [{ reportDate: "asc" }, { id: "asc" }],
      });
      complaintIds = found.map((c) => c.id);
    }

    // Create Document
    const newDoc = await prisma.document.create({
      data: {
        documentNumber: finalDocNumber,
        documentDate: docDate,
        version: "002-2020",
        title:
          parsed.data.title ||
          "DOKUMENTASI PENGELOLAAN DAN PENANGANAN KELUHAN PELANGGAN",
        periodType: parsed.data.periodType,
        periodStart: start,
        periodEnd: end,
        status: "draft",
        createdById: parseInt(session.user.id),
        complaints: {
          create: complaintIds.map((cId: number, idx: number) => ({
            complaintId: cId,
            displayOrder: idx + 1,
          })),
        },
      },
      include: {
        _count: { select: { complaints: true } },
      },
    });

    return NextResponse.json(newDoc, { status: 201 });
  } catch (error) {
    console.error("Create document error:", error);
    return NextResponse.json(
      { error: "Failed to create document" },
      { status: 500 }
    );
  }
}
