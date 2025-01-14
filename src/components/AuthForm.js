import styles from "../styles/Form.module.css";

const AuthForm = ({
  privateKey,
  setPrivateKey,
  signAuthorization,
  contractAddress,
  setContractAddress,
    authMessage,
}) => {
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
      <button className={styles.submitButton} onClick={signAuthorization}>
        Sign Authorization
      </button>
      {authMessage && (
            <div className={styles.txnContainer}>
            <p>
                {authMessage}
            </p>
            </div>)}
    </div>
  );
};

export default AuthForm;
