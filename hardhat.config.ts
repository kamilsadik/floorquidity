import {HardhatUserConfig} from 'hardhat/types';
import 'hardhat-deploy';
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-truffle5';

const fs = require('fs');
const alchemyEndpoint = fs.readFileSync("./alchemyEndpoint").toString().trim();

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.3',
  },
  networks: {
    hardhat: {
      forking: {
        url: alchemyEndpoint,
        blockNumber: 13972250,
      }
    }
  },
  namedAccounts: {
    owner: 0,
    bidder: 1,
  },
  paths: {
    sources: 'contracts',
  },
};
export default config;