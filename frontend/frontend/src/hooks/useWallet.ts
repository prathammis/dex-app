import { useEffect, useState } from "react";
import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export function useWallet() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [account, setAccount] = useState<string>("");

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask");
      return;
    }

    const browserProvider = new ethers.BrowserProvider(window.ethereum);
    await browserProvider.send("eth_requestAccounts", []);
    const signer = await browserProvider.getSigner();

    setProvider(browserProvider);
    setSigner(signer);
    setAccount(await signer.getAddress());
  };

  useEffect(() => {
    if (!window.ethereum) return;

    window.ethereum.on("accountsChanged", () => {
      window.location.reload();
    });
  }, []);

  return { provider, signer, account, connectWallet };
}
