/**
 * @type import('hardhat/config').HardhatUserConfig
 */

// Need this in order to use hardhat with Truffle testing format
// npm install --save-dev @nomiclabs/hardhat-truffle5 @nomiclabs/hardhat-web3 web3
require("@nomiclabs/hardhat-truffle5");

module.exports = {
  solidity: "0.8.3",
};
