const FloToken = artifacts.require("./FloToken");

module.exports = function (deployer) {
  deployer.deploy(FloToken);
};
