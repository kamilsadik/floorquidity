var CreatorTokenExchange = artifacts.require("./CreatorTokenExchange.sol");
module.exports = function(deployer) {
  deployer.deploy(CreatorTokenExchange, 'CreatorTokenExchange');
};