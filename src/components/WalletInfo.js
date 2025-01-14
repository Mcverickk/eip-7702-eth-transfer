const WalletInfo = ({ address, balance }) => {
  return (
    <div>
      <p>Address: {address}</p>
      <p>Balance: {balance} ETH</p>
    </div>
  );
};

export default WalletInfo;
