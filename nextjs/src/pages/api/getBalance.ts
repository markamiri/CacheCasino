import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { getAuth } from "@clerk/nextjs/server"; // Clerk authentication

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "GET") {  // ✅ Change to GET (since we are fetching data)
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        // ✅ Get the authenticated user
        const { userId } = getAuth(req);
        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        // ✅ Find the user in the database
        const user = await prisma.user.findUnique({
            where: { clerkId: userId }, // Find user by Clerk ID
            select: { balance: true },  // ✅ Only fetch the balance
        });

        if (!user) return res.status(404).json({ error: "User not found" });

        // ✅ Return the user's balance
        return res.status(200).json({ success: true, balance: user.balance });
    } catch (error) {
        console.error("Error fetching balance:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
