import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Import your Prisma client

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

    // Fetch user match history from Prisma
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        bets: {
          include: { legs: true }, // ✅ Include legs inside bets
        },
        transactions: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user match history:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
