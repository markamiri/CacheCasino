import { useState } from "react";
import { createPortal } from "react-dom";
import { useEffect } from "react";

interface CashOutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CashOutModal: React.FC<CashOutModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit");
  const [selectedAmount, setSelectedAmount] = useState<number | "custom">(25);
  const [customAmount, setCustomAmount] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState<number | null>(null); // Store updated balance
  const [showBalance, setShowBalance] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [wderror, wdsetError] = useState("");
  const [lastAction, setLastAction] = useState<"deposit" | "withdraw" | null>(
    null
  );

  if (!isOpen) return null;

  async function handleGetBalance() {
    setLoading(true);
    wdsetError("");

    try {
      const response = await fetch("/api/getBalance", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Failed to fetch balance");
      setBalance(data.balance); // ✅ Store balance in the correct state
    } catch (err: any) {
      wdsetError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeposit() {
    if (cvv.length !== 3) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/deposits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: selectedAmount === "custom" ? customAmount : selectedAmount,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Deposit failed");

      setBalance(data.newBalance); // ✅ Update balance in state
      setShowBalance(true);
      setLastAction("deposit"); // ✅ Track the last action
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleWithdraw() {
    const amount = parseFloat(withdrawAmount);

    if (!withdrawAmount || isNaN(amount) || amount <= 0) {
      wdsetError("Invalid withdrawal amount.");
      return;
    }

    if (balance === null || amount > balance) {
      wdsetError("Amount exceeds available balance.");
      return;
    }

    setLoading(true);
    wdsetError("");

    try {
      const response = await fetch("/api/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Withdrawal failed");

      setBalance(data.newBalance); // ✅ Update balance
      setWithdrawAmount(""); // ✅ Clear input field
      setShowBalance(true);
      setLastAction("withdraw"); // ✅ Track the last action
    } catch (err: any) {
      wdsetError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
      {/* ✅ Outer Bordered Container with Grey Border */}
      <div className="bg-[#2c2e4f] p-6 rounded-lg shadow-lg w-[400px] text-center ">
        {/* ✅ Tab Navigation */}
        <div className="flex justify-center mb-4">
          <button
            className={`px-4 py-2 rounded-l-lg w-1/2 ${
              activeTab === "deposit"
                ? "bg-blue-500 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
            onClick={() => {
              setActiveTab("deposit");
              setLastAction(null);
            }}
          >
            Deposit
          </button>
          <button
            className={`px-4 py-2 rounded-r-lg w-1/2 ${
              activeTab === "withdraw"
                ? "bg-blue-500 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
            onClick={() => {
              setActiveTab("withdraw");
              handleGetBalance();
              setLastAction(null);
            }}
          >
            Withdraw
          </button>
        </div>

        {/* ✅ Deposit Form */}
        {activeTab === "deposit" ? (
          <>
            <h2 className="text-white font-bold text-lg mb-4">Deposit Funds</h2>

            {/* ✅ Card Details Section */}
            <div className="flex justify-between items-center bg-[#1d1e39] p-3 rounded-md mb-4 ">
              <div className="flex items-center space-x-3">
                <img
                  src="/images/logo/VISA.png"
                  alt="Visa"
                  className="w-auto h-7 bg-white border-gray-300 rounded-md object-contain"
                />{" "}
                {/* Replace with actual Visa image */}
                <span className="text-white font-semibold ">Ending 0223</span>
              </div>
              <span className="text-gray-400 text-sm">Exp 02/27</span>
              <button className="bg-blue-600 text-white px-1 py-1 text-xs rounded-md">
                SAVED
              </button>
            </div>

            {/* Amount Selection Buttons */}
            <div className="grid grid-cols-5 gap-1 mb-4">
              {[10, 25, 100, 200].map((amount) => (
                <button
                  key={amount}
                  className={`p-2 rounded-md ${
                    selectedAmount === amount
                      ? "bg-blue-500 text-white"
                      : "bg-gray-700 text-gray-300"
                  }`}
                  onClick={() => setSelectedAmount(amount)}
                >
                  ${amount}
                </button>
              ))}
              {/* Custom Amount Button */}
              <button
                className={`p-2 rounded-md ${
                  selectedAmount === "custom"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-700 text-gray-300"
                }`}
                onClick={() => setSelectedAmount("custom")}
              >
                Custom
              </button>
            </div>

            {/* Custom Amount Input */}
            {selectedAmount === "custom" && (
              <div className="relative w-full mb-4">
                <label
                  className={`absolute left-3 top-2 text-gray-400 transition-all ${
                    customAmount ? "text-xs top-[-10px] bg-[#2c2e4f] px-1" : ""
                  }`}
                >
                  Enter Amount
                </label>

                <input
                  type="text"
                  value={customAmount}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*\.?\d*$/.test(value) || value === "") {
                      setCustomAmount(value);
                      setError("");
                    } else {
                      setError("Invalid input. Only numbers are allowed.");
                    }
                  }}
                  className={`w-full p-3 border ${
                    error ? "border-red-500" : "border-gray-400"
                  } rounded-lg text-white bg-transparent focus:outline-none focus:ring-2 ${
                    error ? "focus:ring-red-500" : "focus:ring-blue-500"
                  }`}
                />

                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              </div>
            )}

            {/* ✅ CVV Input (Now Half the Width) */}
            <div className="relative w-1/2 mb-4 ">
              <label
                htmlFor="cvv"
                className={`absolute left-3 top-2 text-gray-400 transition-all ${
                  cvv ? "text-xs top-[-10px] bg-[#2c2e4f] px-1" : ""
                }`}
              >
                CVV
              </label>

              <input
                type="text"
                id="cvv"
                value={cvv}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d{0,3}$/.test(value)) {
                    setCvv(value);
                    setError("");
                  } else {
                    setError("Invalid CVV. Only numbers are allowed.");
                  }
                }}
                maxLength={3}
                className={`w-full p-3 border rounded-md text-white bg-transparent focus:outline-none focus:ring-2 ${
                  error
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-400 focus:ring-blue-500"
                }`}
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
            {lastAction === "deposit" && showBalance && balance !== null && (
              <p className="text-green-500 mt-2">
                New Balance: ${balance.toFixed(2)}
              </p>
            )}
            {/* ✅ Deposit Button (Greyed Out Until CVV is Entered) */}
            <button
              onClick={handleDeposit}
              className={`w-full p-2 rounded-lg ${
                cvv.length === 3
                  ? "bg-blue-500 text-white"
                  : "bg-gray-500 text-gray-300 cursor-not-allowed"
              }`}
              disabled={cvv.length !== 3 || loading}
            >
              {loading
                ? "Processing..."
                : `Deposit $${
                    selectedAmount === "custom" ? customAmount : selectedAmount
                  }`}
            </button>

            <button
              onClick={onClose}
              className="w-full bg-gray-500 text-white p-2 rounded-lg mt-2"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            {/* ✅ Withdraw Form */}
            <h2 className="text-white font-bold text-lg mb-4">
              Withdrawable Balance:{" "}
              {balance !== null ? `$${balance.toFixed(2)}` : "Loading..."}
            </h2>
            <div className="relative w-2/2 mb-4 ">
              <label
                htmlFor="withdrawAmount"
                className={`absolute left-3 top-2 text-gray-400 transition-all ${
                  withdrawAmount ? "text-xs top-[-10px] bg-[#2c2e4f] px-1" : ""
                }`}
              >
                $ Amount
              </label>

              <input
                type="text"
                id="withdrawAmount"
                value={withdrawAmount}
                onChange={(e) => {
                  const value = e.target.value;

                  // ✅ Allow only numbers & a single decimal point (.)
                  if (/^\d*\.?\d*$/.test(value)) {
                    if (balance !== null && parseFloat(value) > balance + 1) {
                      wdsetError("Amount exceeds available balance.");
                    } else {
                      setWithdrawAmount(value);
                      wdsetError(""); // ✅ Clear error if valid
                    }
                  } else {
                    wdsetError("Only numbers and decimals are allowed.");
                  }
                }}
                className={`w-full p-3 border rounded-md text-white bg-transparent focus:outline-none focus:ring-2 ${
                  wderror
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-400 focus:ring-blue-500"
                }`}
              />

              {/* ✅ Display Error Message */}
              {wderror && (
                <p className="text-red-500 text-sm mt-1">{wderror}</p>
              )}
            </div>
            <div className="flex justify-between items-center bg-[#1d1e39] p-3 rounded-md mb-4 ">
              <div className="flex items-center space-x-3">
                <img
                  src="/images/logo/VISA.png"
                  alt="Visa"
                  className="w-auto h-7 bg-white border-gray-300 rounded-md object-contain"
                />{" "}
                {/* Replace with actual Visa image */}
                <span className="text-white font-semibold ">Ending 0223</span>
              </div>
              <span className="text-gray-400 text-sm">Exp 02/27</span>
            </div>

            {lastAction === "withdraw" && showBalance && balance !== null && (
              <p className="text-green-500 mt-2">
                New Balance: ${balance.toFixed(2)}
              </p>
            )}
            <button
              onClick={handleWithdraw}
              className={`w-full p-2 rounded-lg mb-1 ${
                withdrawAmount &&
                !isNaN(parseFloat(withdrawAmount)) &&
                balance !== null &&
                parseFloat(withdrawAmount) > 0 &&
                parseFloat(withdrawAmount) <= balance
                  ? "bg-blue-500 text-white"
                  : "bg-gray-500 text-gray-300 cursor-not-allowed"
              }`}
              disabled={
                !withdrawAmount ||
                isNaN(parseFloat(withdrawAmount)) ||
                balance === null ||
                parseFloat(withdrawAmount) <= 0 ||
                parseFloat(withdrawAmount) > balance
              }
            >
              Confirm Withdraw
            </button>
            <button
              onClick={onClose}
              className="w-full bg-gray-500 text-white p-2 rounded-lg mt-0.5"
            >
              Cancel
            </button>
          </>
        )}

        {/* ✅ Close Button */}
      </div>
    </div>,
    document.body
  );
};

export default CashOutModal;
