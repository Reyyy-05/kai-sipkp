import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { verifyComplaintSchema } from "@/lib/validators";
import { logStatusChange } from "@/lib/audit";

// POST /api/complaints/[id]/verify — Verify complaint (PIC action)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as Record<string, unknown>).role;
    if (role !== "pic" && role !== "admin") {
      return NextResponse.json(
        { error: "Hanya PIC atau Admin yang dapat memverifikasi" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = verifyComplaintSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const existing = await prisma.complaint.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Complaint not found" },
        { status: 404 }
      );
    }

    if (existing.status !== "diproses" && existing.status !== "perlu_tindak_lanjut") {
      return NextResponse.json(
        {
          error: `Keluhan dengan status "${existing.status}" tidak dapat diverifikasi. Status harus "diproses" atau "perlu_tindak_lanjut".`,
        },
        { status: 400 }
      );
    }

    const newStatus = body.needsFollowUp ? "perlu_tindak_lanjut" : "selesai";

    const updated = await prisma.complaint.update({
      where: { id: parseInt(id) },
      data: {
        verificationDate: new Date(parsed.data.verificationDate),
        picId: parseInt(session.user.id),
        verificationResult: parsed.data.verificationResult,
        remark: parsed.data.remark || existing.remark,
        status: newStatus,
        updatedById: parseInt(session.user.id),
      },
      include: {
        source: true,
        pic: { select: { id: true, name: true, position: true } },
        createdBy: { select: { id: true, name: true } },
      },
    });

    // Audit log
    await logStatusChange(
      existing.id,
      parseInt(session.user.id),
      existing.status,
      newStatus,
      {
        ip: request.headers.get("x-forwarded-for") || "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
      }
    );

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Verify complaint error:", error);
    return NextResponse.json(
      { error: "Failed to verify complaint" },
      { status: 500 }
    );
  }
}
