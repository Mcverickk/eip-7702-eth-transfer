const WalletInfo = ({ account, balance }) => {
    return (
      <div>
        <p>Account: {account}</p>
        <p>Balance: {balance} ETH</p>
      </div>
    );
  };
  
  export default WalletInfo;
  