var LiquidityFactory = artifacts.require("./LiquidityFactory.sol");
module.exports = function(deployer, network, accounts) {
  deployer.deploy(LiquidityFactory, 'LiquidityFactory',{from: accounts[0]});
};