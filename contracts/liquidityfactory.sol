// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";

/// @title A contract creating a mechanism by which to bid on any NFT in a given collection
/// @author Kamil Alizai Sadik
contract LiquidityFactory is Ownable, IERC721Receiver {

	// Event that fires when a new bid is submitted
	event NewBid(address payable bidderAddress, string collectionName, uint bidAmount, uint bidId, bool bidStatus);
	// Event that fires when a bid is canceled
	event BidCanceled(address payable bidderAddress, string collectionName, uint bidAmount, uint bidId, bool bidStatus);
	// Event that fires when a bid is hit
	event NewTrade(address payable sellerAddress, address payable buyerAddress, uint bidAmount, uint tokenId);

	// Percentage platform fee paid by the seller (i.e., seller receives proceeds equal to bid*(1 - platformFee/100)
	uint public platformFee = 2;

	// Struct containing Bid attributes
	struct Bid {
		address payable bidderAddress;
		string collectionName;
		uint bidAmount;
		uint bidId;
		bool bidStatus;
	}

	// Array of all bids
	Bid[] public bids;

	// Mapping from collections to bids on that collection
	//mapping (address => Bid[]) public collectionsToBids;

	/// @dev Creates a new bid
	/// @param _bidderAddress Address of the bidder
	/// @param _collectionName Name of the NFT collection to which the bid applies
	/// @param _bidAmount Amount of bid in ETH
	function submitBid(address payable _bidderAddress, address _collectionName, uint memory _bidAmount) public {
		// Require that bidding address is sender
		require(msg.sender == _bidderAddress);
		// Reequire that message value is equal to _bidAmount
		require (msg.value == _bidAmount);
		// Create bid id
		uint id = bids.length;
		// Add bid to bids array
		bids.push(Bid(_bidderAddress, _collectionName, _bidAmount, id, true));
		// Add bid to collectionsToBids mapping

		// Emit bid creation event
		emit NewBid(_bidderAddress, _collectionName, _bidAmount, id, true);
	}

	/// @dev Cancels a bid
	/// @param _bidder Address Address of the bidder
	/// @param _bidId Id of the bid being canceled
	function cancelBid(address payable _bidderAddress, uint _bidId) public {
		// Require that bidding address is sender
		require(msg.sender == _bidderAddress);
		// Set bidStatus to false
		bids[_bidId].bidStatus = false;
		// Refund bidder
		_bidderAddress.transfer(bids[_bidId].bidAmount);
		// Emit bid cancelation event
		emit BidCanceled(_bidderAddress, bids[_bidId].collectionName, bids[_bidId].bidAmount, bids[_bidId].bidId, false);
	}

	/// @dev Sells an NFT into a bid (i.e., "hits" the bid)
	/// @param _sellerAddress Address of the seller
	/// @param _bidId Bid id of the bid being sold into
	/// @param _tokenId Token id of the NFT in question
	function hitBid(address payable _sellerAddress, uint _bidId, uint _tokenId) public {
		// Require that _sellerAddress is sender
		require(msg.sender == _sellerAddress);
		// Require that bidStatus of _bidId bid is true
		require(bids[_bidId].bidStatus == true);
		// Require that the NFT is in the collection to which the bid applies
		require(name(_tokenId) == bids[_bidId].name(_tokenId));
		// Transfer NFT from seller address to buyer address
		transferFrom(_sellerAddress, bids[_bidId].bidderAddress, _tokenId);
		// Calculate net proceeds that seller is owed after accounting for the platform fee
		uint netProceeds = bids[_bidId].bidAmount*(1-platformFee)/100;
		// Transfer net proceeds to seller address
		_sellerAddress.transfer(netProceeds);
		// Transfer platform fee to owner
		owner().transfer(bids[_bidId].bidAmount - netProceeds));
		// Set bidStatus of buyer's bid to false
		bids[_bidId].bitStatus == false;
		// Emit new trade event
		emit NewTrade(_sellerAddress, bids[_bidId].bidderAddress, bids[_bidId].bidAmount, _tokenId);
	}
}