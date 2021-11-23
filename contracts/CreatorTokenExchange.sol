// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./creatortokencomputation.sol";

/// @title Implements high-level buy and sell functions (which users invoke when transacting)
/// @author Kamil Alizai Sadik
contract CreatorTokenExchange is CreatorTokenComputation {

	constructor(string memory uri) CreatorTokenComputation(uri) { }

	// Event that fires when a new transaction occurs
	event NewTransaction(address indexed account, uint amount, uint price, string transactionType, uint tokenId, string name, string symbol);

	/// @dev Allows user to buy a given CreatorToken from the platform
	/// @param _tokenId ID of the token being transacted
	/// @param _amount Quantity of the token being transacted
	function buyCreatorToken(uint _tokenId, uint _amount) external payable {
		// Compute total transaction proceeds required (inclusive of fee)
		uint totalProceeds = _totalProceeds(_tokenId, _amount);
		// Require that user sends totalProceeds in order to transact
		require(msg.value == totalProceeds);
		// Compute buy proceeds
		uint netProceeds = _buyProceeds(_tokenId, _amount);
		// Update totalValueLocked mapping
		totalValueLocked[_tokenId] += netProceeds;
		// Update platform fee total
		_platformFeeUpdater(_feeProceeds(netProceeds));
		// Mint _amount tokens at the user's address (note this increases token amount outstanding)
		_mint(msg.sender, _tokenId, _amount, "");
		// Update lastPrice at which token has traded
		creatorTokens[_tokenId].lastPrice = netProceeds/_amount;
		// Emit new transaction event
		emit NewTransaction(msg.sender, _amount, creatorTokens[_tokenId].lastPrice, "buy", _tokenId, creatorTokens[_tokenId].name, creatorTokens[_tokenId].symbol);
		// Check if new outstanding amount of token is greater than maxSupply
		if (creatorTokens[_tokenId].outstanding > creatorTokens[_tokenId].maxSupply) {
			// Update maxSupply
			creatorTokens[_tokenId].maxSupply = creatorTokens[_tokenId].outstanding;
			// Call _payout to transfer excess liquidity
			_payCreator(_tokenId, creatorTokens[_tokenId].creatorAddress);
		}
	}

	/// @dev Allows user to sell a given CreatorToken back to the platform
	/// @param _tokenId ID of the token being transacted
	/// @param _amount Quantity of the token being transacted
	/// @param _seller Wallet address of user selling the token
	function sellCreatorToken(uint _tokenId, uint _amount, address payable _seller) external payable {
		// Require that user calling function is selling own tokens
		require(_seller == msg.sender);
		// Compute sale proceeds required
		uint proceedsRequired = _saleFunction(creatorTokens[_tokenId].outstanding, _amount, mNumerator, mDenominator, creatorTokens[_tokenId].maxSupply, profitMargin);
		// Update totalValueLocked mapping
		totalValueLocked[_tokenId] -= proceedsRequired;
		// Update lastPrice at which token has traded
		creatorTokens[_tokenId].lastPrice = proceedsRequired/_amount;
		// Compute fee
		uint fee = proceedsRequired*platformFee/100;
		// Add platform fee to obtain real proceedsRequired value
		proceedsRequired -= fee;
		// Burn _amount tokens from user's address (note this decreases token amount outstanding)
		_burn(_seller, _tokenId, _amount);
		// Send user proceedsRequired wei (less the platform fee) in exchange for the burned tokens
		_seller.transfer(proceedsRequired); //1500000000000000000); //
		// Update platform fee total
		_platformFeeUpdater(fee);
		// Emit new transaction event
		emit NewTransaction(msg.sender, _amount, creatorTokens[_tokenId].lastPrice, "sell", _tokenId, creatorTokens[_tokenId].name, creatorTokens[_tokenId].symbol);
	}
}
