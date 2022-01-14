// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

interface IERC721 {
	//function approve(address _approved, uint256 _tokenId) external;
	function ownerOf(uint256 _tokenId) external returns (address);
	function safeTransferFrom(address _from, address _to, uint256 _tokenId) external payable;
}
interface CryptopunkInterface {
	function transferPunk(address _to, uint _tokenId) external;
}

/// @title A contract enabling bidders to bid on any NFT in a given collection, and holders to sell any NFT from that collection into such a bid
/// @author Kamil Alizai Sadik
contract LiquidityFactory is Ownable {

	// Set owner wallet as payable
	address payable OWNER = payable(owner());
	// Percentage platform fee paid by the seller, in basis points
	uint256 public platformFee = 200;

	// Event that fires when a new bid is submitted
	event NewBid(address indexed bidderAddress, address indexed nftAddress, uint weiPriceEach, uint quantity, uint tokenId);
	// Event that fires when a bid is canceled
	event BidCanceled(address indexed bidderAddress, address indexed nftAddress, uint weiPriceEach, uint quantity, uint tokenId);
	// Event that fires when a bid is hit
	event NewTrade(address indexed bidderAddress, address indexed sellerAddress, address indexed nftAddress, uint weiPriceEach, uint quantity, uint tokenId);

	// Struct containing Bid attributes
	struct Bid {
		uint256 weiPriceEach;
		uint256 quantity;
	}

	// Array of all bids (bidder => NFT collection address => Bid {weiPriceEach, quantity})
	mapping(address => mapping(address => Bid)) bids;

	/// @dev Creates a new bid
	/// @param _nftAddress Address of desired NFT collection
	/// @param _quantity Quantity of desired NFT
	function submitBid(address _nftAddress, uint _quantity) external payable {
		// Initialize bid
		Bid memory bid = bids[msg.sender][_nftAddress];
		// Require that bidder does not already have a bid on this collection
		require(bid.quantity == 0, "Cancel existing bid before placing a new one.");
		// Require that message value is > 0
		require (msg.value > 0, "Bid value must exceed 0 ETH.");
		// Compute value of each bid, in wei
		uint256 weiPriceEach = uint256(msg.value) / _quantity;
		// Update bids mapping
		bids[msg.sender][_nftAddress].weiPriceEach = weiPriceEach;
		bids[msg.sender][_nftAddress].quantity = _quantity;
		// Emit bid creation event
		emit NewBid(msg.sender, _nftAddress, weiPriceEach, _quantity, 0);
	}

	/// @dev Cancels a bid
	/// @param _nftAddress Address of NFT collection for which bid is being canceled
	function cancelBid(address _nftAddress) external {
		// Initialize bid
		Bid memory bid = bids[msg.sender][_nftAddress];
		// Compute refund
		uint256 refund = bid.weiPriceEach * bid.quantity;
		// Require that bidder is due a refund
		require(refund != 0, "You have no live bids for this collection.");
		// Delete bid
		delete bids[msg.sender][_nftAddress];
		// Refund bidder
		sendValue(payable(msg.sender), refund);
		// Emit bid cancelation event
		emit BidCanceled(msg.sender, _nftAddress, bid.weiPriceEach, bid.quantity, 0);
	}

	/// @dev Sells NFT into a bid (i.e., "hits" the bid)
	/// @param _bidderAddress Address of the bidder
	/// @param _nftAddress Address of collection to which the bid applies
	/// @param _tokenId Token id of the NFT in question
	/// @param _expectedWeiPriceEach Price (in wei) that seller expects to receive for each NFT
	/// @return Proceeds remitted to seller
	function hitBid(address _bidderAddress, address _nftAddress, uint256 _tokenId, uint256 _expectedWeiPriceEach) public returns (uint256) {
		console.log("msg.sender of hitBid: ", msg.sender);
		// Initialize bid
		Bid memory bid = bids[_bidderAddress][_nftAddress];
		// Require that bid exists
		require(bid.quantity > 0, "This bid does not exist.");
		// Require that bid amount is at least what the seller expects
		require(bid.weiPriceEach >= _expectedWeiPriceEach, "Bid is insufficient.");
		// Decrement bidder's bid quantity for this collection
		bids[_bidderAddress][_nftAddress].quantity = bid.quantity - 1;
		// Compute platform fee proceeds
		uint256 platformFeeProceeds = bid.weiPriceEach * platformFee / 10000;
		// Remit platform fee proceeds to owner
		sendValue(OWNER, platformFeeProceeds);
		// Transfer NFT to bidder
		// Check whether _nftAddress is Cryptopunks address
		if (_nftAddress == 0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB) {
			CryptopunkInterface(_nftAddress).transferPunk(_bidderAddress, _tokenId);
		} else {
			console.log("ownerOf NFT being sold: ", IERC721(_nftAddress).ownerOf(_tokenId));
			IERC721(_nftAddress).safeTransferFrom(msg.sender, _bidderAddress, _tokenId);
		}
		// Compute seller proceeds
		uint256 sellerProceeds = bid.weiPriceEach - platformFeeProceeds;
		// Remit seller proceeds to seller
		sendValue(payable(msg.sender), sellerProceeds);
		// Emit new trade event
		emit NewTrade(_bidderAddress, msg.sender, _nftAddress, bid.weiPriceEach, 1, _tokenId);
		// Return seller proceeds
		return sellerProceeds;
	}

	/// @dev Sells multiple NFTs into multiple bids (i.e., "hits" multiple bids)
	/// @param _bidderAddresses Array of addresses of bidders
	/// @param _nftAddress Address of collection to which the bids apply
	/// @param _tokenIds Array of token ids of the NFTs in question
	/// @param _expectedWeiPriceEach Array of prices (in wei) that seller expects to receive for each NFT
	/// @return Array of proceeds remitted to seller for each sold NFT
	function hitMultipleBids(address[] memory _bidderAddresses, address _nftAddress, uint256[] memory _tokenIds, uint256[] memory _expectedWeiPriceEach) external returns (uint256[] memory){
		// Check that number of bids matches number of expected sales
		require(_bidderAddresses.length == _tokenIds.length && _tokenIds.length == _expectedWeiPriceEach.length, "Mismatching array lengths");
		// Initialize output array of sellerProceeds
		uint256[] memory output = new uint256[](_bidderAddresses.length);
		// Iteratively sell NFTs to bidder
		for (uint256 i = 0; i < _bidderAddresses.length; i++) {
			output[i] = hitBid(_bidderAddresses[i], _nftAddress, _tokenIds[i], _expectedWeiPriceEach[i]);
		}
		// Return array of seller proceeds
		return output;
	}

	/// @dev Allows owner to change platformFee
	/// @param _newPlatformFee New platform fee
	function changePlatformFee(uint _newPlatformFee) external onlyOwner {
		platformFee = _newPlatformFee;
	}

	/// @dev OpenZeppelin sendValue function
	/// @param recipient Address receiving funds
	/// @param amount Amount of funds being sent
	function sendValue(address payable recipient, uint256 amount) internal {
		require(address(this).balance >= amount, "Address: insufficient balance");
		(bool success, ) = recipient.call{ value: amount }("");
		require(success, "Address: unable to send value, recipient may have reverted");
	}

	/// @dev Getter function to display a single bid on front-end
	/// @param _bidderAddress Address of bidder
	/// @param _nftAddress Address of collection to which the bid applies
	/// @return Desired bid
	function getBid(address _bidderAddress, address _nftAddress) external view returns (Bid memory) {
		return bids[_bidderAddress][_nftAddress];
	}

	/// @dev Getter function to display multiple bids on front-end
	/// @param _bidderAddresses Array of bidders
	/// @param _nftAddresses Array of collections to which each bid (respectively) applies
	/// @return Array of desired bids
	function getBids(address[] memory _bidderAddresses, address[] memory _nftAddresses) external view returns (Bid[] memory) {
		Bid[] memory output = new Bid[](_bidderAddresses.length);
		for (uint i = 0; i < _bidderAddresses.length; i++) {
			output[i] = bids[_bidderAddresses[i]][_nftAddresses[i]];
		}
		return output;
	}

}