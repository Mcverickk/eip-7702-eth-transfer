const ODYSSEY_CHAIN = {
  id: 911867,
  name: "Odyssey Testnet",
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH", // Replace with your chain's token symbol
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ["https://odyssey.ithaca.xyz"] },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://odyssey-explorer.ithaca.xyz" },
  },
};

export { ODYSSEY_CHAIN };
