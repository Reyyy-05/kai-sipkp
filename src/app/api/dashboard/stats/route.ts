import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Status counts
    const statusCounts = await prisma.complaint.groupBy({
      by: ["status"],
      _count: { id: true },
    });

    const statusMap: Record<string, number> = {};
    let total = 0;
    statusCounts.forEach((s) => {
      statusMap[s.status] = s._count.id;
      total += s._count.id;
    });

    // Average resolution days
    const resolved = await prisma.complaint.findMany({
      where: {
        status: "selesai",
        verificationDate: { not: null },
      },
      select: {
        reportDate: true,
        verificationDate: true,
      },
    });

    let avgResolutionDays = 0;
    if (resolved.length > 0) {
      const totalDays = resolved.reduce((acc, c) => {
        if (c.verificationDate) {
          const diff =
            (new Date(c.verificationDate).getTime() -
              new Date(c.reportDate).getTime()) /
            (1000 * 60 * 60 * 24);
          return acc + diff;
        }
        return acc;
      }, 0);
      avgResolutionDays = Math.round((totalDays / resolved.length) * 10) / 10;
    }

    // Monthly data (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyComplaints = await prisma.complaint.findMany({
      where: {
        reportDate: { gte: sixMonthsAgo },
      },
      select: {
        reportDate: true,
        status: true,
      },
    });

    const monthlyMap: Record<string, { total: number; resolved: number }> = {};
    monthlyComplaints.forEach((c) => {
      const d = new Date(c.reportDate);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!monthlyMap[key]) monthlyMap[key] = { total: 0, resolved: 0 };
      monthlyMap[key].total++;
      if (c.status === "selesai") monthlyMap[key].resolved++;
    });

    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
      "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
    ];

    const monthly = Object.entries(monthlyMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, val]) => ({
        month: monthNames[parseInt(key.split("-")[1]) - 1],
        total: val.total,
        resolved: val.resolved,
      }));

    // Source distribution
    const sourceCounts = await prisma.complaint.groupBy({
      by: ["sourceId"],
      _count: { id: true },
    });

    const sourceIds = sourceCounts.map((s) => s.sourceId);
    const sources = await prisma.complaintSource.findMany({
      where: { id: { in: sourceIds } },
    });

    const sourceData = sourceCounts.map((s) => {
      const source = sources.find((src) => src.id === s.sourceId);
      return {
        name: source?.label || "Unknown",
        value: s._count.id,
      };
    });

    // Recent complaints
    const recent = await prisma.complaint.findMany({
      take: 5,
      orderBy: { reportDate: "desc" },
      include: {
        source: true,
      },
    });

    const recentData = recent.map((c) => ({
      id: c.id,
      complaintNumber: c.complaintNumber,
      reportDate: c.reportDate.toISOString().split("T")[0],
      customerName: c.customerName,
      status: c.status,
      source: c.source.label,
    }));

    return NextResponse.json({
      stats: {
        total,
        baru: statusMap["baru"] || 0,
        diproses: statusMap["diproses"] || 0,
        selesai: statusMap["selesai"] || 0,
        ditolak: statusMap["ditolak"] || 0,
        perluTindakLanjut: statusMap["perlu_tindak_lanjut"] || 0,
        avgResolutionDays,
      },
      monthly,
      sources: sourceData,
      recent: recentData,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
