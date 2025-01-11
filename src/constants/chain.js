const ODYSSEY_CHAIN = {
            id: 911867,
            name: 'Odyssey Testnet',
            nativeCurrency: {
              name: 'ETH',
              symbol: 'ETH', // Replace with your chain's token symbol
              decimals: 18,
            },
            rpcUrls: {
              default: { http: ['https://odyssey.ithaca.xyz'] },
            },
            blockExplorers: {
              default: { name: 'Explorer', url: 'https://odyssey-explorer.ithaca.xyz' },
            },
        };

const CONTRACT_ADDRESS_2 = '0x58bF960d3f6403c2dE0019D9632C05ceE413A340';
const CONTRACT_ADDRESS = '0x50766859cA7566a2E61F1b5507331cf345b062a9';
const CONTRACT_ABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	}
];

export { CONTRACT_ADDRESS, CONTRACT_ABI, CONTRACT_ADDRESS_2, ODYSSEY_CHAIN };