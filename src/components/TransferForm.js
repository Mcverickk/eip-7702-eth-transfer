import styles from "../styles/Form.module.css";

const TransferForm = ({
    recipient,
    setRecipient,
    amount,
    setAmount,
    isConnected,
    writeContract,
    txnHash
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
      {!isConnected && <button className={styles.inactiveSubmitButton} disabled={true}>
        Please connect your wallet
      </button>}
      {isConnected && <button className={styles.submitButton} onClick={writeContract}>
        Send ETH
      </button>}

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
};

export default TransferForm;
