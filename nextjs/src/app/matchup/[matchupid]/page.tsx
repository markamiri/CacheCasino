"use client";
import ScrollableButtons from "@/components/ScrollableButtons";
import { Progress } from "@/components/ui/progress"; // ✅ Import ShadCN Progress component

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";
type MarketSelection = {
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
  queryName: string;
  wagerAmount: number; // NEW: Stores the amount wagered
  gameDate: string;
};
const MatchupPage = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [matchups, setMatchups] = useState<any[]>([]); // Initialize as an empty array
  const { isSignedIn, user } = useUser(); // ✅ Get user info from Clerk
  const [marketLoading, setMarketLoading] = useState<boolean>(false); // ✅ Track market-fetching loading state
  const [progress, setProgress] = useState(0);

  const [selectedBets, setSelectedBets] = useState<SelectedBet[]>(() => {
    if (typeof window !== "undefined") {
      const savedBets = localStorage.getItem("betSlip");
      return savedBets ? JSON.parse(savedBets) : [];
    }
    return [];
  });
  const [sectionChildren, setSectionChildren] = useState<any[]>([]);
  const [moneyLineData, setMoneyLineData] = useState<any>({
    away: null,
    home: null,
  });

  const [gameSpreadData, setgameSpreadData] = useState<any>({
    away: null,
    home: null,
  });

  const [totalPointsData, settotalPointsData] = useState<any>({
    over: null,
    under: null,
  });
  const [playerPointsOUData, setplayerPointsOUData] = useState<any>({
    over: null,
    under: null,
    marketName: null,
  });

  const [playerPointsOUData2, setplayerPointsOUData2] = useState<any[]>([]);

  const [playerFirstBasketData, setplayerFirstBasketData] = useState<any>({
    marketName: null,
    formattedOdds: null,
  });
  const [playerFirstReboundData, setplayerFirstReboundData] = useState<any>({
    marketName: null,
    formattedOdds: null,
  });
  const [playerFirstAssistData, setplayerFirstAssistData] = useState<any>({
    marketName: null,
    formattedOdds: null,
  });
  const [playerReboundsOUData, setplayerReboundsOUData] = useState<any[]>([]);

  const [playerAssistsOUData, setplayerAssistsOUData] = useState<any[]>([]);

  const [player3PointersOUData, setplayer3PointersOUData] = useState<any[]>([]);

  const [playerTurnoversOUData, setplayerTurnoversOUData] = useState<any[]>([]);
  const [playerFTMOUData, setplayerFTMOUData] = useState<any[]>([]);
  const [playerFGMOUData, setplayerFGMOUData] = useState<any[]>([]);
  const [playerTotalPointsData, setplayerTotalPointsData] = useState<any[]>([]);

  const [playerTotalAssistsData, setplayerTotalAssistsData] = useState<any[]>(
    []
  );
  const [playerTotalReboundsData, setplayerTotalReboundsData] = useState<any[]>(
    []
  );

  const [playerTotalStealsData, setplayerTotalStealsData] = useState<any[]>([]);

  const [playerTotalBlocksData, setplayerTotalBlocksData] = useState<any[]>([]);
  const [playerTotal3PointersMadeData, setplayerTotal3PointersMadeData] =
    useState<any[]>([]);

  const [playerTotalStealsandBlockData, setplayerTotalStealsandBlockData] =
    useState<any[]>([]);

  const [TeamTotalAssistsData, setTeamTotalAssistsData] = useState<any[]>([]);

  const [TeamTotal3PointersData, setTeamTotal3PointersData] = useState<any[]>(
    []
  );
  const [TeamTotalStealsData, setTeamTotalStealsData] = useState<any[]>([]);

  const [TeamTotalBlocksData, setTeamTotalBlocksData] = useState<any[]>([]);

  const [MatchTotalAssistsData, setMatchTotalAssistsData] = useState<any[]>([]);

  const [MatchTotal3PointersData, setMatchTotal3PointersData] = useState<any[]>(
    []
  );

  const [MatchTotalStealsData, setMatchTotalStealsData] = useState<any[]>([]);

  const [MatchTotalBlocksData, setMatchTotalBlocksData] = useState<any[]>([]);

  useEffect(() => {
    // Retrieve `sectionChildren` from sessionStorage
    const storedData = sessionStorage.getItem("sectionChildren");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      console.log("Parsed sectionChildren:", parsedData);
      setSectionChildren(parsedData);
    }
  }, []);

  useEffect(() => {
    if (sectionChildren.length > 0) {
      setMarketLoading(true); // ✅ Show progress bar **before** processing sectionChildren
      setProgress(10); // ✅ Initialize progress

      const interval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 10 : prev));
      }, 400);

      console.log(
        "✅ sectionChildren is updated, running market-fetching functions..."
      );

      // ✅ Run market-fetching functions
      handleMoneyLineButtonClick();
      handleGameSpreadButtonClick();
      handleTotalPointsButtonClick();
      handleFirstPointsButtonClick();
      handleFirstReboundButtonClick();
      handlePlayerTotalPointsOUClick2();
      handlePlayerTotalReboundsOUClick();
      handlePlayerTotalAssistsOUClick();
      handlePlayerTotalPoints();
      handlePlayerTotalAssists();
      handlePlayerTotalRebounds();
      handlePlayerTotalSteals();
      handlePlayerTotalBlocks();
      handlePlayerTotal3PointersMade();
      handlePlayerTotalStealsandBlocks();
      handlePlayerTotal3PointersOUClick();
      handlePlayerTotalTurnoversOUClick();
      handlePlayerTotalFTMOUClick();
      handlePlayerTotalFGMOUClick();
      handleFirstAssistButtonClick();
      handleTeamTotalAssistsClick();
      handleTeamTotal3PointersClick();
      handleTeamTotalStealsClick();
      handleTeamTotalBlocksClick();
      handleMatchTotalAssistsButtonClick();
      handleMatchTotal3PointersButtonClick();
      handleMatchTotalStealsButtonClick();
      handleMatchTotalBlocksButtonClick();

      setTimeout(() => {
        clearInterval(interval);
        setProgress(100);
        setMarketLoading(false); // ✅ Hide progress bar after small delay
      }, 2000);
    }
  }, [sectionChildren]);

  const handleBetSelection = (
    matchup: string, // ✅ Formatted as "AwayTeam @ HomeTeam"
    marketType: string,
    teamName: string, // ✅ Selected Team
    odds: string, // ✅ Odds for Selected Team
    queryName: string,
    gameDate: string
  ) => {
    if (!matchup) {
      console.warn("⚠️ Missing matchup.");
      return;
    }

    if (!teamName) {
      console.warn("⚠️ No team selected for bet.");
      return;
    }

    if (!odds) {
      console.warn("⚠️ No odds available for bet.");
      return;
    }

    const betData: SelectedBet = {
      matchup,
      marketType,
      team: teamName,
      points: "N/A",
      odds,
      queryName,
      wagerAmount: 0,
      gameDate,
    };

    console.log("📝 Bet Selected:", betData);

    setSelectedBets((prevBets: SelectedBet[]) => {
      const betExists = prevBets.some(
        (bet) =>
          bet.matchup === betData.matchup &&
          bet.marketType === betData.marketType &&
          bet.team === betData.team
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

  const handleMoneyLineButtonClick = () => {
    console.log(
      "Looking for MoneyLine Drawer in sectionChildren:",
      sectionChildren
    );

    // Find the drawer with labelText "MoneyLine"
    const moneyLineDrawer = sectionChildren.find(
      (drawer) => drawer.labelText === "Moneyline"
    );

    if (!moneyLineDrawer) {
      console.warn("No MoneyLine drawer found.");
      return;
    }

    console.log("Found MoneyLine Drawer:", moneyLineDrawer);

    // Check for drawerChildren inside the MoneyLine drawer
    const drawerChildren = moneyLineDrawer.drawerChildren;
    if (!Array.isArray(drawerChildren) || drawerChildren.length === 0) {
      console.warn(
        "No drawerChildren found in MoneyLine drawer:",
        moneyLineDrawer
      );
      return;
    }

    console.log("Found drawerChildren in MoneyLine Drawer:", drawerChildren);

    // Extract the market data for type AWAY_MONEYLINE and HOME_MONEYLINE
    const awayMoneyLine =
      drawerChildren[0]?.marketplaceShelfChildren?.[0]?.markets?.[0]?.selections?.find(
        (selection: { type: string }) => selection.type === "AWAY_MONEYLINE"
      );

    const homeMoneyLine =
      drawerChildren[0]?.marketplaceShelfChildren?.[0]?.markets?.[0]?.selections?.find(
        (selection: { type: string }) => selection.type === "HOME_MONEYLINE"
      );

    if (!awayMoneyLine && !homeMoneyLine) {
      console.warn("No AWAY_MONEYLINE or HOME_MONEYLINE data found.");
      return;
    }

    console.log("Found AWAY_MONEYLINE data:", awayMoneyLine);
    console.log("Found HOME_MONEYLINE data:", homeMoneyLine);
    // ✅ Extract the startTime from fallbackEvent
    const startTime =
      drawerChildren[0]?.marketplaceShelfChildren?.[0]?.fallbackEvent
        ?.startTime || "N/A"; // Default to N/A if not found

    console.log("Game Start Time:", startTime);
    // Set the extracted data in the state
    setMoneyLineData({
      away: {
        formattedOdds: awayMoneyLine?.odds?.formattedOdds || "N/A",
        fullName: awayMoneyLine?.participant?.mediumName || "N/A",
        queryName: awayMoneyLine?.participant?.fullName || "N/A",
      },
      home: {
        formattedOdds: homeMoneyLine?.odds?.formattedOdds || "N/A",
        fullName: homeMoneyLine?.participant?.mediumName || "N/A",
        queryName: homeMoneyLine?.participant?.fullName || "N/A",
      },
      startTime, // ✅ Add start time to the state
    });
  };

  const handleGameSpreadButtonClick = () => {
    console.log(
      "Looking for Game Spread Drawer in sectionChildren:",
      sectionChildren
    );

    // Find the drawer with labelText "Game Spread"
    const gameSpreadDrawer = sectionChildren.find(
      (drawer) => drawer.labelText === "Game Spread"
    );

    if (!gameSpreadDrawer) {
      console.warn("No Game Spread drawer found.");
      return;
    }

    console.log("Found Game Spread Drawer:", gameSpreadDrawer);

    // Check for drawerChildren inside the Game Spread drawer
    const drawerChildren = gameSpreadDrawer.drawerChildren;
    if (!Array.isArray(drawerChildren) || drawerChildren.length === 0) {
      console.warn(
        "No drawerChildren found in Game Spread drawer:",
        gameSpreadDrawer
      );
      return;
    }

    console.log("Found drawerChildren in Game Spread Drawer:", drawerChildren);

    // Iterate through each drawerChild to extract all AWAY_SPREAD and HOME_SPREAD data
    const spreadData = drawerChildren.flatMap((drawerChild) => {
      const markets = drawerChild?.marketplaceShelfChildren?.flatMap(
        (shelfChild: any) => shelfChild.markets || []
      );

      if (!markets || markets.length === 0) {
        console.warn("No markets found in drawerChild:", drawerChild);
        return [];
      }

      return markets.flatMap((market: any) => {
        const awaySpread = market.selections?.find(
          (selection: { type: string }) => selection.type === "AWAY_SPREAD"
        );

        const homeSpread = market.selections?.find(
          (selection: { type: string }) => selection.type === "HOME_SPREAD"
        );

        return [
          awaySpread
            ? {
                type: "AWAY_SPREAD",
                formattedOdds: awaySpread.odds?.formattedOdds || "N/A",
                fullName: awaySpread.name?.fullName || "N/A",
              }
            : null,
          homeSpread
            ? {
                type: "HOME_SPREAD",
                formattedOdds: homeSpread.odds?.formattedOdds || "N/A",
                fullName: homeSpread.name?.fullName || "N/A",
              }
            : null,
        ].filter(Boolean); // Remove null values
      });
    });

    if (spreadData.length === 0) {
      console.warn("No spread data found.");
      return;
    }

    console.log("Extracted Spread Data:", spreadData);

    // Set the extracted spread data in the state
    setgameSpreadData(spreadData);
  };

  const handleTotalPointsButtonClick = () => {
    console.log(
      "Looking for Total Points Drawer in sectionChildren:",
      sectionChildren
    );

    // Find the drawer with labelText "Game Spread"
    const totalPointsDrawer = sectionChildren.find(
      (drawer) => drawer.labelText === "Total Points"
    );

    if (!totalPointsDrawer) {
      console.warn("No Game Spread drawer found.");
      return;
    }

    console.log("Found Game Spread Drawer:", totalPointsDrawer);

    // Check for drawerChildren inside the Game Spread drawer
    const drawerChildren = totalPointsDrawer.drawerChildren;
    if (!Array.isArray(drawerChildren) || drawerChildren.length === 0) {
      console.warn(
        "No drawerChildren found in Game Spread drawer:",
        totalPointsDrawer
      );
      return;
    }

    console.log("Found drawerChildren in Game Spread Drawer:", drawerChildren);

    const totalData = drawerChildren.flatMap((drawerChild) => {
      const markets = drawerChild?.marketplaceShelfChildren?.flatMap(
        (shelfChild: any) => shelfChild.markets || []
      );

      if (!markets || markets.length === 0) {
        console.warn("No markets found in drawerChild:", drawerChild);
        return [];
      }

      return markets.flatMap((market: any) => {
        const over = market.selections?.find(
          (selection: { type: string }) => selection.type === "OVER"
        );

        const under = market.selections?.find(
          (selection: { type: string }) => selection.type === "UNDER"
        );

        return [
          over
            ? {
                type: "OVER",
                formattedOdds: over.odds?.formattedOdds || "N/A",
                fullName: over.name?.defaultName || "N/A",
              }
            : null,
          under
            ? {
                type: "UNDER",
                formattedOdds: under.odds?.formattedOdds || "N/A",
                fullName: under.name?.defaultName || "N/A",
              }
            : null,
        ].filter(Boolean); // Remove null values
      });
    });

    if (totalData.length === 0) {
      console.warn("No spread data found.");
      return;
    }

    console.log("Extracted Spread Data:", totalData);

    // Set the extracted spread data in the state
    settotalPointsData(totalData);
  };

  const handleFirstPointsButtonClick = () => {
    console.log(
      "Looking for First Points Drawer in sectionChildren:",
      sectionChildren
    );

    // Find the drawer with labelText "Game Spread"
    const playerFirstBasketDrawer = sectionChildren.find(
      (drawer) =>
        drawer.labelText === "Player To Score First Basket (Incld. Free Throws)"
    );

    if (!playerFirstBasketDrawer) {
      console.warn("No Game Spread drawer found.");
      return;
    }

    console.log(
      "Found Game player first basket Drawer:",
      playerFirstBasketDrawer
    );

    // Check for drawerChildren inside the Game Spread drawer
    const drawerChildren = playerFirstBasketDrawer.drawerChildren;
    if (!Array.isArray(drawerChildren) || drawerChildren.length === 0) {
      console.warn(
        "No drawerChildren found in Game Spread drawer:",
        playerFirstBasketDrawer
      );
      return;
    }

    console.log("Found drawerChildren in Game Spread Drawer:", drawerChildren);

    const totalData = drawerChildren.flatMap((drawerChild) => {
      const markets = drawerChild?.marketplaceShelfChildren?.flatMap(
        (shelfChild: any) => shelfChild.markets || []
      );

      if (!markets || markets.length === 0) {
        console.warn("No markets found in drawerChild:", drawerChild);
        return [];
      }

      return markets.flatMap((market: any) => {
        const marketName = market.name || "N/A"; // Extract the market name

        return market.selections?.[0] // Access only the first selection
          ? {
              marketName, // Include market name
              formattedOdds: market.selections[0].odds?.formattedOdds || "N/A", // Extract odds from the first selection
            }
          : []; // Return an empty array if selections[0] does not exist
      });
    });

    if (totalData.length === 0) {
      console.warn("No spread data found.");
      return;
    }

    console.log("Extracted Spread Data:", totalData);

    // Set the extracted spread data in the state
    setplayerFirstBasketData(totalData);
  };

  const handleFirstReboundButtonClick = () => {
    console.log(
      "Looking for First Rebound Drawer in sectionChildren:",
      sectionChildren
    );

    // Find the drawer with labelText "Game Spread"
    const playerFirstReboundDrawer = sectionChildren.find(
      (drawer) => drawer.labelText === "Player To Record The First Rebound"
    );

    if (!playerFirstReboundDrawer) {
      console.warn("No Game Spread drawer found.");
      return;
    }

    console.log(
      "Found Game player first Rebound Drawer:",
      playerFirstReboundDrawer
    );

    // Check for drawerChildren inside the Game Spread drawer
    const drawerChildren = playerFirstReboundDrawer.drawerChildren;
    if (!Array.isArray(drawerChildren) || drawerChildren.length === 0) {
      console.warn(
        "No drawerChildren found in first Rebound drawer:",
        playerFirstReboundDrawer
      );
      return;
    }

    console.log(
      "Found drawerChildren in first Rebound Drawer:",
      drawerChildren
    );

    const totalData = drawerChildren.flatMap((drawerChild) => {
      const markets = drawerChild?.marketplaceShelfChildren?.flatMap(
        (shelfChild: any) => shelfChild.markets || []
      );

      if (!markets || markets.length === 0) {
        console.warn("No markets found in drawerChild:", drawerChild);
        return [];
      }

      return markets.flatMap((market: any) => {
        const marketName = market.name || "N/A"; // Extract the market name

        return market.selections?.[0] // Access only the first selection
          ? {
              marketName, // Include market name
              formattedOdds: market.selections[0].odds?.formattedOdds || "N/A", // Extract odds from the first selection
            }
          : []; // Return an empty array if selections[0] does not exist
      });
    });

    if (totalData.length === 0) {
      console.warn("No spread data found.");
      return;
    }

    console.log("Extracted Spread Data:", totalData);

    // Set the extracted spread data in the state
    setplayerFirstReboundData(totalData);
  };

  const handlePlayerTotalPointsOUClick2 = () => {
    console.log(
      "Looking for Player total Points O/U in sectionChildren:",
      sectionChildren
    );

    // Find the drawer with labelText "Player Total Points O/U"
    const playerPointsOUDrawer = sectionChildren.find(
      (drawer) => drawer.labelText === "Player Total Points O/U"
    );

    if (!playerPointsOUDrawer) {
      console.warn("No Player Total Points O/U drawer found.");
      return;
    }

    console.log("Found Player Total Points O/U Drawer:", playerPointsOUDrawer);

    // Check for drawerChildren inside the Game Spread drawer
    const drawerChildren = playerPointsOUDrawer.drawerChildren;
    if (!Array.isArray(drawerChildren) || drawerChildren.length === 0) {
      console.warn(
        "No drawerChildren found in Player Total Points O/U drawer:",
        playerPointsOUDrawer
      );
      return;
    }

    console.log(
      "Found drawerChildren in Player Total Points O/U Drawer:",
      drawerChildren
    );

    // ✅ Extract Participants and Their Selections
    const totalData = drawerChildren.flatMap((drawerChild) => {
      return drawerChild?.marketplaceShelfChildren?.map((shelfChild: any) => {
        const fullName = shelfChild.participant?.fullName || "N/A"; // Extract participant name

        // Extract selections for this participant
        const selections = (shelfChild.markets || []).flatMap((market: any) => {
          return (
            market.selections?.map((selection: any) => ({
              type: selection.type || "N/A",
              formattedOdds: selection.odds?.formattedOdds || "N/A",
              fullName: selection.name?.defaultName || "N/A",
            })) || []
          );
        });

        return {
          fullName,
          selections,
        };
      });
    });

    if (totalData.length === 0) {
      console.warn("No player total points data found.");
      return;
    }

    // ✅ Log the extracted data
    console.log("Extracted Player Points Data:", totalData);

    // ✅ Set the extracted spread data in the state
    setplayerPointsOUData2(totalData);
  };

  const handlePlayerTotalReboundsOUClick = () => {
    console.log(
      "Looking for Player total Rebounds O/U in sectionChildren:",
      sectionChildren
    );

    // Find the drawer with labelText "Player Total Points O/U"
    const playerReboundsOUDrawer = sectionChildren.find(
      (drawer) => drawer.labelText === "Player Total Rebounds O/U"
    );

    if (!playerReboundsOUDrawer) {
      console.warn("No Player Total Rebounds O/U drawer found.");
      return;
    }

    console.log(
      "Found Player Total Rebounds O/U Drawer:",
      playerReboundsOUDrawer
    );

    // Check for drawerChildren inside the Game Spread drawer
    const drawerChildren = playerReboundsOUDrawer.drawerChildren;
    if (!Array.isArray(drawerChildren) || drawerChildren.length === 0) {
      console.warn(
        "No drawerChildren found in Player Total Rebounds O/U drawer:",
        playerReboundsOUDrawer
      );
      return;
    }

    console.log(
      "Found drawerChildren in Player Total Rebounds O/U Drawer:",
      drawerChildren
    );

    // ✅ Extract Participants and Their Selections
    const totalData = drawerChildren.flatMap((drawerChild) => {
      return drawerChild?.marketplaceShelfChildren?.map((shelfChild: any) => {
        const fullName = shelfChild.participant?.fullName || "N/A"; // Extract participant name

        // Extract selections for this participant
        const selections = (shelfChild.markets || []).flatMap((market: any) => {
          return (
            market.selections?.map((selection: any) => ({
              type: selection.type || "N/A",
              formattedOdds: selection.odds?.formattedOdds || "N/A",
              fullName: selection.name?.defaultName || "N/A",
            })) || []
          );
        });

        return {
          fullName,
          selections,
        };
      });
    });

    if (totalData.length === 0) {
      console.warn("No player total points data found.");
      return;
    }

    // ✅ Log the extracted data
    console.log("Extracted Player Points Data:", totalData);

    // ✅ Set the extracted spread data in the state
    setplayerReboundsOUData(totalData);
  };

  const handlePlayerTotalAssistsOUClick = () => {
    console.log(
      "Looking for Player total Assists O/U in sectionChildren:",
      sectionChildren
    );

    // Find the drawer with labelText "Player Total Points O/U"
    const playerAssistsOUDrawer = sectionChildren.find(
      (drawer) => drawer.labelText === "Player Total Assists O/U"
    );

    if (!playerAssistsOUDrawer) {
      console.warn("No Player Total Assists O/U drawer found.");
      return;
    }

    console.log(
      "Found Player Total Assists O/U Drawer:",
      playerAssistsOUDrawer
    );

    // Check for drawerChildren inside the Game Spread drawer
    const drawerChildren = playerAssistsOUDrawer.drawerChildren;
    if (!Array.isArray(drawerChildren) || drawerChildren.length === 0) {
      console.warn(
        "No drawerChildren found in Player Total Assists O/U drawer:",
        playerAssistsOUDrawer
      );
      return;
    }

    console.log(
      "Found drawerChildren in Player Total Assists O/U Drawer:",
      drawerChildren
    );

    // ✅ Extract Participants and Their Selections
    const totalData = drawerChildren.flatMap((drawerChild) => {
      return drawerChild?.marketplaceShelfChildren?.map((shelfChild: any) => {
        const fullName = shelfChild.participant?.fullName || "N/A"; // Extract participant name

        // Extract selections for this participant
        const selections = (shelfChild.markets || []).flatMap((market: any) => {
          return (
            market.selections?.map((selection: any) => ({
              type: selection.type || "N/A",
              formattedOdds: selection.odds?.formattedOdds || "N/A",
              fullName: selection.name?.defaultName || "N/A",
            })) || []
          );
        });

        return {
          fullName,
          selections,
        };
      });
    });

    if (totalData.length === 0) {
      console.warn("No player total points data found.");
      return;
    }

    // ✅ Log the extracted data
    console.log("Extracted Player Points Data:", totalData);

    // ✅ Set the extracted spread data in the state
    setplayerAssistsOUData(totalData);
  };

  const handlePlayerTotalPoints = () => {
    console.log(
      "Looking for Player total Points in sectionChildren:",
      sectionChildren
    );

    // Find the drawer with labelText ends with "Total Points"
    const playerTotalPointsDrawers = sectionChildren.filter(
      (drawer) =>
        drawer.labelText &&
        drawer.labelText.endsWith("Total Points") &&
        drawer.labelText != "Total Points" &&
        drawer.labelText != "Player Total Points"
    );

    if (!playerTotalPointsDrawers) {
      console.warn("No Player Total Points drawer found.");
      return;
    }

    console.log("Found Player Total Points Drawer", playerTotalPointsDrawers);

    // Check for drawerChildren inside the Game Spread drawer
    const drawerChildren = playerTotalPointsDrawers.flatMap(
      (drawer) => drawer.drawerChildren
    );

    if (!Array.isArray(drawerChildren) || drawerChildren.length === 0) {
      console.warn(
        "No drawerChildren found in Player Total Points drawer:",
        playerTotalPointsDrawers
      );
      return;
    }

    console.log(
      "Found drawerChildren in Player Total Points Drawer:",
      drawerChildren
    );

    const totalData = drawerChildren.flatMap((drawerChild) => {
      return drawerChild?.marketplaceShelfChildren?.map((shelfChild: any) => {
        const fullName = shelfChild.market?.name || "N/A"; // Extract participant name

        // Extract selections for this participant
        const selections =
          shelfChild.market?.selections?.map((selection: any) => ({
            formattedOdds: selection.odds?.formattedOdds || "N/A",
            fullName:
              selection.name?.fullName || selection.name?.defaultName || "N/A",
          })) || [];
        return {
          fullName,
          selections,
        };
      });
    });

    if (totalData.length === 0) {
      console.warn("No player total points data found.");
      return;
    }

    // ✅ Log the extracted data
    console.log("Extracted Player Points Data:", totalData);

    // ✅ Set the extracted spread data in the state
    setplayerTotalPointsData(totalData);
  };

  const handlePlayerTotalAssists = () => {
    console.log(
      "Looking for Player total Assists in sectionChildren:",
      sectionChildren
    );

    // Find the drawer with labelText ends with "Total Points"
    const playerTotalAssistsDrawers = sectionChildren.filter(
      (drawer) =>
        drawer.labelText &&
        drawer.labelText.endsWith("Total Assists") &&
        drawer.labelText != "Total Assists" &&
        drawer.labelText != "Player Total Assists" &&
        drawer.labelText != "Team Total Assists" &&
        drawer.labelText != "Match Total Assists"
    );

    if (!playerTotalAssistsDrawers) {
      console.warn("No Player Total Assists drawer found.");
      return;
    }

    console.log("Found Player Total Assists Drawer", playerTotalAssistsDrawers);

    // Check for drawerChildren inside the Game Spread drawer
    const drawerChildren = playerTotalAssistsDrawers.flatMap(
      (drawer) => drawer.drawerChildren
    );

    if (!Array.isArray(drawerChildren) || drawerChildren.length === 0) {
      console.warn(
        "No drawerChildren found in Player Total Assists drawer:",
        playerTotalAssistsDrawers
      );
      return;
    }

    console.log(
      "Found drawerChildren in Player Total Assists Drawer:",
      drawerChildren
    );

    const totalData = drawerChildren.flatMap((drawerChild) => {
      return drawerChild?.marketplaceShelfChildren?.map((shelfChild: any) => {
        const fullName = shelfChild.market?.name || "N/A"; // Extract participant name

        // Extract selections for this participant
        const selections =
          shelfChild.market?.selections
            ?.filter((selection: any) => selection.odds?.formattedOdds) // ✅ Filter out missing odds
            ?.map((selection: any) => ({
              formattedOdds: selection.odds?.formattedOdds, // ✅ No need for "N/A" since we filtered
              fullName:
                selection.name?.fullName ||
                selection.name?.defaultName ||
                "N/A",
            })) || [];

        return {
          fullName,
          selections,
        };
      });
    });

    if (totalData.length === 0) {
      console.warn("No player total Assists data found.");
      return;
    }

    // ✅ Log the extracted data
    console.log("Extracted Player Assists Data:", totalData);

    // ✅ Set the extracted spread data in the state
    setplayerTotalAssistsData(totalData);
  };

  const handlePlayerTotalRebounds = () => {
    console.log(
      "Looking for Player total Rebounds in sectionChildren:",
      sectionChildren
    );

    // Find the drawer with labelText ends with "Total Points"
    const playerTotalReboundsDrawers = sectionChildren.filter(
      (drawer) =>
        drawer.labelText &&
        drawer.labelText.endsWith("Total Rebounds") &&
        drawer.labelText != "Total Rebounds" &&
        drawer.labelText != "Player Total Rebounds" &&
        drawer.labelText != "Team Total Rebounds" &&
        drawer.labelText != "Match Total Rebounds"
    );

    if (!playerTotalReboundsDrawers) {
      console.warn("No Player Total Rebounds drawer found.");
      return;
    }

    console.log(
      "Found Player Total Rebounds Drawer",
      playerTotalReboundsDrawers
    );

    // Check for drawerChildren inside the Game Spread drawer
    const drawerChildren = playerTotalReboundsDrawers.flatMap(
      (drawer) => drawer.drawerChildren
    );

    if (!Array.isArray(drawerChildren) || drawerChildren.length === 0) {
      console.warn(
        "No drawerChildren found in Player Total Rebounds drawer:",
        playerTotalReboundsDrawers
      );
      return;
    }

    console.log(
      "Found drawerChildren in Player Total Rebounds Drawer:",
      drawerChildren
    );

    const totalData = drawerChildren.flatMap((drawerChild) => {
      return drawerChild?.marketplaceShelfChildren?.map((shelfChild: any) => {
        const fullName = shelfChild.market?.name || "N/A"; // Extract participant name

        // Extract selections for this participant
        const selections =
          shelfChild.market?.selections
            ?.filter((selection: any) => selection.odds?.formattedOdds) // ✅ Filter out missing odds
            ?.map((selection: any) => ({
              formattedOdds: selection.odds?.formattedOdds, // ✅ No need for "N/A" since we filtered
              fullName:
                selection.name?.fullName ||
                selection.name?.defaultName ||
                "N/A",
            })) || [];

        return {
          fullName,
          selections,
        };
      });
    });

    if (totalData.length === 0) {
      console.warn("No player total Rebounds data found.");
      return;
    }

    // ✅ Log the extracted data
    console.log("Extracted Player Rebounds Data:", totalData);

    // ✅ Set the extracted spread data in the state
    setplayerTotalReboundsData(totalData);
  };

  const handlePlayerTotalSteals = () => {
    console.log(
      "Looking for Player total Steals in sectionChildren:",
      sectionChildren
    );

    // Find the drawer with labelText ends with "Total Points"
    const playerTotalStealsDrawers = sectionChildren.filter(
      (drawer) =>
        drawer.labelText &&
        drawer.labelText.endsWith("Total Steals") &&
        drawer.labelText != "Total Steals" &&
        drawer.labelText != "Player Total Steals" &&
        drawer.labelText != "Team Total Steals" &&
        drawer.labelText != "Match Total Steals"
    );

    if (!playerTotalStealsDrawers) {
      console.warn("No Player Total Steals drawer found.");
      return;
    }

    console.log("Found Player Total Steals Drawer", playerTotalStealsDrawers);

    // Check for drawerChildren inside the Game Spread drawer
    const drawerChildren = playerTotalStealsDrawers.flatMap(
      (drawer) => drawer.drawerChildren
    );

    if (!Array.isArray(drawerChildren) || drawerChildren.length === 0) {
      console.warn(
        "No drawerChildren found in Player Total Steals drawer:",
        playerTotalStealsDrawers
      );
      return;
    }

    console.log(
      "Found drawerChildren in Player Total Steals Drawer:",
      drawerChildren
    );

    const totalData = drawerChildren.flatMap((drawerChild) => {
      return drawerChild?.marketplaceShelfChildren?.map((shelfChild: any) => {
        const fullName = shelfChild.market?.name || "N/A"; // Extract participant name

        // Extract selections for this participant
        const selections =
          shelfChild.market?.selections
            ?.filter((selection: any) => selection.odds?.formattedOdds) // ✅ Filter out missing odds
            ?.map((selection: any) => ({
              formattedOdds: selection.odds?.formattedOdds, // ✅ No need for "N/A" since we filtered
              fullName:
                selection.name?.fullName ||
                selection.name?.defaultName ||
                "N/A",
            })) || [];

        return {
          fullName,
          selections,
        };
      });
    });

    if (totalData.length === 0) {
      console.warn("No player total Steals data found.");
      return;
    }

    // ✅ Log the extracted data
    console.log("Extracted Player Steals Data:", totalData);

    // ✅ Set the extracted spread data in the state
    setplayerTotalStealsData(totalData);
  };

  const handlePlayerTotalBlocks = () => {
    console.log(
      "Looking for Player total Blocks in sectionChildren:",
      sectionChildren
    );

    // Find the drawer with labelText ends with "Total Points"
    const playerTotalBlocksDrawers = sectionChildren.filter(
      (drawer) =>
        drawer.labelText &&
        drawer.labelText.endsWith("Total Blocks") &&
        drawer.labelText != "Total Blocks" &&
        drawer.labelText != "Player Total Blocks" &&
        drawer.labelText != "Team Total Blocks" &&
        drawer.labelText != "Match Total Blocks"
    );

    if (!playerTotalBlocksDrawers) {
      console.warn("No Player Total Blocks drawer found.");
      return;
    }

    console.log("Found Player Total Blocks Drawer", playerTotalBlocksDrawers);

    // Check for drawerChildren inside the Game Spread drawer
    const drawerChildren = playerTotalBlocksDrawers.flatMap(
      (drawer) => drawer.drawerChildren
    );

    if (!Array.isArray(drawerChildren) || drawerChildren.length === 0) {
      console.warn(
        "No drawerChildren found in Player Total Blocks drawer:",
        playerTotalBlocksDrawers
      );
      return;
    }

    console.log(
      "Found drawerChildren in Player Total Blocks Drawer:",
      drawerChildren
    );

    const totalData = drawerChildren.flatMap((drawerChild) => {
      return drawerChild?.marketplaceShelfChildren?.map((shelfChild: any) => {
        const fullName = shelfChild.market?.name || "N/A"; // Extract participant name

        // Extract selections for this participant
        const selections =
          shelfChild.market?.selections
            ?.filter((selection: any) => selection.odds?.formattedOdds) // ✅ Filter out missing odds
            ?.map((selection: any) => ({
              formattedOdds: selection.odds?.formattedOdds, // ✅ No need for "N/A" since we filtered
              fullName:
                selection.name?.fullName ||
                selection.name?.defaultName ||
                "N/A",
            })) || [];

        return {
          fullName,
          selections,
        };
      });
    });

    if (totalData.length === 0) {
      console.warn("No player total Blocks data found.");
      return;
    }

    // ✅ Log the extracted data
    console.log("Extracted Player Blocks Data:", totalData);

    // ✅ Set the extracted spread data in the state
    setplayerTotalBlocksData(totalData);
  };

  const handlePlayerTotal3PointersMade = () => {
    console.log(
      "Looking for Player total 3 pointers in sectionChildren:",
      sectionChildren
    );

    // Find the drawer with labelText ends with "Total Points"
    const playerTotal3PointersMadeDrawers = sectionChildren.filter(
      (drawer) =>
        drawer.labelText && drawer.labelText.endsWith("3-Pointers Made")
    );

    if (!playerTotal3PointersMadeDrawers) {
      console.warn("No Player Total 3 pointers drawer found.");
      return;
    }

    console.log(
      "Found Player Total 3 pointers Drawer",
      playerTotal3PointersMadeDrawers
    );

    // Check for drawerChildren inside the Game Spread drawer
    const drawerChildren = playerTotal3PointersMadeDrawers.flatMap(
      (drawer) => drawer.drawerChildren
    );

    if (!Array.isArray(drawerChildren) || drawerChildren.length === 0) {
      console.warn(
        "No drawerChildren found in Player Total 3 pointers drawer:",
        playerTotal3PointersMadeDrawers
      );
      return;
    }

    console.log(
      "Found drawerChildren in Player Total 3 pointers Drawer:",
      drawerChildren
    );

    const totalData = drawerChildren.flatMap((drawerChild) => {
      return drawerChild?.marketplaceShelfChildren?.map((shelfChild: any) => {
        const fullName = shelfChild.market?.name || "N/A"; // Extract participant name

        // Extract selections for this participant
        const selections =
          shelfChild.market?.selections
            ?.filter((selection: any) => selection.odds?.formattedOdds) // ✅ Filter out missing odds
            ?.map((selection: any) => ({
              formattedOdds: selection.odds?.formattedOdds, // ✅ No need for "N/A" since we filtered
              fullName:
                selection.name?.fullName ||
                selection.name?.defaultName ||
                "N/A",
            })) || [];

        return {
          fullName,
          selections,
        };
      });
    });

    if (totalData.length === 0) {
      console.warn("No player total 3 pointers data found.");
      return;
    }

    // ✅ Log the extracted data
    console.log("Extracted Player 3 pointers Data:", totalData);

    // ✅ Set the extracted spread data in the state
    setplayerTotal3PointersMadeData(totalData);
  };

  const handlePlayerTotalStealsandBlocks = () => {
    console.log(
      "Looking for Player total Steals and Blocks in sectionChildren:",
      sectionChildren
    );

    // Find the drawer with labelText ends with "Total Points"
    const playerTotalStealandBlockDrawers = sectionChildren.filter(
      (drawer) => drawer.labelText && drawer.labelText.endsWith("And Blocks")
    );

    if (!playerTotalStealandBlockDrawers) {
      console.warn("No Player Total Steals and Blocks drawer found.");
      return;
    }

    console.log(
      "Found Player Total Steals and Blocks Drawer",
      playerTotalStealandBlockDrawers
    );

    // Check for drawerChildren inside the Game Spread drawer
    const drawerChildren = playerTotalStealandBlockDrawers.flatMap(
      (drawer) => drawer.drawerChildren
    );

    if (!Array.isArray(drawerChildren) || drawerChildren.length === 0) {
      console.warn(
        "No drawerChildren found in Player Total Steals and Blocks drawer:",
        playerTotalStealandBlockDrawers
      );
      return;
    }

    console.log(
      "Found drawerChildren in Player Total Steals and Blocks Drawer:",
      drawerChildren
    );

    const totalData = drawerChildren.flatMap((drawerChild) => {
      return drawerChild?.marketplaceShelfChildren?.map((shelfChild: any) => {
        const fullName = shelfChild.market?.name || "N/A"; // Extract participant name

        // Extract selections for this participant
        const selections =
          shelfChild.market?.selections
            ?.filter((selection: any) => selection.odds?.formattedOdds) // ✅ Filter out missing odds
            ?.map((selection: any) => ({
              formattedOdds: selection.odds?.formattedOdds, // ✅ No need for "N/A" since we filtered
              fullName:
                selection.name?.fullName ||
                selection.name?.defaultName ||
                "N/A",
            })) || [];

        return {
          fullName,
          selections,
        };
      });
    });

    if (totalData.length === 0) {
      console.warn("No player total Steals and Blocks data found.");
      return;
    }

    // ✅ Log the extracted data
    console.log("Extracted Player Steals and Blocks Data:", totalData);

    // ✅ Set the extracted spread data in the state
    setplayerTotalStealsandBlockData(totalData);
  };

  const handlePlayerTotal3PointersOUClick = () => {
    console.log(
      "Looking for Player total 3 Pointers O/U in sectionChildren:",
      sectionChildren
    );

    // Find the drawer with labelText "Player Total Points O/U"
    const player3PointersOUDrawer = sectionChildren.find(
      (drawer) => drawer.labelText === "Player Total 3-Pointers Made O/U"
    );

    if (!player3PointersOUDrawer) {
      console.warn("No Player Total 3 Pointers O/U drawer found.");
      return;
    }

    console.log(
      "Found Player Total 3 Pointers O/U Drawer:",
      player3PointersOUDrawer
    );

    // Check for drawerChildren inside the Game Spread drawer
    const drawerChildren = player3PointersOUDrawer.drawerChildren;
    if (!Array.isArray(drawerChildren) || drawerChildren.length === 0) {
      console.warn(
        "No drawerChildren found in Player Total 3 Pointers O/U drawer:",
        player3PointersOUDrawer
      );
      return;
    }

    console.log(
      "Found drawerChildren in Player Total 3 Pointers O/U Drawer:",
      drawerChildren
    );

    // ✅ Extract Participants and Their Selections
    const totalData = drawerChildren.flatMap((drawerChild) => {
      return drawerChild?.marketplaceShelfChildren?.map((shelfChild: any) => {
        const fullName = shelfChild.participant?.fullName || "N/A"; // Extract participant name

        // Extract selections for this participant
        const selections = (shelfChild.markets || []).flatMap((market: any) => {
          return (
            market.selections?.map((selection: any) => ({
              type: selection.type || "N/A",
              formattedOdds: selection.odds?.formattedOdds || "N/A",
              fullName: selection.name?.defaultName || "N/A",
            })) || []
          );
        });

        return {
          fullName,
          selections,
        };
      });
    });

    if (totalData.length === 0) {
      console.warn("No player total points data found.");
      return;
    }

    // ✅ Log the extracted data
    console.log("Extracted Player Points Data:", totalData);

    // ✅ Set the extracted spread data in the state
    setplayer3PointersOUData(totalData);
  };
  const handlePlayerTotalTurnoversOUClick = () => {
    console.log(
      "Looking for Player total Turnovers O/U in sectionChildren:",
      sectionChildren
    );

    // Find the drawer with labelText "Player Total Points O/U"
    const playerTurnoversOUDrawer = sectionChildren.find(
      (drawer) => drawer.labelText === "Player Total Turnovers O/U"
    );

    if (!playerTurnoversOUDrawer) {
      console.warn("No Player Total Turnovers O/U drawer found.");
      return;
    }

    console.log(
      "Found Player Total Turnovers O/U Drawer:",
      playerTurnoversOUDrawer
    );

    // Check for drawerChildren inside the Game Spread drawer
    const drawerChildren = playerTurnoversOUDrawer.drawerChildren;
    if (!Array.isArray(drawerChildren) || drawerChildren.length === 0) {
      console.warn(
        "No drawerChildren found in Player Total Turnovers O/U drawer:",
        playerTurnoversOUDrawer
      );
      return;
    }

    console.log(
      "Found drawerChildren in Player Total Turnovers O/U Drawer:",
      drawerChildren
    );

    // ✅ Extract Participants and Their Selections
    const totalData = drawerChildren.flatMap((drawerChild) => {
      return drawerChild?.marketplaceShelfChildren?.map((shelfChild: any) => {
        let fullName = shelfChild.markets?.[0]?.name || "N/A"; // Extract participant name
        // Split the string into an array of words
        const words = fullName.split(" ");

        // Remove the last two words and join the remaining words back into a string
        fullName = words.slice(0, -2).join(" ") || fullName; // Fallback to original name if it's too short

        // Extract selections for this participant
        const selections = (shelfChild.markets || []).flatMap((market: any) => {
          return (
            market.selections?.map((selection: any) => ({
              type: selection.type || "N/A",
              formattedOdds: selection.odds?.formattedOdds || "N/A",
              fullName: selection.name?.defaultName || "N/A",
            })) || []
          );
        });

        return {
          fullName,
          selections,
        };
      });
    });

    if (totalData.length === 0) {
      console.warn("No player total points data found.");
      return;
    }

    // ✅ Log the extracted data
    console.log("Extracted Player Points Data:", totalData);

    // ✅ Set the extracted spread data in the state
    setplayerTurnoversOUData(totalData);
  };

  const handlePlayerTotalFTMOUClick = () => {
    console.log(
      "Looking for Player total Free Throws Made O/U in sectionChildren:",
      sectionChildren
    );

    // Find the drawer with labelText "Player Total Points O/U"
    const playerFTMOUDrawer = sectionChildren.find(
      (drawer) => drawer.labelText === "Player Total Free Throws Made O/U"
    );

    if (!playerFTMOUDrawer) {
      console.warn("No Player Total Free Throws Made O/U drawer found.");
      return;
    }

    console.log(
      "Found Player Total Free Throws Made O/U Drawer:",
      playerFTMOUDrawer
    );

    // Check for drawerChildren inside the Game Spread drawer
    const drawerChildren = playerFTMOUDrawer.drawerChildren;
    if (!Array.isArray(drawerChildren) || drawerChildren.length === 0) {
      console.warn(
        "No drawerChildren found in Player Total Free Throws Made O/U drawer:",
        playerFTMOUDrawer
      );
      return;
    }

    console.log(
      "Found drawerChildren in Player Total Free Throws Made O/U Drawer:",
      drawerChildren
    );

    // ✅ Extract Participants and Their Selections
    const totalData = drawerChildren.flatMap((drawerChild) => {
      return drawerChild?.marketplaceShelfChildren?.map((shelfChild: any) => {
        let fullName = shelfChild.markets?.[0]?.name || "N/A"; // Extract participant name
        // Split the string into an array of words
        const words = fullName.split(" ");

        // Remove the last two words and join the remaining words back into a string
        fullName = words.slice(0, -4).join(" ") || fullName; // Fallback to original name if it's too short

        // Extract selections for this participant
        const selections = (shelfChild.markets || []).flatMap((market: any) => {
          return (
            market.selections?.map((selection: any) => ({
              type: selection.type || "N/A",
              formattedOdds: selection.odds?.formattedOdds || "N/A",
              fullName: selection.name?.defaultName || "N/A",
            })) || []
          );
        });

        return {
          fullName,
          selections,
        };
      });
    });

    if (totalData.length === 0) {
      console.warn("No player total points data found.");
      return;
    }

    // ✅ Log the extracted data
    console.log("Extracted Player Points Data:", totalData);

    // ✅ Set the extracted spread data in the state
    setplayerFTMOUData(totalData);
  };

  const handlePlayerTotalFGMOUClick = () => {
    console.log(
      "Looking for Player total Field Goals Made O/U in sectionChildren:",
      sectionChildren
    );

    // Find the drawer with labelText "Player Total Points O/U"
    const playerFGMOUDrawer = sectionChildren.find(
      (drawer) => drawer.labelText === "Player Total Field Goals Made O/U"
    );

    if (!playerFGMOUDrawer) {
      console.warn("No Player Total Field Goals Made O/U drawer found.");
      return;
    }

    console.log(
      "Found Player Total Field Goals Made O/U Drawer:",
      playerFGMOUDrawer
    );

    // Check for drawerChildren inside the Game Spread drawer
    const drawerChildren = playerFGMOUDrawer.drawerChildren;
    if (!Array.isArray(drawerChildren) || drawerChildren.length === 0) {
      console.warn(
        "No drawerChildren found in Player Total Field Goals Made O/U drawer:",
        playerFGMOUDrawer
      );
      return;
    }

    console.log(
      "Found drawerChildren in Player Total Field Goals Made O/U Drawer:",
      drawerChildren
    );

    // ✅ Extract Participants and Their Selections
    const totalData = drawerChildren.flatMap((drawerChild) => {
      return drawerChild?.marketplaceShelfChildren?.map((shelfChild: any) => {
        let fullName = shelfChild.markets?.[0]?.name || "N/A"; // Extract participant name
        // Split the string into an array of words
        const words = fullName.split(" ");

        // Remove the last two words and join the remaining words back into a string
        fullName = words.slice(0, -4).join(" ") || fullName; // Fallback to original name if it's too short

        // Extract selections for this participant
        const selections = (shelfChild.markets || []).flatMap((market: any) => {
          return (
            market.selections?.map((selection: any) => ({
              type: selection.type || "N/A",
              formattedOdds: selection.odds?.formattedOdds || "N/A",
              fullName: selection.name?.defaultName || "N/A",
            })) || []
          );
        });

        return {
          fullName,
          selections,
        };
      });
    });

    if (totalData.length === 0) {
      console.warn("No player total points data found.");
      return;
    }

    // ✅ Log the extracted data
    console.log("Extracted FGM Data:", totalData);

    // ✅ Set the extracted spread data in the state
    setplayerFGMOUData(totalData);
  };

  const handleFirstAssistButtonClick = () => {
    console.log(
      "Looking for First Assist Drawer in sectionChildren:",
      sectionChildren
    );

    // Find the drawer with labelText "Game Spread"
    const playerFirstAssistDrawer = sectionChildren.find(
      (drawer) => drawer.labelText === "Player To Record The First Assist"
    );

    if (!playerFirstAssistDrawer) {
      console.warn("No Game Spread drawer found.");
      return;
    }

    console.log(
      "Found Game player first Assist Drawer:",
      playerFirstAssistDrawer
    );

    // Check for drawerChildren inside the Game Spread drawer
    const drawerChildren = playerFirstAssistDrawer.drawerChildren;
    if (!Array.isArray(drawerChildren) || drawerChildren.length === 0) {
      console.warn(
        "No drawerChildren found in first Assist drawer:",
        playerFirstAssistDrawer
      );
      return;
    }

    console.log("Found drawerChildren in first Assist Drawer:", drawerChildren);

    const totalData = drawerChildren.flatMap((drawerChild) => {
      const markets = drawerChild?.marketplaceShelfChildren?.flatMap(
        (shelfChild: any) => shelfChild.markets || []
      );

      if (!markets || markets.length === 0) {
        console.warn("No markets found in drawerChild:", drawerChild);
        return [];
      }

      return markets.flatMap((market: any) => {
        const marketName = market.name || "N/A"; // Extract the market name

        return market.selections?.[0] // Access only the first selection
          ? {
              marketName, // Include market name
              formattedOdds: market.selections[0].odds?.formattedOdds || "N/A", // Extract odds from the first selection
            }
          : []; // Return an empty array if selections[0] does not exist
      });
    });

    if (totalData.length === 0) {
      console.warn("No spread data found.");
      return;
    }

    console.log("Extracted Spread Data:", totalData);

    // Set the extracted spread data in the state
    setplayerFirstAssistData(totalData);
  };

  const handleTeamTotalAssistsClick = () => {
    console.log(
      "Looking for Team Total Assists in sectionChildren:",
      sectionChildren
    );

    // Find the drawer with labelText "MoneyLine"
    const moneyLineDrawer = sectionChildren.find(
      (drawer) => drawer.labelText === "Team Total Assists"
    );

    if (!moneyLineDrawer) {
      console.warn("No Team Total Assists drawer found.");
      return;
    }

    console.log("Found Team Total Assists Drawer:", moneyLineDrawer);

    // Check for drawerChildren inside the MoneyLine drawer
    const drawerChildren = moneyLineDrawer.drawerChildren;
    if (!Array.isArray(drawerChildren) || drawerChildren.length === 0) {
      console.warn(
        "No drawerChildren found in Team Total Assists drawer:",
        moneyLineDrawer
      );
      return;
    }

    console.log(
      "Found drawerChildren in Team Total Assists Drawer:",
      drawerChildren
    );

    // Extract the market data for type AWAY_MONEYLINE and HOME_MONEYLINE
    const awaySelections =
      drawerChildren[0]?.marketplaceShelfChildren?.[1]?.markets?.[0]
        ?.selections || [];

    const homeSelections =
      drawerChildren[0]?.marketplaceShelfChildren?.[0]?.markets?.[0]
        ?.selections || [];

    if (!awaySelections && !homeSelections) {
      console.warn("No AWAY_MONEYLINE or HOME_MONEYLINE data found.");
      return;
    }

    const totalData = drawerChildren.flatMap((drawerChild) => {
      return drawerChild?.marketplaceShelfChildren?.map((shelfChild: any) => {
        // Extract away team selections
        const awaySelections = shelfChild.markets?.[1]?.selections || [];

        // Extract home team selections
        const homeSelections = shelfChild.markets?.[0]?.selections || [];

        // Map through the selections

        const home = homeSelections.map((selection: any) => ({
          formattedOdds: selection.odds?.formattedOdds || "N/A",
          fullName: selection.name?.defaultName || "N/A",
        }));

        return {
          teamName: shelfChild.participant?.mediumName || "N/A", // Ensure we associate the data with a team name
          home,
        };
      });
    });

    //  Handle empty data case
    if (totalData.length === 0) {
      console.warn("No team total assists data found.");
      return;
    }

    //  Log the extracted data
    console.log("Extracted Team Total Assists Data:", totalData);

    //  Set the extracted data in the state
    setTeamTotalAssistsData(totalData);
  };

  const handleTeamTotal3PointersClick = () => {
    console.log(
      "Looking for Team Total 3 Pointers in sectionChildren:",
      sectionChildren
    );

    // Find the drawer with labelText "MoneyLine"
    const moneyLineDrawer = sectionChildren.find(
      (drawer) => drawer.labelText === "Team Total 3-Pointers Made"
    );

    if (!moneyLineDrawer) {
      console.warn("No Team Total 3 Pointers drawer found.");
      return;
    }

    console.log("Found Team Total 3 Pointers Drawer:", moneyLineDrawer);

    // Check for drawerChildren inside the MoneyLine drawer
    const drawerChildren = moneyLineDrawer.drawerChildren;
    if (!Array.isArray(drawerChildren) || drawerChildren.length === 0) {
      console.warn(
        "No drawerChildren found in Team Total 3 Pointers drawer:",
        moneyLineDrawer
      );
      return;
    }

    console.log(
      "Found drawerChildren in Team Total 3 Pointers Drawer:",
      drawerChildren
    );

    // Extract the market data for type AWAY_MONEYLINE and HOME_MONEYLINE
    const awaySelections =
      drawerChildren[0]?.marketplaceShelfChildren?.[1]?.markets?.[0]
        ?.selections || [];

    const homeSelections =
      drawerChildren[0]?.marketplaceShelfChildren?.[0]?.markets?.[0]
        ?.selections || [];

    if (!awaySelections && !homeSelections) {
      console.warn("No AWAY_MONEYLINE or HOME_MONEYLINE data found.");
      return;
    }

    const totalData = drawerChildren.flatMap((drawerChild) => {
      return drawerChild?.marketplaceShelfChildren?.map((shelfChild: any) => {
        // Extract away team selections
        const awaySelections = shelfChild.markets?.[1]?.selections || [];

        // Extract home team selections
        const homeSelections = shelfChild.markets?.[0]?.selections || [];

        // Map through the selections

        const home = homeSelections.map((selection: any) => ({
          formattedOdds: selection.odds?.formattedOdds || "N/A",
          fullName: selection.name?.defaultName || "N/A",
        }));

        return {
          teamName: shelfChild.participant?.mediumName || "N/A", // Ensure we associate the data with a team name
          home,
        };
      });
    });

    //  Handle empty data case
    if (totalData.length === 0) {
      console.warn("No team total assists data found.");
      return;
    }

    //  Log the extracted data
    console.log("Extracted Team Total Assists Data:", totalData);

    //  Set the extracted data in the state
    setTeamTotal3PointersData(totalData);
  };
  const handleTeamTotalStealsClick = () => {
    console.log(
      "Looking for Team Total Steals in sectionChildren:",
      sectionChildren
    );

    // Find the drawer with labelText "MoneyLine"
    const moneyLineDrawer = sectionChildren.find(
      (drawer) => drawer.labelText === "Team Total Steals"
    );

    if (!moneyLineDrawer) {
      console.warn("No Team Total Steals drawer found.");
      return;
    }

    console.log("Found Team Total Steals Drawer:", moneyLineDrawer);

    // Check for drawerChildren inside the MoneyLine drawer
    const drawerChildren = moneyLineDrawer.drawerChildren;
    if (!Array.isArray(drawerChildren) || drawerChildren.length === 0) {
      console.warn(
        "No drawerChildren found in Team Total Steals drawer:",
        moneyLineDrawer
      );
      return;
    }

    console.log(
      "Found drawerChildren in Team Total Steals Drawer:",
      drawerChildren
    );

    // Extract the market data for type AWAY_MONEYLINE and HOME_MONEYLINE
    const awaySelections =
      drawerChildren[0]?.marketplaceShelfChildren?.[1]?.markets?.[0]
        ?.selections || [];

    const homeSelections =
      drawerChildren[0]?.marketplaceShelfChildren?.[0]?.markets?.[0]
        ?.selections || [];

    if (!awaySelections && !homeSelections) {
      console.warn("No AWAY_MONEYLINE or HOME_MONEYLINE data found.");
      return;
    }

    const totalData = drawerChildren.flatMap((drawerChild) => {
      return drawerChild?.marketplaceShelfChildren?.map((shelfChild: any) => {
        // Extract away team selections
        const awaySelections = shelfChild.markets?.[1]?.selections || [];

        // Extract home team selections
        const homeSelections = shelfChild.markets?.[0]?.selections || [];

        // Map through the selections

        const home = homeSelections.map((selection: any) => ({
          formattedOdds: selection.odds?.formattedOdds || "N/A",
          fullName: selection.name?.defaultName || "N/A",
        }));

        return {
          teamName: shelfChild.participant?.mediumName || "N/A", // Ensure we associate the data with a team name
          home,
        };
      });
    });

    //  Handle empty data case
    if (totalData.length === 0) {
      console.warn("No team total Steals data found.");
      return;
    }

    //  Log the extracted data
    console.log("Extracted Team Total Steals Data:", totalData);

    //  Set the extracted data in the state
    setTeamTotalStealsData(totalData);
  };

  const handleTeamTotalBlocksClick = () => {
    console.log(
      "Looking for Team Total Blocks in sectionChildren:",
      sectionChildren
    );

    // Find the drawer with labelText "MoneyLine"
    const moneyLineDrawer = sectionChildren.find(
      (drawer) => drawer.labelText === "Team Total Blocks"
    );

    if (!moneyLineDrawer) {
      console.warn("No Team Total Blocks drawer found.");
      return;
    }

    console.log("Found Team Total Blocks Drawer:", moneyLineDrawer);

    // Check for drawerChildren inside the MoneyLine drawer
    const drawerChildren = moneyLineDrawer.drawerChildren;
    if (!Array.isArray(drawerChildren) || drawerChildren.length === 0) {
      console.warn(
        "No drawerChildren found in Team Total Blocks drawer:",
        moneyLineDrawer
      );
      return;
    }

    console.log(
      "Found drawerChildren in Team Total Blocks Drawer:",
      drawerChildren
    );

    // Extract the market data for type AWAY_MONEYLINE and HOME_MONEYLINE
    const awaySelections =
      drawerChildren[0]?.marketplaceShelfChildren?.[1]?.markets?.[0]
        ?.selections || [];

    const homeSelections =
      drawerChildren[0]?.marketplaceShelfChildren?.[0]?.markets?.[0]
        ?.selections || [];

    if (!awaySelections && !homeSelections) {
      console.warn("No AWAY_MONEYLINE or HOME_MONEYLINE data found.");
      return;
    }

    const totalData = drawerChildren.flatMap((drawerChild) => {
      return drawerChild?.marketplaceShelfChildren?.map((shelfChild: any) => {
        // Extract away team selections
        const awaySelections = shelfChild.markets?.[1]?.selections || [];

        // Extract home team selections
        const homeSelections = shelfChild.markets?.[0]?.selections || [];

        // Map through the selections

        const home = homeSelections.map((selection: any) => ({
          formattedOdds: selection.odds?.formattedOdds || "N/A",
          fullName: selection.name?.defaultName || "N/A",
        }));

        return {
          teamName: shelfChild.participant?.mediumName || "N/A", // Ensure we associate the data with a team name
          home,
        };
      });
    });

    //  Handle empty data case
    if (totalData.length === 0) {
      console.warn("No team total Blocks data found.");
      return;
    }

    //  Log the extracted data
    console.log("Extracted Team Total Blocks Data:", totalData);

    //  Set the extracted data in the state
    setTeamTotalBlocksData(totalData);
  };

  const handleMatchTotalAssistsButtonClick = () => {
    console.log(
      "Looking for Match Total Assists Drawer in sectionChildren:",
      sectionChildren
    );

    // Find the drawer with labelText "Game Spread"
    const totalPointsDrawer = sectionChildren.find(
      (drawer) => drawer.labelText === "Match Total Assists"
    );

    if (!totalPointsDrawer) {
      console.warn("No Match Total Assists drawer found.");
      return;
    }

    console.log("Found Match Total Assists Drawer:", totalPointsDrawer);

    // Check for drawerChildren inside the Game Spread drawer
    const drawerChildren = totalPointsDrawer.drawerChildren;
    if (!Array.isArray(drawerChildren) || drawerChildren.length === 0) {
      console.warn(
        "No drawerChildren found in Match Total Assists drawer:",
        totalPointsDrawer
      );
      return;
    }

    console.log(
      "Found drawerChildren in Match Total Assists Drawer:",
      drawerChildren
    );

    const totalData = drawerChildren.flatMap((drawerChild) => {
      const markets = drawerChild?.marketplaceShelfChildren?.flatMap(
        (shelfChild: any) => shelfChild.markets || []
      );

      if (!markets || markets.length === 0) {
        console.warn("No markets found in drawerChild:", drawerChild);
        return [];
      }

      return markets.flatMap((market: any) => {
        const over = market.selections?.find(
          (selection: { type: string }) => selection.type === "OVER"
        );

        const under = market.selections?.find(
          (selection: { type: string }) => selection.type === "UNDER"
        );

        return [
          over
            ? {
                type: "OVER",
                formattedOdds: over.odds?.formattedOdds || "N/A",
                fullName: over.name?.defaultName || "N/A",
              }
            : null,
          under
            ? {
                type: "UNDER",
                formattedOdds: under.odds?.formattedOdds || "N/A",
                fullName: under.name?.defaultName || "N/A",
              }
            : null,
        ].filter(Boolean); // Remove null values
      });
    });

    if (totalData.length === 0) {
      console.warn("No Match Total Assists found.");
      return;
    }

    console.log("Extracted Match Total Assists Data:", totalData);

    // Set the extracted spread data in the state
    setMatchTotalAssistsData(totalData);
  };

  const handleMatchTotal3PointersButtonClick = () => {
    console.log(
      "Looking for Match Total 3 Pointers Drawer in sectionChildren:",
      sectionChildren
    );

    // Find the drawer with labelText "Game Spread"
    const totalPointsDrawer = sectionChildren.find(
      (drawer) => drawer.labelText === "Match Total 3-Pointers Made"
    );

    if (!totalPointsDrawer) {
      console.warn("No Match Total 3 Pointers drawer found.");
      return;
    }

    console.log("Found Match Total 3 Pointers Drawer:", totalPointsDrawer);

    // Check for drawerChildren inside the Game Spread drawer
    const drawerChildren = totalPointsDrawer.drawerChildren;
    if (!Array.isArray(drawerChildren) || drawerChildren.length === 0) {
      console.warn(
        "No drawerChildren found in Match Total 3 Pointers drawer:",
        totalPointsDrawer
      );
      return;
    }

    console.log(
      "Found drawerChildren in Match Total 3 Pointers Drawer:",
      drawerChildren
    );

    const totalData = drawerChildren.flatMap((drawerChild) => {
      const markets = drawerChild?.marketplaceShelfChildren?.flatMap(
        (shelfChild: any) => shelfChild.markets || []
      );

      if (!markets || markets.length === 0) {
        console.warn("No markets found in drawerChild:", drawerChild);
        return [];
      }

      return markets.flatMap((market: any) => {
        const over = market.selections?.find(
          (selection: { type: string }) => selection.type === "OVER"
        );

        const under = market.selections?.find(
          (selection: { type: string }) => selection.type === "UNDER"
        );

        return [
          over
            ? {
                type: "OVER",
                formattedOdds: over.odds?.formattedOdds || "N/A",
                fullName: over.name?.defaultName || "N/A",
              }
            : null,
          under
            ? {
                type: "UNDER",
                formattedOdds: under.odds?.formattedOdds || "N/A",
                fullName: under.name?.defaultName || "N/A",
              }
            : null,
        ].filter(Boolean); // Remove null values
      });
    });

    if (totalData.length === 0) {
      console.warn("No Match Total 3 Pointers found.");
      return;
    }

    console.log("Extracted Match Total 3 Pointers Data:", totalData);

    // Set the extracted spread data in the state
    setMatchTotal3PointersData(totalData);
  };

  const handleMatchTotalStealsButtonClick = () => {
    console.log(
      "Looking for Match Total Steals Drawer in sectionChildren:",
      sectionChildren
    );

    // Find the drawer with labelText "Game Spread"
    const totalPointsDrawer = sectionChildren.find(
      (drawer) => drawer.labelText === "Match Total Steals"
    );

    if (!totalPointsDrawer) {
      console.warn("No Match Total Steals drawer found.");
      return;
    }

    console.log("Found Match Total Steals Drawer:", totalPointsDrawer);

    // Check for drawerChildren inside the Game Spread drawer
    const drawerChildren = totalPointsDrawer.drawerChildren;
    if (!Array.isArray(drawerChildren) || drawerChildren.length === 0) {
      console.warn(
        "No drawerChildren found in Match Total Steals drawer:",
        totalPointsDrawer
      );
      return;
    }

    console.log(
      "Found drawerChildren in Match Total Steals Drawer:",
      drawerChildren
    );

    const totalData = drawerChildren.flatMap((drawerChild) => {
      const markets = drawerChild?.marketplaceShelfChildren?.flatMap(
        (shelfChild: any) => shelfChild.markets || []
      );

      if (!markets || markets.length === 0) {
        console.warn("No markets found in drawerChild:", drawerChild);
        return [];
      }

      return markets.flatMap((market: any) => {
        const over = market.selections?.find(
          (selection: { type: string }) => selection.type === "OVER"
        );

        const under = market.selections?.find(
          (selection: { type: string }) => selection.type === "UNDER"
        );

        return [
          over
            ? {
                type: "OVER",
                formattedOdds: over.odds?.formattedOdds || "N/A",
                fullName: over.name?.defaultName || "N/A",
              }
            : null,
          under
            ? {
                type: "UNDER",
                formattedOdds: under.odds?.formattedOdds || "N/A",
                fullName: under.name?.defaultName || "N/A",
              }
            : null,
        ].filter(Boolean); // Remove null values
      });
    });

    if (totalData.length === 0) {
      console.warn("No Match Total Steals found.");
      return;
    }

    console.log("Extracted Match Total Steals Data:", totalData);

    // Set the extracted spread data in the state
    setMatchTotalStealsData(totalData);
  };

  const handleMatchTotalBlocksButtonClick = () => {
    console.log(
      "Looking for Match Total Blocks Drawer in sectionChildren:",
      sectionChildren
    );

    // Find the drawer with labelText "Game Spread"
    const totalPointsDrawer = sectionChildren.find(
      (drawer) => drawer.labelText === "Match Total Blocks"
    );

    if (!totalPointsDrawer) {
      console.warn("No Match Total Blocks drawer found.");
      return;
    }

    console.log("Found Match Total Blocks Drawer:", totalPointsDrawer);

    // Check for drawerChildren inside the Game Spread drawer
    const drawerChildren = totalPointsDrawer.drawerChildren;
    if (!Array.isArray(drawerChildren) || drawerChildren.length === 0) {
      console.warn(
        "No drawerChildren found in Match Total Blocks drawer:",
        totalPointsDrawer
      );
      return;
    }

    console.log(
      "Found drawerChildren in Match Total Blocks Drawer:",
      drawerChildren
    );

    const totalData = drawerChildren.flatMap((drawerChild) => {
      const markets = drawerChild?.marketplaceShelfChildren?.flatMap(
        (shelfChild: any) => shelfChild.markets || []
      );

      if (!markets || markets.length === 0) {
        console.warn("No markets found in drawerChild:", drawerChild);
        return [];
      }

      return markets.flatMap((market: any) => {
        const over = market.selections?.find(
          (selection: { type: string }) => selection.type === "OVER"
        );

        const under = market.selections?.find(
          (selection: { type: string }) => selection.type === "UNDER"
        );

        return [
          over
            ? {
                type: "OVER",
                formattedOdds: over.odds?.formattedOdds || "N/A",
                fullName: over.name?.defaultName || "N/A",
              }
            : null,
          under
            ? {
                type: "UNDER",
                formattedOdds: under.odds?.formattedOdds || "N/A",
                fullName: under.name?.defaultName || "N/A",
              }
            : null,
        ].filter(Boolean); // Remove null values
      });
    });

    if (totalData.length === 0) {
      console.warn("No Match Total Blocks found.");
      return;
    }

    console.log("Extracted Match Total Blocks Data:", totalData);

    // Set the extracted spread data in the state
    setMatchTotalBlocksData(totalData);
  };

  //Apollo testing

  return (
    <>
      {marketLoading ? (
        // ✅ Show Progress Bar While Loading
        <div className="flex flex-col items-center justify-center h-screen">
          <p className="mb-4 text-white font-bold">Loading Markets...</p>
          <Progress value={progress} className="w-[60%]" />
        </div>
      ) : (
        <div className="backgroundColor">
          {moneyLineData.away && moneyLineData.home && (
            <Card className="market-card" style={{ display: "none" }}>
              <CardHeader>
                <CardTitle>Moneyline</CardTitle>
              </CardHeader>
              <CardContent className="card-content">
                <div className="match-total-container">
                  <button className="moneyline-button">
                    <div className="moneyline-team">
                      {moneyLineData.away.fullName}
                    </div>
                    <div className="moneyline-odds">
                      {moneyLineData.away.formattedOdds}
                    </div>
                  </button>
                  <button className="moneyline-button">
                    <div className="moneyline-team">
                      {moneyLineData.home.fullName}
                    </div>
                    <div className="moneyline-odds">
                      {moneyLineData.home.formattedOdds}
                    </div>
                  </button>
                </div>
              </CardContent>
            </Card>
          )}

          {gameSpreadData && gameSpreadData.length > 0 && (
            <div style={{ display: "none" }}>
              <h2>Game Spread</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Game Spread</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid-container">
                    {gameSpreadData.map((spread: any, index: number) => (
                      <div key={index} className="grid-item">
                        <button className="spread-button">
                          <div>{spread.fullName}</div>
                          <div className="gameSpread-odds">
                            {spread.formattedOdds}
                          </div>
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div style={{ display: "none" }} className="button-group ">
            {/* 2️⃣ Search Bar */}
            <div className="hidden md:flex flex-1 mx-4">
              <input
                type="text"
                placeholder="Search markets"
                className="w-full md:w-[180px] lg:w-[280px] h-10 border border-gray-500 rounded-lg px-4 text-white bg-transparent outline-none focus:border-white"
              />
            </div>

            <div className="scroll-container">
              <button
                className="px-4 py-2 bg-gray-800 rounded-md"
                onClick={handleMoneyLineButtonClick}
              >
                Get MoneyLine Data
              </button>
              <button
                className="px-4 py-2 bg-gray-800 rounded-md"
                onClick={handleGameSpreadButtonClick}
              >
                Get Game Spread Data
              </button>
              <button
                className="px-4 py-2 bg-gray-800 rounded-md"
                onClick={handleTotalPointsButtonClick}
              >
                Get Total Points Data
              </button>

              <button
                className="px-4 py-2 bg-gray-800 rounded-md"
                onClick={handleFirstPointsButtonClick}
              >
                Get first basket Data
              </button>

              <button
                className="px-4 py-2 bg-gray-800 rounded-md"
                onClick={handleFirstReboundButtonClick}
              >
                Get first rebound Data
              </button>

              <button
                className="px-4 py-2 bg-gray-800 rounded-md"
                onClick={handleFirstAssistButtonClick}
              >
                Get first assist Data
              </button>

              <button
                className="px-4 py-2 bg-gray-800 rounded-md"
                onClick={handlePlayerTotalPointsOUClick2}
              >
                Get player points OU data2
              </button>

              <button
                className="px-4 py-2 bg-gray-800 rounded-md"
                onClick={handlePlayerTotalReboundsOUClick}
              >
                Get player Rebounds OU data
              </button>

              <button
                className="px-4 py-2 bg-gray-800 rounded-md"
                onClick={handlePlayerTotalAssistsOUClick}
              >
                Get player Assists OU data
              </button>

              <button
                className="px-4 py-2 bg-gray-800 rounded-md"
                onClick={handlePlayerTotal3PointersOUClick}
              >
                Get player 3 Pointers OU data
              </button>
              <button
                className="px-4 py-2 bg-gray-800 rounded-md"
                onClick={handlePlayerTotalTurnoversOUClick}
              >
                Get player Total Turnovers OU data
              </button>
              <button
                className="px-4 py-2 bg-gray-800 rounded-md"
                onClick={handlePlayerTotalFTMOUClick}
              >
                Get player Free Throws Made OU data
              </button>
              <button
                className="px-4 py-2 bg-gray-800 rounded-md"
                onClick={handlePlayerTotalFGMOUClick}
              >
                Get player Field Goals Made OU data
              </button>

              <button
                className="px-4 py-2 bg-gray-800 rounded-md"
                onClick={handlePlayerTotalPoints}
              >
                Player Points
              </button>

              <button
                className="px-4 py-2 bg-gray-800 rounded-md"
                onClick={handlePlayerTotalAssists}
              >
                Player Assists
              </button>

              <button
                className="px-4 py-2 bg-gray-800 rounded-md"
                onClick={handlePlayerTotalRebounds}
              >
                Player Rebounds
              </button>

              <button
                className="px-4 py-2 bg-gray-800 rounded-md"
                onClick={handlePlayerTotalSteals}
              >
                Player Steals
              </button>

              <button
                className="px-4 py-2 bg-gray-800 rounded-md"
                onClick={handlePlayerTotalBlocks}
              >
                Player Blocks
              </button>

              <button
                className="px-4 py-2 bg-gray-800 rounded-md"
                onClick={handlePlayerTotal3PointersMade}
              >
                Player 3 Pointers Made
              </button>

              <button
                className="px-4 py-2 bg-gray-800 rounded-md"
                onClick={handlePlayerTotalStealsandBlocks}
              >
                Player Total Steals and Blocks
              </button>

              <button
                className="px-4 py-2 bg-gray-800 rounded-md"
                onClick={handleTeamTotalAssistsClick}
              >
                Team Total Assists
              </button>

              <button
                className="px-4 py-2 bg-gray-800 rounded-md"
                onClick={handleTeamTotal3PointersClick}
              >
                Team Total 3 Pointers Made
              </button>

              <button
                className="px-4 py-2 bg-gray-800 rounded-md"
                onClick={handleTeamTotalStealsClick}
              >
                Team Total Steals
              </button>

              <button
                className="px-4 py-2 bg-gray-800 rounded-md"
                onClick={handleTeamTotalBlocksClick}
              >
                Team Total Blocks
              </button>

              <button
                className="px-4 py-2 bg-gray-800 rounded-md"
                onClick={handleMatchTotalAssistsButtonClick}
              >
                Match Total Assists
              </button>

              <button
                className="px-4 py-2 bg-gray-800 rounded-md"
                onClick={handleMatchTotal3PointersButtonClick}
              >
                Match Total 3 Pointers Made
              </button>

              <button
                className="px-4 py-2 bg-gray-800 rounded-md"
                onClick={handleMatchTotalStealsButtonClick}
              >
                Match Total Steals
              </button>

              <button
                className="px-4 py-2 bg-gray-800 rounded-md"
                onClick={handleMatchTotalBlocksButtonClick}
              >
                Match Total Blocks
              </button>
            </div>
          </div>

          <div /* className="p-4" */>
            <h1 className="text-white text-lg mb-4"></h1>
            <ScrollableButtons
              onMoneyLineClick={handleMoneyLineButtonClick}
              onGameSpreadClick={handleGameSpreadButtonClick}
              onTotalPointsClick={handleTotalPointsButtonClick}
              handleFirstPointsButtonClick={handleFirstPointsButtonClick}
              handleFirstReboundButtonClick={handleFirstReboundButtonClick}
              handlePlayerTotalPointsOUClick2={handlePlayerTotalPointsOUClick2}
              handlePlayerTotalReboundsOUClick={
                handlePlayerTotalReboundsOUClick
              }
              handlePlayerTotalAssistsOUClick={handlePlayerTotalAssistsOUClick}
              handlePlayerTotalPoints={handlePlayerTotalPoints}
              handlePlayerTotalAssists={handlePlayerTotalAssists}
              handlePlayerTotalRebounds={handlePlayerTotalRebounds}
              handlePlayerTotalSteals={handlePlayerTotalSteals}
              handlePlayerTotalBlocks={handlePlayerTotalBlocks}
              handlePlayerTotal3PointersMade={handlePlayerTotal3PointersMade}
              handlePlayerTotalStealsandBlocks={
                handlePlayerTotalStealsandBlocks
              }
              handlePlayerTotal3PointersOUClick={
                handlePlayerTotal3PointersOUClick
              }
              handlePlayerTotalTurnoversOUClick={
                handlePlayerTotalTurnoversOUClick
              }
              handlePlayerTotalFTMOUClick={handlePlayerTotalFTMOUClick}
              handlePlayerTotalFGMOUClick={handlePlayerTotalFGMOUClick}
              handleFirstAssistButtonClick={handleFirstAssistButtonClick}
              handleTeamTotalAssistsClick={handleTeamTotalAssistsClick}
              handleTeamTotal3PointersClick={handleTeamTotal3PointersClick}
              handleTeamTotalStealsClick={handleTeamTotalStealsClick}
              handleTeamTotalBlocksClick={handleTeamTotalBlocksClick}
              handleMatchTotalAssistsButtonClick={
                handleMatchTotalAssistsButtonClick
              }
              handleMatchTotal3PointersButtonClick={
                handleMatchTotal3PointersButtonClick
              }
              handleMatchTotalStealsButtonClick={
                handleMatchTotalStealsButtonClick
              }
              handleMatchTotalBlocksButtonClick={
                handleMatchTotalBlocksButtonClick
              }
            />
          </div>

          {moneyLineData.away && moneyLineData.home && (
            <div
              style={{
                position: "fixed",
                top: "122px", // Adjust as needed
                left: 0,
                width: "100%", // Ensures full width background
                backgroundColor: "#12122c",
                zIndex: 200,
              }}
            >
              {/* Centered text container with max-width 600px */}
              <div
                className="team-name-container"
                style={{
                  maxWidth: "600px", // Text container width
                  margin: "0 auto", // Centers the content
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "15px 25px",
                }}
              >
                <div
                  style={{
                    flex: 1,
                    textAlign: "left",
                    fontWeight: "bold",
                    fontSize: "20px",
                  }}
                >
                  {moneyLineData.away.fullName}
                </div>

                <div
                  style={{
                    flex: "0 0 auto",
                    fontWeight: "bold",
                    fontSize: "25px",
                    color: "white",
                  }}
                >
                  VS
                </div>

                <div
                  style={{
                    flex: 1,
                    textAlign: "right",
                    fontWeight: "bold",
                    fontSize: "20px",
                  }}
                >
                  {moneyLineData.home.fullName}
                </div>
              </div>
            </div>
          )}

          {/* Jerseys Section */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              maxWidth: "600px",
              margin: "70px auto 0", // Adjust margin to avoid overlap with fixed names
              padding: "20px",
              borderRadius: "10px",
            }}
          >
            {moneyLineData.away && moneyLineData.home && (
              <>
                {/* Away Team Jersey */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    width: "fit-content",
                  }}
                >
                  <img
                    src={`/images/jersey/away/${
                      moneyLineData.away.fullName.split(" ")[0]
                    }_icon.png`}
                    alt={`${moneyLineData.away.fullName} Jersey`}
                    style={{ width: "100px", height: "150px" }}
                  />
                </div>

                {/* @ Symbol */}
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "25px",
                    color: "white",
                    textAlign: "center",
                    flex: "0 0 auto",
                    padding: "0 20px", // Creates space between jerseys
                  }}
                >
                  @
                </div>

                {/* Home Team Jersey */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    width: "fit-content",
                  }}
                >
                  <img
                    src={`/images/jersey/home/${
                      moneyLineData.home.fullName.split(" ")[0]
                    }_association.png`}
                    alt={`${moneyLineData.home.fullName} Jersey`}
                    style={{ width: "100px", height: "150px" }}
                  />
                </div>
              </>
            )}
          </div>

          <div className="marketContainer">
            <div>
              <Card className="market-card">
                <CardHeader>
                  <CardTitle>MoneyLine</CardTitle>
                </CardHeader>
                <CardContent className="match-total-moneyLine">
                  {moneyLineData.away && (
                    <button
                      style={{ marginRight: "10px" }}
                      className="moneyline-button"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevents clicking from triggering parent events
                        handleBetSelection(
                          `${moneyLineData.away.fullName} @ ${moneyLineData.home.fullName}`, // ✅ Correct matchup
                          "Moneyline",
                          moneyLineData.away.fullName, // ✅ Selected Team (Away)
                          moneyLineData.away.formattedOdds,
                          moneyLineData.away.queryName,
                          moneyLineData.startTime
                        );
                      }}
                    >
                      <div className="spread-text">
                        {moneyLineData.away.fullName}
                      </div>
                      <div className="moneyline-odds, odds">
                        {moneyLineData.away.formattedOdds}
                      </div>
                    </button>
                  )}
                  {moneyLineData.home && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevents clicking from triggering parent events
                        handleBetSelection(
                          `${moneyLineData.away.fullName} @ ${moneyLineData.home.fullName}`, // ✅ Proper matchup format
                          "Moneyline",
                          moneyLineData.home.fullName, // ✅ Selected Team
                          moneyLineData.home.formattedOdds,
                          moneyLineData.home.queryName,
                          moneyLineData.startTime
                        );
                      }}
                      className="moneyline-button"
                    >
                      <div className="spread-text">
                        {moneyLineData.home.fullName}
                      </div>
                      <div className="moneyline-odds, odds">
                        {moneyLineData.home.formattedOdds}
                      </div>
                    </button>
                  )}
                </CardContent>
              </Card>
            </div>
            {gameSpreadData && gameSpreadData.length > 0 && (
              <div>
                <Card className="market-card">
                  <CardHeader>
                    <CardTitle>Game Spread</CardTitle>
                  </CardHeader>
                  <CardContent className="card-content">
                    <div className="grid-container">
                      {gameSpreadData.map((spread: any, index: number) => (
                        <div key={index} className="grid-item">
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Prevents clicking from triggering parent events
                              handleBetSelection(
                                `${moneyLineData.away.fullName} @ ${moneyLineData.home.fullName}`, // ✅ Proper matchup format
                                "Game Spread",
                                spread.fullName,
                                spread.formattedOdds,
                                "Game Spread",
                                moneyLineData.startTime
                              );
                            }}
                            className="long-name-button"
                          >
                            <div className="spread-text">{spread.fullName}</div>
                            <div className="gameSpread-odds, odds">
                              {spread.formattedOdds}
                            </div>
                          </button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            {totalPointsData && totalPointsData.length > 0 && (
              <div>
                <Card className="market-card">
                  <CardHeader>
                    <CardTitle>Total Points</CardTitle>
                  </CardHeader>
                  <CardContent className="card-content">
                    <div className="grid-container">
                      {totalPointsData.map((points: any, index: number) => (
                        <div key={index} className="grid-item">
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Prevents clicking from triggering parent events
                              handleBetSelection(
                                `${moneyLineData.away.fullName} @ ${moneyLineData.home.fullName}`, // ✅ Proper matchup format
                                "Total Points",
                                points.fullName,
                                points.formattedOdds,
                                "Total Points",
                                moneyLineData.startTime
                              );
                            }}
                            className="spread-button"
                          >
                            <div>{points.fullName}</div>
                            <div className="gameSpread-odds, odds">
                              {points.formattedOdds}
                            </div>
                          </button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {playerFirstBasketData && playerFirstBasketData.length > 0 && (
              <div>
                <Card className="market-card">
                  <CardHeader>
                    <CardTitle>First Basket</CardTitle>
                  </CardHeader>
                  <CardContent className="card-content">
                    <div>
                      {playerFirstBasketData.map(
                        (player: any, index: number) => (
                          <div
                            key={index}
                            className="grid-item"
                            style={{ marginBottom: "5px" }}
                          >
                            <div
                              className="text-white font-bold w-1/4"
                              style={{ fontSize: 15, flex: 4 }}
                            >
                              {player.marketName}
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation(); // Prevents clicking from triggering parent events
                                handleBetSelection(
                                  `${moneyLineData.away.fullName} @ ${moneyLineData.home.fullName}`, // ✅ Proper matchup format
                                  "First Basket",
                                  player.marketName,
                                  player.formattedOdds,
                                  "First Basket",
                                  moneyLineData.startTime
                                );
                              }}
                              style={{ flex: 1 }}
                              className="spread-button"
                            >
                              <div className="gameSpread-odds, odds">
                                {player.formattedOdds}
                              </div>
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {playerFirstReboundData && playerFirstReboundData.length > 0 && (
              <div>
                <Card className="market-card">
                  <CardHeader>
                    <CardTitle>First Rebound</CardTitle>
                  </CardHeader>
                  <CardContent className="card-content">
                    <div>
                      {playerFirstReboundData.map(
                        (player: any, index: number) => (
                          <div
                            key={index}
                            className="grid-item"
                            style={{ marginBottom: "5px" }}
                          >
                            <div
                              className="text-white font-bold w-1/4"
                              style={{ flex: 6, fontSize: "15px" }}
                            >
                              {player.marketName}
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation(); // Prevents clicking from triggering parent events
                                handleBetSelection(
                                  `${moneyLineData.away.fullName} @ ${moneyLineData.home.fullName}`, // ✅ Proper matchup format
                                  "First Rebound",
                                  player.marketName,
                                  player.formattedOdds,
                                  "First Rebound",
                                  moneyLineData.startTime
                                );
                              }}
                              style={{ flex: 1 }}
                              className="spread-button"
                            >
                              <div className="gameSpread-odds, odds">
                                {player.formattedOdds}
                              </div>
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {playerFirstAssistData && playerFirstAssistData.length > 0 && (
              <div>
                <Card className="market-card">
                  <CardHeader>
                    <CardTitle>First Assist</CardTitle>
                  </CardHeader>
                  <CardContent className="card-content">
                    <div>
                      {playerFirstAssistData.map(
                        (player: any, index: number) => (
                          <div
                            key={index}
                            className="grid-item"
                            style={{ marginBottom: "5px" }}
                          >
                            <div
                              className="text-white font-bold w-1/4"
                              style={{ flex: 6, fontSize: "15px" }}
                            >
                              {player.marketName}
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation(); // Prevents clicking from triggering parent events
                                handleBetSelection(
                                  `${moneyLineData.away.fullName} @ ${moneyLineData.home.fullName}`, // ✅ Proper matchup format
                                  "First Assist",
                                  player.marketName,
                                  player.formattedOdds,
                                  "First Assist",
                                  moneyLineData.startTime
                                );
                              }}
                              style={{ flex: 1 }}
                              className="spread-button"
                            >
                              <div className="gameSpread-odds, odds">
                                {player.formattedOdds}
                              </div>
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {playerPointsOUData2 && playerPointsOUData2.length > 0 && (
              <div>
                <Card className="market-card">
                  <CardHeader>
                    <CardTitle>Player Total Points O/U</CardTitle>
                  </CardHeader>
                  <CardContent className="card-content">
                    <div className="playerOU-container">
                      {playerPointsOUData2.map((player: any, index: number) => (
                        <div
                          key={index}
                          className="player-container flex items-center justify-between pb-3 border-b border-gray-500"
                        >
                          {/* ✅ Player Name on the Left */}
                          <div className="text-white font-bold text-lg w-1/4">
                            {player.fullName}
                          </div>

                          {/* ✅ Buttons for OVER & UNDER Selections (Side by Side) */}
                          <div className="flex space-x-4 w-3/5">
                            {player.selections.map(
                              (selection: any, selIndex: number) => (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevents clicking from triggering parent events
                                    handleBetSelection(
                                      `${moneyLineData.away.fullName} @ ${moneyLineData.home.fullName}`, // ✅ Proper matchup format
                                      "Player Total Points O/U",
                                      player.fullName +
                                        " " +
                                        selection.fullName,
                                      selection.formattedOdds,
                                      "Player Total Points O/U",
                                      moneyLineData.startTime
                                    );
                                  }}
                                  key={selIndex}
                                  className="spread-button w-1/2 p-3 bg-black text-white rounded-lg"
                                >
                                  <div className="font-bold">
                                    {selection.fullName}
                                  </div>
                                  <div className="text-yellow-400">
                                    {selection.formattedOdds}
                                  </div>
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {playerReboundsOUData && playerReboundsOUData.length > 0 && (
              <div>
                <Card className="market-card">
                  <CardHeader>
                    <CardTitle>Player Total Rebounds O/U</CardTitle>
                  </CardHeader>
                  <CardContent className="card-content">
                    <div className="playerOU-container">
                      {playerReboundsOUData.map(
                        (player: any, index: number) => (
                          <div
                            key={index}
                            className="player-container flex items-center justify-between pb-3 border-b border-gray-500"
                          >
                            {/* ✅ Player Name on the Left */}
                            <div className="text-white font-bold text-lg w-1/4">
                              {player.fullName}
                            </div>

                            {/* ✅ Buttons for OVER & UNDER Selections (Side by Side) */}
                            <div className="flex space-x-4 w-3/5">
                              {player.selections.map(
                                (selection: any, selIndex: number) => (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation(); // Prevents clicking from triggering parent events
                                      handleBetSelection(
                                        `${moneyLineData.away.fullName} @ ${moneyLineData.home.fullName}`, // ✅ Proper matchup format
                                        "Player Total Rebounds O/U",
                                        player.fullName +
                                          " " +
                                          selection.fullName,
                                        selection.formattedOdds,
                                        "Player Total Rebounds O/U",
                                        moneyLineData.startTime
                                      );
                                    }}
                                    key={selIndex}
                                    className="spread-button w-1/2 p-3 bg-black text-white rounded-lg"
                                  >
                                    <div className="font-bold">
                                      {selection.fullName}
                                    </div>
                                    <div className="text-yellow-400">
                                      {selection.formattedOdds}
                                    </div>
                                  </button>
                                )
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {playerAssistsOUData && playerAssistsOUData.length > 0 && (
              <div>
                <Card className="market-card">
                  <CardHeader>
                    <CardTitle>Player Total Assists O/U</CardTitle>
                  </CardHeader>
                  <CardContent className="card-content">
                    <div className="playerOU-container">
                      {playerAssistsOUData.map((player: any, index: number) => (
                        <div
                          key={index}
                          className="player-container flex items-center justify-between pb-3 border-b border-gray-500"
                        >
                          {/* ✅ Player Name on the Left */}
                          <div className="text-white font-bold text-lg w-1/4">
                            {player.fullName}
                          </div>

                          {/* ✅ Buttons for OVER & UNDER Selections (Side by Side) */}
                          <div className="flex space-x-4 w-3/5">
                            {player.selections.map(
                              (selection: any, selIndex: number) => (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevents clicking from triggering parent events
                                    handleBetSelection(
                                      `${moneyLineData.away.fullName} @ ${moneyLineData.home.fullName}`, // ✅ Proper matchup format
                                      "Player Total Assists O/U",
                                      player.fullName +
                                        " " +
                                        selection.fullName,
                                      selection.formattedOdds,
                                      "Player Total Assists O/U",
                                      moneyLineData.startTime
                                    );
                                  }}
                                  key={selIndex}
                                  className="spread-button w-1/2 p-3 bg-black text-white rounded-lg"
                                >
                                  <div className="font-bold">
                                    {selection.fullName}
                                  </div>
                                  <div className="text-yellow-400">
                                    {selection.formattedOdds}
                                  </div>
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {player3PointersOUData && player3PointersOUData.length > 0 && (
              <div>
                <Card className="market-card">
                  <CardHeader>
                    <CardTitle>Player Total 3 Pointers O/U</CardTitle>
                  </CardHeader>
                  <CardContent className="card-content">
                    <div className="playerOU-container">
                      {player3PointersOUData.map(
                        (player: any, index: number) => (
                          <div
                            key={index}
                            className="player-container flex items-center justify-between pb-3 border-b border-gray-500"
                          >
                            {/* ✅ Player Name on the Left */}
                            <div className="text-white font-bold text-lg w-1/4">
                              {player.fullName}
                            </div>

                            {/* ✅ Buttons for OVER & UNDER Selections (Side by Side) */}
                            <div className="flex space-x-4 w-3/5">
                              {player.selections.map(
                                (selection: any, selIndex: number) => (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation(); // Prevents clicking from triggering parent events
                                      handleBetSelection(
                                        `${moneyLineData.away.fullName} @ ${moneyLineData.home.fullName}`, // ✅ Proper matchup format
                                        "Player Total 3 Pointers O/U",
                                        player.fullName +
                                          " " +
                                          selection.fullName,
                                        selection.formattedOdds,
                                        "Player Total 3 Pointers O/U",
                                        moneyLineData.startTime
                                      );
                                    }}
                                    key={selIndex}
                                    className="spread-button w-1/2 p-3 bg-black text-white rounded-lg"
                                  >
                                    <div className="font-bold">
                                      {selection.fullName}
                                    </div>
                                    <div className="text-yellow-400">
                                      {selection.formattedOdds}
                                    </div>
                                  </button>
                                )
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {playerTurnoversOUData && playerTurnoversOUData.length > 0 && (
              <div>
                <Card className="market-card">
                  <CardHeader>
                    <CardTitle>Player Total Turnovers O/U</CardTitle>
                  </CardHeader>
                  <CardContent className="card-content">
                    <div className="playerOU-container">
                      {playerTurnoversOUData.map(
                        (player: any, index: number) => (
                          <div
                            key={index}
                            className="player-container flex items-center justify-between pb-3 border-b border-gray-500"
                          >
                            {/* ✅ Player Name on the Left */}
                            <div className="text-white font-bold text-lg w-3/6">
                              {player.fullName}
                            </div>

                            {/* ✅ Buttons for OVER & UNDER Selections (Side by Side) */}
                            <div className="flex space-x-4 w-3/5">
                              {player.selections.map(
                                (selection: any, selIndex: number) => (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation(); // Prevents clicking from triggering parent events
                                      handleBetSelection(
                                        `${moneyLineData.away.fullName} @ ${moneyLineData.home.fullName}`, // ✅ Proper matchup format
                                        "Player Total Turnovers O/U",
                                        player.fullName +
                                          " " +
                                          selection.fullName,
                                        selection.formattedOdds,
                                        "Player Total Turnovers O/U",
                                        moneyLineData.startTime
                                      );
                                    }}
                                    key={selIndex}
                                    className="spread-button w-1/2 p-3 bg-black text-white rounded-lg"
                                  >
                                    <div className="font-bold">
                                      {selection.fullName}
                                    </div>
                                    <div className="text-yellow-400">
                                      {selection.formattedOdds}
                                    </div>
                                  </button>
                                )
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {playerFTMOUData && playerFTMOUData.length > 0 && (
              <div>
                <Card className="market-card">
                  <CardHeader>
                    <CardTitle>Player Total Free Throws Made O/U</CardTitle>
                  </CardHeader>
                  <CardContent className="card-content">
                    <div className="playerOU-container">
                      {playerFTMOUData.map((player: any, index: number) => (
                        <div
                          key={index}
                          className="player-container flex items-center justify-between pb-3 border-b border-gray-500"
                        >
                          {/* ✅ Player Name on the Left */}
                          <div className="text-white font-bold text-lg w-3/6">
                            {player.fullName}
                          </div>

                          {/* ✅ Buttons for OVER & UNDER Selections (Side by Side) */}
                          <div className="flex space-x-4 w-3/5">
                            {player.selections.map(
                              (selection: any, selIndex: number) => (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevents clicking from triggering parent events
                                    handleBetSelection(
                                      `${moneyLineData.away.fullName} @ ${moneyLineData.home.fullName}`, // ✅ Proper matchup format
                                      "Player Total Free Throws Made O/U",
                                      player.fullName +
                                        " " +
                                        selection.fullName,
                                      selection.formattedOdds,
                                      "Player Total Free Throws Made O/U",
                                      moneyLineData.startTime
                                    );
                                  }}
                                  key={selIndex}
                                  className="spread-button w-1/2 p-3 bg-black text-white rounded-lg"
                                >
                                  <div className="font-bold">
                                    {selection.fullName}
                                  </div>
                                  <div className="text-yellow-400">
                                    {selection.formattedOdds}
                                  </div>
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {playerFGMOUData && playerFGMOUData.length > 0 && (
              <div>
                <Card className="market-card">
                  <CardHeader>
                    <CardTitle>Player Total Field Goals Made O/U</CardTitle>
                  </CardHeader>
                  <CardContent className="card-content">
                    <div className="playerOU-container">
                      {playerFGMOUData.map((player: any, index: number) => (
                        <div
                          key={index}
                          className="player-container flex items-center justify-between pb-3 border-b border-gray-500"
                        >
                          {/* ✅ Player Name on the Left */}
                          <div className="text-white font-bold text-lg w-3/6">
                            {player.fullName}
                          </div>

                          {/* ✅ Buttons for OVER & UNDER Selections (Side by Side) */}
                          <div className="flex space-x-4 w-3/5">
                            {player.selections.map(
                              (selection: any, selIndex: number) => (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevents clicking from triggering parent events
                                    handleBetSelection(
                                      `${moneyLineData.away.fullName} @ ${moneyLineData.home.fullName}`, // ✅ Proper matchup format
                                      "Player Total Field Goals Made O/U",
                                      player.fullName +
                                        " " +
                                        selection.fullName,
                                      selection.formattedOdds,
                                      "Player Total Field Goals Made O/U",
                                      moneyLineData.startTime
                                    );
                                  }}
                                  key={selIndex}
                                  className="spread-button w-1/2 p-3 bg-black text-white rounded-lg"
                                >
                                  <div className="font-bold">
                                    {selection.fullName}
                                  </div>
                                  <div className="text-yellow-400">
                                    {selection.formattedOdds}
                                  </div>
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {TeamTotalAssistsData && TeamTotalAssistsData.length > 0 && (
              <div>
                <Card className="market-card">
                  <CardHeader>
                    <CardTitle>Team Total Assists</CardTitle>
                  </CardHeader>

                  <CardContent className="team-totalcard-content">
                    <div className="playerOU-container">
                      {TeamTotalAssistsData.map((team: any, index: number) => (
                        <div>
                          {" "}
                          <div
                            key={index}
                            className="player-container flex items-center justify-between pb-3 border-b border-gray-500"
                          >
                            {/* Team Name */}
                            <div className="text-white font-bold text-lg mb-2">
                              {team.teamName}
                            </div>

                            {/* Mapping Over Home Selections */}
                            <div className="flex space-x-4 w-3/5">
                              {team.home.map(
                                (selection: any, selIndex: number) => (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation(); // Prevents clicking from triggering parent events
                                      handleBetSelection(
                                        `${moneyLineData.away.fullName} @ ${moneyLineData.home.fullName}`, // ✅ Proper matchup format
                                        "Team Total Assists",
                                        team.teamName +
                                          " " +
                                          selection.fullName,
                                        selection.formattedOdds,
                                        "Team Total Assists",
                                        moneyLineData.startTime
                                      );
                                    }}
                                    key={selIndex}
                                    className="spread-button w-24 p-3 bg-black text-white rounded-lg text-center flex flex-col items-center"
                                  >
                                    {/* Selection Name */}
                                    <div className="font-bold">
                                      {selection.fullName}
                                    </div>

                                    {/* Formatted Odds Below Name */}
                                    <div className="text-yellow-400 text-sm">
                                      {selection.formattedOdds}
                                    </div>
                                  </button>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {TeamTotal3PointersData && TeamTotal3PointersData.length > 0 && (
              <div>
                <Card className="market-card">
                  <CardHeader>
                    <CardTitle>Team Total 3 Pointers</CardTitle>
                  </CardHeader>

                  <CardContent className="team-totalcard-content">
                    <div className="playerOU-container">
                      {TeamTotal3PointersData.map(
                        (team: any, index: number) => (
                          <div>
                            {" "}
                            <div
                              key={index}
                              className="player-container flex items-center justify-between pb-3 border-b border-gray-500"
                            >
                              {/* Team Name */}
                              <div className="text-white font-bold text-lg mb-2">
                                {team.teamName}
                              </div>

                              {/* Mapping Over Home Selections */}
                              <div className="flex space-x-4 w-3/5">
                                {team.home.map(
                                  (selection: any, selIndex: number) => (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation(); // Prevents clicking from triggering parent events
                                        handleBetSelection(
                                          `${moneyLineData.away.fullName} @ ${moneyLineData.home.fullName}`, // ✅ Proper matchup format
                                          "Team Total 3 Pointers",
                                          team.teamName +
                                            " " +
                                            selection.fullName,
                                          selection.formattedOdds,
                                          "Team Total 3 Pointers",
                                          moneyLineData.startTime
                                        );
                                      }}
                                      key={selIndex}
                                      className="spread-button w-24 p-3 bg-black text-white rounded-lg text-center flex flex-col items-center"
                                    >
                                      {/* Selection Name */}
                                      <div className="font-bold">
                                        {selection.fullName}
                                      </div>

                                      {/* Formatted Odds Below Name */}
                                      <div className="text-yellow-400 text-sm">
                                        {selection.formattedOdds}
                                      </div>
                                    </button>
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {TeamTotalStealsData && TeamTotalStealsData.length > 0 && (
              <div>
                <Card className="market-card">
                  <CardHeader>
                    <CardTitle>Team Total Steals</CardTitle>
                  </CardHeader>

                  <CardContent className="team-totalcard-content">
                    <div className="playerOU-container">
                      {TeamTotalStealsData.map((team: any, index: number) => (
                        <div>
                          {" "}
                          <div
                            key={index}
                            className="player-container flex items-center justify-between pb-3 border-b border-gray-500"
                          >
                            {/* Team Name */}
                            <div className="text-white font-bold text-lg mb-2">
                              {team.teamName}
                            </div>

                            {/* Mapping Over Home Selections */}
                            <div className="flex space-x-4 w-3/5">
                              {team.home.map(
                                (selection: any, selIndex: number) => (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation(); // Prevents clicking from triggering parent events
                                      handleBetSelection(
                                        `${moneyLineData.away.fullName} @ ${moneyLineData.home.fullName}`, // ✅ Proper matchup format
                                        "Team Total Steals",
                                        team.teamName +
                                          " " +
                                          selection.fullName,
                                        selection.formattedOdds,
                                        "Team Total Steals",
                                        moneyLineData.startTime
                                      );
                                    }}
                                    key={selIndex}
                                    className="spread-button w-24 p-3 bg-black text-white rounded-lg text-center flex flex-col items-center"
                                  >
                                    {/* Selection Name */}
                                    <div className="font-bold">
                                      {selection.fullName}
                                    </div>

                                    {/* Formatted Odds Below Name */}
                                    <div className="text-yellow-400 text-sm">
                                      {selection.formattedOdds}
                                    </div>
                                  </button>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {TeamTotalBlocksData && TeamTotalBlocksData.length > 0 && (
              <div>
                <Card className="market-card">
                  <CardHeader>
                    <CardTitle>Team Total Blocks</CardTitle>
                  </CardHeader>

                  <CardContent className="team-totalcard-content">
                    <div className="playerOU-container">
                      {TeamTotalBlocksData.map((team: any, index: number) => (
                        <div>
                          {" "}
                          <div
                            key={index}
                            className="player-container flex items-center justify-between pb-3 border-b border-gray-500"
                          >
                            {/* Team Name */}
                            <div className="text-white font-bold text-lg mb-2">
                              {team.teamName}
                            </div>

                            {/* Mapping Over Home Selections */}
                            <div className="flex space-x-4 w-3/5">
                              {team.home.map(
                                (selection: any, selIndex: number) => (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation(); // Prevents clicking from triggering parent events
                                      handleBetSelection(
                                        `${moneyLineData.away.fullName} @ ${moneyLineData.home.fullName}`, // ✅ Proper matchup format
                                        "Team Total Blocks",
                                        team.teamName +
                                          " " +
                                          selection.fullName,
                                        selection.formattedOdds,
                                        "Team Total Blocks",
                                        moneyLineData.startTime
                                      );
                                    }}
                                    key={selIndex}
                                    className="spread-button w-24 p-3 bg-black text-white rounded-lg text-center flex flex-col items-center"
                                  >
                                    {/* Selection Name */}
                                    <div className="font-bold">
                                      {selection.fullName}
                                    </div>

                                    {/* Formatted Odds Below Name */}
                                    <div className="text-yellow-400 text-sm">
                                      {selection.formattedOdds}
                                    </div>
                                  </button>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {MatchTotalAssistsData && MatchTotalAssistsData.length > 0 && (
              <div>
                <Card className="market-card">
                  <CardHeader>
                    <CardTitle>Match Total Assists</CardTitle>
                  </CardHeader>
                  <CardContent className="match-total-moneyLine">
                    <div className="match-total-container">
                      {MatchTotalAssistsData.map(
                        (points: any, index: number) => (
                          <div key={index} className="match-total-item">
                            <button
                              onClick={(e) => {
                                e.stopPropagation(); // Prevents clicking from triggering parent events
                                handleBetSelection(
                                  `${moneyLineData.away.fullName} @ ${moneyLineData.home.fullName}`, // ✅ Proper matchup format
                                  "Match Total Assists",
                                  points.fullName,
                                  points.formattedOdds,
                                  "Match Total Assists",
                                  moneyLineData.startTime
                                );
                              }}
                              className="spread-button"
                            >
                              <div>{points.fullName}</div>
                              <div className="gameSpread-odds, odds">
                                {points.formattedOdds}
                              </div>
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {MatchTotal3PointersData && MatchTotal3PointersData.length > 0 && (
              <div>
                <Card className="market-card">
                  <CardHeader>
                    <CardTitle>Match Total 3 Pointers Made</CardTitle>
                  </CardHeader>
                  <CardContent className="match-total-moneyLine">
                    <div className="match-total-container">
                      {MatchTotal3PointersData.map(
                        (points: any, index: number) => (
                          <div key={index} className="match-total-item">
                            <button
                              onClick={(e) => {
                                e.stopPropagation(); // Prevents clicking from triggering parent events
                                handleBetSelection(
                                  `${moneyLineData.away.fullName} @ ${moneyLineData.home.fullName}`, // ✅ Proper matchup format
                                  "Match Total 3 Pointers",
                                  points.fullName,
                                  points.formattedOdds,
                                  "Match Total 3 Pointers",
                                  moneyLineData.startTime
                                );
                              }}
                              className="spread-button"
                            >
                              <div>{points.fullName}</div>
                              <div className="gameSpread-odds, odds">
                                {points.formattedOdds}
                              </div>
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {MatchTotalStealsData && MatchTotalStealsData.length > 0 && (
              <div>
                <Card className="market-card">
                  <CardHeader>
                    <CardTitle>Match Total Steals</CardTitle>
                  </CardHeader>
                  <CardContent className="match-total-moneyLine">
                    <div className="match-total-container">
                      {MatchTotalStealsData.map(
                        (points: any, index: number) => (
                          <div key={index} className="match-total-item">
                            <button
                              onClick={(e) => {
                                e.stopPropagation(); // Prevents clicking from triggering parent events
                                handleBetSelection(
                                  `${moneyLineData.away.fullName} @ ${moneyLineData.home.fullName}`, // ✅ Proper matchup format
                                  "Match Total Steals",
                                  points.fullName,
                                  points.formattedOdds,
                                  "Match Total Steals",
                                  moneyLineData.startTime
                                );
                              }}
                              className="spread-button"
                            >
                              <div>{points.fullName}</div>
                              <div className="gameSpread-odds, odds">
                                {points.formattedOdds}
                              </div>
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {MatchTotalBlocksData && MatchTotalBlocksData.length > 0 && (
              <div>
                <Card className="market-card">
                  <CardHeader>
                    <CardTitle>Match Total Blocks</CardTitle>
                  </CardHeader>
                  <CardContent className="match-total-moneyLine">
                    <div className="match-total-container">
                      {MatchTotalBlocksData.map(
                        (points: any, index: number) => (
                          <div key={index} className="match-total-item">
                            <button
                              onClick={(e) => {
                                e.stopPropagation(); // Prevents clicking from triggering parent events
                                handleBetSelection(
                                  `${moneyLineData.away.fullName} @ ${moneyLineData.home.fullName}`, // ✅ Proper matchup format
                                  "Match Total Blocks",
                                  points.fullName,
                                  points.formattedOdds,
                                  "Match Total Blocks",
                                  moneyLineData.startTime
                                );
                              }}
                              className="spread-button"
                            >
                              <div>{points.fullName}</div>
                              <div className="gameSpread-odds, odds">
                                {points.formattedOdds}
                              </div>
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
          {playerTotalPointsData && playerTotalPointsData.length > 0 && (
            <div className="w-full flex justify-center  mb-[25px]">
              <Card className="market-card w-[1191px]  h-[350px] mx-auto">
                <CardHeader>
                  <CardTitle>Player Total Points</CardTitle>
                </CardHeader>
                <CardContent className="player-total-card-content">
                  <div className="playerTotalPoints-container">
                    {playerTotalPointsData.map((player: any, index: number) => (
                      <div
                        key={index}
                        className="pb-5 border-b border-gray-500"
                      >
                        {/* ✅ Player Name on Top Left */}
                        <div className="text-white font-bold text-lg mb-2">
                          {player.fullName}
                        </div>

                        {/* ✅ Row of Selection Buttons */}
                        <div className="flex flex-wrap gap-2 ">
                          {player.selections.map(
                            (selection: any, selIndex: number) => (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevents clicking from triggering parent events
                                  handleBetSelection(
                                    `${moneyLineData.away.fullName} @ ${moneyLineData.home.fullName}`, // ✅ Proper matchup format
                                    "Player Total Points",
                                    player.fullName + " " + selection.fullName,
                                    selection.formattedOdds,
                                    "Player Total Points",
                                    moneyLineData.startTime
                                  );
                                }}
                                key={selIndex}
                                className="player-total-button w-24 p-3 bg-black text-white rounded-lg text-center flex flex-col items-center"
                              >
                                {/* ✅ Selection Name */}
                                <div className="font-bold">
                                  {selection.fullName}
                                </div>

                                {/* ✅ Formatted Odds Below Name */}
                                <div className="text-yellow-400">
                                  {selection.formattedOdds}
                                </div>
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {playerTotalAssistsData && playerTotalAssistsData.length > 0 && (
            <div className="w-full flex justify-center mb-[25px]">
              <Card className="market-card w-[1191px]  h-[350px] mx-auto">
                <CardHeader>
                  <CardTitle>Player Total Assists</CardTitle>
                </CardHeader>
                <CardContent className="player-total-card-content">
                  <div className="playerTotalPoints-container">
                    {playerTotalAssistsData.map(
                      (player: any, index: number) => (
                        <div
                          key={index}
                          className="pb-5 border-b border-gray-500"
                        >
                          {/* ✅ Player Name on Top Left */}
                          <div className="text-white font-bold text-lg mb-2">
                            {player.fullName}
                          </div>

                          {/* ✅ Row of Selection Buttons */}
                          <div className="flex flex-wrap gap-2 ">
                            {player.selections.map(
                              (selection: any, selIndex: number) => (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevents clicking from triggering parent events
                                    handleBetSelection(
                                      `${moneyLineData.away.fullName} @ ${moneyLineData.home.fullName}`, // ✅ Proper matchup format
                                      "Player Total Assists",
                                      player.fullName +
                                        " " +
                                        selection.fullName,
                                      selection.formattedOdds,
                                      "Player Total Assists",
                                      moneyLineData.startTime
                                    );
                                  }}
                                  key={selIndex}
                                  className="player-total-button w-24 p-3 bg-black text-white rounded-lg text-center flex flex-col items-center"
                                >
                                  {/* ✅ Selection Name */}
                                  <div className="font-bold">
                                    {selection.fullName}
                                  </div>

                                  {/* ✅ Formatted Odds Below Name */}
                                  <div className="text-yellow-400">
                                    {selection.formattedOdds}
                                  </div>
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {playerTotalReboundsData && playerTotalReboundsData.length > 0 && (
            <div className="w-full flex justify-center mb-[25px]">
              <Card className="market-card w-[1191px]  h-[350px] mx-auto">
                <CardHeader>
                  <CardTitle>Player Total Rebounds</CardTitle>
                </CardHeader>
                <CardContent className="player-total-card-content">
                  <div className="playerTotalPoints-container">
                    {playerTotalReboundsData.map(
                      (player: any, index: number) => (
                        <div
                          key={index}
                          className="pb-5 border-b border-gray-500"
                        >
                          {/* ✅ Player Name on Top Left */}
                          <div className="text-white font-bold text-lg mb-2">
                            {player.fullName}
                          </div>

                          {/* ✅ Row of Selection Buttons */}
                          <div className="flex flex-wrap gap-2 ">
                            {player.selections.map(
                              (selection: any, selIndex: number) => (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevents clicking from triggering parent events
                                    handleBetSelection(
                                      `${moneyLineData.away.fullName} @ ${moneyLineData.home.fullName}`, // ✅ Proper matchup format
                                      "Player Total Rebounds",
                                      player.fullName +
                                        " " +
                                        selection.fullName,
                                      selection.formattedOdds,
                                      "Player Total Rebounds",
                                      moneyLineData.startTime
                                    );
                                  }}
                                  key={selIndex}
                                  className="player-total-button w-24 p-3 bg-black text-white rounded-lg text-center flex flex-col items-center"
                                >
                                  {/* ✅ Selection Name */}
                                  <div className="font-bold">
                                    {selection.fullName}
                                  </div>

                                  {/* ✅ Formatted Odds Below Name */}
                                  <div className="text-yellow-400">
                                    {selection.formattedOdds}
                                  </div>
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {playerTotalStealsData && playerTotalStealsData.length > 0 && (
            <div className="w-full flex justify-center mb-[25px]">
              <Card className="market-card w-[1191px]  h-[350px] mx-auto">
                <CardHeader>
                  <CardTitle>Player Total Steals</CardTitle>
                </CardHeader>
                <CardContent className="player-total-card-content">
                  <div className="playerTotalPoints-container">
                    {playerTotalStealsData.map((player: any, index: number) => (
                      <div
                        key={index}
                        className="pb-5 border-b border-gray-500"
                      >
                        {/* ✅ Player Name on Top Left */}
                        <div className="text-white font-bold text-lg mb-2">
                          {player.fullName}
                        </div>

                        {/* ✅ Row of Selection Buttons */}
                        <div className="flex flex-wrap gap-2 ">
                          {player.selections.map(
                            (selection: any, selIndex: number) => (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevents clicking from triggering parent events
                                  handleBetSelection(
                                    `${moneyLineData.away.fullName} @ ${moneyLineData.home.fullName}`, // ✅ Proper matchup format
                                    "Player Total Steals",
                                    player.fullName + " " + selection.fullName,
                                    selection.formattedOdds,
                                    "Player Total Steals",
                                    moneyLineData.startTime
                                  );
                                }}
                                key={selIndex}
                                className="player-total-button w-24 p-3 bg-black text-white rounded-lg text-center flex flex-col items-center"
                              >
                                {/* ✅ Selection Name */}
                                <div className="font-bold">
                                  {selection.fullName}
                                </div>

                                {/* ✅ Formatted Odds Below Name */}
                                <div className="text-yellow-400">
                                  {selection.formattedOdds}
                                </div>
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {playerTotalBlocksData && playerTotalBlocksData.length > 0 && (
            <div className="w-full flex justify-center mb-[25px]">
              <Card className="market-card w-[1191px]  h-[350px] mx-auto">
                <CardHeader>
                  <CardTitle>Player Total Blocks</CardTitle>
                </CardHeader>
                <CardContent className="player-total-card-content">
                  <div className="playerTotalPoints-container">
                    {playerTotalBlocksData.map((player: any, index: number) => (
                      <div
                        key={index}
                        className="pb-5 border-b border-gray-500"
                      >
                        {/* ✅ Player Name on Top Left */}
                        <div className="text-white font-bold text-lg mb-2">
                          {player.fullName}
                        </div>

                        {/* ✅ Row of Selection Buttons */}
                        <div className="flex flex-wrap gap-2 ">
                          {player.selections.map(
                            (selection: any, selIndex: number) => (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevents clicking from triggering parent events
                                  handleBetSelection(
                                    `${moneyLineData.away.fullName} @ ${moneyLineData.home.fullName}`, // ✅ Proper matchup format
                                    "Player Total Blocks",
                                    player.fullName + " " + selection.fullName,
                                    selection.formattedOdds,
                                    "Player Total Blocks",
                                    moneyLineData.startTime
                                  );
                                }}
                                key={selIndex}
                                className="player-total-button w-24 p-3 bg-black text-white rounded-lg text-center flex flex-col items-center"
                              >
                                {/* ✅ Selection Name */}
                                <div className="font-bold">
                                  {selection.fullName}
                                </div>

                                {/* ✅ Formatted Odds Below Name */}
                                <div className="text-yellow-400">
                                  {selection.formattedOdds}
                                </div>
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {playerTotal3PointersMadeData &&
            playerTotal3PointersMadeData.length > 0 && (
              <div className="w-full flex justify-center mb-[25px]">
                <Card className="market-card w-[1191px]  h-[350px] mx-auto">
                  <CardHeader>
                    <CardTitle>Player Total 3 Pointers Made</CardTitle>
                  </CardHeader>
                  <CardContent className="player-total-card-content">
                    <div className="playerTotalPoints-container">
                      {playerTotal3PointersMadeData.map(
                        (player: any, index: number) => (
                          <div
                            key={index}
                            className="pb-5 border-b border-gray-500"
                          >
                            {/* ✅ Player Name on Top Left */}
                            <div className="text-white font-bold text-lg mb-2">
                              {player.fullName}
                            </div>

                            {/* ✅ Row of Selection Buttons */}
                            <div className="flex flex-wrap gap-2 ">
                              {player.selections.map(
                                (selection: any, selIndex: number) => (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation(); // Prevents clicking from triggering parent events
                                      handleBetSelection(
                                        `${moneyLineData.away.fullName} @ ${moneyLineData.home.fullName}`, // ✅ Proper matchup format
                                        "Player Total 3 Pointers",
                                        player.fullName +
                                          " " +
                                          selection.fullName,
                                        selection.formattedOdds,
                                        "Player Total 3 Pointers",
                                        moneyLineData.startTime
                                      );
                                    }}
                                    key={selIndex}
                                    className="player-total-button w-24 p-3 bg-black text-white rounded-lg text-center flex flex-col items-center"
                                  >
                                    {/* ✅ Selection Name */}
                                    <div className="font-bold">
                                      {selection.fullName}
                                    </div>

                                    {/* ✅ Formatted Odds Below Name */}
                                    <div className="text-yellow-400">
                                      {selection.formattedOdds}
                                    </div>
                                  </button>
                                )
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

          {playerTotalStealsandBlockData &&
            playerTotalStealsandBlockData.length > 0 && (
              <div className="w-full flex justify-center mb-[25px]">
                <Card className="market-card w-[1191px]  h-[350px] mx-auto">
                  <CardHeader>
                    <CardTitle>Player Total Steals and Blocks</CardTitle>
                  </CardHeader>
                  <CardContent className="player-total-card-content">
                    <div className="playerTotalPoints-container">
                      {playerTotalStealsandBlockData.map(
                        (player: any, index: number) => (
                          <div
                            key={index}
                            className="pb-5 border-b border-gray-500"
                          >
                            {/* ✅ Player Name on Top Left */}
                            <div className="text-white font-bold text-lg mb-2">
                              {player.fullName}
                            </div>

                            {/* ✅ Row of Selection Buttons */}
                            <div className="flex flex-wrap gap-2 ">
                              {player.selections.map(
                                (selection: any, selIndex: number) => (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation(); // Prevents clicking from triggering parent events
                                      handleBetSelection(
                                        `${moneyLineData.away.fullName} @ ${moneyLineData.home.fullName}`, // ✅ Proper matchup format
                                        "Player Total Steals and Blocks",
                                        player.fullName +
                                          " " +
                                          selection.fullName,
                                        selection.formattedOdds,
                                        "Player Total Steals and Blocks",
                                        moneyLineData.startTime
                                      );
                                    }}
                                    key={selIndex}
                                    className="player-total-button w-24 p-3 bg-black text-white rounded-lg text-center flex flex-col items-center"
                                  >
                                    {/* ✅ Selection Name */}
                                    <div className="font-bold">
                                      {selection.fullName}
                                    </div>

                                    {/* ✅ Formatted Odds Below Name */}
                                    <div className="text-yellow-400">
                                      {selection.formattedOdds}
                                    </div>
                                  </button>
                                )
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

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
              <div
                style={{
                  flex: 1, // Makes this section take available space
                  overflowY: "auto", // Enables scrolling
                  maxHeight: "340px", // Adjust based on layout
                  paddingRight: "5px",
                }}
              >
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
                        {bet.team}
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

              {/* Place Bet / Login Button */}
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
                {isSignedIn ? "Place Bet" : "Log In to Bet"}
              </button>
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
      )}
    </>
  );
};

export default MatchupPage;
