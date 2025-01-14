// index.js
import { useState } from "react";
import styles from "../styles/Home.module.css";
import { connectWallet } from "../wallet/connect.js";
import Header from "../components/Header";
import WalletInfo from "../components/WalletInfo";
import TransferForm from "../components/TransferForm";
import AuthForm from "../components/AuthForm";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(0);
  const [isEOASmartAccount, setIsEOASmartAccount] = useState(false);

  return (
    <div className={styles.container}>
      <Header />
      
      <button
        className={styles.connectWallet}
        onClick={() =>
          connectWallet({ setIsConnected, setBalance, setAddress, setIsEOASmartAccount })
        }
      >
        {isConnected ? "Connected" : "Connect Wallet"}
      </button>
      {isConnected && (
        <WalletInfo address={address} balance={balance} />
      )}

    {
        isEOASmartAccount &&
        <TransferForm
            isConnected={isConnected}
            address={address}
            setBalance={setBalance}
          />
    }

    <AuthForm
            setIsEOASmartAccount={setIsEOASmartAccount}
          />
    </div>
  );
}