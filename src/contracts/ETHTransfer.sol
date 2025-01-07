// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.0;

contract ETHTransfer {
    receive() external payable {}

    function transfer(address to, uint amount) public payable {
        (bool sent, ) = to.call{value: amount}("");
        require(sent, "Failed to send Ether");
    }
}