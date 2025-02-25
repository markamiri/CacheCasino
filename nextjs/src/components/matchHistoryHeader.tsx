import React from "react";
import Image from "next/image";

// Define TypeScript interface for matchHistory

interface MatchHistoryType {
  profileImage?: string;
  username?: string;
  name?: string;
  createdAt?: string;
}

interface MatchHistoryHeaderProps {
  matchHistory?: MatchHistoryType;
}

const MatchHistoryHeader: React.FC<MatchHistoryHeaderProps> = ({
  matchHistory,
}) => {
  return (
    <div
      style={{ backgroundColor: "rgb(49, 49, 60)" }}
      className="text-white p-6 rounded-lg flex items-center space-x-6 shadow-lg"
    >
      {/* Profile Image */}
      <div className="w-20 h-20 relative">
        <Image
          src={matchHistory?.profileImage || "/images/placeholder-avatar.png"}
          alt="User Avatar"
          width={80}
          height={80}
          className="rounded-full"
        />
      </div>

      {/* User Details */}
      <div className="flex-1">
        <h2 className="text-2xl font-bold flex">
          {matchHistory?.username || "USERNAME"}
          <div
            style={{ color: "rgb(158, 158, 177)", marginLeft: "10px" }}
            className="text"
          >
            #{matchHistory?.name || "0000"}
          </div>
        </h2>
        <p className="text-gray-400">
          Member Since:{" "}
          <span className="text-blue-400">
            {matchHistory?.createdAt
              ? matchHistory.createdAt.split("T")[0]
              : "Unranked"}
          </span>
        </p>

        <button
          style={{ backgroundColor: "rgb(83, 131, 232)" }}
          className="px-4 py-2 text-white rounded-md"
        >
          Tier Graph
        </button>
      </div>
    </div>
  );
};

export default MatchHistoryHeader;
