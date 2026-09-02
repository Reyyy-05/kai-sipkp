import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { logStatusChange, logComplaintUpdate } from "@/lib/audit";

// GET /api/complaints/[id] — Detail
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const complaint = await prisma.complaint.findUnique({
      where: { id: parseInt(id) },
      include: {
        source: true,
        pic: { select: { id: true, name: true, position: true } },
        createdBy: { select: { id: true, name: true } },
        updatedBy: { select: { id: true, name: true } },
        auditLogs: {
          include: { user: { select: { id: true, name: true } } },
          orderBy: { createdAt: "desc" },
          take: 20,
        },
      },
    });

    if (!complaint) {
      return NextResponse.json(
        { error: "Complaint not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(complaint);
  } catch (error) {
    console.error("Get complaint error:", error);
    return NextResponse.json(
      { error: "Failed to fetch complaint" },
      { status: 500 }
    );
  }
}

// PUT /api/complaints/[id] — Update
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
    const existing = await prisma.complaint.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Complaint not found" },
        { status: 404 }
      );
    }

    // Determine changes for audit log
    const changes: { field: string; oldValue: unknown; newValue: unknown }[] = [];
    const updateData: Record<string, unknown> = {
      updatedById: parseInt(session.user.id),
    };

    // If assigning corrective action → status change to diproses
    if (body.correctiveAction && existing.status === "baru") {
      updateData.correctiveAction = body.correctiveAction;
      updateData.status = "diproses";
      changes.push({
        field: "corrective_action",
        oldValue: existing.correctiveAction,
        newValue: body.correctiveAction,
      });

      // Log status change
      await logStatusChange(
        existing.id,
        parseInt(session.user.id),
        existing.status,
        "diproses",
        {
          ip: request.headers.get("x-forwarded-for") || "unknown",
          userAgent: request.headers.get("user-agent") || "unknown",
        }
      );
    }

    // General field updates
    const editableFields = [
      "customerName",
      "description",
      "remark",
      "correctiveAction",
    ];
    for (const field of editableFields) {
      if (body[field] !== undefined && body[field] !== (existing as Record<string, unknown>)[field]) {
        updateData[field] = body[field];
        if (!changes.find((c) => c.field === field)) {
          changes.push({
            field,
            oldValue: (existing as Record<string, unknown>)[field],
            newValue: body[field],
          });
        }
      }
    }

    if (body.sourceId && body.sourceId !== existing.sourceId) {
      updateData.sourceId = body.sourceId;
      changes.push({
        field: "sourceId",
        oldValue: existing.sourceId,
        newValue: body.sourceId,
      });
    }

    if (body.reportDate) {
      updateData.reportDate = new Date(body.reportDate);
    }

    const updated = await prisma.complaint.update({
      where: { id: parseInt(id) },
      data: updateData as any,
      include: {
        source: true,
        pic: { select: { id: true, name: true } },
        createdBy: { select: { id: true, name: true } },
      },
    });

    // Audit log for field changes
    if (changes.length > 0) {
      await logComplaintUpdate(
        existing.id,
        parseInt(session.user.id),
        changes,
        {
          ip: request.headers.get("x-forwarded-for") || "unknown",
          userAgent: request.headers.get("user-agent") || "unknown",
        }
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update complaint error:", error);
    return NextResponse.json(
      { error: "Failed to update complaint" },
      { status: 500 }
    );
  }
}

// DELETE /api/complaints/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admin can delete
    if ((session.user as Record<string, unknown>).role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    await prisma.complaint.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: "Complaint deleted" });
  } catch (error) {
    console.error("Delete complaint error:", error);
    return NextResponse.json(
      { error: "Failed to delete complaint" },
      { status: 500 }
    );
  }
}
