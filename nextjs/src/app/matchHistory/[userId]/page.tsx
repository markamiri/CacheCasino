"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import MatchHistoryHeader from "@/components/matchHistoryHeader"; // Import your component
import MatchHistoryBets from "@/components/MatchHistoryBets";

interface MatchHistoryType {
  profileImage?: string;
  username?: string;
  name?: string;
  createdAt?: string;
  bets: any[]; // Replace `any` with actual bet type if available
}
const MatchHistory = () => {
  const { userId } = useParams() as { userId: string };

  const [matchHistory, setMatchHistory] = useState<MatchHistoryType | null>(
    null
  );

  useEffect(() => {
    const fetchMatchHistory = async () => {
      try {
        const response = await fetch(`/api/matchHistory/${userId}`);
        const data = await response.json();
        setMatchHistory(data);
      } catch (error) {
        console.error("Error fetching match history:", error);
      }
    };

    if (userId) {
      fetchMatchHistory();
    }
  }, [userId]);

  return (
    <div>
      {/* Pass matchHistory as a prop */}
      {matchHistory && <MatchHistoryHeader matchHistory={matchHistory} />}

      <h1 className="text-xl font-bold">Match History</h1>
      {matchHistory ? (
        <MatchHistoryBets bets={matchHistory.bets} />
      ) : (
        <p>Loading match history...</p>
      )}
    </div>
  );
};

export default MatchHistory;
