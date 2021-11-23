// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./creatortokenformulas.sol";

/// @title Computation of fees owed to platform, and payout of creator
/// @author Kamil Alizai Sadik
contract CreatorTokenFees is CreatorTokenFormulas {

	constructor(string memory uri) CreatorTokenFormulas(uri) { }

	/// @dev Calculates the fee associated with a buy transaction
	/// @param _proceedsRequired The proceeds required for the buy transaction (before addition of fees)
	/// @return Fee associated with transaction
	function _feeProceeds(uint _proceedsRequired) public view returns (uint256) {
		return _proceedsRequired*platformFee/100;
	}

	/// @dev Updates platform fee tracker mappings
	/// @param _fee Fee being added to the tracker
	function _platformFeeUpdater(uint _fee) internal {
		totalPlatformFees += _fee;
		platformFeesOwed += _fee;
	}

	/// @dev Transfers excess liquidity to the creator (triggered only when a CreatorToken hits a new maxSupply)
	/// @param _tokenId ID of the token in question
	/// @param _creatorAddress Wallet address of the creator of the token
	function _payCreator(uint _tokenId, address payable _creatorAddress) internal {
		// Create a variable showing excess liquidity that has already been transferred out of this token's liquidity pool
		uint alreadyTransferred = tokenValueTransferred[_tokenId];
		// Initialize totalProfit
		uint totalProfit = 0;
		// Calculate totalProfit (area between b(x) and s(x) from 0 to maxSupply)
		totalProfit = _buyFunction(0, creatorTokens[_tokenId].maxSupply, mNumerator, mDenominator) - _saleFunction(creatorTokens[_tokenId].maxSupply, creatorTokens[_tokenId].maxSupply, mNumerator, mDenominator, creatorTokens[_tokenId].maxSupply, profitMargin);
		// Calculate creator's new profit created from new excess liquidity created
		uint newProfit = totalProfit - alreadyTransferred;
		// Transfer newProfit wei to creator
		_creatorAddress.transfer(newProfit);
		// Update amount of value transferred to creator
		tokenValueTransferred[_tokenId] = totalProfit;
	}
}