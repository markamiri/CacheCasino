"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs"; // Import Clerk's useUser

interface MatchHistoryType {
  profileImage?: string;
  username?: string;
  name?: string;
  createdAt?: string;
  bets: any[]; // Replace `any` with actual bet type if available
}


const MatchHistoryButton = () => {
  const router = useRouter();
  const { isSignedIn, user } = useUser(); // useUser() returns the user object

  const handleClick = () => {
    if (!isSignedIn || !user?.id) {
      alert("User not logged in");
      return;
    }

    // Redirect to match history page with userId
    router.push(`/matchHistory/${user.id}`);
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 bg-gray-800 rounded-md text-white"
    >
      Match History
    </button>
  );
};

export default MatchHistoryButton;
