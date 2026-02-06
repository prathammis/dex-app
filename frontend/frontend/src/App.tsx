import Swap from "./components/Swap";
import { useWallet } from "./hooks/useWallet";
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const { account, connectWallet } = useWallet();
  const [count, setCount] = useState(0)

  return (
    <div className="app-container">
      <h1>Simple DEX</h1>
      <div style={{ marginBottom: 24 }}>
        {account ? (
          <span>Connected: {account}</span>
        ) : (
          <button onClick={connectWallet}>Connect Wallet</button>
        )}
        <div style={{ marginTop: 8 }}>
          <span>Make sure your MetaMask is connected to Hardhat local network (chainId 31337).</span>
        </div>
      </div>
      <Swap />
    </div>
  );
}

export default App
