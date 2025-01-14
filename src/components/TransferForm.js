import { useState } from "react";
import styles from "../styles/Form.module.css";
import { executeBatch } from "@/wallet/connect";

const TransferForm = ({
  isConnected,
  address,
    setBalance,
}) => {
  const [recipients, setRecipients] = useState([""]);
  const [amounts, setAmounts] = useState([""]);
  const [txnHash, setTxnHash] = useState("");
  const [txnMsg, setTxnMsg] = useState("");

  const handleRecipientChange = (e, index) => {
    const newRecipients = [...recipients];
    newRecipients[index] = e.target.value;
    setRecipients(newRecipients);
  };

  const handleAmountChange = (e, index) => {
    const newAmounts = [...amounts];
    newAmounts[index] = e.target.value;
    setAmounts(newAmounts);
  };

  const addFields = () => {
    setRecipients([...recipients, ""]);
    setAmounts([...amounts, ""]);
  };

  const removeFields = (index) => {
    if (recipients.length > 1) {
      const newRecipients = recipients.filter((_, i) => i !== index);
      const newAmounts = amounts.filter((_, i) => i !== index);
      setRecipients(newRecipients);
      setAmounts(newAmounts);
    }
  };

  const handleSubmit = () => {
    const recipientStr = recipients.join(",");
    const amountStr = amounts.join(",");
    console.log({recipientStr, amountStr});
    executeBatch({ recipient: recipientStr, amount: amountStr, address, setTxnHash, setBalance, setTxnMsg})
  };

  return (
    <div className={styles.formContainer}>
      <h2>Transfer ETH</h2>
      {recipients.map((recipient, index) => (
        <div key={index} className={styles.inputRow}>
          <input
            type="text"
            placeholder="Recipient Address"
            value={recipient}
            onChange={(e) => handleRecipientChange(e, index)}
            className={styles.addressField}
          />
          <input
            type="text"
            placeholder="Amount in ETH"
            value={amounts[index]}
            onChange={(e) => handleAmountChange(e, index)}
            className={styles.amountField}
          />
          <div className={styles.buttonContainer}>
            <button
              className={styles.addRemoveButton}
              onClick={addFields}
              disabled={index !== recipients.length - 1}
            >
              +
            </button>
            <button
              className={styles.addRemoveButton}
              onClick={() => removeFields(index)}
              disabled={recipients.length <= 1}
            >
              -
            </button>
          </div>
        </div>
      ))}

      {!isConnected && (
        <button className={styles.inactiveSubmitButton} disabled>
          Please connect your wallet
        </button>
      )}
      {isConnected && (
        <button className={styles.submitButton} onClick={handleSubmit}>
          Send ETH
        </button>
      )}
      {txnMsg && (
        <div className={styles.txnContainer}>
          <p>{txnMsg}</p>
        </div>
      )}
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
