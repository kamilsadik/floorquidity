const LiquidityFactory = artifacts.require("LiquidityFactory");
const utils = require("./helpers/utils");

contract("LiquidityFactory", (accounts) => {

    let [owner, bidder, seller] = accounts;
    let contractInstance;
    beforeEach(async () => {
        contractInstance = await LiquidityFactory.new("LiquidityFactory");
    });

})