import { useState } from "react";
import styles from "../styles/Form.module.css";
import { SIMPLE_ACCOUNT_ADDRESS } from "@/constants/SimpleAccont";
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
      {/* <input
        type="text"
        placeholder="Contract Address"
        value={contractAddress}
        onChange={(e) => setContractAddress(e.target.value)}
        className={styles.inputField}
      /> */}
      <input
        type="password"
        placeholder="Private Key"
        value={privateKey}
        onChange={(e) => setPrivateKey(e.target.value)}
        className={styles.inputField}
      />
      <button
        className={styles.submitButton}
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
      {authMessage && (
        <div className={styles.txnContainer}>
          <p>{authMessage}</p>
        </div>
      )}
    </div>
  );
};

export default AuthForm;
