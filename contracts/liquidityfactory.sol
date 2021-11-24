// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

abstract contract ERC721Interface {
  function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public virtual;
  function balanceOf(address owner) public virtual view returns (uint256 balance) ;
}

/// @title A contract creating a mechanism by which to bid on any NFT in a given collection
/// @author Kamil Alizai Sadik
contract LiquidityFactory is Ownable, IERC721Receiver {

	// Event that fires when a new bid is submitted
	event NewBid(address payable bidderAddress, address collectionAddress, uint bidAmount, uint bidId, bool bidStatus);
	// Event that fires when a bid is canceled
	event BidCanceled(address payable bidderAddress, address collectionAddress, uint bidAmount, uint bidId, bool bidStatus);
	// Event that fires when a bid is hit
	event NewTrade();

	// Percentage platform fee paid by the seller (i.e., seller receives proceeds equal to bid*(1 - platformFee/100)
	uint public platformFee = 2;
	// Variable to track total platform fees generated
	uint public totalPlatformFees = 0;

	// Struct containing Bid attributes
	struct Bid {
		address payable bidderAddress;
		address collectionAddress;
		uint bidAmount;
		uint bidId;
		bool bidStatus;
	}

	// Array of all bids
	Bid[] public bids;

	/// @dev Creates a new bid
	/// @param _bidderAddress Address of the bidder
	/// @param _collectionAddress Contract address of the NFT collection to which the bid applies
	/// @param _bidAmount Amount of bid in ETH
	function submitBid(address payable _bidderAddress, address _collectionAddress, uint memory _bidAmount) public {
		// Require that bidding address is sender
		require(msg.sender == _bidderAddress);
		// Reequire that message value is equal to _bidAmount
		require (msg.value == _bidAmount);
		// Create bid id
		uint id = bids.length;
		// Add bid to bids array
		bids.push(Bid(_bidderAddress, _collectionAddress, _bidAmount, id, true));
		// Emit bid creation event
		emit NewBid(_bidderAddress, _collectionAddress, _bidAmount, id, true);
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
		emit BidCanceled(_bidderAddress, _collectionAddress, _bidAmount, id, false);
	}

	/// @dev Sells an NFT into a bid (i.e., "hits" the bid)
	/// @param _sellerAddress Address of the seller
	/// @param _bidId Bid id of the bid being sold into
	function hitBid(address payable _sellerAddress, uint _bidId) public {
		// Require that _sellerAddress is sender
		require(msg.sender == _sellerAddress);
		// Transfer NFT from seller address to buyer address
		ERC721Interface(nftsOne[_swapId][i].dapp).safeTransferFrom(address(this), swapList[_swapCreator][swapMatch[_swapId]].addressTwo, nftsOne[_swapId][i].tokenId[0], nftsOne[_swapId][i].data);
		// Calculate net proceeds that seller is owed after accounting for the platform fee
		uint netProceeds = bids[_bidId].bidAmount*(1-platformFee)/100;
		// Transfer proceeds to seller address
		_sellerAddress.transfer(netProceeds);
		// Set bidstatus of buyer's bid to false

	}


	// UPDATE COLLECTIONS MAPPING OWNABLE FUNCTION (perhaps do this in a separate contract)


	// ADD COLLECTIONS OWNABLE FUNCTION


	// Add platform fee updater

}