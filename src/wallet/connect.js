import { custom, createWalletClient, parseUnits, createPublicClient, http, formatUnits, isAddressEqual } from 'viem';
import { eip7702Actions, verifyAuthorization } from 'viem/experimental'
import { CONTRACT_ABI, CONTRACT_ADDRESS, CONTRACT_ADDRESS_2, ODYSSEY_CHAIN } from '../constants/chain.js';
import { privateKeyToAccount } from 'viem/accounts';
import { SIMPLE_ACCOUNT_ABI, SIMPLE_ACCOUNT_ADDRESS } from '@/constants/SimpleAccont.js';

let client;

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

        const publicClient = createPublicClient({
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

async function writeContract({recipient, amount, address, setTxnHash}) {
    
    if(!client) {
        alert('Please connect your wallet first');
        return
    }

    try {

        const hash = await client.writeContract({
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

const signAuthorization = async ({ privateKey, contractAddress, setAuthMessage }) => {

    try{
        const privateKeyAccount = privateKeyToAccount(privateKey);
    
        const client = createWalletClient({
            chain: CHAIN,
            transport: http()
        }).extend(eip7702Actions());
    
        const publicClient = createPublicClient({
            chain: CHAIN,
            transport: http()
        })
    
        const authorization = await client.signAuthorization({
            account: privateKeyAccount,
            contractAddress
        })
        
        const valid = await verifyAuthorization({ 
            address: privateKeyAccount.address,
            authorization, 
        }) 
    
        
        if(!valid) {
            alert('Invalid authorization');
            throw new Error('Invalid authorization');
        } else {
    
            const hash = await client.sendTransaction({
                account: privateKeyAccount,
                authorizationList: [authorization],
                to: privateKeyAccount.address,
                value: 1000
            })

            await publicClient.waitForTransactionReceipt({ hash });

    
            const contractCode = await publicClient.getCode({ address: privateKeyAccount.address });
    
            if( contractCode.toLowerCase().split('0xef0100')[1] === contractAddress.toLowerCase().slice(2)) {
                setAuthMessage('✅ Successfully set contract code at EOA');
                console.log('Contract code at EOA is correct');
            } else {
                console.log('Contract code at EOA is incorrect');
                throw new Error('Contract code at EOA is incorrect');
                
            }
        }

    } catch (error) {
        console.error('Error setting contract code at EOA:', error);
        setAuthMessage('❌ Error setting contract code at EOA');
    }
    
}





export {connectWallet, writeContract, signAuthorization};
