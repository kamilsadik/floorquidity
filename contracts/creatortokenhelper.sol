// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./creatortokenfactory.sol";

/// @title A contract with helper functions enabling Owner- and creator-specific functions
/// @author Kamil Alizai Sadik
contract CreatorTokenHelper is CreatorTokenFactory {

	/// @dev Modifier checking whether user is creator of the token
	/// @param _tokenId ID of the token in question
	modifier onlyCreatorOf(uint _tokenId) {
		require(msg.sender == tokenToCreator[_tokenId]);
		_;
	}

	/// @dev Ownable function allowing for withdrawal
	/// @param _owner Owner of the smart contract
	function withdraw(address payable _owner) external onlyOwner {
		_owner.transfer(address(this).balance);
	}

	/// @dev Pays out platform fees owed to owner (might opt to call this daily)
	/// @param _owner Owner of the smart contract
	function payoutPlatformFees(address payable _owner) external onlyOwner {
		_owner.transfer(platformFeesOwed);
		// Reset platformFeesOwed to zero after payout
		platformFeesOwed = 0;
	}

	/// @dev Allows owner to change platformFee
	/// @param _newPlatformFee New platform fee
	function changePlatformFee(uint _newPlatformFee) external onlyOwner {
		platformFee = _newPlatformFee;
	}

	/// @dev Allows owner to change profit_margin
	/// @param _newProfitMargin New profit margin
	function changeProfitMargin(uint _newProfitMargin) external onlyOwner {
		profitMargin = _newProfitMargin;
	}

	/// @dev Allows owner to verify (or undo verification) of a CreatorToken
	/// @param _tokenId ID of the token in question
	/// @param _verified Verification status of the token in question
	function changeVerification(uint _tokenId, bool _verified) external onlyOwner {
		creatorTokens[_tokenId].verified = _verified;
	}

	/// @dev Allows token creator to change their address
	/// @param _tokenId ID of the token in question
	/// @param _newCreatorAddress New creator address associated with the token
	function changeAddress(uint _tokenId, address payable _newCreatorAddress) external onlyCreatorOf(_tokenId) {
		creatorTokens[_tokenId].creatorAddress = _newCreatorAddress;
	}

	/// @dev Allows token creator to change the name of their token
	/// @param _tokenId ID of the token in question
	/// @param _newName New name associated with the token
	function changeName(uint _tokenId, string calldata _newName) external onlyCreatorOf(_tokenId) {
		creatorTokens[_tokenId].name = _newName;
	}

	/// @dev Allows token creator to change the symbol of their token
	/// @param _tokenId ID of the token in question
	/// @param _newSymbol New symbol associated with the token
	function changeSymbol(uint _tokenId, string calldata _newSymbol) external onlyCreatorOf(_tokenId) {
		creatorTokens[_tokenId].symbol = _newSymbol;
	}

	/// @dev Allows token creator to change the description of their token
	/// @param _tokenId ID of the token in question
	/// @param _newDescription New description associated with the token
	function changeDescription(uint _tokenId, string calldata _newDescription) external onlyCreatorOf(_tokenId) {
		creatorTokens[_tokenId].description = _newDescription;
	}
}