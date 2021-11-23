// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./creatortokenhelper.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

/// @title Contract inheriting from the ERC1155 standard
/// @author Kamil Alizai Sadik
contract CreatorTokenOwnership is CreatorTokenHelper, ERC1155 {

	constructor(string memory uri) ERC1155(uri) { }

	/// @dev Increases holdership stats of a given token
	/// @param _account Wallet address whose holdership is being updated
	/// @param _id ID of the token whose holdership is being updated
	/// @param _amount Amount of the change in token holdership
	function mappingIncrease(address _account, uint256 _id, uint256 _amount) internal {
		tokenHoldership[_id][_account] += _amount;
		userToHoldings[_account][_id] += _amount;
	}

	/// @dev Decreases holdership stats of a given token
	/// @param _account Wallet address whose holdership is being updated
	/// @param _id ID of the token whose holdership is being updated
	/// @param _amount Amount of the change in token holdership
	function mappingDecrease(address _account, uint256 _id, uint256 _amount) internal {
		tokenHoldership[_id][_account] -= _amount;
		userToHoldings[_account][_id] -= _amount;
	}

	/// @dev Mints a token
	/// @param _to Wallet address the newly minted token is assigned to
	/// @param _id ID of the newly minted token
	/// @param _amount Quantity of token to be minted
	/// @param _data Data
	function _mint(address _to, uint256 _id, uint256 _amount, bytes memory _data) internal override {
		//require(hasRole(MINTER_ROLE, msg.sender));
		// Update tokenHoldership mapping
		mappingIncrease(_to, _id, _amount);
		// Increase token amount outstanding
		creatorTokens[_id].outstanding += _amount;
		// Emit single transfer event
		emit TransferSingle(msg.sender, address(0), _to, _id, _amount);
	}

	/// @dev Mints a batch of tokens
	/// @param _to Wallet address the newly minted token is assigned to
	/// @param _ids Array of IDs of tokens to be minted
	/// @param _amounts Array of quantities of tokens to be minted
	/// @param _data Data
	function _mintBatch(address _to, uint256[] memory _ids, uint256[] memory _amounts, bytes memory _data) internal override {
		//require(hasRole(MINTER_ROLE, msg.sender));
		// Iterate through _ids
		for (uint256 i=0; i<_ids.length; i++) {
			// Update tokenHoldership mapping
			mappingIncrease(_to, _ids[i], _amounts[i]);
			// Increase token amount outstanding
			creatorTokens[_ids[i]].outstanding += _amounts[i];
		}
		// Emit batch transfer event
		emit TransferBatch(msg.sender, address(0), _to, _ids, _amounts);
	}

	/// @dev Burns a token
	/// @param _account Account whose tokens are being burned
	/// @param _id ID of the token being burned
	/// @param _amount Quantity of the token to be burned
	function _burn(address _account, uint256 _id, uint256 _amount) internal override {
		require(msg.sender == _account);
		// Update tokenHoldership mapping
		mappingDecrease(_account, _id, _amount);
		// Decrease token amount outstanding
		creatorTokens[_id].outstanding -= _amount;
		// Emit single transfer event
		emit TransferSingle(msg.sender, _account, address(0), _id, _amount);
	}

	/// @dev Burns a batch of tokens
	/// @param _account Account whose tokens are being burned
	/// @param _ids Array of IDs of the tokens being burned
	/// @param _amounts Array of quantities of the tokens to be burned
	function _burnBatch(address _account, uint256[] memory _ids, uint256[] memory _amounts) internal override {
		require(msg.sender == _account);
		// Iterate through _ids
		for (uint256 i=0; i<_ids.length; i++) {
			// Update tokenHoldership mapping
			mappingDecrease(_account, _ids[i], _amounts[i]);
			// Decrease token amount outstanding
			creatorTokens[_ids[i]].outstanding -= _amounts[i];
		}
		// Emit batch transfer event
		emit TransferBatch(msg.sender, _account, address(0), _ids, _amounts);
	}

	/// @dev Transfers a token
	/// @param _from Address token is being transferred from
	/// @param _to Address token is being transferred to
	/// @param _id ID of token being transferred
	/// @param _amount Quantity of token to be transferred
	/// @param _data Data
	function safeTransferFrom(address _from, address _to, uint256 _id, uint256 _amount, bytes memory _data) public override {
		// Require that msg.sender == _from, or that approvals[_from][_to] == true
		require(msg.sender == _from || isApprovedForAll(_from, _to));
		// Reduce tokenHoldership holdings of _from
		mappingDecrease(_from, _id, _amount);
		// Increase tokenHoldership holdings of _to
		mappingIncrease(_to, _id, _amount);
		// Emit single transfer event
		emit TransferSingle(msg.sender, _from, _to, _id, _amount);
	}

	/// @dev Transfers a batch of tokens
	/// @param _from Address token is being transferred from
	/// @param _to Address token is being transferred to
	/// @param _ids Array of IDs of tokens being transferred
	/// @param _amounts Array of quantities of token to be transferred
	/// @param _data Data
	function safeBatchTransferFrom(address _from, address _to, uint256[] memory _ids, uint256[] memory _amounts, bytes memory _data) public override {
		// Iterate through _ids
		for (uint256 i=0; i<_ids.length; i++) {
			// Require that msg.sender == _from, or that approvals[_from][_to] == true
			require(msg.sender == _from || isApprovedForAll(_from, _to));
			// Reduce tokenHoldership holdings of _from
			mappingDecrease(_from, _ids[i], _amounts[i]);
			// Increase tokenHoldership holdings of _to
			mappingIncrease(_to, _ids[i], _amounts[i]);
		}
		// Emit batch transfer event
		emit TransferBatch(msg.sender, _from, _to, _ids, _amounts);
	}

	/// @dev Gives operator permission to transfer caller's tokens
	/// @param _operator Wallet address being granted permission
	/// @param _approved Boolean value indicating whether operator is approved
	function setApprovalForAll(address _operator, bool _approved) public override {
		// Update approvals mapping
		approvals[msg.sender][_operator] = _approved;
		// Emit Approval event
		emit ApprovalForAll(msg.sender, _operator, _approved);
	}

	/// @dev Denotes whether operator is approved to transfer account's tokens
	/// @param _account Wallet address holding tokens
	/// @param _operator Wallet address which is/isn't approved to transfer _account's tokens
	/// @return Boolean value indicating approval status
	function isApprovedForAll(address _account, address _operator) public view override returns (bool) {
		// Look up approvals mapping
		return approvals[_account][_operator];
	}

	/// @dev Returns balance of a given token at a given address. Commented this out since this info is visible in tokenHoldership and userToHoldings mappings.
	/// @param _account Account in question
	/// @param _id ID of token whose balance we wish to find
	/// @return Quantity of token _id in _account
	//function balanceOf(address _account, uint256 _id) public view override returns (uint256) {
		// Look up _account's holdings of _id in tokenHoldership
	//	return tokenHoldership[_id][_account];
	//}

	/// @dev Returns balance of a batch of tokens. Commented this out since this info is visible in tokenHoldership and userToHoldings mappings.
	/// @param _accounts Array of accounts in question
	/// @param _ids Array of IDs of token whose balances we wish to find
	/// @return Array of quantities of tokens _ids in _accounts
	//function balanceOfBatch(address[] calldata _accounts, uint256[] calldata _ids) public view override returns (uint256[] memory) {
	//	// Initialize output array
	//	uint256[] memory batchBalances = new uint256[](_accounts.length);
	//	// Iterate through _accounts
	//	for (uint256 i = 0; i < _accounts.length; i++) {
	//		// Look up _account's holdings of _id in tokenHoldership
	//		batchBalances[i] = tokenHoldership[_ids[i]][_accounts[i]];
	//	}
	//	// Return output array
	//	return batchBalances;
	//}
}