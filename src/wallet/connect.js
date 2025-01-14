import { custom, createWalletClient, parseUnits, createPublicClient, http, formatUnits, isAddressEqual } from 'viem';
import { eip7702Actions, verifyAuthorization } from 'viem/experimental'
import { CONTRACT_ABI, CONTRACT_ADDRESS, CONTRACT_ADDRESS_2, ODYSSEY_CHAIN } from '../constants/chain.js';
import { privateKeyToAccount } from 'viem/accounts';
import { SIMPLE_ACCOUNT_ABI, SIMPLE_ACCOUNT_ADDRESS } from '@/constants/SimpleAccont.js';

let walletClient;
let publicClient;

const CHAIN = ODYSSEY_CHAIN;

async function connectWallet({ setIsConnected, setBalance, setAddress, setIsEOASmartAccount }) {
    try {
        if (!window.ethereum) {
            warn('Please install MetaMask');
            return;
        }

        const [address] = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        })

        walletClient = createWalletClient({
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

        await isEOASmart({ address, setIsEOASmartAccount });

    } catch (error) {
        console.error('Error connecting wallet:', error);
        alert('Failed to connect wallet. Please try again.');
    }
}
const signAuthorization = async ({ privateKey, contractAddress, setAuthMessage }) => {

    try{
        setAuthMessage('⌛ Signing authorization...');

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
            setAuthMessage('⌛ Setting contract code at EOA...');
    
            const hash = await client.sendTransaction({
                account: privateKeyAccount,
                authorizationList: [authorization],
                to: privateKeyAccount.address,
                value: 1000
            })

            setAuthMessage('⌛ Waiting for confirmation...');

            await publicClient.waitForTransactionReceipt({ hash });

    
            const isEOASmartAccount = await isEOASmart({ address: privateKeyAccount.address });
    
            if(isEOASmartAccount) {
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


const executeBatch = async ({recipient, amount, address, setTxnHash, setBalance}) => {

    setTxnHash('');

    if(!walletClient) {
        alert('Please connect your wallet first');
        return
    }

    try {
        console.log('Input Data', {recipient, amount});
        const recipents = recipient.split(',').map(r => r.trim());
        const amounts = amount.split(',').map(a => parseUnits(a.trim(), 18)); 
        const data = recipents.map(r => "0x");
        console.log('Processed Data', {recipents, amounts, data});

        const hash = await walletClient.writeContract({
            address,
            abi: SIMPLE_ACCOUNT_ABI,
            functionName: 'executeBatch',
            account: address,
            args: [recipents, amounts, data]
        })

        
        console.log('Transaction hash:', hash);

        setTxnHash(hash);

        await publicClient.waitForTransactionReceipt({ hash });

        const balance = await publicClient.getBalance({ address });
        const formattedBalance = parseFloat(formatUnits(balance, 18)).toFixed(4);
        setBalance(formattedBalance);


    } catch (error) {
        console.error('Error sending ETH:', error);
    }

}

const isEOASmart = async ({ address, setIsEOASmartAccount }) => {
    const publicClient = createPublicClient({
        chain: CHAIN,
        transport: http()
    })

    const contractCode = await publicClient.getCode({ address });

    if(!contractCode || contractCode === '0x' ) {
        return false;
    }
    
    if( contractCode.toLowerCase().split('0xef0100')[1] === SIMPLE_ACCOUNT_ADDRESS.toLowerCase().slice(2)) {
        if(setIsEOASmartAccount) {
            setIsEOASmartAccount(true);
        }
        return true;
    }

    return false;
}





export {connectWallet, signAuthorization, executeBatch, isEOASmart};
