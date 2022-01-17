

//const CRYPTOPUNK_ABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"punksOfferedForSale","outputs":[{"name":"isForSale","type":"bool"},{"name":"punkIndex","type":"uint256"},{"name":"seller","type":"address"},{"name":"minValue","type":"uint256"},{"name":"onlySellTo","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"punkIndex","type":"uint256"}],"name":"enterBidForPunk","outputs":[],"payable":true,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"punkIndex","type":"uint256"},{"name":"minPrice","type":"uint256"}],"name":"acceptBidForPunk","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"addresses","type":"address[]"},{"name":"indices","type":"uint256[]"}],"name":"setInitialOwners","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"imageHash","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"nextPunkIndexToAssign","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"punkIndexToAddress","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"standard","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"punkBids","outputs":[{"name":"hasBid","type":"bool"},{"name":"punkIndex","type":"uint256"},{"name":"bidder","type":"address"},{"name":"value","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"allInitialOwnersAssigned","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"allPunksAssigned","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"punkIndex","type":"uint256"}],"name":"buyPunk","outputs":[],"payable":true,"type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"punkIndex","type":"uint256"}],"name":"transferPunk","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"punkIndex","type":"uint256"}],"name":"withdrawBidForPunk","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"punkIndex","type":"uint256"}],"name":"setInitialOwner","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"punkIndex","type":"uint256"},{"name":"minSalePriceInWei","type":"uint256"},{"name":"toAddress","type":"address"}],"name":"offerPunkForSaleToAddress","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"punksRemainingToAssign","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"punkIndex","type":"uint256"},{"name":"minSalePriceInWei","type":"uint256"}],"name":"offerPunkForSale","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"punkIndex","type":"uint256"}],"name":"getPunk","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"pendingWithdrawals","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"punkIndex","type":"uint256"}],"name":"punkNoLongerForSale","outputs":[],"payable":false,"type":"function"},{"inputs":[],"payable":true,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"punkIndex","type":"uint256"}],"name":"Assign","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"punkIndex","type":"uint256"}],"name":"PunkTransfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"punkIndex","type":"uint256"},{"indexed":false,"name":"minValue","type":"uint256"},{"indexed":true,"name":"toAddress","type":"address"}],"name":"PunkOffered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"punkIndex","type":"uint256"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":true,"name":"fromAddress","type":"address"}],"name":"PunkBidEntered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"punkIndex","type":"uint256"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":true,"name":"fromAddress","type":"address"}],"name":"PunkBidWithdrawn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"punkIndex","type":"uint256"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":true,"name":"fromAddress","type":"address"},{"indexed":true,"name":"toAddress","type":"address"}],"name":"PunkBought","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"punkIndex","type":"uint256"}],"name":"PunkNoLongerForSale","type":"event"}];

const LiquidityFactory = artifacts.require("LiquidityFactory");
const utils = require("./helpers/utils");
const { ERC721ABI } = require("./helpers/ERC721ABI")
const { ethers } = require("hardhat");

const fs = require('fs');
const alchemyEndpoint = fs.readFileSync("./alchemyEndpoint").toString().trim();
const provider = ethers.getDefaultProvider(alchemyEndpoint);

// Contract addresses
const CRYPTOPUNK_ADDRESS = "0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB";
const BAYC_ADDRESS = "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D";
const DOODLE_ADDRESS = "0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e";

// Holders
// Cryptopunk
const CRYPTOPUNK_HOLDER_ADDRESS = "0xa25803ab86A327786Bb59395fC0164D826B98298";
const CRYPTOPUNK_HOLDINGS_FIVE = [3013, 3505, 9294, 9360, 9382];
const CRYPTOPUNK_HOLDINGS_ONE = 3013;
// BAYC
const BAYC_HOLDER_ADDRESS = "0x54BE3a794282C030b15E43aE2bB182E14c409C5e";
const BAYC_HOLDINGS_FIVE = [1044, 864, 857, 188, 863];
const BAYC_HOLDINGS_ONE = 1044;
// Doodle
const DOODLE_HOLDER_ADDRESS = "0xC35f3F92A9F27A157B309a9656CfEA30E5C9cCe3";
const DOODLE_HOLDINGS_FIVE = [6230, 9083, 5604, 5603, 5599];
const DOODLE_HOLDINGS_ONE = 6230;

contract("LiquidityFactory", (accounts) => {

  let [owner, bidder] = accounts;
  console.log("Accounts: ", accounts);
  let contractInstance;
  beforeEach(async () => {
    // Resetting state back to refreshed block before each test
    // This lets us test with the same NFT(s) in sequential tests
    await hre.network.provider.request({
      method: "hardhat_reset",
      params: [
        {
          forking: {
            jsonRpcUrl: alchemyEndpoint,
            blockNumber: 13972250,
          },
        },
      ],
    });
    
    contractInstance = await LiquidityFactory.new("LiquidityFactory");
    //console.log("Contract address: ", contractInstance.address);

    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [BAYC_HOLDER_ADDRESS],
    });
    
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [DOODLE_HOLDER_ADDRESS],
    });

    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [CRYPTOPUNK_HOLDER_ADDRESS],
    });

    ERC721_BAYC = new ethers.Contract(BAYC_ADDRESS, ERC721ABI, await provider.getSigner());
    ERC721_DOODLES = new ethers.Contract(DOODLE_ADDRESS, ERC721ABI, await provider.getSigner());
    //cryptopunk = new ethers.Contract(CRYPTOPUNK_ADDRESS, CRYPTOPUNK_ABI, await provider.getSigner());
  });

  context("as a bidder, bidding on an ERC-721 collection", async () => {
    it("should be able to submit a bid", async () => {
        // bidder is bidding 0.1 ETH for 1 BAYC
        const result = await contractInstance.submitBid(BAYC_ADDRESS, 1, {from: bidder, value: 100000000000000000});
        assert.equal(result.receipt.status, true);
        assert.equal(result.logs[0].args.bidderAddress, bidder);
        assert.equal(result.logs[0].args.nftAddress, BAYC_ADDRESS);
        assert.equal(result.logs[0].args.weiPriceEach, 100000000000000000);
        assert.equal(result.logs[0].args.quantity, 1);
        assert.equal(result.logs[0].args.tokenId, 0);
    });
    it("should not be able to bid 0 ETH", async () => {
        // bidder is bidding 0 ETH for 1 BAYC
        await utils.shouldThrow(contractInstance.submitBid(BAYC_ADDRESS, 1, {from: bidder, value: 0}));
    });
    it("should be able to cancel a single bid previously submitted on a given collection", async () => {
        // bidder is bidding 0.1 ETH for 1 BAYC
        await contractInstance.submitBid(BAYC_ADDRESS, 1, {from: bidder, value: 100000000000000000});
        // bidder is canceling BAYC bid
        const result = await contractInstance.cancelBid(BAYC_ADDRESS, {from: bidder});
        assert.equal(result.receipt.status, true);
        assert.equal(result.logs[0].args.bidderAddress, bidder);
        assert.equal(result.logs[0].args.nftAddress, BAYC_ADDRESS);
        assert.equal(result.logs[0].args.weiPriceEach, 100000000000000000);
        assert.equal(result.logs[0].args.quantity, 1);
        assert.equal(result.logs[0].args.tokenId, 0);
    });
    it("should be able to cancel multiple bids previously submitted on a given collection", async () => {
      // bidder is bidding 0.2 ETH for 2 BAYC
      await contractInstance.submitBid(BAYC_ADDRESS, 2, {from: bidder, value: 200000000000000000});
      // bidder is canceling BAYC bid
      const result = await contractInstance.cancelBid(BAYC_ADDRESS, {from: bidder});
      assert.equal(result.receipt.status, true);
      assert.equal(result.logs[0].args.bidderAddress, bidder);
      assert.equal(result.logs[0].args.nftAddress, BAYC_ADDRESS);
      assert.equal(result.logs[0].args.weiPriceEach, 100000000000000000);
      assert.equal(result.logs[0].args.quantity, 2);
      assert.equal(result.logs[0].args.tokenId, 0);
    });
    it("should not be able to place a bid on a collection where you already have a bid outstanding", async () => {
      // bidder is bidding 0.1 ETH for 1 BAYC
      await contractInstance.submitBid(BAYC_ADDRESS, 1, {from: bidder, value: 100000000000000000});
      // bidder is trying to bid 0.1 ETH for 1 BAYC again
      await utils.shouldThrow(contractInstance.submitBid(BAYC_ADDRESS, 1, {from: bidder, value: 100000000000000000}));
    });
    it("should be able to place a bid, cancel a bid, and place a new bid on a collection", async () => {
      // bidder is bidding 0.1 ETH for 1 BAYC
      await contractInstance.submitBid(BAYC_ADDRESS, 1, {from: bidder, value: 100000000000000000});
      // bidder is canceling BAYC bid
      await contractInstance.cancelBid(BAYC_ADDRESS, {from: bidder});
      // bidder is bidding 0.1 ETH for 1 BAYC
      const result = await contractInstance.submitBid(BAYC_ADDRESS, 1, {from: bidder, value: 100000000000000000});
      assert.equal(result.receipt.status, true);
      assert.equal(result.logs[0].args.bidderAddress, bidder);
      assert.equal(result.logs[0].args.nftAddress, BAYC_ADDRESS);
      assert.equal(result.logs[0].args.weiPriceEach, 100000000000000000);
      assert.equal(result.logs[0].args.quantity, 1);
      assert.equal(result.logs[0].args.tokenId, 0);
    });
    it("should not be able to cancel a bid if you haven't already placed one", async () => {
      // bidder is trying to cancel a bid that does not exist
      await utils.shouldThrow(contractInstance.cancelBid(BAYC_ADDRESS, {from: bidder}));
    });
  })

  context("as a seller, selling an NFT from an ERC-721 collection", async () => {
    it("should be able to sell a single NFT into a bid for a single NFT", async () => {
      // bidder bids 0.000001 ETH for 1 BAYC
      await contractInstance.submitBid(BAYC_ADDRESS, 1, {from: bidder, value: 1000000000000});
      // seller approves contract address to transfer BAYC
      const BAYC_SIGNER = await ethers.getSigner(BAYC_HOLDER_ADDRESS);
      await ERC721_BAYC.connect(BAYC_SIGNER).approve(contractInstance.address, BAYC_HOLDINGS_ONE, {gasLimit: 500000});
      // seller sells 1 BAYC into bidder's bid
      const result = await contractInstance.hitBid(bidder, BAYC_ADDRESS, BAYC_HOLDINGS_ONE, 1000000000000, {from: BAYC_HOLDER_ADDRESS});
      assert.equal(result.receipt.status, true);
      assert.equal(result.logs[0].args.bidderAddress, bidder);
      assert.equal(result.logs[0].args.sellerAddress, BAYC_HOLDER_ADDRESS);
      assert.equal(result.logs[0].args.nftAddress, BAYC_ADDRESS);
      assert.equal(result.logs[0].args.weiPriceEach, 1000000000000);
      assert.equal(result.logs[0].args.quantity, 1);
      assert.equal(result.logs[0].args.tokenId, BAYC_HOLDINGS_ONE);
    });
    it("should throw if bid amount is less than seller expects", async () => {
      // bidder bids 0.000001 ETH for 1 BAYC
      await contractInstance.submitBid(BAYC_ADDRESS, 1, {from: bidder, value: 1000000000000});
      // seller approves contract address to transfer BAYC
      const BAYC_SIGNER = await ethers.getSigner(BAYC_HOLDER_ADDRESS);
      await ERC721_BAYC.connect(BAYC_SIGNER).approve(contractInstance.address, BAYC_HOLDINGS_ONE, {gasLimit: 500000});
      // seller tries to sell 1 BAYC into bid, but doesn't because the bid is less than expected
      await utils.shouldThrow(contractInstance.hitBid(bidder, BAYC_ADDRESS, BAYC_HOLDINGS_ONE, 2000000000000, {from: BAYC_HOLDER_ADDRESS}));
    });
    it("should not be able to sell an ineligible NFT into a bid for a specific collection", async () => {
      // bidder bids 0.000001 ETH for 1 BAYC
      await contractInstance.submitBid(BAYC_ADDRESS, 1, {from: bidder, value: 1000000000000});
      // seller approves contract address to transfer a Doodle into the BAYC bid
      const DOODLE_SIGNER = await ethers.getSigner(DOODLE_HOLDER_ADDRESS);
      await ERC721_DOODLES.connect(DOODLE_SIGNER).approve(contractInstance.address, DOODLE_HOLDINGS_ONE, {gasLimit: 500000});
      // seller tries to sell 1 Doodle into bid
      await utils.shouldThrow(contractInstance.hitBid(bidder, DOODLE_ADDRESS, DOODLE_HOLDINGS_ONE, 1000000000000, {from: DOODLE_HOLDER_ADDRESS}));
    });
    xit("should not be able to sell multiple NFTs into a bid for a single NFT", async () => {
      // bidder bids 0.000001 ETH for 1 BAYC
      await contractInstance.submitBid(BAYC_ADDRESS, 1, {from: bidder, value: 1000000000000});
      // seller tries to sell 2 BAYC into bid
      await utils.shouldThrow(contractInstance.hitMultipleBids([bidder, bidder], BAYC_ADDRESS, BAYC_HOLDINGS_FIVE.slice(1), 1000000000000, {from: BAYC_HOLDER}));
    });
    xit("should be able to sell a single NFT into a bid for multiple NFTs", async () => {
      // bidder bids 0.000001 ETH for 1 BAYC (good for up to 5 BAYC)
      await contractInstance.submitBid(BAYC_ADDRESS, 5, {from: bidder, value: 5000000000000});
      // seller sells 1 BAYC into bid
      const result = await contractInstance.hitBid(bidder, BAYC_ADDRESS, BAYC_HOLDINGS_ONE, 1000000000000, {from: BAYC_HOLDER});
      assert.equal(result.receipt.status, true);
      assert.equal(result.logs[0].args.bidderAddress, bidder);
      assert.equal(result.logs[0].args.sellerAddress, BAYC_HOLDER);
      assert.equal(result.logs[0].args.nftAddress, BAYC_ADDRESS);
      assert.equal(result.logs[0].args.weiPriceEach, 1000000000000);
      assert.equal(result.logs[0].args.quantity, 1);
      assert.equal(result.logs[0].args.tokenId, BAYC_HOLDINGS_ONE);
    });
    xit("should be able to sell N NFTs into a bid for M NFTs, where N<M", async () => {
      // bidder bids 0.000001 ETH for 1 BAYC (good for up to 5 BAYC)
      await contractInstance.submitBid(BAYC_ADDRESS, 5, {from: bidder, value: 5000000000000});
      // seller sells 2 BAYC into bid
      const result = await contractInstance.hitMultipleBids([bidder, bidder], BAYC_ADDRESS, BAYC_HOLDINGS_FIVE.slice(1), 1000000000000, {from: BAYC_HOLDER});
      assert.equal(result.receipt.status, true);
      //TODO: other NewTrade event-related checks
    });
    xit("should not be able to sell into a bid that has been canceled", async () => {
      // bidder is bidding 0.000001 ETH for 1 BAYC
      await contractInstance.submitBid(BAYC_ADDRESS, 1, {from: bidder, value: 1000000000000});
      // bidder is canceling BAYC bid
      await contractInstance.cancelBid(BAYC_ADDRESS, {from: bidder});
      // seller is trying to sell into canceled bid
      await utils.shouldThrow(contractInstance.hitBid(bidder, BAYC_ADDRESS, BAYC_HOLDINGS_ONE, 1000000000000, {from: BAYC_HOLDER}));
    });
    xit("should not be able to sell into a bid that does not exist", async () => {
      // seller is trying to sell into a nonexistent bid
      await utils.shouldThrow(contractInstance.hitBid(bidder, BAYC_ADDRESS, BAYC_HOLDINGS_ONE, 1000000000000, {from: BAYC_HOLDER}));
    });
  })

  context("as a bidder, bidding on a Cryptopunk", async () => {
    it("should be able to submit a bid", async () => {
      // bidder is bidding 0.1 ETH for 1 Cryptopunk
      const result = await contractInstance.submitBid(CRYPTOPUNK_ADDRESS, 1, {from: bidder, value: 100000000000000000});
      assert.equal(result.receipt.status, true);
      assert.equal(result.logs[0].args.bidderAddress, bidder);
      assert.equal(result.logs[0].args.nftAddress, CRYPTOPUNK_ADDRESS);
      assert.equal(result.logs[0].args.weiPriceEach, 100000000000000000);
      assert.equal(result.logs[0].args.quantity, 1);
      assert.equal(result.logs[0].args.tokenId, 0);
    });
    it("should not be able to bid 0 ETH", async () => {
      // bidder is bidding 0 ETH for 1 Cryptopunk
      await utils.shouldThrow(contractInstance.submitBid(CRYPTOPUNK_ADDRESS, 1, {from: bidder, value: 0}));
    });
    it("should be able to cancel a bid", async () => {
      // bidder is bidding 0.1 ETH for 1 Cryptopunk
      await contractInstance.submitBid(CRYPTOPUNK_ADDRESS, 1, {from: bidder, value: 100000000000000000});
      // bidder is canceling Cryptopunk bid
      const result = await contractInstance.cancelBid(CRYPTOPUNK_ADDRESS, {from: bidder});
      assert.equal(result.receipt.status, true);
      assert.equal(result.logs[0].args.bidderAddress, bidder);
      assert.equal(result.logs[0].args.nftAddress, CRYPTOPUNK_ADDRESS);
      assert.equal(result.logs[0].args.weiPriceEach, 100000000000000000);
      assert.equal(result.logs[0].args.quantity, 1);
      assert.equal(result.logs[0].args.tokenId, 0);
    });
    it("should be able to cancel multiple bids", async () => {
      // bidder is bidding 0.2 ETH for 2 Cryptopunks
      await contractInstance.submitBid(CRYPTOPUNK_ADDRESS, 2, {from: bidder, value: 200000000000000000});
      // bidder is canceling Cryptopunk bid
      const result = await contractInstance.cancelBid(CRYPTOPUNK_ADDRESS, {from: bidder});
      assert.equal(result.receipt.status, true);
      assert.equal(result.logs[0].args.bidderAddress, bidder);
      assert.equal(result.logs[0].args.nftAddress, CRYPTOPUNK_ADDRESS);
      assert.equal(result.logs[0].args.weiPriceEach, 100000000000000000);
      assert.equal(result.logs[0].args.quantity, 2);
      assert.equal(result.logs[0].args.tokenId, 0);
    });
    it("should not be able to place a bid if you already have a bid outstanding", async () => {
      // bidder is bidding 0.1 ETH for 1 Cryptopunk
      await contractInstance.submitBid(CRYPTOPUNK_ADDRESS, 1, {from: bidder, value: 100000000000000000});
      // bidder is trying to bid 0.1 ETH for 1 Cryptopunk again
      await utils.shouldThrow(contractInstance.submitBid(CRYPTOPUNK_ADDRESS, 1, {from: bidder, value: 100000000000000000}));
    });
    it("should be able to place a bid, cancel a bid, and place a new bid", async () => {
      // bidder is bidding 0.1 ETH for 1 Cryptopunk
      await contractInstance.submitBid(CRYPTOPUNK_ADDRESS, 1, {from: bidder, value: 100000000000000000});
      // bidder is canceling Cryptopunk bid
      await contractInstance.cancelBid(CRYPTOPUNK_ADDRESS, {from: bidder});
      // bidder is bidding 0.1 ETH for 1 Cryptopunk
      const result = await contractInstance.submitBid(CRYPTOPUNK_ADDRESS, 1, {from: bidder, value: 100000000000000000});
      assert.equal(result.receipt.status, true);
      assert.equal(result.logs[0].args.bidderAddress, bidder);
      assert.equal(result.logs[0].args.nftAddress, CRYPTOPUNK_ADDRESS);
      assert.equal(result.logs[0].args.weiPriceEach, 100000000000000000);
      assert.equal(result.logs[0].args.quantity, 1);
      assert.equal(result.logs[0].args.tokenId, 0);
    });
    it("should not be able to cancel a bid if you haven't already placed one", async () => {
      // bidder is trying to cancel a bid that does not exist
      await utils.shouldThrow(contractInstance.cancelBid(CRYPTOPUNK_ADDRESS, {from: bidder}));
    });
  })

  context("as a seller, selling a Cryptopunk", async () => {
    xit("should be able to sell a single Cryptopunk into a bid for a single Cryptopunk", async () => {
      // bidder bids 0.000001 ETH for 1 Cryptopunk
      await contractInstance.submitBid(CRYPTOPUNK_ADDRESS, 1, {from: bidder, value: 1000000000000});
      // seller sells 1 Cryptopunk into bid
      const result = await contractInstance.hitBid(bidder, CRYPTOPUNK_ADDRESS, CRYPTOPUNK_HOLDINGS_ONE, 1000000000000, {from: CRYPTOPUNK_HOLDER_ADDRESS});
      assert.equal(result.receipt.status, 1000000000000);
      assert.equal(result.receipt.status, true);
      assert.equal(result.logs[0].args.bidderAddress, bidder);
      assert.equal(result.logs[0].args.sellerAddress, CRYPTOPUNK_HOLDER);
      assert.equal(result.logs[0].args.nftAddress, CRYPTOPUNK_ADDRESS);
      assert.equal(result.logs[0].args.weiPriceEach, 1000000000000);
      assert.equal(result.logs[0].args.quantity, 1);
      assert.equal(result.logs[0].args.tokenId, CRYPTOPUNK_HOLDINGS_ONE);
    });
    xit("should throw if bid amount is less than seller expects", async () => {
      // bidder bids 0.000001 ETH for 1 Cryptopunk
      await contractInstance.submitBid(CRYPTOPUNK_ADDRESS, 1, {from: bidder, value: 1000000000000});
      // seller tries to sell 1 Cryptopunk into bid, but doesn't because the bid is less than expected
      await utils.shouldThrow(contractInstance.hitBid(bidder, CRYPTOPUNK_ADDRESS, CRYPTOPUNK_HOLDINGS_ONE, 2000000000000, {from: CRYPTOPUNK_HOLDER}));
    });
    xit("should not be able to sell an ineligible NFT into a bid for a Cryptopunk", async () => {
      // bidder bids 0.000001 ETH for 1 Cryptopunk
      await contractInstance.submitBid(CRYPTOPUNK_ADDRESS, 1, {from: bidder, value: 1000000000000});
      // seller tries to sell 1 Doodle into bid
      await utils.shouldThrow(contractInstance.hitBid(bidder, DOODLE_ADDRESS, DOODLE_HOLDINGS_ONE, 1000000000000, {from: DOODLE_HOLDER_ADDRESS}));
    });
    xit("should not be able to sell multiple Cryptopunks into a bid for one Cryptopunk", async () => {
      // bidder bids 0.000001 ETH for 1 Cryptopunk
      await contractInstance.submitBid(CRYPTOPUNK_ADDRESS, 1, {from: bidder, value: 1000000000000});
      // seller tries to sell 2 Cryptopunks into bid
      await utils.shouldThrow(contractInstance.hitMultipleBids([bidder, bidder], CRYPTOPUNK_ADDRESS, CRYPTOPUNK_HOLDINGS_FIVE.slice(1), 1000000000000, {from: CRYPTOPUNK_HOLDER}));
    });
    xit("should be able to sell a single Cryptopunk into a bid for multiple Cryptopunks", async () => {
      // bidder bids 0.000001 ETH for 1 Cryptopunk (good for up to 5 Cryptopunk)
      await contractInstance.submitBid(CRYPTOPUNK_ADDRESS, 5, {from: bidder, value: 5000000000000});
      // seller sells 1 Cryptopunk into bid
      const result = await contractInstance.hitBid(bidder, CRYPTOPUNK_ADDRESS, CRYPTOPUNK_HOLDINGS_ONE, 1000000000000, {from: CRYPTOPUNK_HOLDER});
      assert.equal(result.receipt.status, true);
      assert.equal(result.logs[0].args.bidderAddress, bidder);
      assert.equal(result.logs[0].args.sellerAddress, CRYPTOPUNK_HOLDER);
      assert.equal(result.logs[0].args.nftAddress, CRYPTOPUNK_ADDRESS);
      assert.equal(result.logs[0].args.weiPriceEach, 1000000000000);
      assert.equal(result.logs[0].args.quantity, 1);
      assert.equal(result.logs[0].args.tokenId, CRYPTOPUNK_HOLDINGS_ONE);
    });
    xit("should be able to sell N Cryptopunks into a bid for M Cryptopunks, where N<M", async () => {
      // bidder bids 0.000001 ETH for 1 Cryptopunk (good for up to 5 BAYC)
      await contractInstance.submitBid(CRYPTOPUNK_ADDRESS, 5, {from: bidder, value: 5000000000000});
      // seller sells 2 Cryptopunks into bid
      const result = await contractInstance.hitMultipleBids([bidder, bidder], CRYPTOPUNK_ADDRESS, CRYPTOPUNK_HOLDINGS_FIVE.slice(1), 1000000000000, {from: CRYPTOPUNK_HOLDER});
      assert.equal(result.receipt.status, true);
      //TODO: other NewTrade event-related checks
    });
    xit("should not be able to sell a Cryptopunk into a bid that has been canceled", async () => {
      // bidder is bidding 0.000001 ETH for 1 Cryptopunk
      await contractInstance.submitBid(CRYPTOPUNK_ADDRESS, 1, {from: bidder, value: 1000000000000});
      // bidder is canceling Cryptopunk bid
      await contractInstance.cancelBid(CRYPTOPUNK_ADDRESS, {from: bidder});
      // seller is trying to sell into canceled bid
      await utils.shouldThrow(contractInstance.hitBid(bidder, CRYPTOPUNK_ADDRESS, CRYPTOPUNK_HOLDINGS_ONE, 1000000000000, {from: CRYPTOPUNK_HOLDER}));
    });
    xit("should not be able to sell into a bid that does not exist", async () => {
      // seller is trying to sell into a nonexistent bid
      await utils.shouldThrow(contractInstance.hitBid(bidder, CRYPTOPUNK_ADDRESS, CRYPTOPUNK_HOLDINGS_ONE, 1000000000000, {from: CRYPTOPUNK_HOLDER}));
    });
  })

  context("as owner", async () => {
    it("should be able to invoke changePlatformFee", async () => {
      const result = await contractInstance.changePlatformFee(100, {from: owner});
      assert.equal(result.receipt.status, true);
    });
    xit("should receive correct payout for a single completed ERC-721 transaction", async () => {
      let ownerBalancePre = await web3.eth.getBalance(owner);
      // bidder bids 0.000001 ETH for 1 BAYC
      await contractInstance.submitBid(BAYC_ADDRESS, 1, {from: bidder, value: 1000000000000});
      // seller sells 1 BAYC into bid
      const result = await contractInstance.hitBid(bidder, BAYC_ADDRESS, BAYC_HOLDINGS_ONE, 1000000000000, {from: BAYC_HOLDER});
      let ownerBalancePost = await web3.eth.getBalance(owner);
      assert.equal(ownerBalancePre+20000000000, ownerBalancePost);
    });
    xit("should receive correct payout for multiple completed ERC-721 transactions", async () => {
      let ownerBalancePre = await web3.eth.getBalance(owner);
      // bidder bids 0.000001 ETH for 1 BAYC (good for up to 5 BAYC)
      await contractInstance.submitBid(BAYC_ADDRESS, 5, {from: bidder, value: 5000000000000});
      // seller sells 5 BAYC into bid
      await contractInstance.hitMultipleBids([bidder, bidder, bidder, bidder, bidder], BAYC_ADDRESS, BAYC_HOLDINGS_FIVE, 1000000000000, {from: BAYC_HOLDER});
      let ownerBalancePost = await web3.eth.getBalance(owner);
      assert.equal(ownerBalancePre+100000000000, ownerBalancePost);
    });
    xit("should receive correct payout for a single completed Cryptopunk transaction", async () => {
      let ownerBalancePre = await web3.eth.getBalance(owner);
      // bidder bids 0.000001 ETH for 1 Cryptopunk
      await contractInstance.submitBid(CRYPTOPUNK_ADDRESS, 1, {from: bidder, value: 1000000000000});
      // seller sells 1 Cryptopunk into bid
      const result = await contractInstance.hitBid(bidder, CRYPTOPUNK_ADDRESS, CRYPTOPUNK_HOLDINGS_ONE, 1000000000000, {from: CRYPTOPUNK_HOLDER});
      let ownerBalancePost = await web3.eth.getBalance(owner);
      assert.equal(ownerBalancePre+20000000000, ownerBalancePost);
    });
    xit("should receive correct payout for multiple completed Cryptopunk transactions", async () => {
      let ownerBalancePre = await web3.eth.getBalance(owner);
      // bidder bids 0.000001 ETH for 1 Cryptopunk (good for up to 5 BAYC)
      await contractInstance.submitBid(CRYPTOPUNK_ADDRESS, 5, {from: bidder, value: 5000000000000});
      // seller sells 5 Cryptopunks into bid
      await contractInstance.hitMultipleBids([bidder, bidder, bidder, bidder, bidder], CRYPTOPUNK_ADDRESS, CRYPTOPUNK_HOLDINGS_FIVE, 1000000000000, {from: CRYPTOPUNK_HOLDER});
      let ownerBalancePost = await web3.eth.getBalance(owner);
      assert.equal(ownerBalancePre+100000000000, ownerBalancePost);
    });
    it("should have unchanged balance when a new bid is placed", async () => {
      let ownerBalancePre = await web3.eth.getBalance(owner);
      // bidder is bidding 0.1 ETH for 1 BAYC
      await contractInstance.submitBid(BAYC_ADDRESS, 1, {from: bidder, value: 100000000000000000});
      let ownerBalancePost = await web3.eth.getBalance(owner);
      assert.equal(ownerBalancePre, ownerBalancePost);
    });
    it("should have unchanged balance when a bid is canceled", async () => {
      let ownerBalancePre = await web3.eth.getBalance(owner);
      // bidder is bidding 0.1 ETH for 1 BAYC
      await contractInstance.submitBid(BAYC_ADDRESS, 1, {from: bidder, value: 100000000000000000});
      // bidder is canceling BAYC bid
      await contractInstance.cancelBid(BAYC_ADDRESS, {from: bidder});
      let ownerBalancePost = await web3.eth.getBalance(owner);
      assert.equal(ownerBalancePre, ownerBalancePost);
    });
  })

  context("as non-owner", async () => {
    it("should not be able to invoke changePlatformFee", async () => {
      await utils.shouldThrow(contractInstance.changePlatformFee(100, {from: bidder}));
    });
  })

})