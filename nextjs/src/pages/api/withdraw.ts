import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { getAuth } from "@clerk/nextjs/server"; // Clerk authentication

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // ✅ Get authenticated user
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    // ✅ Extract withdraw amount from request body
    const { amount } = req.body;
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Invalid withdrawal amount" });
    }

    // ✅ Find the user in the database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }, // Clerk uses `clerkId`
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    // ✅ Check if user has enough balance
    if (user.balance < parseFloat(amount)) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    // ✅ Update user balance (subtract withdrawal amount)
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        balance: { decrement: parseFloat(amount) }, // ✅ Deduct balance
      },
    });

    // ✅ Create a withdrawal transaction record
    await prisma.transactions.create({
      data: {
        userId: user.id,
        TransactionType: "WITHDRAWAL",
        TransactionValue: parseFloat(amount),
        TransactionStatus: "COMPLETED",
      },
    });

    // ✅ Return updated balance
    return res
      .status(200)
      .json({ success: true, newBalance: updatedUser.balance });
  } catch (error) {
    console.error("Withdrawal Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
