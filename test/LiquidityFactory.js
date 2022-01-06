const LiquidityFactory = artifacts.require("LiquidityFactory");
const utils = require("./helpers/utils");

// Contract addresses
const CRYPTOPUNK_ADDRESS = "0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB";
const BAYC_ADDRESS = "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D";
const DOODLE_ADDRESS = "0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e";

// Holder addresses
// Cryptopunk
const CRYPTOPUNK_HOLDER = "0xa25803ab86A327786Bb59395fC0164D826B98298";
const CRYPTOPUNK_HOLDINGS_FIVE = [3013, 3505, 9294, 9360, 9382];
const CRYPTOPUNK_HOLDINGS_ONE = 3013;
// BAYC
const BAYC_HOLDER = "0x54BE3a794282C030b15E43aE2bB182E14c409C5e";
const BAYC_HOLDINGS_FIVE = [1044, 864, 857, 188, 863];
const BAYC_HOLDINGS_ONE = 1044;
// Doodle
const DOODLE_HOLDER = "0xC35f3F92A9F27A157B309a9656CfEA30E5C9cCe3";
const DOODLE_HOLDINGS_FIVE = [6230, 9083, 5604, 5603, 5599];
const DOODLE_HOLDINGS_ONE = 6230;

contract("LiquidityFactory", (accounts) => {

  let [owner, bidder, seller] = accounts;
  let contractInstance;
  beforeEach(async () => {
      contractInstance = await LiquidityFactory.new("LiquidityFactory");
  });

  xcontext("as a bidder, bidding on an ERC-721 collection", async () => {
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
      console.log(await contractInstance.IERC721(BAYC_ADDRESS).ownerOf(BAYC_HOLDINGS_ONE));
      // bidder bids 0.000001 ETH for 1 BAYC
      await contractInstance.submitBid(BAYC_ADDRESS, 1, {from: bidder, value: 1000000000000});
      // seller sells 1 BAYC into bidder's bid
      const result = await contractInstance.hitBid(bidder, BAYC_ADDRESS, BAYC_HOLDINGS_ONE, 1000000000000, {from: BAYC_HOLDER});
      assert.equal(result.receipt.status, true);
      assert.equal(result.logs[0].args.bidderAddress, bidder);
      assert.equal(result.logs[0].args.sellerAddress, BAYC_HOLDER);
      assert.equal(result.logs[0].args.nftAddress, BAYC_ADDRESS);
      assert.equal(result.logs[0].args.weiPriceEach, 1000000000000);
      assert.equal(result.logs[0].args.quantity, 1);
      assert.equal(result.logs[0].args.tokenId, BAYC_HOLDINGS_ONE);
    });
    xit("should throw if bid amount is less than seller expects", async () => {
      // bidder bids 0.000001 ETH for 1 BAYC
      await contractInstance.submitBid(BAYC_ADDRESS, 1, {from: bidder, value: 1000000000000});
      // seller tries to sell 1 BAYC into bid, but doesn't because the bid is less than expected
      await utils.shouldThrow(contractInstance.hitBid(bidder, BAYC_ADDRESS, BAYC_HOLDINGS_ONE, 2000000000000, {from: BAYC_HOLDER}));
    });
    xit("should not be able to sell an ineligible NFT into a bid for a specific collection", async () => {
      // bidder bids 0.000001 ETH for 1 BAYC
      await contractInstance.submitBid(BAYC_ADDRESS, 1, {from: bidder, value: 1000000000000});
      // seller tries to sell 1 Doodle into bid
      await utils.shouldThrow(contractInstance.hitBid(bidder, DOODLE_ADDRESS, DOODLE_HOLDINGS_ONE, 1000000000000, {from: DOODLE_HOLDER}));
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

  xcontext("as a bidder, bidding on a Cryptopunk", async () => {
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
    it("should be able to sell a single Cryptopunk into a bid for a single Cryptopunk", async () => {
      // bidder bids 0.000001 ETH for 1 Cryptopunk
      await contractInstance.submitBid(CRYPTOPUNK_ADDRESS, 1, {from: bidder, value: 1000000000000});
      // seller sells 1 Cryptopunk into bid
      const result = await contractInstance.hitBid(bidder, CRYPTOPUNK_ADDRESS, CRYPTOPUNK_HOLDINGS_ONE, 1000000000000, {from: CRYPTOPUNK_HOLDER});
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
      await utils.shouldThrow(contractInstance.hitBid(bidder, DOODLE_ADDRESS, DOODLE_HOLDINGS_ONE, 1000000000000, {from: DOODLE_HOLDER}));
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

  xcontext("as owner", async () => {
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

  xcontext("as non-owner", async () => {
    it("should not be able to invoke changePlatformFee", async () => {
      await utils.shouldThrow(contractInstance.changePlatformFee(100, {from: bidder}));
    });
  })

})