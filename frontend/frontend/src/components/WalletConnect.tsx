import { useWallet } from "../hooks/useWallet";

export default function WalletConnect() {
  const { account, connectWallet } = useWallet();

  return (
    <div style={{ marginBottom: "1rem" }}>
      {account ? (
        <p>Connected: {account.slice(0, 6)}...{account.slice(-4)}</p>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
}
