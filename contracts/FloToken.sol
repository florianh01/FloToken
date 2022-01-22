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
    mapping(address => mapping(address => uint256)) public allowance;

    // Constructor
    constructor(uint256 _initialSupply) {
        // allocate the totalSupply
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

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

    function approve(address _spender, uint256 _value)
        public
        returns (bool success)
    {
        allowance[msg.sender][_spender] = _value;

        // Approval Event
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {
        // Require _from has enough tokens
        require(balanceOf[_from] >= _value);
        // Require allowance is big enough
        require(_value <= allowance[_from][msg.sender]);
        // Change the balance
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        // Update the allowance
        // Transfer Event
        emit Transfer(_from, _to, _value);
        // Return a boolean
        return true;
    }
}
