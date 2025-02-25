import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const loadMatchups = async () => {
    try {
      const nbaToday = `http://localhost:3000/api/fetchMarketData?url=https://thescore.bet/sport/basketball/organization/united-states/competition/nba`;
      const response = await fetch(nbaToday);
      if (!response.ok) {
        throw new Error(`Failed to fetch matchups: ${response.statusText}`);
      }

      const responseData = await response.json();

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

      // ✅ Fetch all matchups without filtering by betid
      const matchups = marketplaceShelf.marketplaceShelfChildren
        .map((child: any) => {
          const event = child.fallbackEvent;
          if (!event || !event.awayParticipant || !event.homeParticipant) {
            console.warn("Incomplete event data for child:", child);
            return null;
          }

          // ✅ Extract all markets and selections without filtering
          const allMarkets = (child.markets || [])
            .map((market: any) => {
              return {
                marketId: market.id,
                marketName: market.name,
                selections: market.selections.map((selection: any) => ({
                  selectionId: selection.id,
                  formattedOdds: selection.odds.formattedOdds,
                  fullName: selection.name.fullName,
                })),
              };
            })
            .filter(Boolean); // Remove null values

          return {
            id: event.id,
            matchup: `${event.awayParticipant.mediumName} @ ${event.homeParticipant.mediumName}`,
            startTime: event.startTime || "Unknown Time",
            gameLink: child.deepLink?.webUrl || "No link available",
            markets: allMarkets,
          };
        })
        .filter(Boolean); // Remove null matchups

      console.log("✅ All matchups fetched successfully.");
      return matchups;
    } catch (error) {
      console.error("Error fetching matchups:", error);
      return [];
    }
  };

  try {
    const { clerkId, selectedBets } = req.body;

    if (!clerkId || !selectedBets.length) {
      return res.status(400).json({ error: "Invalid request" });
    }

    // Fetch the user from the database
    const loggedInUser = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!loggedInUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Calculate total wager (sum of all bets)
    const totalWager = selectedBets.reduce(
      (sum: number, bet: any) => sum + parseFloat(bet.wagerAmount),
      0
    );

    if (loggedInUser.balance < totalWager) {
      return res.status(400).json({ error: "Insufficient balance" });
    }
    /*
    const printSelectedBetsWithMarketData = async (selectedBets: any[]) => {
      await Promise.all(
        selectedBets.map(async (bet) => {
          console.log(
            "gameid:",
            bet.id,
            "| betslip odds:",
            parseFloat(bet.odds),
            "fullName",
            bet.team
          );

          // Call loadMatchups with the gameid (bet.id)
          const matchups = await loadMatchups(bet.id);

          // Print the odds and formattedOdds for this betid
          matchups.forEach((matchup) => {
            matchup.markets.forEach((market) => {
              console.log(`Full Name: ${market.fullName}`);
              console.log(`Formatted Odds: ${market.formattedOdds}`);
            });
          });
        })
      );
    };

    */
    const matchupsMap: Record<
      string,
      { formattedOdds: number; fullName: string }
    > = {};

    // ✅ Fetch all matchups once before the loop
    console.log("Fetching all matchups...");
    const matchups = await loadMatchups();

    // ✅ Create a lookup table for faster access
    matchups.forEach((matchup: any) => {
      // Explicitly type as 'any' if unknown, or define an interface
      matchup.markets.forEach((market: any) => {
        market.selections.forEach((selection: any) => {
          matchupsMap[selection.selectionId] = {
            formattedOdds: parseFloat(selection.formattedOdds),
            fullName: selection.fullName,
          };
        });
      });
    });

    console.log("✅ Matchups lookup table created.");

    const newBets = await prisma.$transaction(async (prisma) => {
      const betsToPlace = [];

      for (const bet of selectedBets) {
        console.log(`Verifying odds for bet ID: ${bet.id}`);

        // ✅ Retrieve the fetched odds from the lookup table instead of calling loadMatchups
        const marketData = matchupsMap[bet.id];

        if (!marketData) {
          console.warn(
            `⚠️ No matching market found for bet ID: ${bet.id}, skipping bet.`
          );
          continue; // Skip this bet if no matching odds are found
        }

        const { formattedOdds, fullName } = marketData;

        console.log(`Betslip Odds: ${parseFloat(bet.odds)}`);
        console.log(`Fetched Odds: ${formattedOdds}`);

        // ✅ Update bet odds if they are different
        if (formattedOdds !== parseFloat(bet.odds)) {
          console.warn(
            `⚠️ Odds changed for ${fullName}. Updating betslip odds from ${bet.odds} to ${formattedOdds}.`
          );
          bet.odds = formattedOdds; // ✅ Update the odds in the selectedBets array
        }

        console.log(
          `✅ Final Odds for ${fullName}: ${bet.odds}, bet will be placed.`
        );

        // ✅ Store the bet creation promise with updated odds
        betsToPlace.push(
          prisma.bets.create({
            data: {
              userId: loggedInUser.id,
              wager: parseFloat(bet.wagerAmount),
              potentialReturn: bet.wagerAmount * parseFloat(bet.odds), // ✅ Uses updated odds
              status: "UNSETTLED",
              betName: fullName,
              odds: parseFloat(bet.odds),
              legs: {
                create: {
                  name: fullName,
                  prop: bet.marketType,
                  odds: parseFloat(bet.odds),
                  team: bet.team,
                  marketType: bet.marketType,
                  points: bet.points,
                  gameDate: bet.gameDate,
                  ...(bet.queryName && { queryName: bet.queryName }), // ✅ Only add queryName if it exists
                  betType: bet.betType,
                  gameid: bet.id,
                },
              },
            },
            include: { legs: true },
          })
        );
      }

      // ✅ Execute all bet creations inside the transaction
      const placedBets = await Promise.all(betsToPlace);

      // ✅ Deduct user balance only if bets were created successfully
      await prisma.user.update({
        where: { id: loggedInUser.id },
        data: {
          balance: {
            decrement: totalWager, // Deduct full wager amount
          },
        },
      });

      console.log("✅ All bets placed successfully, balance updated.");
      return placedBets;
    });

    return res.status(200).json({ success: true, newBets });
  } catch (error) {
    console.error("Error placing bet:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
