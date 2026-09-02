import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const sources = await prisma.complaintSource.findMany({
      where: { isActive: true },
      orderBy: { label: "asc" },
    });
    return NextResponse.json(sources);
  } catch (error) {
    console.error("Fetch sources error:", error);
    return NextResponse.json(
      { error: "Failed to fetch sources" },
      { status: 500 }
    );
  }
}
