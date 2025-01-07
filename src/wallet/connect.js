import { custom, createWalletClient, parseUnits, createPublicClient, http, formatUnits } from 'viem';
import { eip7702Actions, verifyAuthorization } from 'viem/experimental'
import { CONTRACT_ABI, CONTRACT_ADDRESS, ODYSSEY_CHAIN } from '../constants.js';
import { privateKeyToAccount } from 'viem/accounts';

let client;

async function connectWallet({ setIsConnected, setBalance, setAccount }) {
    try {
        if (!window.ethereum) {
            warn('Please install MetaMask');
            return;
        }

        client = createWalletClient({
            chain: ODYSSEY_CHAIN,
            transport: custom(window.ethereum)
        }).extend(eip7702Actions());
           
        const [address] = await client.getAddresses()
           
        setIsConnected(true);
        setAccount(address);

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

    
    if(!privateKey) {
        alert('Please enter your private key');
        return
    }
    
    if(!client) {
        alert('Please connect your wallet first');
        return
    }
    
    
    const myAddress = privateKeyToAccount(privateKey);

    console.log({recipient, amount, address: myAddress.address});

    const authorization = await client.signAuthorization({
        contractAddress: CONTRACT_ADDRESS,
        account: myAddress,
    })

    const valid = await verifyAuthorization({ 
        address: myAddress.address, 
        authorization, 
      }) 

    console.log('Authorization valid:', valid);


    const hash = await client.writeContract({
        authorizationList: [authorization],
        address: myAddress.address,
        abi: CONTRACT_ABI,
        functionName: 'transfer',
        account: myAddress.address,
        args: [recipient, parseUnits(amount, 18)]
    })

    console.log('Transaction hash:', hash);
    setTxnHash(hash);

}





export {connectWallet, sendEth};
