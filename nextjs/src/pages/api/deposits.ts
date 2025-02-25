import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { getAuth } from "@clerk/nextjs/server"; // If using Clerk auth

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // ✅ Get the authenticated user (Clerk example)
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    // ✅ Extract deposit amount from request body
    const { amount } = req.body;
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Invalid deposit amount" });
    }

    // ✅ Find the user in the database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }, // Clerk uses clerkId
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    // ✅ Update user balance
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        balance: { increment: parseFloat(amount) }, // ✅ Increase balance
      },
    });

    // ✅ Create a transaction record
    await prisma.transactions.create({
      data: {
        userId: user.id,
        TransactionType: "DEPOSIT",
        TransactionValue: parseFloat(amount),
        TransactionStatus: "COMPLETED",
      },
    });

    // ✅ Return updated balance
    return res
      .status(200)
      .json({ success: true, newBalance: updatedUser.balance });
  } catch (error) {
    console.error("Deposit Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
