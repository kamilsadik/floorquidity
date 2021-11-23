var CreatorTokenExchange = artifacts.require("./CreatorTokenExchange.sol");
module.exports = function(deployer, network, accounts) {
  deployer.deploy(CreatorTokenExchange, 'CreatorTokenExchange',{from: accounts[0]});
};