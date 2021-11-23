// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./creatortokenfees.sol";

/// @title Computes buy proceeds and total proceeds associated with a buy transaction
/// @author Kamil Alizai Sadik
contract CreatorTokenComputation is CreatorTokenFees {

	constructor(string memory uri) CreatorTokenFees(uri) { }

	/// @dev Calculates total transaction proceeds
	/// @param _tokenId ID of the token being transacted
	/// @param _amount Quantity of the token being transacted
	/// @return Total proceeds required in transaction
	function _totalProceeds(uint _tokenId, uint _amount) public view returns (uint256) {//, uint256, uint256) {//[3] memory) {
		// Compute proceedsRequired (ex-fees)
		uint proceedsRequired = _buyProceeds(_tokenId, _amount);
		// Compute feeRequired
		uint feeRequired = _feeProceeds(proceedsRequired);
		// Compute total proceeds required
		uint totalProceeds = proceedsRequired + feeRequired;
		return totalProceeds;
	}

	/// @dev Calculates proceeds required for a given buy transaction (not including fees)
	/// @param _tokenId ID of the token being transacted
	/// @param _amount Quantity of the token being transacted
	/// @return Proceeds required in the transaction (before fees)
	function _buyProceeds(uint _tokenId, uint _amount) public view returns (uint256) {
		// Initialize proceeds required;
		uint proceedsRequired = 0;
		// Initialize pre-transaction supply
		uint startingSupply = creatorTokens[_tokenId].outstanding;
		// Compute post-transaction supply
		uint endSupply = startingSupply + _amount;
		// Compute buy proceeds
		// Check if endSupply <= maxSupply
		if (endSupply < creatorTokens[_tokenId].maxSupply) {
			// Scenario in which entire transaction takes place below maxSupply
			// Just call s(x)
			//proceedsRequired = _saleFunction(startingSupply, _amount, mNumerator, mDenominator, creatorTokens[_tokenId].maxSupply, profitMargin);
			proceedsRequired = _saleFunction(endSupply, _amount, mNumerator, mDenominator, creatorTokens[_tokenId].maxSupply, profitMargin);
		} else if (startingSupply < creatorTokens[_tokenId].maxSupply){
			// Scenario in which supply begins below maxSupply and ends above pre-transaction maxSupply
			// Use s(x) from startingSupply to maxSupply
			proceedsRequired = _saleFunction(creatorTokens[_tokenId].maxSupply, creatorTokens[_tokenId].maxSupply - startingSupply, mNumerator, mDenominator, creatorTokens[_tokenId].maxSupply, profitMargin);
			// Use b(x) from maxSupply to endSupply
			proceedsRequired += _buyFunction(creatorTokens[_tokenId].maxSupply, _amount - (creatorTokens[_tokenId].maxSupply - startingSupply), mNumerator, mDenominator);
		} else {
			// Scenario in which transaction begins at maxSupply
			// Just call b(x)
			proceedsRequired = _buyFunction(startingSupply, _amount, mNumerator, mDenominator);
		}
		// Return proceeds required
		return proceedsRequired;
	}
}