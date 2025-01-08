import { custom, createWalletClient, parseUnits, createPublicClient, http, formatUnits, isAddressEqual } from 'viem';
import { eip7702Actions, verifyAuthorization } from 'viem/experimental'
import { CONTRACT_ABI, CONTRACT_ADDRESS, ODYSSEY_CHAIN } from '../constants.js';
import { privateKeyToAccount } from 'viem/accounts';

let client;

async function connectWallet({ setIsConnected, setBalance, setAddress }) {
    try {
        if (!window.ethereum) {
            warn('Please install MetaMask');
            return;
        }

        const [address] = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        })

        client = createWalletClient({
            account: address,
            chain: ODYSSEY_CHAIN,
            transport: custom(window.ethereum)
        }).extend(eip7702Actions());

        console.log('Connected wallet:', address);
        
           
        setIsConnected(true);
        setAddress(address);

        const publicClient = createPublicClient({
            chain: ODYSSEY_CHAIN,
            transport: http(ODYSSEY_CHAIN.rpcUrls.default[0])
        })

        const balance = await publicClient.getBalance({ address });
        const formattedBalance = parseFloat(formatUnits(balance, 18)).toFixed(4);
        setBalance(formattedBalance);

    } catch (error) {
        console.error('Error connecting wallet:', error);
        alert('Failed to connect wallet. Please try again.');
    }
}

async function sendEth({recipient, amount, address, privateKey, setTxnHash}) {

    const privateKeyAccount = privateKeyToAccount(privateKey);

    if(!privateKey || !isAddressEqual(privateKeyAccount.address, address)) {
        console.log('Private key address:', privateKeyAccount.address);
        alert('Please enter correct private key');
        return
    }
    
    if(!client) {
        alert('Please connect your wallet first');
        return
    }

    try {
        
        const authorization = await client.signAuthorization({
            account: privateKeyAccount,
            contractAddress: CONTRACT_ADDRESS
        })
        
        const valid = await verifyAuthorization({ 
            address,
            authorization, 
        }) 
        
        console.log('Authorization valid:', valid);
        
        if(!valid) {
            alert('Invalid authorization');
            return
        }
        
        const hash = await client.writeContract({
            authorizationList: [authorization],
            address,
            abi: CONTRACT_ABI,
            functionName: 'transfer',
            account: address,
            args: [recipient, parseUnits(amount, 18)]
        })
        
        console.log('Transaction hash:', hash);
        setTxnHash(hash);
    } catch (error) {
        console.error('Error sending ETH:', error);
    }

}





export {connectWallet, sendEth};
