import { NextResponse, NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const claimId = searchParams.get("id");

  if (!claimId) {
    return NextResponse.json(
      { error: "Claim ID is required" },
      { status: 400 }
    );
  }

  try {
    const claim = await prisma.claim.findUnique({
      where: { id: claimId, userId },
    });

    if (!claim) {
      return NextResponse.json({ error: "Claim not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, status: claim.status });
  } catch (error) {
    console.error("Error fetching claim status:", error);
    return NextResponse.json(
      { error: "Failed to fetch claim status" },
      { status: 500 }
    );
  }
}
