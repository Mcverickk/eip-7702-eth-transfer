// index.js
import { useState } from "react";
import styles from "../styles/Home.module.css";
import { connectWallet, sendEth } from "../wallet/connect.js";
import Header from "../components/Header";
import WalletInfo from "../components/WalletInfo";
import TransferForm from "../components/TransferForm";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState(0);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [txnHash, setTxnHash] = useState("");

  return (
    <div className={styles.container}>
      <Header />
      <button
        className={styles.connectWallet}
        onClick={() =>
          connectWallet({ setIsConnected, setBalance, setAccount })
        }
      >
        {isConnected ? "Connected" : "Connect Wallet"}
      </button>

      {isConnected && (
        <WalletInfo account={account} balance={balance} />
      )}

      <TransferForm
        recipient={recipient}
        setRecipient={setRecipient}
        amount={amount}
        setAmount={setAmount}
        privateKey={privateKey}
        setPrivateKey={setPrivateKey}
        sendEth={() =>
          sendEth({
            recipient,
            amount,
            address: account,
            privateKey,
            setTxnHash,
          })
        }
      />

      {txnHash && (
        <div className={styles.txnContainer}>
          <p>
            <a
              href={`https://odyssey-explorer.ithaca.xyz/tx/${txnHash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Transaction
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
