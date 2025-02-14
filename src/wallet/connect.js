import {
  custom,
  createWalletClient,
  parseUnits,
  createPublicClient,
  http,
  formatUnits,
} from "viem";
import { eip7702Actions, verifyAuthorization } from "viem/experimental";
import { privateKeyToAccount } from "viem/accounts";
import {
  SIMPLE_ACCOUNT_ABI,
  SIMPLE_ACCOUNT_ADDRESS,
} from "@/constants/simpleAccount.js";
import { ODYSSEY_CHAIN } from "@/constants/chain";

let walletClient;
let publicClient;

const CHAIN = ODYSSEY_CHAIN;

async function connectWallet({
  setIsConnected,
  setBalance,
  setAddress,
  setIsEOASmartAccount,
}) {
  try {
    if (!window.ethereum) {
      warn("Please install MetaMask");
      return;
    }

    const [address] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    walletClient = createWalletClient({
      account: address,
      chain: CHAIN,
      transport: custom(window.ethereum),
    }).extend(eip7702Actions());

    console.log("Connected wallet:", address);

    setIsConnected(true);
    setAddress(address);

    publicClient = createPublicClient({
      chain: CHAIN,
      transport: http(),
    });

    const balance = await publicClient.getBalance({ address });
    const formattedBalance = parseFloat(formatUnits(balance, 18)).toFixed(4);
    setBalance(formattedBalance);

    await isEOASmart({ address, setIsEOASmartAccount });
  } catch (error) {
    console.error("Error connecting wallet:", error);
    alert("Failed to connect wallet. Please try again.");
  }
}
const signAuthorization = async ({
  privateKey,
  contractAddress,
  setAuthMessage,
  setIsEOASmartAccount,
}) => {
  let privateKeyAccount;
  try{
    privateKeyAccount = privateKeyToAccount(privateKey);
  
    if(!privateKeyAccount || !privateKeyAccount.address) {
      setAuthMessage("❌ Invalid private key");
      return;
    }
  } catch (error) {
    console.error("Invalid private key", error);
    setAuthMessage("❌ Invalid private key");
    return;
  }
  

  try {

    setAuthMessage("⌛ Signing authorization...");


    const client = createWalletClient({
      chain: CHAIN,
      transport: http(),
    }).extend(eip7702Actions());

    const publicClient = createPublicClient({
      chain: CHAIN,
      transport: http(),
    });

    const authorization = await client.signAuthorization({
      account: privateKeyAccount,
      contractAddress,
    });

    const valid = await verifyAuthorization({
      address: privateKeyAccount.address,
      authorization,
    });

    if (!valid) {
      throw new Error("Invalid authorization");
    } else {
      setAuthMessage("⌛ Setting contract code at EOA...");

      const hash = await client.sendTransaction({
        account: privateKeyAccount,
        authorizationList: [authorization],
        to: privateKeyAccount.address,
        value: 1000,
      });

      setAuthMessage("⌛ Waiting for confirmation...");

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      console.log("Transaction receipt:", receipt);

      const isEOASmartAccount = await isEOASmart({
        address: privateKeyAccount.address,
        setIsEOASmartAccount,
      });

      if (isEOASmartAccount) {
        setAuthMessage("✅ Successfully set contract code at EOA");
        console.log("Contract code at EOA is correct");
      } else {
        console.log("Contract code at EOA is incorrect");
        throw new Error("Contract code at EOA is incorrect");
      }
    }
  } catch (error) {
    console.error("Error setting contract code at EOA:", error);
    setAuthMessage("❌ Error setting contract code at EOA");
  }
};

const executeBatch = async ({
  recipients,
  amounts,
  address,
  setTxnHash,
  setBalance,
  setTxnMsg,
}) => {
  setTxnHash("");

  if (!walletClient) {
    alert("Please connect your wallet first");
    return;
  }

  try {
    setTxnMsg("⌛ Processing transaction...");
    
    const data = recipients.map((r) => "0x");
    console.log("Processed Data", { recipients, amounts, data });

    const hash = await walletClient.writeContract({
      address,
      abi: SIMPLE_ACCOUNT_ABI,
      functionName: "executeBatch",
      account: address,
      args: [recipients, amounts, data],
    });

    console.log("Transaction hash:", hash);

    setTxnMsg("⌛ Waiting for confirmation...");

    await publicClient.waitForTransactionReceipt({ hash });
    setTxnHash(hash);

    const balance = await publicClient.getBalance({ address });
    const formattedBalance = parseFloat(formatUnits(balance, 18)).toFixed(4);
    setBalance(formattedBalance);

    setTxnMsg("✅ Transaction successful");
  } catch (error) {
    console.error("Error sending ETH:", error);
    setTxnMsg("❌ Error sending transaction");
  }
};

const isEOASmart = async ({ address, setIsEOASmartAccount }) => {
  try{

    const publicClient = createPublicClient({
      chain: CHAIN,
      transport: http(),
    });
    
    const contractCode = await publicClient.getCode({ address });
    
    if (!contractCode || contractCode === "0x") {
      return false;
    }
    
    if (
      contractCode.toLowerCase().split("0xef0100")[1] ===
      SIMPLE_ACCOUNT_ADDRESS.toLowerCase().slice(2)
    ) {
      if (setIsEOASmartAccount) {
        setIsEOASmartAccount(true);
      }
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error checking if EOA is smart:", error);
    return false;
  }
};

export { connectWallet, signAuthorization, executeBatch, isEOASmart };
