// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract FloToken {

    // Contructor
    // Set total number of Tokens
    constructor () {
       totalSupply = 1000000;
    }

    // Total number of Tokens
    uint256 public totalSupply;
    
}