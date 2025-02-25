import React from "react";

// Define TypeScript types
interface BetLeg {
  name: string;
  team: string;
  prop: string;
  points?: string;
  betType?: string;
  odds: number;
}

interface Bet {
  status: "WON" | "LOST" | "UNSETTLED";
  createdAt: string;
  wager: number;
  potentialReturn: number;
  legs: BetLeg[];
}

interface MatchHistoryBetsProps {
  bets?: Bet[]; // Optional to avoid crashes
}

const MatchHistoryBets: React.FC<MatchHistoryBetsProps> = ({ bets = [] }) => {
  return (
    <div className="match-history-container">
      {bets.map((bet, index) => (
        <div
          key={index}
          className={`bet-card ${
            bet.status === "WON"
              ? "win-card"
              : bet.status === "LOST"
              ? "lose-card"
              : "unsettled-card"
          }`}
        >
          {/* Row 1: Bet Title + Time */}
          <div className="bet-header">
            <span className="bet-type">
              {bet.legs.length > 1 ? "Parlay" : "Straight"}
            </span>
            <span className="bet-time">
              {new Date(bet.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* Row 2: Bet Legs */}
          <div className="bet-legs">
            {bet.legs.map((leg, legIndex) => (
              <div key={legIndex} className="bet-leg">
                <img
                  src="/images/placeholder-avatar.png"
                  alt="Team"
                  className="team-logo"
                />
                <div className="bet-leg-info">
                  <span className="bet-name">{leg.name}</span>

                  {/* Moneyline */}
                  {leg.prop === "Moneyline" && (
                    <span className="bet-details">
                      {leg.team === "Away" && leg.name.includes("@")
                        ? ` ${leg.name.split(" @ ")[0]} `
                        : ` ${leg.name.split(" @ ")[1]} `}
                      {leg.prop}
                    </span>
                  )}

                  {/* Game Spread */}
                  {leg.prop === "Game Spread" && (
                    <span className="bet-details">
                      {leg.points && leg.points !== "N/A" ? (
                        <>
                          {leg.team === "Away" && leg.name.includes("@")
                            ? ` ${leg.name.split(" @ ")[0]}`
                            : ` ${leg.name.split(" @ ")[1]}`}{" "}
                          {leg.points}
                        </>
                      ) : (
                        <>{leg.team}</>
                      )}
                    </span>
                  )}

                  {/* Total Points */}
                  {leg.prop === "Total Points" && (
                    <span className="bet-details">
                      {leg.betType === "Over" && leg.name.includes("@")
                        ? "Under"
                        : "Over"}{" "}
                      {leg.points && leg.points !== "N/A" ? ` ${leg.points} ` : ""}
                    </span>
                  )}

                  {/* Match & Team Totals */}
                  {(leg.prop.startsWith("Match Total") ||
                    leg.prop.startsWith("Team Total")) &&
                    leg.prop !== "Total Points" &&
                    leg.prop !== "Game Spread" &&
                    leg.prop !== "Moneyline" && (
                      <span>
                        {leg.prop} {leg.team}
                      </span>
                    )}

                  {/* Default Prop Display */}
                  {leg.prop !== "Total Points" &&
                    leg.prop !== "Game Spread" &&
                    leg.prop !== "Moneyline" &&
                    !leg.prop.startsWith("Match Total") &&
                    !leg.prop.startsWith("Team Total") && (
                      <span>{leg.team}</span>
                    )}

                  <span className="bet-odds">Odds: {leg.odds}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Row 3: Bet Outcome */}
          <div className="bet-outcome">
            <span className="bet-wager">Wager: ${bet.wager}</span>
            <span className="bet-return">
              Potential Return: ${bet.potentialReturn}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MatchHistoryBets;
