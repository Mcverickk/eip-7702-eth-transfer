// index.js
import { useState } from "react";
import styles from "../styles/Home.module.css";
import { connectWallet, sendEth, signAuthorization } from "../wallet/connect.js";
import Header from "../components/Header";
import WalletInfo from "../components/WalletInfo";
import TransferForm from "../components/TransferForm";
import { CONTRACT_ADDRESS_2 } from "@/constants/chain";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(0);
  const [recipient, setRecipient] = useState("0x34F4198f2D8D66666A7BEB417a246bB20c66c97a");
  const [amount, setAmount] = useState("0.00001");
  const [privateKey, setPrivateKey] = useState("");
  const [txnHash, setTxnHash] = useState("");

  return (
    <div className={styles.container}>
      <Header />
      <button
        className={styles.connectWallet}
        onClick={() =>
          connectWallet({ setIsConnected, setBalance, setAddress })
        }
      >
        {isConnected ? "Connected" : "Connect Wallet"}
      </button>

      {isConnected && (
        <WalletInfo address={address} balance={balance} />
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
            address,
            privateKey,
            setTxnHash,
          })
        }
        signAuthorization={() => signAuthorization({ privateKey, contractAddress: CONTRACT_ADDRESS_2})}
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
