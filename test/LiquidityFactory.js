const LiquidityFactory = artifacts.require("LiquidityFactory");
const utils = require("./helpers/utils");

contract("LiquidityFactory", (accounts) => {

    let [owner, bidder, seller] = accounts;
    let contractInstance;
    beforeEach(async () => {
        contractInstance = await LiquidityFactory.new("LiquidityFactory");
    });

    it("should be able to create a new Creator Token", async () => {
        const result = await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator})
        assert.equal(result.receipt.status, true);
        assert.equal(result.logs[0].args.creatorAddress, creator);
        assert.equal(result.logs[0].args.name, "Protest The Hero");
        assert.equal(result.logs[0].args.symbol, "PTH5");
        assert.equal(result.logs[0].args.description, "This token will help us fund our next album.");
        assert.equal(result.logs[0].args.verified, false);
        assert.equal(result.logs[0].args.outstanding, 0);
        assert.equal(result.logs[0].args.maxSupply, 0);
    })

    context("in the normal course of transacting", async () => {
	    it("should be able to buy Creator Token", async () => {
	    	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
	        let totalProceeds = await contractInstance._totalProceeds(0, 5000);
	        const result = await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
	        assert.equal(result.receipt.status, true);
	        assert.equal(result.logs[1].args.account, user);
	        assert.equal(result.logs[1].args.amount, 5000);
	        assert.equal(result.logs[1].args.transactionType, "buy");
	        assert.equal(result.logs[1].args.tokenId, 0);
	        assert.equal(result.logs[1].args.name, "Protest The Hero");
	        assert.equal(result.logs[1].args.symbol, "PTH5");
	    })
	    it("should be able to sell Creator Token", async () => {
	    	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
	        let totalProceeds = await contractInstance._totalProceeds(0, 5000);
	        await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
	        const result = await contractInstance.sellCreatorToken(0, 5000, user, {from: user});
	        assert.equal(result.receipt.status, true);
	        assert.equal(result.logs[1].args.account, user);
	        assert.equal(result.logs[1].args.amount, 5000);
	        assert.equal(result.logs[1].args.transactionType, "sell");
	        assert.equal(result.logs[1].args.tokenId, 0);
	        assert.equal(result.logs[1].args.name, "Protest The Hero");
	        assert.equal(result.logs[1].args.symbol, "PTH5");
	    })
	    it("should not be able to sell more than outstanding amount of Creator Token", async () => {
	    	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
	        let totalProceeds = await contractInstance._totalProceeds(0, 5000);
	        await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
	        await utils.shouldThrow(contractInstance.sellCreatorToken(0, 2000000, user, {from: user}));
	    })
	    it("should not be able to sell another user's Creator Tokens", async () => {
	    	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
	        let totalProceeds = await contractInstance._totalProceeds(0, 5000);
	        await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
	        await utils.shouldThrow(contractInstance.sellCreatorToken(0, 5000, owner, {from: user}));
	    })
	   	it("should not pay creator in a transaction in which a new level of maxSupply is not hit", async () => {
	   		await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
	        let totalProceeds = await contractInstance._totalProceeds(0, 5000);
	        await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
	        await contractInstance.sellCreatorToken(0, 5000, user, {from: user});
	        // Check creator address balance before additional transaction
	        let creatorBalancePre = await web3.eth.getBalance(creator);
	        creatorBalancePre = Number(creatorBalancePre);
	        // User now buys 2500 tokens (leaving maxSupply unchanged) <= these two lines causing test to fail
	        let totalProceedsNew = await contractInstance._totalProceeds(0, 2500);
	        await contractInstance.buyCreatorToken(0, 2500, {from: user, value: totalProceedsNew});
	        // Check creator address balance after additional transaction
	        let creatorBalancePost = await web3.eth.getBalance(creator);
	        creatorBalancePost = Number(creatorBalancePost);
	        // Make sure creator address balanced is unchanged after the second buy transaction
	        assert.equal(creatorBalancePre, creatorBalancePost);
	    })
	    it("should be able to handle transactions with odd numbers of tokens", async () => {
	    	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
	        let totalProceeds = await contractInstance._totalProceeds(0, 5069);
	        const result = await contractInstance.buyCreatorToken(0, 5069, {from: user, value: totalProceeds});
	        assert.equal(result.receipt.status, true);
	    })
	    it("should not be able to buy more tokens than can afford", async () => {
	    	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
	        let totalProceeds = await contractInstance._totalProceeds(0, 100000);
	        await utils.shouldThrow(contractInstance.buyCreatorToken(0, 100000, {from: user, value: totalProceeds}));
	    })
	    it("should correctly update quantity of tokens outstanding after each transaction", async () => {
	    	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
	        let totalProceeds = await contractInstance._totalProceeds(0, 5000);
	        await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
	        let newProceeds = await contractInstance._totalProceeds(0, 5000);
	        await contractInstance.buyCreatorToken(0, 5000, {from: newUser, value: newProceeds});
	        await contractInstance.sellCreatorToken(0, 499, user, {from: user});
	        const result = await contractInstance.creatorTokens(0);
	        assert.equal(result.outstanding, 9501);
	    })
	    it("should correctly update total value locked after a buy", async () => {
	    	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
	        let totalProceeds = await contractInstance._totalProceeds(0, 5000);
	        let netProceeds = await contractInstance._buyProceeds(0, 5000);
	        await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
	        let totalValueLocked = await contractInstance.totalValueLocked(0);
	        assert.equal(Number(netProceeds), Number(totalValueLocked));
	    })
	    xit("should correctly update total value locked after a buy and a sale", async () => {
	    	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
	        let totalProceeds = await contractInstance._totalProceeds(0, 5000);
	        let netProceeds = await contractInstance._buyProceeds(0, 5000);
	        await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
	        const result = await contractInstance.sellCreatorToken(0, 5000, user, {from: user});
	    })
	})

	context("post-transaction holdership mappings", async () => {
		it("should correctly update userToHoldings after a buy", async () => {
	    	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
	        let totalProceeds = await contractInstance._totalProceeds(0, 5000);
	        await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
	        let holdings = await contractInstance.userToHoldings(user, 0);
	        holdings = Number(holdings);
	        assert.equal(holdings, 5000);
	    })
	    it("should correctly update tokenHoldership after a buy", async () => {
	    	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
	        let totalProceeds = await contractInstance._totalProceeds(0, 5000);
	        await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
	        let holdings = await contractInstance.tokenHoldership(0, user);
	        holdings = Number(holdings);
	        assert.equal(holdings, 5000);
	    })
	    it("should correctly update userToHoldings after a sale", async () => {
	    	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
	        let totalProceeds = await contractInstance._totalProceeds(0, 5000);
	        await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
	        await contractInstance.sellCreatorToken(0, 5000, user, {from: user});
	        let holdings = await contractInstance.userToHoldings(user, 0);
	        holdings = Number(holdings);
	        assert.equal(holdings, 0);
	    })
	    it("should correctly update tokenHoldership after a sale", async () => {
	    	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
	        let totalProceeds = await contractInstance._totalProceeds(0, 5000);
	        await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
	        await contractInstance.sellCreatorToken(0, 5000, user, {from: user});
	        let holdings = await contractInstance.tokenHoldership(0, user)
	        holdings = Number(holdings);
	        assert.equal(holdings, 0);
	    })
	    it("should correctly update userToHoldings after a combination of buys and sales", async () => {
	    	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
	        let totalProceeds = await contractInstance._totalProceeds(0, 5000);
	        await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
	        await contractInstance.sellCreatorToken(0, 5000, user, {from: user});
	        // User now buys 2500 tokens (leaving maxSupply unchanged) <= these two lines causing test to fail
	        let totalProceedsNew = await contractInstance._totalProceeds(0, 2500);
	        await contractInstance.buyCreatorToken(0, 2500, {from: user, value: totalProceedsNew});
	        let holdings = await contractInstance.userToHoldings(user, 0);
	        holdings = Number(holdings);
	        assert.equal(holdings, 2500);
	    })
	    it("should correctly update tokenHoldership after a combination of buys and sales", async () => {
	    	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
	        let totalProceeds = await contractInstance._totalProceeds(0, 5000);
	        await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
	        await contractInstance.sellCreatorToken(0, 5000, user, {from: user});
	        // User now buys 2500 tokens (leaving maxSupply unchanged) <= these two lines causing test to fail
	        let totalProceedsNew = await contractInstance._totalProceeds(0, 2500);
	        await contractInstance.buyCreatorToken(0, 2500, {from: user, value: totalProceedsNew});
	        let holdings = await contractInstance.tokenHoldership(0, user);
	        holdings = Number(holdings);
	        assert.equal(holdings, 2500);
	    })
	})

	context("as a token-holder", async () => {
		/*
		it("should allow user to burn their own tokens", async () => {
			await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
			let totalProceeds = await contractInstance._totalProceeds(0, 5000);
			await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
			//const result = await contractInstance.burn(user, 0, 5000, {from: user});
			//assert.equal(result.receipt.status, true);
			await utils.shouldThrow(contractInstance._burn(user, 0, 5000, {from: user}));

		})
		it("should allow user to burnBatch their own tokens", async () => {
			await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
			await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH6", "This token will help us fund our next tour.", {from: creator});
			let totalProceeds = await contractInstance._totalProceeds(0, 5000);
			await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
			await contractInstance.buyCreatorToken(1, 5000, {from: user, value: totalProceeds});
			//const result = await contractInstance.burnBatch(user, [0,1], [5000,5000], {from: user});
			//assert.equal(result.receipt.status, true);
			await utils.shouldThrow(contractInstance._burnBatch(user, [0,1], [5000,5000], {from: user}));
		})
		it("should not allow user to burn another user's tokens", async () => {
			await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
			let totalProceeds = await contractInstance._totalProceeds(0, 5000);
			await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
			await utils.shouldThrow(contractInstance._burn(user, 0, 5000, {from: creator}));
		})
		it("should not allow user to burnBatch another user's tokens", async () => {
			await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
			await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH6", "This token will help us fund our next tour.", {from: creator});
			let totalProceeds = await contractInstance._totalProceeds(0, 5000);
			await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
			await contractInstance.buyCreatorToken(1, 5000, {from: user, value: totalProceeds});
			await utils.shouldThrow(contractInstance._burnBatch(user, [0,1], [5000,5000], {from: creator}));
		})
		xit("should not allow a user to mint tokens", async () => {
			
		})
		xit("should not allow a user to mintBatch tokens", async () => {
			
		})
		*/
		it("should allow user to transfer their tokens to another user", async () => {
			await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
			let totalProceeds = await contractInstance._totalProceeds(0, 5000);
			await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
			await contractInstance.safeTransferFrom(user, newUser, 0, 5000, 1, {from: user});
			let holdings = await contractInstance.tokenHoldership(0, user);
			holdings = Number(holdings);
			assert.equal(holdings, 0);
			let newHoldings = await contractInstance.tokenHoldership(0, newUser);
			newHoldings = Number(newHoldings);
			assert.equal(newHoldings, 5000);
		})
		it("should allow user to batch transfer their tokens to another user", async () => {
			await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
			await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH6", "This token will help us fund our next tour.", {from: creator});
			let totalProceeds = await contractInstance._totalProceeds(0, 5000);
			await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
			await contractInstance.buyCreatorToken(1, 5000, {from: user, value: totalProceeds});
			await contractInstance.safeBatchTransferFrom(user, newUser, [0,1], [5000,5000], 1, {from: user});
			let holdings0 = await contractInstance.tokenHoldership(0, user);
			holdings0 = Number(holdings0);
			assert.equal(holdings0, 0);
			let holdings1 = await contractInstance.tokenHoldership(1, user);
			holdings1 = Number(holdings1);
			assert.equal(holdings1, 0);
			let newHoldings0 = await contractInstance.tokenHoldership(0, newUser);
			newHoldings0 = Number(newHoldings0);
			assert.equal(newHoldings0, 5000);
			let newHoldings1 = await contractInstance.tokenHoldership(1, newUser);
			newHoldings1 = Number(newHoldings1);
			assert.equal(newHoldings1, 5000);
		})
		it("should correctly update tokenHoldership mapping upon a token transfer", async () => {
			await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
			let totalProceeds = await contractInstance._totalProceeds(0, 5000);
			await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
			await contractInstance.safeTransferFrom(user, newUser, 0, 5000, 1, {from: user});
			let holdings = await contractInstance.tokenHoldership(0, user);
			holdings = Number(holdings);
			assert.equal(holdings, 0);
			let newHoldings = await contractInstance.tokenHoldership(0, newUser);
			newHoldings = Number(newHoldings);
			assert.equal(newHoldings, 5000);
		})
		it("should correctly update userToHoldings mapping upon a token transfer", async () => {
			await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
			let totalProceeds = await contractInstance._totalProceeds(0, 5000);
			await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
			await contractInstance.safeTransferFrom(user, newUser, 0, 5000, 1, {from: user});
			let holdings = await contractInstance.userToHoldings(user, 0);
			holdings = Number(holdings);
			assert.equal(holdings, 0);
			let newHoldings = await contractInstance.userToHoldings(newUser, 0);
			newHoldings = Number(newHoldings);
			assert.equal(newHoldings, 5000);
		})
		it("should correctly update tokenHoldership mappings upon a batch token transfer", async () => {
			await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
			await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH6", "This token will help us fund our next tour.", {from: creator});
			let totalProceeds = await contractInstance._totalProceeds(0, 5000);
			await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
			await contractInstance.buyCreatorToken(1, 5000, {from: user, value: totalProceeds});
			await contractInstance.safeBatchTransferFrom(user, newUser, [0,1], [5000,5000], 1, {from: user});
			let holdings0 = await contractInstance.tokenHoldership(0, user);
			holdings0 = Number(holdings0);
			assert.equal(holdings0, 0);
			let holdings1 = await contractInstance.tokenHoldership(1, user);
			holdings1 = Number(holdings1);
			assert.equal(holdings1, 0);
			let newHoldings0 = await contractInstance.tokenHoldership(0, newUser);
			newHoldings0 = Number(newHoldings0);
			assert.equal(newHoldings0, 5000);
			let newHoldings1 = await contractInstance.tokenHoldership(1, newUser);
			newHoldings1 = Number(newHoldings1);
			assert.equal(newHoldings1, 5000);
		})
		it("should correctly update userToHoldings mappings upon a batch token transfer", async () => {
			await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
			await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH6", "This token will help us fund our next tour.", {from: creator});
			let totalProceeds = await contractInstance._totalProceeds(0, 5000);
			await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
			await contractInstance.buyCreatorToken(1, 5000, {from: user, value: totalProceeds});
			await contractInstance.safeBatchTransferFrom(user, newUser, [0,1], [5000,5000], 1, {from: user});
			let holdings0 = await contractInstance.userToHoldings(user, 0);
			holdings0 = Number(holdings0);
			assert.equal(holdings0, 0);
			let holdings1 = await contractInstance.userToHoldings(user, 1);
			holdings1 = Number(holdings1);
			assert.equal(holdings1, 0);
			let newHoldings0 = await contractInstance.userToHoldings(newUser, 1);
			newHoldings0 = Number(newHoldings0);
			assert.equal(newHoldings0, 5000);
			let newHoldings1 = await contractInstance.userToHoldings(newUser, 1);
			newHoldings1 = Number(newHoldings1);
			assert.equal(newHoldings1, 5000);
		})
		it("should be able to set approval", async () => {
			await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
			let totalProceeds = await contractInstance._totalProceeds(0, 5000);
			await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
			const result = await contractInstance.setApprovalForAll(newUser, true, {from: user});
			assert.equal(result.receipt.status, true);
		})
		it("should correctly show approval status", async () => {
			await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
			let totalProceeds = await contractInstance._totalProceeds(0, 5000);
			await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
			await contractInstance.setApprovalForAll(newUser, true, {from: user});
			let approval = await contractInstance.isApprovedForAll(user, newUser);
			assert.equal(approval, true);
		})
		it("should allow a user to transfer another user's tokens if they have been approved", async () => {
			await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
			let totalProceeds = await contractInstance._totalProceeds(0, 5000);
			await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
			await contractInstance.setApprovalForAll(newUser, true, {from: user});
			const result = await contractInstance.safeTransferFrom(user, newUser, 0, 5000, 1, {from: newUser});
			assert.equal(result.receipt.status, true);
		})
		it("should allow a user to batch transfer another user's tokens if they have been approved", async () => {
			await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
			await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH6", "This token will help us fund our next tour.", {from: creator});
			let totalProceeds = await contractInstance._totalProceeds(0, 5000);
			await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
			await contractInstance.buyCreatorToken(1, 5000, {from: user, value: totalProceeds});
			await contractInstance.setApprovalForAll(newUser, true, {from: user});
			const result = await contractInstance.safeBatchTransferFrom(user, newUser, [0,1], [5000,5000], 1, {from: newUser});
			assert.equal(result.receipt.status, true);
		})
		it("should not allow a user to transfer another user's tokens if they have not been approved", async () => {
			await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
			let totalProceeds = await contractInstance._totalProceeds(0, 5000);
			await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
			await utils.shouldThrow(contractInstance.safeTransferFrom(user, newUser, 0, 5000, 1, {from: newUser}));
		})
		it("should not allow a user to batch transfer another user's tokens if they have not been approved", async () => {
			await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
			await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH6", "This token will help us fund our next tour.", {from: creator});
			let totalProceeds = await contractInstance._totalProceeds(0, 5000);
			await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
			await contractInstance.buyCreatorToken(1, 5000, {from: user, value: totalProceeds});
			await utils.shouldThrow(contractInstance.safeBatchTransferFrom(user, newUser, [0,1], [5000,5000], 1, {from: newUser}));
		})
		/*
		it("should correctly show user's balance of a given token", async () => {
			await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
			let totalProceeds = await contractInstance._totalProceeds(0, 5000);
			await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
			let holdings = contractInstance.balanceOf(user, 0);
			assert.equal(holdings, 5000);
		})
		it("should correctly show user's balance of a batch of tokens", async () => {
			await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
			await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH6", "This token will help us fund our next tour.", {from: creator});
			let totalProceeds = await contractInstance._totalProceeds(0, 5000);
			await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
			await contractInstance.buyCreatorToken(1, 5000, {from: user, value: totalProceeds});
			let holdings = contractInstance.balanceOfBatch([user, user], [0,1]);
			assert.equal(holdings, [5000,5000]);
		})
		*/
	})

	context("post-transaction fee accounting", async () => {
		it("should transfer the correct amount to the creator after a buy resulting in a new maxSupply", async () => {
	    	let creatorBalancePre = await web3.eth.getBalance(creator);
	    	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
	        let netProceeds = await contractInstance._buyProceeds(0, 5000);
	        let totalProceeds = await contractInstance._totalProceeds(0, 5000);
	        await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
	        let creatorBalancePost = await web3.eth.getBalance(creator);
	        let creatorBalanceDiff = creatorBalancePost - creatorBalancePre;
	        assert.equal(netProceeds/5,creatorBalanceDiff);
	        // AssertionError: expected 121621621621621500 to equal 117519561621372930
	        // This is a larger difference than the difference between expected/actual platform balance, but is still a small difference likely attributable to gas costs
	    })
	    it("should have feeProceeds equal to netProceeds*platformFee/100", async () => {
	    	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
	        let netProceeds = await contractInstance._buyProceeds(0, 5000);
	        let feeProceeds = await contractInstance._feeProceeds(netProceeds);
	        let totalProceeds = await contractInstance._totalProceeds(0, 5000);
	        await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
	        assert.equal(netProceeds/100, feeProceeds);
	    })
	    it("should transfer the correct amount to the platform after a buy", async () => {
	    	let platformBalancePre = await web3.eth.getBalance(contractInstance.address);
	    	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
	        let netProceeds = await contractInstance._buyProceeds(0, 5000);
	        let feeProceeds = await contractInstance._feeProceeds(netProceeds);
	        let totalProceeds = await contractInstance._totalProceeds(0, 5000);
	        await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
	        let platformCut = totalProceeds - netProceeds/5;
	        let platformBalancePost = await web3.eth.getBalance(contractInstance.address);
	        let platformBalanceDiff = platformBalancePost - platformBalancePre;
	        assert.equal(platformCut,platformBalanceDiff);
	        // AssertionError: expected 492567567567567100 to equal 492567567567816060
	        // Note that this difference is small enough that it is likely a function of gas costs
	    })
	    it("should correctly update totalPlatformFees after a buy", async () => {
	    	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
	        let netProceeds = await contractInstance._buyProceeds(0, 5000);
	        let feeProceeds = await contractInstance._feeProceeds(netProceeds);
	        let totalProceeds = await contractInstance._totalProceeds(0, 5000);
	        await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
	        let totalPlatformFees = await contractInstance.totalPlatformFees();
	        assert.equal(Number(totalPlatformFees), Number(feeProceeds));
	    })
	    it("should correctly update platformFeesOwed after a buy", async () => {
	    	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
	        let netProceeds = await contractInstance._buyProceeds(0, 5000);
	        let feeProceeds = await contractInstance._feeProceeds(netProceeds);
	        let totalProceeds = await contractInstance._totalProceeds(0, 5000);
	        await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
	        let platformFeesOwed = await contractInstance.platformFeesOwed();
	        assert.equal(Number(platformFeesOwed), Number(feeProceeds));
	    })
	    it("should leave totalPlatformFees unchanged after a payout to owner", async () => {
	    	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
	        let netProceeds = await contractInstance._buyProceeds(0, 5000);
	        let feeProceeds = await contractInstance._feeProceeds(netProceeds);
	        let totalProceeds = await contractInstance._totalProceeds(0, 5000);
	        await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
	        let totalPlatformFeesPre = await contractInstance.totalPlatformFees();
	        await contractInstance.payoutPlatformFees(owner, {from: owner});
	        let totalPlatformFeesPost = await contractInstance.totalPlatformFees();
	        assert.equal(Number(totalPlatformFeesPre), Number(totalPlatformFeesPost));
	    })
	    it("should correctly update platformFeesOwed after a payout to owner", async () => {
	    	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
	        let netProceeds = await contractInstance._buyProceeds(0, 5000);
	        let feeProceeds = await contractInstance._feeProceeds(netProceeds);
	        let totalProceeds = await contractInstance._totalProceeds(0, 5000);
	        await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
	        let platformFeesOwedPre = await contractInstance.platformFeesOwed();
	        await contractInstance.payoutPlatformFees(owner, {from: owner});
	        let platformFeesOwedPost = await contractInstance.platformFeesOwed();
	        assert.equal(Number(platformFeesOwedPost), 0);
	    })
	    it("should have a CTE wallet balance >0 after a buy/sell of the same number of tokens", async () => {
	    	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
	        let totalProceeds = await contractInstance._totalProceeds(0, 5000);
	        await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
	        await contractInstance.sellCreatorToken(0, 5000, user, {from: user});
	        let contractBalance = await web3.eth.getBalance(contractInstance.address);
	        contractBalance = Number(contractBalance);
	        assert.isAbove(contractBalance, 0);
	    })
	    it("should have a CTE wallet balance equal to expected totalPlatformFees after a buy and a sale", async () => {
	    	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
	        let totalProceeds = await contractInstance._totalProceeds(0, 5000);
	        await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
	        await contractInstance.sellCreatorToken(0, 5000, user, {from: user});
	        let contractBalance = await web3.eth.getBalance(contractInstance.address);
	        let totalPlatformFees = await contractInstance.totalPlatformFees();
	        assert.equal(Number(contractBalance), Number(totalPlatformFees));
	    })
	    it("should adjust owner wallet balance as expected after executing payoutPlatformFees", async () => {
	    	let ownerBalancePre = await web3.eth.getBalance(owner);
	    	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
	    	let totalProceeds = await contractInstance._totalProceeds(0, 5000);
	    	await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
	    	await contractInstance.payoutPlatformFees(owner, {from: owner});
	    	let ownerBalancePost = await web3.eth.getBalance(owner);
	    	let ownerBalanceDiff = ownerBalancePost - ownerBalancePre;
	    	let totalPlatformFees = await contractInstance.totalPlatformFees();
	    	assert.equal(Number(ownerBalanceDiff), Number(totalPlatformFees));
	    	// AssertionError: expected 5655961081069568 to equal 6081081081081075
	    })
	    it("should have a CTE wallet balance equal to expected totalPlatformFees after a moderate number (~10) of buys/sales", async () => {
	    	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
	    	for (let i = 0; i < 10; i++) {
	    		let totalProceeds = await contractInstance._totalProceeds(0, 5000);
	        	await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
	        	await contractInstance.sellCreatorToken(0, 5000, user, {from: user});
	    	}
	    	let contractBalance = await web3.eth.getBalance(contractInstance.address);
	    	let totalPlatformFees = await contractInstance.totalPlatformFees();
	    	assert.equal(Number(contractBalance), Number(totalPlatformFees));
	    })
	    it("should have a CTE wallet balance equal to expected totalPlatformFees after a moderate number (10) of buys, followed by a moderate number (10) of sales", async () => {
	    	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
	    	for (let i = 0; i < 10; i++) {
	    		let totalProceeds = await contractInstance._totalProceeds(0, 500);
	        	await contractInstance.buyCreatorToken(0, 500, {from: user, value: totalProceeds});
	    	}
	    	for (let i = 0; i < 10; i++) {
	    		await contractInstance.sellCreatorToken(0, 500, user, {from: user});
	    	}
	    	let contractBalance = await web3.eth.getBalance(contractInstance.address);
	    	let totalPlatformFees = await contractInstance.totalPlatformFees();
	    	assert.equal(Number(contractBalance), Number(totalPlatformFees));
	    	//AssertionError: expected 10945945945946152 to equal 10945945945948400
	    	// Note that this difference is small enough that it is likely a function of gas costs, but it's interesting the prior test doesn't have any slippage. Look into why that is.
	    })
	    it("should have a CTE wallet balance equal to expected totalPlatformFees after a large number (~50) of buys/sales", async () => {
	    	// Create additional users for this test
	    	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
	    	for (let i = 0; i < 10; i++) {
	    		// Compute required proceeds, and execute buy transactions
	    		let totalProceeds = await contractInstance._totalProceeds(0, 50);
	        	await contractInstance.buyCreatorToken(0, 50, {from: user, value: totalProceeds});
	        	let totalProceeds2 = await contractInstance._totalProceeds(0, 50);
	        	await contractInstance.buyCreatorToken(0, 50, {from: newUser, value: totalProceeds2});
	        	let totalProceeds3 = await contractInstance._totalProceeds(0, 50);
	        	await contractInstance.buyCreatorToken(0, 50, {from: user3, value: totalProceeds3});
	        	let totalProceeds4 = await contractInstance._totalProceeds(0, 50);
	        	await contractInstance.buyCreatorToken(0, 50, {from: user4, value: totalProceeds4});
	        	let totalProceeds5 = await contractInstance._totalProceeds(0, 50);
	        	await contractInstance.buyCreatorToken(0, 50, {from: user5, value: totalProceeds5});
	        	// Execute sell transactions
	        	await contractInstance.sellCreatorToken(0, 50, user, {from: user});
	        	await contractInstance.sellCreatorToken(0, 50, newUser, {from: newUser});
	        	await contractInstance.sellCreatorToken(0, 50, user3, {from: user3});
	        	await contractInstance.sellCreatorToken(0, 50, user4, {from: user4});
	        	await contractInstance.sellCreatorToken(0, 50, user5, {from: user5});
	    	}
	    	let contractBalance = await web3.eth.getBalance(contractInstance.address);
	    	let totalPlatformFees = await contractInstance.totalPlatformFees();
	    	assert.equal(Number(contractBalance), Number(totalPlatformFees));
	    	// AssertionError: expected 246283783783754 to equal 246283783783854
	    })
	    it("should have a CTE wallet balance equal to expected totalPlatformFees after a large number (~50) of buys, followed by a large number (~50) of sales", async () => {
	    	// Create additional users for this test
	    	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
	    	for (let i = 0; i < 10; i++) {
	    		// Compute required proceeds, and execute buy transactions
	    		let totalProceeds = await contractInstance._totalProceeds(0, 50);
	        	await contractInstance.buyCreatorToken(0, 50, {from: user, value: totalProceeds});
	        	let totalProceeds2 = await contractInstance._totalProceeds(0, 50);
	        	await contractInstance.buyCreatorToken(0, 50, {from: newUser, value: totalProceeds2});
	        	let totalProceeds3 = await contractInstance._totalProceeds(0, 50);
	        	await contractInstance.buyCreatorToken(0, 50, {from: user3, value: totalProceeds3});
	        	let totalProceeds4 = await contractInstance._totalProceeds(0, 50);
	        	await contractInstance.buyCreatorToken(0, 50, {from: user4, value: totalProceeds4});
	        	let totalProceeds5 = await contractInstance._totalProceeds(0, 50);
	        	await contractInstance.buyCreatorToken(0, 50, {from: user5, value: totalProceeds5});
	    	}
	    	for (let i = 0; i < 10; i++) {
	    		// Execute sell transactions
	        	await contractInstance.sellCreatorToken(0, 50, user, {from: user});
	        	await contractInstance.sellCreatorToken(0, 50, newUser, {from: newUser});
	        	await contractInstance.sellCreatorToken(0, 50, user3, {from: user3});
	        	await contractInstance.sellCreatorToken(0, 50, user4, {from: user4});
	        	await contractInstance.sellCreatorToken(0, 50, user5, {from: user5});
	    	}
	    	let contractBalance = await web3.eth.getBalance(contractInstance.address);
	    	let totalPlatformFees = await contractInstance.totalPlatformFees();
	    	assert.equal(Number(contractBalance), Number(totalPlatformFees));
	    	// AssertionError: expected 2736486486486641 to equal 2736486486487066
	    })
	    xit("should have a CTE wallet balance equal to expected totalPlatformFees after a very large number (~250) of buys/sales", async () => {
	    	// Create additional users for this test
	    	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
	    	for (let i = 0; i < 50; i++) {
	    		// Compute required proceeds, and execute buy transactions
	    		let totalProceeds = await contractInstance._totalProceeds(0, 50);
	        	await contractInstance.buyCreatorToken(0, 50, {from: user, value: totalProceeds});
	        	let totalProceeds2 = await contractInstance._totalProceeds(0, 50);
	        	await contractInstance.buyCreatorToken(0, 50, {from: newUser, value: totalProceeds2});
	        	let totalProceeds3 = await contractInstance._totalProceeds(0, 50);
	        	await contractInstance.buyCreatorToken(0, 50, {from: user3, value: totalProceeds3});
	        	let totalProceeds4 = await contractInstance._totalProceeds(0, 50);
	        	await contractInstance.buyCreatorToken(0, 50, {from: user4, value: totalProceeds4});
	        	let totalProceeds5 = await contractInstance._totalProceeds(0, 50);
	        	await contractInstance.buyCreatorToken(0, 50, {from: user5, value: totalProceeds5});
	        	// Execute sell transactions
	        	await contractInstance.sellCreatorToken(0, 50, user, {from: user});
	        	await contractInstance.sellCreatorToken(0, 50, newUser, {from: newUser});
	        	await contractInstance.sellCreatorToken(0, 50, user3, {from: user3});
	        	await contractInstance.sellCreatorToken(0, 50, user4, {from: user4});
	        	await contractInstance.sellCreatorToken(0, 50, user5, {from: user5});
	    	}
	    	let contractBalance = await web3.eth.getBalance(contractInstance.address);
	    	let totalPlatformFees = await contractInstance.totalPlatformFees();
	    	assert.equal(Number(contractBalance), Number(totalPlatformFees));
	    	// AssertionError: expected 1219256756757034 to equal 1219256756757134
	    })
	    xit("should have a CTE wallet balance equal to expected totalPlatformFees after a very large number (~250) of buys, followed by a very large number (~250) of sales", async () => {
	    	// Create additional users for this test
	    	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
	    	for (let i = 0; i < 50; i++) {
	    		// Compute required proceeds, and execute buy transactions
	    		let totalProceeds = await contractInstance._totalProceeds(0, 50);
	        	await contractInstance.buyCreatorToken(0, 50, {from: user, value: totalProceeds});
	        	let totalProceeds2 = await contractInstance._totalProceeds(0, 50);
	        	await contractInstance.buyCreatorToken(0, 50, {from: newUser, value: totalProceeds2});
	        	let totalProceeds3 = await contractInstance._totalProceeds(0, 50);
	        	await contractInstance.buyCreatorToken(0, 50, {from: user3, value: totalProceeds3});
	        	let totalProceeds4 = await contractInstance._totalProceeds(0, 50);
	        	await contractInstance.buyCreatorToken(0, 50, {from: user4, value: totalProceeds4});
	        	let totalProceeds5 = await contractInstance._totalProceeds(0, 50);
	        	await contractInstance.buyCreatorToken(0, 50, {from: user5, value: totalProceeds5});
	    	}
	    	for (let i = 0; i < 50; i++) {
	    		// Execute sell transactions
	        	await contractInstance.sellCreatorToken(0, 50, user, {from: user});
	        	await contractInstance.sellCreatorToken(0, 50, newUser, {from: newUser});
	        	await contractInstance.sellCreatorToken(0, 50, user3, {from: user3});
	        	await contractInstance.sellCreatorToken(0, 50, user4, {from: user4});
	        	await contractInstance.sellCreatorToken(0, 50, user5, {from: user5});
	    	}
	    	let contractBalance = await web3.eth.getBalance(contractInstance.address);
	    	let totalPlatformFees = await contractInstance.totalPlatformFees();
	    	assert.equal(Number(contractBalance), Number(totalPlatformFees));
	    	// AssertionError: expected 68412162162172340 to equal 68412162162177736
	    })
	})

    context("as owner", async () => {
        it("should allow withdrawal", async () => {
            const result = await contractInstance.withdraw(owner, {from: owner});
        	assert.equal(result.receipt.status, true);
        })
        it("should allow payout of platform fees", async () => {
        	const result = await contractInstance.payoutPlatformFees(owner, {from: owner});
        	assert.equal(result.receipt.status, true);
         })
        it("should allow change to platform fee", async () => {
        	const result = await contractInstance.changePlatformFee(2, {from: owner});
        	assert.equal(result.receipt.status, true);
         })
        it("should allow change to profit margin", async () => {
        	const result = await contractInstance.changeProfitMargin(22, {from: owner});
        	assert.equal(result.receipt.status, true);
         })
        it("should allow change to token verification status", async () => {
        	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
        	const result = await contractInstance.changeVerification(0, true, {from: owner});
        	assert.equal(result.receipt.status, true);
         })
    })

    context("as non-owner", async () => {
        it("should not allow withdrawal", async () => {
            await utils.shouldThrow(contractInstance.withdraw(user, {from: user}));
        })
        it("should not allow payout of platform fees", async () => {
        	await utils.shouldThrow(contractInstance.payoutPlatformFees(user, {from: user}));
         })
        it("should not allow change to platform fee", async () => {
        	await utils.shouldThrow(contractInstance.changePlatformFee(2, {from: user}));
         })
        it("should not allow change to profit margin", async () => {
        	await utils.shouldThrow(contractInstance.changeProfitMargin(22, {from: user}));
         })
        it("should not allow change to token verification status", async () => {
        	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
        	await utils.shouldThrow(contractInstance.changeVerification(0, true, {from: user}));
         })
    })

    context("as creator", async () => {
        it("should allow change of address", async () => {
        	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
        	const result = await contractInstance.changeAddress(0, newCreator, {from: creator});
        	assert.equal(result.receipt.status, true);
        })
        it("should allow change of name", async () => {
        	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
        	const result = await contractInstance.changeName(0, "Protest The Hero New Name", {from: creator});
        	assert.equal(result.receipt.status, true);
         })
        it("should allow change of symbol", async () => {
        	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
        	const result = await contractInstance.changeSymbol(0, "PTH5NEW", {from: creator});
        	assert.equal(result.receipt.status, true);
         })
        it("should allow change of description", async () => {
        	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
        	const result = await contractInstance.changeDescription(0, "This token will help us fund our next tour.", {from: creator});
        	assert.equal(result.receipt.status, true);
         })
    })

    context("as non-creator", async () => {
        it("should not allow change of address", async () => {
        	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
        	await utils.shouldThrow(contractInstance.changeAddress(0, newCreator, {from: newCreator}));
        })
        it("should not allow change of name", async () => {
        	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
        	await utils.shouldThrow(contractInstance.changeName(0, "Protest The Hero New Name", {from: newCreator}));
         })
        it("should not allow change of symbol", async () => {
        	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
        	await utils.shouldThrow(contractInstance.changeSymbol(0, "PTH5NEW", {from: newCreator}));
         })
        it("should not allow change of description", async () => {
        	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
        	await utils.shouldThrow(contractInstance.changeDescription(0, "This token will help us fund our next tour.", {from: newCreator}));
         })
    })
})