"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs"; // ✅ Import client-side auth
import { useEffect, useState } from "react";
import response from "./response.json";
import { SignedOut } from "@clerk/nextjs";
import { SignedIn } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PrismaClient } from "@prisma/client";
import prisma from "@/lib/prisma";
import { Progress } from "@/components/ui/progress";

type MarketSelection = {
  id: string;
  type: string;
  points?: {
    formattedPoints: string;
  };
  odds?: {
    formattedOdds: string;
    numerator: number;
    denominator: number;
  };
  name?: {
    defaultName: string;
  };
};

type Market = {
  name: string;
  selections: MarketSelection[];
};

type Matchup = {
  id: string;
  matchup: string;
  startTime: string;
  gameLink: string;
  markets: Record<string, Market>; // Update this to make `markets` an object with string keys
  awayRankAndRecord: string;
  homeRankAndRecord: string;
};

type SelectedBet = {
  matchup: string;
  marketType: string;
  team: string;
  points: string;
  odds: string;
  betType: string;
  wagerAmount: number; // NEW: Stores the amount wagered
  gameDate: string;
  id: string; // ✅ Add this line
};

export default function Home() {
  const router = useRouter(); // Using the new `useRouter` from `next/navigation`
  const [matchups, setMatchups] = useState<any[]>([]); // Initialize as an empty array
  const [loading, setLoading] = useState<boolean>(true); // Track loading state
  const [cartOpen, setCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // ✅ Track when component is mounted
  const [progress, setProgress] = useState(0); // ✅ Track progress

  const { isSignedIn, user } = useUser(); // ✅ Get user info from Clerk
  const [selectedBets, setSelectedBets] = useState<SelectedBet[]>(() => {
    if (typeof window !== "undefined") {
      const savedBets = localStorage.getItem("betSlip");
      return savedBets ? JSON.parse(savedBets) : [];
    }
    return [];
  });
  const getTeamImage = (teamName: string): string => {
    // Convert team name to lowercase, replace spaces with dashes
    const sanitizedName = teamName.toLowerCase().replace(/\s+/g, "-");
    console.log(sanitizedName);
    return `/images/nba-${sanitizedName}-logo.png`; // No /src // Assuming images are in the `/public/images` folder
  };

  const fetchMatchups = async () => {
    //const nbaToday =
    //"https://52.15.141.192:8000/fetch_market_data?canonical_url=https://thescore.bet/sport/basketball/organization/united-states/competition/nba";
    const nbaToday =
      "/api/fetchMarketData?url=https://thescore.bet/sport/basketball/organization/united-states/competition/nba";

    try {
      // Fetch data from the API
      const response = await fetch(nbaToday);
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      // Parse the JSON response
      const responseData = await response.json();

      // Extract sectionChildren from the fetched data
      const sectionChildren =
        responseData.data?.page?.defaultChild?.sectionChildren;

      if (!sectionChildren) {
        console.error("sectionChildren not found");
        return [];
      }

      const marketplaceShelf = sectionChildren.find(
        (child: any) => child.__typename === "MarketplaceShelf"
      );

      if (!marketplaceShelf?.marketplaceShelfChildren) {
        console.error("marketplaceShelfChildren not found");
        return [];
      }

      // Extract and organize matchups
      const data = marketplaceShelf.marketplaceShelfChildren.map(
        (child: any) => {
          const event = child.fallbackEvent;
          const richEvent = child.richEvent;
          const gameLink = child.deepLink?.webUrl || "No link available";

          if (!event || !event.awayParticipant || !event.homeParticipant)
            return null;

          const matchup = `${event.awayParticipant.mediumName} @ ${event.homeParticipant.mediumName}`;
          const startTime = event.startTime || "Unknown Time";

          return {
            id: event.id,
            matchup,
            startTime,
            gameLink,
          };
        }
      );

      return data.filter(Boolean); // Filter out any null values
    } catch (error) {
      console.error("Error fetching matchups:", error);
      return [];
    }
  };

  const loadMatchups = async () => {
    const nbaToday =
      "/api/fetchMarketData?url=https://thescore.bet/sport/basketball/organization/united-states/competition/nba";

    try {
      const response = await fetch(nbaToday);
      if (!response.ok) {
        throw new Error(`Failed to fetch matchups: ${response.statusText}`);
      }

      const responseData = await response.json();
      console.log("Full API Response:", responseData);

      const sectionChildren =
        responseData?.data?.data?.page?.defaultChild?.sectionChildren;
      if (!Array.isArray(sectionChildren)) {
        console.error(
          "sectionChildren is not found or not an array:",
          sectionChildren
        );
        return [];
      }

      const marketplaceShelf = sectionChildren.find(
        (child: any) => child.__typename === "MarketplaceShelf"
      );

      if (!marketplaceShelf?.marketplaceShelfChildren) {
        console.error("marketplaceShelfChildren not found in MarketplaceShelf");
        return [];
      }

      console.log(
        "marketplaceShelfChildren:",
        marketplaceShelf.marketplaceShelfChildren
      );

      const matchups = marketplaceShelf.marketplaceShelfChildren.map(
        (child: any) => {
          const event = child.fallbackEvent;
          if (!event || !event.awayParticipant || !event.homeParticipant) {
            console.warn("Incomplete event data for child:", child);
            return null;
          }

          const marketsObject = (child.markets || []).reduce(
            (acc: Record<string, any>, market: any) => {
              acc[market.name] = market;
              return acc;
            },
            {}
          );

          return {
            id: event.id,
            matchup: `${event.awayParticipant.mediumName} @ ${event.homeParticipant.mediumName}`,
            startTime: event.startTime || "Unknown Time",
            gameLink: child.deepLink?.webUrl || "No link available",
            markets: marketsObject,
          };
        }
      );

      return matchups.filter(Boolean);
    } catch (error) {
      console.error("Error fetching matchups:", error);
      return [];
    }
  };

  const handleCardClick = async (gameLink: string, matchup: string) => {
    //const apiUrl = `http://52.15.141.192:8000/fetch_market_data?canonical_url=https://thescore.bet${gameLink}`;
    const apiUrl = `/api/fetchMarketData?url=https://thescore.bet${gameLink}`;

    console.log(
      `handleCardClick invoked with gameLink: ${gameLink} and matchup: ${matchup}`
    );
    console.log(`Constructed API URL: ${apiUrl}`);

    try {
      console.log(`Starting fetch for matchup: ${matchup}`);
      const response = await fetch(apiUrl);

      console.log(
        `Fetch completed for API: ${apiUrl}, status: ${response.status}`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`Fetched data:`, data);

      // Extract the `sectionChildren` array
      const sectionChildren =
        data?.data?.data?.page?.defaultChild?.sectionChildren || [];

      console.log(`Extracted sectionChildren:`, sectionChildren);

      if (!Array.isArray(sectionChildren)) {
        console.warn("sectionChildren is not an array:", sectionChildren);
        alert("No valid sectionChildren found.");
        return;
      }

      // Save the `sectionChildren` to sessionStorage for use on the next page
      console.log(`Saving sectionChildren to sessionStorage`);
      sessionStorage.setItem(
        "sectionChildren",
        JSON.stringify(sectionChildren)
      );

      // Redirect to the matchup page
      console.log(`Redirecting to /matchup/${encodeURIComponent(matchup)}`);
      router.push(`/matchup/${encodeURIComponent(matchup)}`);
    } catch (error) {
      console.error("Error occurred in handleCardClick:", error);
      alert(`Failed to fetch data for matchup: ${matchup}`);
    }
  };

  const handleBetSelection = (
    matchup: Matchup,
    marketType: string,
    selection: MarketSelection,
    id: string = "N/A" // ✅ Default to "N/A" if not provided
  ) => {
    const betData: SelectedBet = {
      matchup: matchup.matchup,
      marketType,
      id,
      team: selection.type.includes("AWAY")
        ? matchup.matchup.split(" @ ")[0] // Get the first team (Away)
        : matchup.matchup.split(" @ ")[1], // Get the second team (Home)
      gameDate: matchup.startTime,
      points: selection.points?.formattedPoints || "N/A",
      odds: selection.odds?.formattedOdds || "N/A",
      betType: selection.type,
      wagerAmount: 0, // NEW: Initialize wager to 0
    };

    console.log("📝 Bet Selected:", betData);

    setSelectedBets((prevBets: SelectedBet[]) => {
      const betExists = prevBets.some(
        (bet) =>
          bet.matchup === betData.matchup &&
          bet.marketType === betData.marketType &&
          bet.betType === betData.betType
      );

      if (betExists) {
        console.warn("⚠️ Duplicate bet detected:", betData);
        return prevBets;
      }

      const updatedBets = [...prevBets, betData];
      localStorage.setItem("betSlip", JSON.stringify(updatedBets));
      return updatedBets;
    });
  };

  const updateWagerAmount = (index: number, amount: number) => {
    setSelectedBets((prevBets) => {
      const updatedBets = prevBets.map((bet, i) =>
        i === index ? { ...bet, wagerAmount: amount } : bet
      );

      localStorage.setItem("betSlip", JSON.stringify(updatedBets));
      return updatedBets;
    });
  };

  const removeBet = (index: number) => {
    setSelectedBets((prevBets) => {
      const updatedBets = prevBets.filter((_, i) => i !== index);
      localStorage.setItem("betSlip", JSON.stringify(updatedBets)); // Update storage
      return updatedBets;
    });
  };

  const handlePlaceBet = async () => {
    if (!isSignedIn || !user) {
      alert("You must be logged in to place a bet.");
      return;
    }

    try {
      const response = await fetch("/api/placeStraightBet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clerkId: user.id,
          selectedBets,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      alert("Bet placed successfully!");
      setSelectedBets([]);
      localStorage.removeItem("betSlip");
    } catch (error) {
      console.error("Error placing bet:", error);

      // Ensure error message is properly retrieved
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      alert(errorMessage);
    }
  };

  useEffect(() => {
    setIsMounted(true); // ✅ Prevent hydration mismatch

    const fetchAndSetMatchups = async () => {
      setLoading(true);
      setProgress(10); // ✅ Start progress

      const interval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 10 : prev)); // Smoothly increase progress
      }, 400);

      const extractedMatchups = await loadMatchups();
      console.log("Extracted Matchups:", extractedMatchups);

      setMatchups(extractedMatchups || []);
      clearInterval(interval);
      setProgress(100); // ✅ Set to 100% after data loads
      setTimeout(() => setLoading(false), 500); // Delay hiding for smooth transition
    };

    fetchAndSetMatchups();
  }, []);

  // 🔹 Show loading screen while fetching data

  useEffect(() => {
    const storedBets = localStorage.getItem("betSlip");
    if (storedBets) {
      setSelectedBets(JSON.parse(storedBets));
    }
  }, []);
  // ✅ Show the ShadCN Progress Bar while loading
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="mb-4 text-white font-bold">Loading Matchups...</p>
        <Progress value={progress} className="w-[60%]" />
      </div>
    );
  }

  return (
    <div className="backgroundColor">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          paddingRight: "20px",
          maxWidth: "1200px", // Limits the width
          margin: "0 auto", // Centers the content
          width: "80%", // Ensures it does not take full width
          transition: "all 0.3s ease-in-out",
        }}
      >
        <div className={`matchupCard ${cartOpen ? "cart-open" : ""}`}>
          {matchups.map((matchup: Matchup) => (
            <Card
              key={matchup.id}
              style={{
                marginBottom: "20px",
                cursor: "pointer",
                backgroundColor: "#2c2e4f",
              }}
              className="cardCont mb-4 cursor-pointer bg-[#2c2e4f] p-3 rounded-lg shadow-md "
              onClick={(e) => {
                // Ensure handleCardClick runs ONLY if the click was NOT on a button
                if (!(e.target as HTMLElement).closest(".bet-button")) {
                  handleCardClick(matchup.gameLink, matchup.matchup);
                }
              }}
            >
              <CardHeader id="matchupTitle">
                <CardTitle>
                  <div className="titleRow">
                    {/* Left Side: Start Time */}
                    <span
                      style={{
                        gridColumn: "1 / 2",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <button className="sgpButton">SGP</button>
                      <div className="startTime">
                        {" "}
                        {(() => {
                          const date = new Date(matchup.startTime);
                          const now = new Date();

                          // Check if the start time is today
                          const isToday =
                            date.toDateString() === now.toDateString();

                          // Format the time without seconds
                          const time = date.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          });

                          return isToday
                            ? `Today · ${time}`
                            : `${date.toLocaleDateString()} · ${time}`;
                        })()}
                      </div>

                      <div>{/*matchup.gameLink*/}</div>
                    </span>

                    {/* Right Side: Spread, Total, Money */}
                    <div className="cardSTM">
                      <span>Spread</span>
                      <span>Total</span>
                      <span>Money</span>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent id="awayteamO">
                {/* Flex Container */}
                <div className="teamRow">
                  {/* First Item: Matchup */}
                  <p style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <div style={{ fontSize: "18px" }}>
                        {matchup.matchup.split(" @ ")[0]}{" "}
                      </div>
                      <div>
                        <Image
                          className="teamImage w-[28px] h-[28px] sm:w-[40px] sm:h-[40px] md:w-[50px] md:h-[50px]"
                          src={getTeamImage(matchup.matchup.split(" @ ")[0])}
                          alt={`${matchup.matchup.split(" @ ")[0]} logo`}
                          width={50} // Default for larger screens
                          height={50} // Default for larger screens
                          onError={(e) => {
                            const imgElement = e.target as HTMLImageElement;
                            if (
                              imgElement.src !== "/images/default-team-logo.png"
                            ) {
                              imgElement.src = "/images/default-team-logo.png";
                            }
                          }}
                        />
                      </div>
                    </div>

                    <div className="rankAndRecord">
                      {matchup.awayRankAndRecord}
                    </div>
                  </p>

                  {/* ✅ BETTING BUTTONS */}

                  {/* 🏀 SPREAD BETTING */}
                  {(() => {
                    const gameSpreadMarket = matchup.markets["Game Spread"];
                    const awaySpreadSelection =
                      gameSpreadMarket?.selections?.find(
                        (selection) => selection.type === "AWAY_SPREAD"
                      );

                    const id = awaySpreadSelection?.id;

                    return (
                      <button
                        className="card-button"
                        onClick={(e) => {
                          if (awaySpreadSelection) {
                            e.stopPropagation();
                            handleBetSelection(
                              matchup,
                              "Game Spread",
                              awaySpreadSelection,
                              id
                            );
                          } else {
                            console.warn("No valid selection for Away Spread");
                          }
                        }}
                      >
                        <div>
                          {awaySpreadSelection?.points?.formattedPoints ||
                            "N/A"}
                        </div>

                        <div className="odds">
                          {awaySpreadSelection?.odds?.formattedOdds || "N/A"}
                        </div>
                      </button>
                    );
                  })()}

                  {/* 📊 TOTAL POINTS BETTING */}
                  {(() => {
                    const totalPointsMarket = matchup.markets["Total Points"];
                    const overSelection = totalPointsMarket?.selections?.find(
                      (selection) => selection.type === "OVER"
                    );
                    const id = overSelection?.id;

                    return (
                      <button
                        className="card-button"
                        onClick={(e) => {
                          if (overSelection) {
                            e.stopPropagation();
                            handleBetSelection(
                              matchup,
                              "Total Points",
                              overSelection,
                              id
                            );
                          } else {
                            console.warn("No valid selection for Over Points");
                          }
                        }}
                      >
                        {overSelection?.name?.defaultName || "N/A"}
                        <div className="odds">
                          {overSelection?.odds?.formattedOdds || "N/A"}
                        </div>
                      </button>
                    );
                  })()}

                  {/* 💰 MONEYLINE BETTING */}
                  {(() => {
                    const moneylineMarket = matchup.markets["Moneyline"];
                    const awayMoneylineSelection =
                      moneylineMarket?.selections?.find(
                        (selection) => selection.type === "AWAY_MONEYLINE"
                      );
                    const id = awayMoneylineSelection?.id;

                    return (
                      <button
                        style={{
                          padding: "10px",
                          backgroundColor: "#1c1c1f",
                          color: "#fff",
                          border: "1px solid #444",
                          borderRadius: "5px",
                          cursor: "pointer",
                          height: "69.33px",
                        }}
                        className="card-button"
                        onClick={(e) => {
                          if (awayMoneylineSelection) {
                            e.stopPropagation();
                            handleBetSelection(
                              matchup,
                              "Moneyline",
                              awayMoneylineSelection,
                              id
                            );
                          } else {
                            console.warn(
                              "No valid selection for Away Moneyline"
                            );
                          }
                        }}
                      >
                        <div className="odds">
                          {awayMoneylineSelection?.odds?.formattedOdds || "N/A"}
                        </div>
                      </button>
                    );
                  })()}
                </div>
              </CardContent>

              <CardContent id="hometeamU">
                {/* Flex Container */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 0.4fr 0.4fr 0.4fr",
                    alignItems: "center",
                    marginLeft: "-4px",
                    gap: "10px",
                  }}
                >
                  {/* First Item: Matchup */}
                  <p style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <div>{matchup.matchup.split(" @ ")[1]} </div>
                      <div>
                        <Image
                          className="teamImage w-[28px] h-[28px] sm:w-[40px] sm:h-[40px] md:w-[50px] md:h-[50px]"
                          src={getTeamImage(matchup.matchup.split(" @ ")[1])}
                          alt={`${matchup.matchup.split(" @ ")[1]} logo`}
                          width={50} // Default for larger screens
                          height={50} // Default for larger screens
                          onError={(e) => {
                            const imgElement = e.target as HTMLImageElement;
                            if (
                              imgElement.src !== "/images/default-team-logo.png"
                            ) {
                              imgElement.src = "/images/default-team-logo.png";
                            }
                          }}
                        />
                      </div>
                    </div>

                    <div className="rankAndRecord">
                      {matchup.homeRankAndRecord}
                    </div>
                  </p>

                  {/* ✅ BETTING BUTTONS */}

                  {/* 🏀 SPREAD BETTING */}
                  {(() => {
                    const gameSpreadMarket = matchup.markets["Game Spread"];
                    const homeSpreadSelection =
                      gameSpreadMarket?.selections?.find(
                        (selection) => selection.type === "HOME_SPREAD"
                      );

                    const id = homeSpreadSelection?.id;

                    return (
                      <button
                        style={{
                          padding: "10px",
                          backgroundColor: "#1c1c1f",
                          color: "#fff",
                          border: "1px solid #444",
                          borderRadius: "5px",
                          cursor: "pointer",
                          height: "69.33px",
                        }}
                        className="card-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (homeSpreadSelection) {
                            handleBetSelection(
                              matchup,
                              "Game Spread",
                              homeSpreadSelection,
                              id
                            );
                          } else {
                            console.warn("No valid selection for Home Spread");
                          }
                        }}
                      >
                        {homeSpreadSelection?.points?.formattedPoints || "N/A"}
                        <div className="odds">
                          {homeSpreadSelection?.odds?.formattedOdds || "N/A"}
                        </div>
                      </button>
                    );
                  })()}

                  {/* 📊 TOTAL POINTS BETTING */}
                  {(() => {
                    const totalPointsMarket = matchup.markets["Total Points"];
                    const underSelection = totalPointsMarket?.selections?.find(
                      (selection) => selection.type === "UNDER"
                    );
                    const id = underSelection?.id;

                    return (
                      <button
                        className="card-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (underSelection) {
                            handleBetSelection(
                              matchup,
                              "Total Points",
                              underSelection,
                              id
                            );
                          } else {
                            console.warn("No valid selection for Under Points");
                          }
                        }}
                      >
                        {underSelection?.name?.defaultName || "N/A"}
                        <div className="odds">
                          {underSelection?.odds?.formattedOdds || "N/A"}
                        </div>
                      </button>
                    );
                  })()}

                  {/* 💰 MONEYLINE BETTING */}
                  {(() => {
                    const moneylineMarket = matchup.markets["Moneyline"];
                    const homeMoneylineSelection =
                      moneylineMarket?.selections?.find(
                        (selection) => selection.type === "HOME_MONEYLINE"
                      );
                    const id = homeMoneylineSelection?.id;

                    return (
                      <button
                        style={{
                          padding: "10px",
                          backgroundColor: "#1c1c1f",
                          color: "#fff",
                          border: "1px solid #444",
                          borderRadius: "5px",
                          cursor: "pointer",
                          height: "69.33px",
                        }}
                        className="card-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (homeMoneylineSelection) {
                            handleBetSelection(
                              matchup,
                              "Moneyline",
                              homeMoneylineSelection,
                              id
                            );
                          } else {
                            console.warn(
                              "No valid selection for Home Moneyline"
                            );
                          }
                        }}
                      >
                        <div className="odds">
                          {homeMoneylineSelection?.odds?.formattedOdds || "N/A"}
                        </div>
                      </button>
                    );
                  })()}
                </div>
              </CardContent>
            </Card>
          ))}
          {cartOpen && (
            <div className="addtocartcont">
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "18px",
                  fontWeight: "bold",
                  paddingBottom: "10px",
                  borderBottom: "1px solid #ddd",
                  flexShrink: 0, // Prevent header from shrinking
                  padding: "0 0px", // Adds spacing inside the container
                }}
              >
                {/* Left: Betslip Title + Bet Count (Grouped Together) */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px", // Adjust spacing between "Betslip" and count
                  }}
                >
                  {/* Bet Count */}
                  <span
                    style={{
                      backgroundColor: "#007AFF",
                      color: "#fff",
                      fontSize: "14px",
                      fontWeight: "bold",
                      borderRadius: "50%",
                      width: "22px",
                      height: "22px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {selectedBets.length}
                  </span>
                  <span>Betslip</span>
                </div>

                {/* Right: Close Cart Button */}
                <button
                  onClick={() => setCartOpen(false)}
                  style={{
                    backgroundColor: "transparent",
                    color: "#000",
                    fontSize: "14px",
                    fontWeight: "bold",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  ✖
                </button>
              </div>

              {/* Tab Navigation */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px 0",
                  fontSize: "14px",
                  fontWeight: "bold",
                  flexShrink: 0, // Prevent this section from shrinking
                }}
              >
                <span
                  style={{
                    color: "#000",
                    borderBottom: "2px solid #007AFF",
                    paddingBottom: "5px",
                  }}
                >
                  STRAIGHT
                </span>
                <span style={{ color: "#bbb" }}>PARLAY</span>
                <span style={{ color: "#bbb" }}>TEASER</span>
              </div>

              {/* Scrollable Bets Container */}
              <div className="scrollable-section">
                {/* Display Selected Bets */}
                {selectedBets.length > 0 ? (
                  selectedBets.map((bet, index) => (
                    <div
                      key={index}
                      style={{
                        backgroundColor: "#fff",
                        padding: "10px",
                        borderRadius: "8px",
                        margin: "10px 0",
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                        position: "relative", // Required for absolute positioning of the button
                      }}
                    >
                      {/* Remove Button (X in top-right) */}
                      <button
                        onClick={() => removeBet(index)}
                        style={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          background: "none",
                          border: "none",
                          fontSize: "18px",
                          fontWeight: "bold",
                          color: "#333",
                          cursor: "pointer",
                        }}
                      >
                        ✖
                      </button>
                      <p
                        style={{
                          fontWeight: "bold",
                          marginBottom: "5px",
                          color: "#000",
                        }}
                      >
                        {bet.matchup}
                      </p>

                      <p style={{ fontSize: "14px", color: "#555" }}>
                        {bet.marketType}
                      </p>
                      <p
                        style={{
                          fontSize: "16px",
                          fontWeight: "bold",
                          color: "#007AFF",
                        }}
                      >
                        {bet.marketType !== "Total Points" && bet.team}

                        {/* Show points only for Game Spread */}
                        {bet.marketType === "Game Spread" && ` ${bet.points}`}

                        {/* Show betType and points for Total Points */}
                        {bet.marketType === "Total Points" && bet.betType
                          ? ` ${bet.betType
                              .charAt(0)
                              .toUpperCase()}${bet.betType
                              .slice(1)
                              .toLowerCase()}  ${bet.points}`
                          : ""}
                      </p>
                      <p
                        style={{
                          fontSize: "14px",
                          fontWeight: "bold",
                          color: "#000",
                        }}
                      >
                        Odds: {bet.odds}
                      </p>

                      {/* NEW: Styled Wager Input & Return Calculation */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginTop: "10px",
                          border: "1px solid #ccc", // Add border to wrap both fields
                          borderRadius: "8px", // Rounded corners
                          padding: "8px", // Add spacing inside
                          backgroundColor: "#fff",
                        }}
                      >
                        {/* Bet Input Field */}
                        <div
                          style={{ flex: 1, textAlign: "left", padding: "5px" }}
                        >
                          <label
                            style={{
                              fontSize: "12px",
                              fontWeight: "bold",
                              color: "#888",
                              display: "block",
                              marginBottom: "2px",
                            }}
                          >
                            Bet
                          </label>
                          <input
                            type="text"
                            value={bet.wagerAmount}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^\d*\.?\d*$/.test(value)) {
                                updateWagerAmount(index, Number(value));
                              }
                            }}
                            style={{
                              width: "100%",
                              padding: "8px",
                              border: "none",
                              borderRadius: "5px",
                              fontSize: "16px",
                              fontWeight: "bold",
                              textAlign: "left",
                              color: "#000",
                              backgroundColor: "#fff",
                              appearance: "textfield", // Prevents number input UI controls
                            }}
                            inputMode="decimal"
                          />
                        </div>

                        {/* Divider Line */}
                        <div
                          style={{
                            width: "1px",
                            backgroundColor: "#ccc",
                            height: "35px",
                          }}
                        ></div>

                        {/* To Win Display */}
                        <div
                          style={{
                            flex: 1,
                            textAlign: "right",
                            padding: "5px",
                          }}
                        >
                          <label
                            style={{
                              fontSize: "12px",
                              fontWeight: "bold",
                              color: "#888",
                              display: "block",
                              marginBottom: "2px",
                            }}
                          >
                            To Win
                          </label>
                          <p
                            style={{
                              fontSize: "16px",
                              fontWeight: "bold",
                              color: "#000",
                              margin: "0",
                            }}
                          >
                            $
                            {bet.wagerAmount
                              ? (
                                  bet.wagerAmount * parseFloat(bet.odds)
                                ).toFixed(2)
                              : "0.00"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  // ✅ Updated Empty Betslip Message
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      padding: "20px 0",
                      color: "#666",
                      fontSize: "14px",
                    }}
                  >
                    {/* Odds Box */}
                    <div
                      style={{
                        border: "2px solid #007AFF",
                        color: "#007AFF",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        fontWeight: "bold",
                        fontSize: "16px",
                      }}
                    >
                      +110
                    </div>
                    <p style={{ textAlign: "center", marginTop: "10px" }}>
                      Add a bet to start building your betslip!
                    </p>
                  </div>
                )}
              </div>

              {/* Payout Section */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "16px",
                  fontWeight: "bold",
                  padding: "10px 0",
                  borderTop: "1px solid #ddd",
                  flexShrink: 0,
                }}
              >
                <span style={{ color: "#777" }}>PAYOUT</span>
                <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                  $
                  {selectedBets
                    .reduce(
                      (total, bet) =>
                        total + bet.wagerAmount * parseFloat(bet.odds),
                      0
                    )
                    .toFixed(2)}
                </span>
              </div>

              {isSignedIn ? (
                <button
                  onClick={handlePlaceBet}
                  style={{
                    width: "100%",
                    backgroundColor: "#007AFF",
                    color: "#fff",
                    padding: "12px",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    marginTop: "10px",
                  }}
                >
                  Place Bet
                </button>
              ) : (
                <SignInButton mode="modal">
                  <button
                    style={{
                      width: "100%",
                      backgroundColor: "#007AFF",
                      color: "#fff",
                      padding: "12px",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "16px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      marginTop: "10px",
                    }}
                  >
                    Log In to Bet
                  </button>
                </SignInButton>
              )}
            </div>
          )}

          {/* Open Cart button (shown when cart is closed) */}
          {!cartOpen && (
            <button
              onClick={() => setCartOpen(true)}
              style={{
                position: "fixed",
                bottom: "20px",
                right: "20px",
                backgroundColor: "#fdbc04",
                color: "#000",
                padding: "15px 20px",
                fontSize: "16px",
                fontWeight: "bold",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              }}
            >
              Open Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
