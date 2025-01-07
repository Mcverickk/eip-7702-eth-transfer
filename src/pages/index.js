import { useState } from "react";
import styles from "../styles/Home.module.css";
import { connectWallet, sendEth } from "../wallet/connect.js";

export default function Home() {
  const [isConnected, setIsConnected] = useState("");
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState(0);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [txnHash, setTxnHash] = useState("");

  return (
    <div className={styles.container}>
      <h1>Transfer ETH (EIP- 7702)</h1>

      <button
        className={styles["connect-wallet"]}
        onClick={() =>
          connectWallet({ setIsConnected, setBalance, setAccount })
        }
      >
        {isConnected ? "Connected" : "Connect Wallet"}
      </button>
      {isConnected && (
        <div className={styles["balance-container"]}>
          <p>Account: {account}</p>
          <p>Balance: {balance} ETH</p>
        </div>
      )}

      <div className={styles["form-container"]}>
        <input
          type="text"
          placeholder="Recipient Address"
          className={styles["input-recipient"]}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount in ETH"
          className={styles["input-amount"]}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          type="text"
          placeholder="Private Key"
          className={styles["input-recipient"]}
          onChange={(e) => setPrivateKey(e.target.value)}
        />
        <button
          className={styles["send-eth"]}
          onClick={() =>
            sendEth({
              recipient,
              amount,
              address: account,
              privateKey,
              setTxnHash,
            })
          }
        >
          Send ETH
        </button>
      </div>
      <div className={styles["form-container"]}>
        {txnHash && (
          <p>
            <a
              href={`https://odyssey-explorer.ithaca.xyz/tx/${txnHash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
                View Transaction
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
