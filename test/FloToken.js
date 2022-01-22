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
        await tokenInstance.transfer.call(accounts[1], 1000001)
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


    it('approves tokens for delegated transfer', async () => {
        // Gets an instance
        const tokenInstance = await FloToken.deployed();
        success = await tokenInstance.approve.call(accounts[1], 100);
        assert.equal(success, true);
        const receipt = await tokenInstance.approve(accounts[1], 100, { from: accounts[0] });
        assert.equal(receipt.logs.length, 1, 'triggers one event');
        assert.equal(receipt.logs[0].event, 'Approval', 'should be the "Approval" event');
        assert.equal(receipt.logs[0].args._owner, accounts[0], 'logs the account the tokens are transfered from');
        assert.equal(receipt.logs[0].args._spender, accounts[1], 'logs the account the tokens are transfered to');
        assert.equal(receipt.logs[0].args._value, 100, 'logs the transfer amount');

        const allowance = await tokenInstance.allowance(accounts[0], accounts[1]);
        assert.equal(allowance, 100);
    });

    it('handles delegated token transfers', async () => {
        // Gets an instance
        const tokenInstance = await FloToken.deployed();
        fromAccount = accounts[2];
        toAccount = accounts[3];
        spendingAccount = accounts[4];
        await tokenInstance.transfer(fromAccount, 100, { from: accounts[0] });
        await tokenInstance.approve(spendingAccount, 10, { from: fromAccount });
        // Try transfering something greater than senders balance
        await tokenInstance.transferFrom(fromAccount, toAccount, 101, { from: spendingAccount })
            .then(assert.fail).catch(function (error) {
                assert(error.message.toString().indexOf('revert') >= 0, 'error message must contain revert');
            });
        await tokenInstance.transferFrom(fromAccount, toAccount, 20, { from: spendingAccount })
            .then(assert.fail).catch(function (error) {
                assert(error.message.toString().indexOf('revert') >= 0, 'error message must contain revert');
            });
        const success = await tokenInstance.transferFrom.call(fromAccount, toAccount, 10, { from: spendingAccount });
        assert.equal(success, true);
        const receipt = await tokenInstance.transferFrom(fromAccount, toAccount, 10, { from: spendingAccount })
        assert.equal(receipt.logs.length, 1, 'triggers one event');
        assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
        assert.equal(receipt.logs[0].args._from, fromAccount, 'logs the account the tokens are transfered from');
        assert.equal(receipt.logs[0].args._to, toAccount, 'logs the account the tokens are transfered to');
        assert.equal(receipt.logs[0].args._value, 10, 'logs the transfer amount');
        balance = await tokenInstance.balanceOf(fromAccount);
        assert.equal(balance.toNumber(), 90);
        balance = await tokenInstance.balanceOf(toAccount);
        assert.equal(balance.toNumber(), 10);
        const allowance = await tokenInstance.allowance(fromAccount, spendingAccount);
        assert.equal(allowance.toNumber(), 0);
    });
});