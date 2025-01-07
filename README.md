# EIP-7702 ETH Transfer

This project implements the EIP-7702 standard where an EOA is converted to a smart wallet to transfer ETH.

## Description

This project offers a reference implementation of the EIP-7702 standard, utilizing Viem and the Odyssey Testnet. It includes a basic smart contract deployed at [`0x50766859cA7566a2E61F1b5507331cf345b062a9`](https://odyssey-explorer.ithaca.xyz/address/0x50766859cA7566a2E61F1b5507331cf345b062a9), designed to transfer ETH from the contract address to a specified recipient. The EOA temporarily behaves as the contract for the duration of the transaction and transfers the funds.

## Setup

1. Clone the repository:
    ```sh
    git clone https://github.com/Mcverickk/eip-7702-eth-transfer
    cd eip-7702-eth-transfer
    ```
2. Install dependencies:
    ```sh
    npm install
    ```
3. Run locally
    ```sh
    npm run dev
    ```