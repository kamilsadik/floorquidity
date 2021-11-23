// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title A contract generating Creator Tokens, as well as relevant attributes and mappings
/// @author Kamil Alizai Sadik
contract CreatorTokenFactory is Ownable {

	// Event that fires whenever a new CreatorToken is created
	event NewCreatorToken(uint tokenId, address payable creatorAddress, string name, string symbol, string description, bool verified, uint outstanding, uint maxSupply);

	// Pay-on-top style platform fee on each transaction
	uint platformFee = 1; // e.g., if platformFee == 1, the platform earns 1% of each transaction's value
	// Variable to track total platform fees generated
	uint public totalPlatformFees = 0;
	// Variable to track platform fees owed, but not yet paid to owner
	uint public platformFeesOwed = 0;
	// Variable to track number of unique creator tokens
	uint public numCreatorTokens = 0;

	// Profit margin (percentage of total revenue) directed toward creator
	uint profitMargin = 20;

	// Slope of buy price function
	uint mNumerator = 9000000000000;
	uint mDenominator = 185;

	// Struct containing CreatorToken attributes
	struct CreatorToken {
		address payable creatorAddress;
		string name;
		string symbol;
		string description;
		bool verified;
		uint outstanding;
		uint maxSupply;
		uint lastPrice;
		uint creatorTokenId;
	}

	// Array of all CreatorTokens
	CreatorToken[] public creatorTokens;

	// Mapping from tokenId to creatorAddress
	mapping (uint => address) public tokenToCreator;
	// Mapping from tokenId to token value transferred to creator
	mapping (uint => uint) public tokenValueTransferred;
	// Mapping from tokenId to mapping from address to quantity of tokenId held
	mapping(uint256 => mapping(address => uint256)) public tokenHoldership;
	// Mapping from user to mapping from tokenId to quantity of that token the user owns (to show a user's portfolio without having to iterate through tokenHoldership)
	mapping(address => mapping(uint256 => uint256)) public userToHoldings;
	// Mapping from account to operator approvals
	mapping(address => mapping(address => bool)) public approvals;
	// Mapping from token to total value locked
	mapping (uint => uint) public totalValueLocked;

	/// @dev Creates a new creator token
	/// @param _creatorAddress Address of the creator of the token
	/// @param _name Name chosen by the creator of the token
	/// @param _symbol Ticker symbol chosen by the creator of the token
	/// @param _description chosen by the creator of the tokens
	function createCreatorToken(address payable _creatorAddress, string memory _name, string memory _symbol, string memory _description) public {
		// Create token id
		uint id = creatorTokens.length;
		// Add token to creatorTokens array
		creatorTokens.push(CreatorToken(_creatorAddress, _name, _symbol, _description, false, 0, 0, 0, id));
		// Update number of creator tokens
		//numCreatorTokens = id+1;
		// Map from token id to creator's address
		tokenToCreator[id] = _creatorAddress;
		// Map from token id to amount of value transferred (0 at inception)
		tokenValueTransferred[id] = 0;
		// Emit token creation event
		emit NewCreatorToken(id, _creatorAddress, _name, _symbol, _description, false, 0, 0);
	}

	/// @dev Returns the current length of the creatorTokens array
	/// @return uint representing number of unique Creator Tokens
	function getCreatorTokenCount() external view returns (uint) {
		// Return length of creatorTokens array
		return creatorTokens.length;
	}
}