import { custom, createWalletClient, parseUnits, createPublicClient, http, formatUnits, isAddressEqual, encodeFunctionData } from 'viem';
import { eip7702Actions, verifyAuthorization } from 'viem/experimental'
import { CONTRACT_ABI, CONTRACT_ADDRESS, CONTRACT_ADDRESS_2, ODYSSEY_CHAIN } from '../constants/chain.js';
import { privateKeyToAccount } from 'viem/accounts';
import { SIMPLE_ACCOUNT_ABI, SIMPLE_ACCOUNT_ADDRESS } from '@/constants/SimpleAccont.js';

let client;
let publicClient;

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

        publicClient = createPublicClient({
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
    
    if(!client || !publicClient) {
        alert('Please connect your wallet first');
        return
    }

    try {

        const authorization = await signAuthorization({ privateKey, address });

        const hash = await client.writeContract({
            authorizationList: [authorization],
            address,
            abi: SIMPLE_ACCOUNT_ABI,
            functionName: 'execute',
            account: address,
            args: [recipient, parseUnits(amount, 18), "0x"],
        })
        
        console.log('Transaction hash:', hash);
        setTxnHash(hash);
    } catch (error) {
        console.error('Error sending ETH:', error);
    }
}

const signAuthorization = async ({ privateKey, address }) => {
    
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

    console.log('Signing authorization...');

    const authorization = await client.signAuthorization({
        account: privateKeyAccount,
        contractAddress: SIMPLE_ACCOUNT_ADDRESS,
    })
    
    const valid = await verifyAuthorization({ 
        address: privateKeyAccount.address,
        authorization, 
    }) 
    
    console.log('Authorization valid:', valid);
    
    if(!valid) {
        alert('Invalid authorization');
        return
    } else {
        console.log('Authorization:', authorization);
        return authorization;
    }
}





export {connectWallet, sendEth, signAuthorization};
