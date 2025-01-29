import { NextResponse, NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const claims = await prisma.claim.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, claims });
  } catch (error) {
    console.error("Error fetching user claims:", error);
    return NextResponse.json(
      { error: "Failed to fetch user claims" },
      { status: 500 }
    );
  }
}
