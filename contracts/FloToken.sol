// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract FloToken {
    // Sets the name of Token
    string public name = "Flo Token";
    // Sets the name of Token
    string public symbol = "Flo";
    // Sets the standard
    string public standard = "Flo Token V 1.0";
    // Total number of Tokens
    uint256 public totalSupply;

    // Adresses with token supply
    mapping(address => uint256) public balanceOf;

    // Constructor
    constructor(uint256 _initialSupply) {
        // allocate the totalSupply
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }

    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    // Transfer
    function transfer(address _to, uint256 _value)
        public
        returns (bool success)
    {
        // Exception if account doesn't have enough Flo Tokens
        require(balanceOf[msg.sender] >= _value);
        // Transfer the balance
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        // Transfer Event
        emit Transfer(msg.sender, _to, _value);
        // Return a boolean
        return true;
    }
}
