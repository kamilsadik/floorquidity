// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./liquidityfactory.sol";

/// @title A contract with helper functions for use by the protocol owner
/// @author Kamil Alizai Sadik
contract LiquidityHelper is LiquidityFactory {

	/// @dev Allows owner to change platformFee
	/// @param _newPlatformFee New platform fee
	function changePlatformFee(uint _newPlatformFee) external onlyOwner {
		platformFee = _newPlatformFee;
	}
}