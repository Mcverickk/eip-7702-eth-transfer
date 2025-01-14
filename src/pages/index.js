// index.js
import { useState } from "react";
import styles from "../styles/Home.module.css";
import { connectWallet, signAuthorization, executeBatch } from "../wallet/connect.js";
import Header from "../components/Header";
import WalletInfo from "../components/WalletInfo";
import TransferForm from "../components/TransferForm";
import AuthForm from "../components/AuthForm";
import { SIMPLE_ACCOUNT_ADDRESS } from "@/constants/SimpleAccont";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(0);
  const [recipient, setRecipient] = useState("0x34F4198f2D8D66666A7BEB417a246bB20c66c97a");
  const [amount, setAmount] = useState("0.00001");
  const [privateKey, setPrivateKey] = useState("");
  const [txnHash, setTxnHash] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [contractAddress, setContractAddress] = useState(SIMPLE_ACCOUNT_ADDRESS);
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
            recipient={recipient}
            setRecipient={setRecipient}
            amount={amount}
            setAmount={setAmount}
            isConnected={isConnected}
            writeContract={() =>
              executeBatch({recipient, amount, address, setTxnHash, setBalance})
            }
            txnHash={txnHash}
          />
    }

    <AuthForm
            privateKey={privateKey}
            setPrivateKey={setPrivateKey}
            signAuthorization={() =>
              signAuthorization({
                privateKey,
                contractAddress,
                setAuthMessage,
              })
            }
            contractAddress={contractAddress}
            setContractAddress={setContractAddress}
            authMessage={authMessage}
          />


    </div>
  );
}