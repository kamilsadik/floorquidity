var LiquidityFactory = artifacts.require("./LiquidityFactory.sol");
module.exports = function(deployer) {
  deployer.deploy(LiquidityFactory, 'LiquidityFactory');
};