const FloToken = artifacts.require("./FloToken");

contract('FloToken', function (accounts) {

    it('initializes the contract with the correct values', async () => {
        // Gets an instance
        const tokenInstance = await FloToken.deployed();

        // Checks the name
        const name = await tokenInstance.name();
        assert.equal(name, 'Flo Token');

        // Checks the symbol
        const symbol = await tokenInstance.symbol();
        assert.equal(symbol, 'Flo');

        // Checks the standard
        const standard = await tokenInstance.standard();
        assert.equal(standard, 'Flo Token V 1.0');
    });

    it('allocates initial supply', async () => {
        // Gets an instance
        const tokenInstance = await FloToken.deployed();

        // Checks the totalSupply
        const totalSupply = await tokenInstance.totalSupply();
        assert.equal(totalSupply.toNumber(), 1000000);

        // Checks the adminBalance
        const adminBalance = await tokenInstance.balanceOf(accounts[0]);
        assert.equal(adminBalance.toNumber(), 1000000);
    });

    it('transfers token ownership', async () => {
        // Gets an instance
        const tokenInstance = await FloToken.deployed();
        // Will fail, because send amount is larger then total token supply
        tokenInstance.transfer.call(accounts[1], 1000001)
            .then(assert.fail).catch(function (error) {
                assert(error.message.toString().indexOf('revert') >= 0, 'error message must contain revert');
            });
        const success = await tokenInstance.transfer.call(accounts[1], 250000)
        assert.equal(success, true);
        const receipt = await tokenInstance.transfer(accounts[1], 250000, { from: accounts[0] });
        assert.equal(receipt.logs.length, 1, 'triggers one event');
        assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
        assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the account the tokens are transfered from');
        assert.equal(receipt.logs[0].args._to, accounts[1], 'logs the account the tokens are transfered to');
        assert.equal(receipt.logs[0].args._value, 250000, 'logs the transfer amount');
        balance = await tokenInstance.balanceOf(accounts[1]);
        assert.equal(balance.toNumber(), 250000);
        balance = await tokenInstance.balanceOf(accounts[0]);
        assert.equal(balance.toNumber(), 750000);

    });

});