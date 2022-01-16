/**
 * @type import('hardhat/config').HardhatUserConfig
 */

// Need this in order to use hardhat with Truffle testing format
// npm install --save-dev @nomiclabs/hardhat-truffle5 @nomiclabs/hardhat-web3 web3
// require("@nomiclabs/hardhat-truffle5");
// require("@nomiclabs/hardhat-ethers");
// require('hardhat-deploy');


const fs = require('fs');
const alchemyEndpoint = fs.readFileSync("./alchemyEndpoint").toString().trim();

// module.exports = {
//   solidity: "0.8.3",
//   networks: {
//     hardhat: {
//       forking: {
//         url: alchemyEndpoint,
//         blockNumber: 13972250,
//       }
//     }
//   }
// };

import {HardhatUserConfig} from 'hardhat/types';
import 'hardhat-deploy';
import '@nomiclabs/hardhat-ethers';

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