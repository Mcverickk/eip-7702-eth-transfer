import { custom, createWalletClient, parseUnits, createPublicClient, http, formatUnits, isAddressEqual, encodeFunctionData } from 'viem';
import { eip7702Actions, verifyAuthorization } from 'viem/experimental'
import { CONTRACT_ABI, CONTRACT_ADDRESS, CONTRACT_ADDRESS_2, ODYSSEY_CHAIN } from '../constants/chain.js';
import { privateKeyToAccount } from 'viem/accounts';
import { SIMPLE_ACCOUNT_ABI, SIMPLE_ACCOUNT_ADDRESS } from '@/constants/SimpleAccont.js';

let client;
let publicClient;

const CHAIN = ODYSSEY_CHAIN;

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
            chain: CHAIN,
            transport: custom(window.ethereum)
        }).extend(eip7702Actions());

        console.log('Connected wallet:', address);
        
           
        setIsConnected(true);
        setAddress(address);

        publicClient = createPublicClient({
            chain: CHAIN,
            transport: http()
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

        const authorization = await signAuthorization({ privateKey, contractAddress: CONTRACT_ADDRESS_2 });

        const hash = await writeContract({
            authorization,
            address,
            abi: CONTRACT_ABI,
            functionName: 'transfer',
            args: [recipient, parseUnits(amount, 18)]
        })


        
        console.log('Transaction hash:', hash);
        setTxnHash(hash);
    } catch (error) {
        console.error('Error sending ETH:', error);
    }
}

const signAuthorization = async ({ privateKey, contractAddress }) => {
    
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
        contractAddress
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

const writeContract = async ({authorization, address, abi, functionName, args}) => {

    const hash = await client.writeContract({
        authorizationList: [authorization],
        address,
        abi,
        functionName,
        account: address,
        args
    })

    return hash;

}

const sendTxn = async ({authorization, address, abi, functionName, args}) => {

    const data = encodeFunctionData({
        abi,
        functionName,
        args
    })

    const hash = await client.sendTransaction({
        authorizationList: [authorization],
        data,
        to: address
    })

    return hash;
}





export {connectWallet, sendEth, signAuthorization};
