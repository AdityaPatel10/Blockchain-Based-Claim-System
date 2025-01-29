import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, email } = await req.json();

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      // Create new user if not exists
      user = await prisma.user.create({
        data: {
          id: userId,
          name,
          email,
        },
      });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Error creating/fetching user:", error);
    return NextResponse.json(
      { error: "Failed to create/fetch user" },
      { status: 500 }
    );
  }
}
