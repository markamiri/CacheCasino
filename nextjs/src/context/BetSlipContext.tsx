"use client";
import { createContext, useContext, useState, useEffect } from "react";

type SelectedBet = {
  matchup: string;
  marketType: string;
  team: string;
  points: string;
  odds: string;
  betType: string;
  wagerAmount: number;
};

type BetSlipContextType = {
  selectedBets: SelectedBet[];
  addBet: (bet: SelectedBet) => void;
  removeBet: (index: number) => void;
  updateWagerAmount: (index: number, amount: number) => void;
};

const BetSlipContext = createContext<BetSlipContextType | undefined>(undefined);

export const BetSlipProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedBets, setSelectedBets] = useState<SelectedBet[]>(() => {
    if (typeof window !== "undefined") {
      const savedBets = localStorage.getItem("betSlip");
      return savedBets ? JSON.parse(savedBets) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("betSlip", JSON.stringify(selectedBets));
  }, [selectedBets]);

  const addBet = (bet: SelectedBet) => {
    setSelectedBets((prev) => {
      const betExists = prev.some(
        (b) =>
          b.matchup === bet.matchup &&
          b.marketType === bet.marketType &&
          b.betType === bet.betType
      );
      if (!betExists) return [...prev, bet];
      return prev;
    });
  };

  const removeBet = (index: number) => {
    setSelectedBets((prev) => prev.filter((_, i) => i !== index));
  };

  const updateWagerAmount = (index: number, amount: number) => {
    setSelectedBets((prev) =>
      prev.map((bet, i) =>
        i === index ? { ...bet, wagerAmount: amount } : bet
      )
    );
  };

  return (
    <BetSlipContext.Provider value={{ selectedBets, addBet, removeBet, updateWagerAmount }}>
      {children}
    </BetSlipContext.Provider>
  );
};

export const useBetSlip = () => {
  const context = useContext(BetSlipContext);
  if (!context) {
    throw new Error("useBetSlip must be used within a BetSlipProvider");
  }
  return context;
};
