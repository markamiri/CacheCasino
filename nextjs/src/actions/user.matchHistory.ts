import prisma from "@/lib/prisma";

export const getUserMatchHistory = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }, // Query based on Clerk ID
      include: {
        bets: true, // Include the user's bets
        transactions: true, // Include transaction history
      },
    });

    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    console.error("Error fetching match history:", error);
    return null;
  }
};
