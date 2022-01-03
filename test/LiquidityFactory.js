const LiquidityFactory = artifacts.require("LiquidityFactory");
const utils = require("./helpers/utils");

contract("LiquidityFactory", (accounts) => {

  let [owner, bidder, seller] = accounts;
  let contractInstance;
  beforeEach(async () => {
      contractInstance = await LiquidityFactory.new("LiquidityFactory");
  });

  context("as a bidder, bidding on an ERC-721 collection", async () => {
    it("should be able to submit a bid", async () => {
        // bidder is bidding 0.1 ETH for 1 BAYC
        const result = await contractInstance.submitBid("0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D", 1, {from: bidder, value: 100000000000000000});
        assert.equal(result.receipt.status, true);
        assert.equal(result.logs[0].args.bidderAddress, bidder);
        assert.equal(result.logs[0].args.nftAddress, "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D");
        assert.equal(result.logs[0].args.weiPriceEach, 100000000000000000);
        assert.equal(result.logs[0].args.quantity, 1);
        assert.equal(result.logs[0].args.tokenId, 0);
    });
    it("should not be able to bid 0 ETH on a collection", async () => {
        // bidder is bidding 0 ETH for 1 BAYC
        await utils.shouldThrow(contractInstance.submitBid("0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D", 1, {from: bidder, value: 0}));
    });
    it("should be able to cancel bids previously submitted on a given collection", async () => {
        // bidder is bidding 0.1 ETH for 1 BAYC
        await contractInstance.submitBid("0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D", 1, {from: bidder, value: 100000000000000000});
        // bidder is canceling BAYC bid
        const result = await contractInstance.cancelBid("0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D", {from: bidder});
        assert.equal(result.receipt.status, true);
        assert.equal(result.logs[0].args.bidderAddress, bidder);
        assert.equal(result.logs[0].args.nftAddress, "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D");
        assert.equal(result.logs[0].args.weiPriceEach, 100000000000000000);
        assert.equal(result.logs[0].args.quantity, 1);
        assert.equal(result.logs[0].args.tokenId, 0);
    });
    it("should not be able to place a bid on a collection where you already have a bid outstanding", async () => {
      // bidder is bidding 0.1 ETH for 1 BAYC
      await contractInstance.submitBid("0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D", 1, {from: bidder, value: 100000000000000000});
      // bidder is trying to bid 0.1 ETH for 1 BAYC again
      await utils.shouldThrow(contractInstance.submitBid("0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D", 1, {from: bidder, value: 100000000000000000}));
    });
    it("should be able to place a bid, cancel a bid, and place a new bid on a collection", async () => {
      // bidder is bidding 0.1 ETH for 1 BAYC
      await contractInstance.submitBid("0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D", 1, {from: bidder, value: 100000000000000000});
      // bidder is canceling BAYC bid
      await contractInstance.cancelBid("0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D", {from: bidder});
      // bidder is bidding 0.1 ETH for 1 BAYC
      const result = await contractInstance.submitBid("0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D", 1, {from: bidder, value: 100000000000000000});
      assert.equal(result.receipt.status, true);
      assert.equal(result.logs[0].args.bidderAddress, bidder);
      assert.equal(result.logs[0].args.nftAddress, "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D");
      assert.equal(result.logs[0].args.weiPriceEach, 100000000000000000);
      assert.equal(result.logs[0].args.quantity, 1);
      assert.equal(result.logs[0].args.tokenId, 0);
    });
    it("should not be able to cancel a bid if you haven't already placed one", async () => {
      // bidder is trying to cancel a bid that does not exist
      await utils.shouldThrow(contractInstance.cancelBid("0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D", {from: bidder}));
    });
  })

  context("as a seller, selling an NFT from an ERC-721 collection", async () => {
    xit("should be able to sell a single NFT into a bid for a single NFT", async () => {
    });
    xit("should not be able to sell an ineligible NFT into a bid for a specific collection", async () => {
    });
    xit("should not be able to sell multiple NFTs into a bid for a single NFT", async () => {
    });
    xit("should be able to sell a single NFT into a bid for multiple NFTs", async () => {
    });
    xit("should be able to sell a single NFT into a bid for multiple NFTs, and subsequently sell additional NFTs into that bid", async () => {
    });
    xit("should not be able to sell into a bid that has been canceled", async () => {
    });
  })

  context("as a bidder, bidding on a Cryptopunk", async () => {
    xit("should be able to submit a bid", async () => {
    });
    xit("should not be able to bid 0 ETH on a collection", async () => {
    });
    xit("should be able to cancel bids on a given collection", async () => {
    });
    xit("should not be able to place a bid on a collection where you already have a bid outstanding", async () => {
    });
    xit("should be able to place a bid, cancel a bid, and place a new bid on a collection", async () => {
    });
    xit("should not be able to cancel a bid if you haven't already placed one", async () => {
    });
  })

  context("as a seller, selling a Cryptopunk", async () => {
    xit("should be able to sell a single NFT into a bid for a single NFT", async () => {
    });
    xit("should not be able to sell an ineligible NFT into a bid for a specific collection", async () => {
    });
    xit("should not be able to sell multiple NFTs into a bid for a single NFT", async () => {
    });
    xit("should be able to sell a single NFT into a bid for multiple NFTs", async () => {
    });
    xit("should be able to sell a single NFT into a bid for multiple NFTs, and subsequently sell additional NFTs into that bid", async () => {
    });
    xit("should not be able to sell into a bid that has been canceled", async () => {
    });
  })

})