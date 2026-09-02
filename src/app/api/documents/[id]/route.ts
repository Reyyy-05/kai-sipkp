import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/documents/[id] — Detail of a document
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const document = await prisma.document.findUnique({
      where: { id: parseInt(id) },
      include: {
        createdBy: { select: { id: true, name: true, position: true } },
        approvedBy: { select: { id: true, name: true, position: true } },
        complaints: {
          include: {
            complaint: {
              include: {
                source: true,
                pic: { select: { id: true, name: true } },
              },
            },
          },
          orderBy: { displayOrder: "asc" },
        },
        signatures: {
          include: {
            user: { select: { id: true, name: true, position: true } },
          },
        },
      },
    });

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    return NextResponse.json(document);
  } catch (error) {
    console.error("Get document error:", error);
    return NextResponse.json(
      { error: "Failed to fetch document" },
      { status: 500 }
    );
  }
}

// PUT /api/documents/[id] — Status update & approval
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const docId = parseInt(id);

    const doc = await prisma.document.findUnique({ where: { id: docId } });
    if (!doc) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    const role = (session.user as Record<string, unknown>).role as string;
    const updateData: Record<string, unknown> = {};

    // Submit for approval (draft -> waiting_approval)
    if (body.action === "submit_approval") {
      updateData.status = "waiting_approval";
    }

    // Approve by Management Rep (waiting_approval -> finalized)
    if (body.action === "approve") {
      if (role !== "management_rep" && role !== "admin") {
        return NextResponse.json(
          { error: "Hanya Management Representative atau Admin yang dapat menyetujui dokumen" },
          { status: 403 }
        );
      }
      updateData.status = "finalized";
      updateData.approvedById = parseInt(session.user.id);
      updateData.approvedAt = new Date();
    }

    // Direct status update
    if (body.status) {
      updateData.status = body.status;
    }

    const updated = await prisma.document.update({
      where: { id: docId },
      data: updateData as any,
      include: {
        approvedBy: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update document error:", error);
    return NextResponse.json(
      { error: "Failed to update document" },
      { status: 500 }
    );
  }
}
