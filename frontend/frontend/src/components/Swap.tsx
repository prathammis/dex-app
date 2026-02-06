import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { getERC20, getDEX } from "../helpers/contracts";
import { TOKEN_A_ADDRESS, TOKEN_B_ADDRESS } from "../config/contracts";
import { useWallet } from "../hooks/useWallet";
import "./Swap.css";

const Swap: React.FC = () => {
  const { provider, signer, account } = useWallet();
  const [amount, setAmount] = useState("");
  const [direction, setDirection] = useState<"AtoB" | "BtoA">("AtoB");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [balanceA, setBalanceA] = useState<string>("-");
  const [balanceB, setBalanceB] = useState<string>("-");

  const tokenIn = direction === "AtoB" ? TOKEN_A_ADDRESS : TOKEN_B_ADDRESS;
  const tokenOut = direction === "AtoB" ? TOKEN_B_ADDRESS : TOKEN_A_ADDRESS;

  // Fetch balances
  useEffect(() => {
    if (!account || !provider) {
      setBalanceA("-");
      setBalanceB("-");
      return;
    }
    (async () => {
      const tokenA = await getERC20(TOKEN_A_ADDRESS, provider);
      const tokenB = await getERC20(TOKEN_B_ADDRESS, provider);
      const [balA, balB, decA, decB] = await Promise.all([
        tokenA.balanceOf(account),
        tokenB.balanceOf(account),
        tokenA.decimals(),
        tokenB.decimals(),
      ]);
      setBalanceA(ethers.formatUnits(balA, decA));
      setBalanceB(ethers.formatUnits(balB, decB));
    })();
  }, [account, provider, loading]);

  const handleSwap = async () => {
    setError(null);
    setLoading(true);
    try {
      if (!signer) throw new Error("Wallet not connected");
      const dex = await getDEX(signer);
      const token = await getERC20(tokenIn, signer);

      const decimals = await token.decimals();
      const parsedAmount = ethers.parseUnits(amount, decimals);

      // Approve if needed
      const allowance = await token.allowance(account, dex.target);
      if (allowance < parsedAmount) {
        const tx = await token.approve(dex.target, parsedAmount);
        await tx.wait();
      }

      // Swap
      let tx;
      if (direction === "AtoB") {
        tx = await dex.swapTokenAForTokenB(parsedAmount);
      } else {
        tx = await dex.swapTokenBForTokenA(parsedAmount);
      }
      await tx.wait();
      setAmount("");
    } catch (e: any) {
      setError(e.message || "Swap failed");
    }
    setLoading(false);
  };

  return (
    <div className="swap-container">
      <h2>Swap</h2>
      <div style={{ marginBottom: 8 }}>
        <strong>TokenA Balance:</strong> {balanceA}
        <br />
        <strong>TokenB Balance:</strong> {balanceB}
      </div>
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        min="0"
        onChange={e => setAmount(e.target.value)}
        disabled={loading}
      />
      <select
        value={direction}
        onChange={e => setDirection(e.target.value as "AtoB" | "BtoA")}
        disabled={loading}
      >
        <option value="AtoB">TokenA → TokenB</option>
        <option value="BtoA">TokenB → TokenA</option>
      </select>
      <button onClick={handleSwap} disabled={loading || !amount || !account}>
        {loading ? "Swapping..." : "Swap"}
      </button>
      {error && <div className="error" style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </div>
  );
};

export default Swap;
