import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

// POST /api/documents/[id]/sign — Add or update signature for a document
export async function POST(
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

    const { role, signatureData } = body;
    if (!role || (role !== "pelaksana" && role !== "management_representative")) {
      return NextResponse.json(
        { error: "Peran tanda tangan tidak valid ('pelaksana' atau 'management_representative')" },
        { status: 400 }
      );
    }

    const userRole = (session.user as Record<string, unknown>).role as string;
    if (role === "management_representative" && userRole !== "management_rep" && userRole !== "admin") {
      return NextResponse.json(
        { error: "Hanya Management Representative atau Admin yang dapat menandatangani sebagai MR" },
        { status: 403 }
      );
    }

    const signature = await prisma.documentSignature.upsert({
      where: {
        documentId_role: {
          documentId: docId,
          role,
        },
      },
      update: {
        userId: parseInt(session.user.id),
        signatureData: signatureData || null,
        signedAt: new Date(),
      },
      create: {
        documentId: docId,
        userId: parseInt(session.user.id),
        role,
        signatureData: signatureData || null,
        signedAt: new Date(),
      },
    });

    // Check if both signatures are filled
    const allSignatures = await prisma.documentSignature.findMany({
      where: { documentId: docId },
    });

    if (allSignatures.length >= 2) {
      await prisma.document.update({
        where: { id: docId },
        data: { status: "signed" },
      });
    }

    return NextResponse.json(signature);
  } catch (error) {
    console.error("Sign document error:", error);
    return NextResponse.json(
      { error: "Failed to save signature" },
      { status: 500 }
    );
  }
}
