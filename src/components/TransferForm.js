import styles from "../styles/Form.module.css";

const TransferForm = ({
  recipient,
  setRecipient,
  amount,
  setAmount,
  privateKey,
  setPrivateKey,
  sendEth,
  signAuthorization,
}) => {
  return (
    <div className={styles.formContainer}>
      <h2>Transfer ETH</h2>
      <input
        type="text"
        placeholder="Recipient Address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        className={styles.inputField}
      />
      <input
        type="number"
        placeholder="Amount in ETH"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className={styles.inputField}
      />
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
      <button className={styles.submitButton} onClick={sendEth}>
        Send ETH
      </button>
    </div>
  );
};

export default TransferForm;
