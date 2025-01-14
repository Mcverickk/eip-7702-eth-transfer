import { useState } from "react";
import styles from "../styles/Form.module.css";
import { SIMPLE_ACCOUNT_ADDRESS } from "@/constants/simpleAccount";
import { signAuthorization } from "@/wallet/connect";

const AuthForm = ({ setIsEOASmartAccount }) => {
  const [contractAddress, setContractAddress] = useState(
    SIMPLE_ACCOUNT_ADDRESS
  );
  const [privateKey, setPrivateKey] = useState("");
  const [authMessage, setAuthMessage] = useState("");

  return (
    <div className={styles.formContainer}>
      <h2>Make Your EOA Smart</h2>
      <p className={styles.infoText}>Currently, wallets do not support sending transactions with authorizationList as per EIP-7702. Hence, we require your private key to sign and send a simple transaction to set the code.</p>
      {/* <input
        type="text"
        placeholder="Contract Address"
        value={contractAddress}
        onChange={(e) => setContractAddress(e.target.value)}
        className={styles.inputField}
      /> */}
      <input
        type="password"
        placeholder="Private Key (0x...)"
        value={privateKey}
        onChange={(e) => setPrivateKey(e.target.value)}
        className={styles.inputField}
      />
      <button
        className={privateKey.length === 66 ? styles.submitButton : styles.inactiveSubmitButton}
        disabled={privateKey.length === 66 ? false : true}
        onClick={() =>
          signAuthorization({
            privateKey,
            contractAddress,
            setAuthMessage,
            setIsEOASmartAccount,
          })
        }
      >
        Sign Authorization
      </button>
      {privateKey && privateKey.length !== 66 && <p>Please enter a valid private key.</p>}
      {authMessage && (
        <div className={styles.txnContainer}>
          <p>{authMessage}</p>
        </div>
      )}
    </div>
  );
};

export default AuthForm;
