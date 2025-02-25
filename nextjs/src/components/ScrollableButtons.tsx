import React, { useRef } from "react";

type ScrollableButtonsProps = {
  onMoneyLineClick: () => void;
  onGameSpreadClick: () => void;
  onTotalPointsClick: () => void;
  handleFirstPointsButtonClick: () => void;
  handleFirstReboundButtonClick: () => void;
  handlePlayerTotalPointsOUClick2: () => void;
  handlePlayerTotalReboundsOUClick: () => void;
  handlePlayerTotalAssistsOUClick: () => void;
  handlePlayerTotalPoints: () => void;
  handlePlayerTotalAssists: () => void;
  handlePlayerTotalRebounds: () => void;
  handlePlayerTotalSteals: () => void;
  handlePlayerTotalBlocks: () => void;
  handlePlayerTotal3PointersMade: () => void;
  handlePlayerTotalStealsandBlocks: () => void;
  handlePlayerTotal3PointersOUClick: () => void;
  handlePlayerTotalTurnoversOUClick: () => void;
  handlePlayerTotalFTMOUClick: () => void;
  handlePlayerTotalFGMOUClick: () => void;
  handleFirstAssistButtonClick: () => void;
  handleTeamTotalAssistsClick: () => void;
  handleTeamTotal3PointersClick: () => void;
  handleTeamTotalStealsClick: () => void;
  handleTeamTotalBlocksClick: () => void;
  handleMatchTotalAssistsButtonClick: () => void;
  handleMatchTotal3PointersButtonClick: () => void;
  handleMatchTotalStealsButtonClick: () => void;
  handleMatchTotalBlocksButtonClick: () => void;
};

const ScrollableButtons: React.FC<ScrollableButtonsProps> = ({
  onMoneyLineClick,
  onGameSpreadClick,
  onTotalPointsClick,
  handleFirstPointsButtonClick,
  handleFirstReboundButtonClick,
  handlePlayerTotalPointsOUClick2,
  handlePlayerTotalReboundsOUClick,
  handlePlayerTotalAssistsOUClick,
  handlePlayerTotalPoints,
  handlePlayerTotalAssists,
  handlePlayerTotalRebounds,
  handlePlayerTotalSteals,
  handlePlayerTotalBlocks,
  handlePlayerTotal3PointersMade,
  handlePlayerTotalStealsandBlocks,
  handlePlayerTotal3PointersOUClick,
  handlePlayerTotalTurnoversOUClick,
  handlePlayerTotalFTMOUClick,
  handlePlayerTotalFGMOUClick,
  handleFirstAssistButtonClick,
  handleTeamTotalAssistsClick,
  handleTeamTotal3PointersClick,
  handleTeamTotalStealsClick,
  handleTeamTotalBlocksClick,
  handleMatchTotalAssistsButtonClick,
  handleMatchTotal3PointersButtonClick,
  handleMatchTotalStealsButtonClick,
  handleMatchTotalBlocksButtonClick,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -800, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 800, behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full hidden">
      {/* Left Scroll Button */}
      <button
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-2 shadow-md z-0"
        onClick={scrollLeft}
      >
        &#8249;
      </button>

      {/* Scrollable Button Group */}
      <div className="overflow-hidden w-full px-8">
        <div
          ref={scrollContainerRef}
          className="flex items-center overflow-x-auto whitespace-nowrap scrollbar-hide space-x-4 px-6"
        >
          {/* Search Bar */}
          <div className="hidden md:flex flex-1 mx-4">
            <input
              type="text"
              placeholder="Search markets"
              className="w-full md:w-[180px] lg:w-[280px] h-10 border border-gray-500 rounded-lg px-4 text-white bg-transparent outline-none focus:border-white"
            />
          </div>
          {/* Buttons with Props */}
          <button
            className="px-4 py-2 bg-gray-800 rounded-md"
            onClick={onMoneyLineClick}
          >
            Get MoneyLine Data
          </button>
          <button
            className="px-4 py-2 bg-gray-800 rounded-md"
            onClick={onGameSpreadClick}
          >
            Get Game Spread Data
          </button>
          <button
            className="px-4 py-2 bg-gray-800 rounded-md"
            onClick={onTotalPointsClick}
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

      {/* Right Scroll Button */}
      <button
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-2 shadow-md z-0"
        onClick={scrollRight}
      >
        &#8250;
      </button>
    </div>
  );
};

export default ScrollableButtons;
