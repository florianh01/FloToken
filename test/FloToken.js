const FloToken = artifacts.require("./FloToken");

contract('FloToken', function (accounts) {
    it('sets the totalSupply upon deployment', function () {
        return FloToken.deployed().then(function (instance) {
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then(function (totalSupply) {
            assert.equal(totalSupply.toNumber(), 1000000, 'sets the total supply to 1000000');
        });
    });
})