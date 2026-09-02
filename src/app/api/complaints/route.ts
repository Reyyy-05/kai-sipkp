import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createComplaintSchema } from "@/lib/validators";
import { generateComplaintNumber } from "@/lib/complaint-number";
import { logComplaintCreate } from "@/lib/audit";
import { auth } from "@/lib/auth";

// GET /api/complaints — List with filter, search, pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status") || undefined;
    const sourceId = searchParams.get("sourceId")
      ? parseInt(searchParams.get("sourceId")!)
      : undefined;
    const picId = searchParams.get("picId")
      ? parseInt(searchParams.get("picId")!)
      : undefined;
    const dateFrom = searchParams.get("dateFrom") || undefined;
    const dateTo = searchParams.get("dateTo") || undefined;
    const search = searchParams.get("search") || undefined;

    const where: Record<string, unknown> = {};

    if (status) where.status = status;
    if (sourceId) where.sourceId = sourceId;
    if (picId) where.picId = picId;
    if (dateFrom || dateTo) {
      where.reportDate = {};
      if (dateFrom)
        (where.reportDate as Record<string, Date>).gte = new Date(dateFrom);
      if (dateTo)
        (where.reportDate as Record<string, Date>).lte = new Date(dateTo);
    }
    if (search) {
      where.OR = [
        { customerName: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { complaintNumber: { contains: search, mode: "insensitive" } },
      ];
    }

    const [complaints, total] = await Promise.all([
      prisma.complaint.findMany({
        where: where as any,
        include: {
          source: true,
          pic: { select: { id: true, name: true } },
          createdBy: { select: { id: true, name: true } },
        },
        orderBy: [{ reportDate: "desc" }, { id: "desc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.complaint.count({ where: where as any }),
    ]);

    return NextResponse.json({
      data: complaints,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("List complaints error:", error);
    return NextResponse.json(
      { error: "Failed to fetch complaints" },
      { status: 500 }
    );
  }
}

// POST /api/complaints — Create new complaint
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createComplaintSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const complaintNumber = await generateComplaintNumber();

    const complaint = await prisma.complaint.create({
      data: {
        complaintNumber,
        reportDate: new Date(parsed.data.reportDate),
        customerName: parsed.data.customerName,
        sourceId: parsed.data.sourceId,
        description: parsed.data.description,
        status: "baru",
        createdById: parseInt(session.user.id),
      },
      include: {
        source: true,
        createdBy: { select: { id: true, name: true } },
      },
    });

    // Audit log
    await logComplaintCreate(complaint.id, parseInt(session.user.id), {
      complaintNumber,
      status: "baru",
      customerName: parsed.data.customerName,
    }, {
      ip: request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    });

    return NextResponse.json(complaint, { status: 201 });
  } catch (error) {
    console.error("Create complaint error:", error);
    return NextResponse.json(
      { error: "Failed to create complaint" },
      { status: 500 }
    );
  }
}
