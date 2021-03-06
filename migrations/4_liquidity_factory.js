// Migrations file which conforms to the hardhat format
// Added this migrations file in order to be able to test using hardhat
const LiquidityFactory = artifacts.require("./LiquidityFactory.sol");

module.exports = async(deployer, network, accounts) => {
  const liquidityFactory = await LiquidityFactory.new();
  LiquidityFactory.setAsDeployed(liquidityFactory, {from: accounts[0]});
}