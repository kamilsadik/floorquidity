// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./creatortokenownership.sol";

/// @title Formulas representing the buy and sale price functions, as well as helper functions to efficiently calculate area under the curve
/// @author Kamil Alizai Sadik
contract CreatorTokenFormulas is CreatorTokenOwnership {

	constructor(string memory uri) CreatorTokenOwnership(uri) { }

	/// @dev Calculates area under buy price function
	/// @param _startingSupply Supply of token in circulation before the transaction
	/// @param _amount Amount of token being purchased
	/// @param _mNumerator Numerator of the slope of the buy price function
	/// @param _mDenominator Denominator of the slope of the buy price function
	/// @return Area under buy price function denoting total proceeds required to buy _amount tokens (before fees)
	function _buyFunction(uint _startingSupply, uint _amount, uint _mNumerator, uint _mDenominator) internal pure returns (uint256) {
		// b(x) = m*x
		uint endSupply = _startingSupply + _amount;
		uint base1 = _mNumerator*_startingSupply/_mDenominator;
		uint base2 = _mNumerator*endSupply/_mDenominator;
		uint height = endSupply-_startingSupply;
		uint area = (base1 + base2) * height / 2;
		return area;
	}

	/// @dev Calculates area under sale price function
	/// @param _startingSupply Supply of token in circulation before the transaction
	/// @param _amount Amount of token being transacted
	/// @param _mNumerator Numerator of the slope of the buy price function
	/// @param _mDenominator Denominator of the slope of the buy price function
	/// @param _maxSupply Peak level of supply of the token to date
	/// @param _profitMargin percentage of total revenue generated routed to creator
	/// @return Area under sale price function denoting total proceeds received when selling _amount tokens (before fees)
	function _saleFunction(uint _startingSupply, uint _amount, uint _mNumerator, uint _mDenominator, uint _maxSupply, uint _profitMargin) public pure returns (uint256) {
		// Calculate breakpoint and endSupply
		(uint a, uint b, uint endSupply) = _breakpoint(_startingSupply, _amount, _mNumerator, _mDenominator, _maxSupply, _profitMargin);
		// Initialize area under curve
		uint area = 0;
		// Check where _startingSupply is relative to the breakpoint
		if (_startingSupply < a) {
			// Just need trapezoidal area of partial entirely left of the breakpoint
			area = _leftArea(a, b, _startingSupply, endSupply);
		} else if (endSupply < a) {
			// Scenario in which _startingSupply >= a, and endSupply < a
			// There, need trapezoidal area of components both to right and left of breakpoint
			area = _bothArea(a, b, _startingSupply, endSupply, _mNumerator, _mDenominator, _maxSupply);
		} else {
			// Scenario in which entire sale occurs to right of breakpoint
			// Just need trapezoidal area of partial entirely right of the breakpoint
			area = _rightArea(a, b, _startingSupply, endSupply, _mNumerator, _mDenominator, _maxSupply);
		}
		return area;
	}

	/// @dev Calculates breakpoint and other key inputs into _saleFunction
	/// @param _startingSupply Supply of token in circulation before the transaction
	/// @param _amount Amount of token being transacted
	/// @param _mNumerator Numerator of the slope of the buy price function
	/// @param _mDenominator Denominator of the slope of the buy price function
	/// @param _maxSupply Peak level of supply of the token to date
	/// @param _profitMargin percentage of total revenue generated routed to creator
	/// @return x-coordinate of breakpoint, y-coordinate of breakpoint, supply of token after the transaction
	function _breakpoint(uint _startingSupply, uint _amount, uint _mNumerator, uint _mDenominator, uint _maxSupply, uint _profitMargin) internal pure returns (uint, uint, uint) {
		// Define breakpoint (a,b) chosen s.t. area under sale price function is (1-profitMargin) times area under buy price function
		uint a = _maxSupply/2;
		uint b = _maxSupply*(50-_profitMargin)/100*_mNumerator/_mDenominator;
		uint endSupply = _startingSupply - _amount;
		return (a, b, endSupply);
	}

	/// @dev Computes _saleFunction scenario in which entire transaction occurs left of breakpoint
	/// @param _a x-coordinate of breakpoint
	/// @param _b y-coordinate of breakpoint
	/// @param _startingSupply Supply of token in circulation before the transaction
	/// @param _endSupply Supply of token in circulation after the transaction
	/// @return Area under the sale price function in this scenario
	function _leftArea(uint _a, uint _b, uint _startingSupply, uint _endSupply) internal pure returns (uint256) {
			//uint base1 = ((_b/_a)*(_a-_endSupply)+_b);
			//uint base1 = ((_b/_a)*(_endSupply-_a)+_b);
			uint base1 = (_b-(_b/_a)*(_a-_endSupply));
			//uint base2 = ((_b/_a)*(_a-_startingSupply)+_b);
			//uint base2 = ((_b/_a)*(_startingSupply-_a)+_b);
			uint base2 = (_b-(_b/_a)*(_a-_startingSupply));
			uint height = _startingSupply-_endSupply;
			return (base1 + base2) * height / 2;
	}

	/// @dev Computes _saleFunction scenario in which transaction crosses breakpoint
	/// @param _a x-coordinate of breakpoint
	/// @param _b y-coordinate of breakpoint
	/// @param _startingSupply Supply of token in circulation before the transaction
	/// @param _endSupply Supply of token in circulation after the transaction
	/// @param _mNumerator Numerator of the slope of the buy price function
	/// @param _mDenominator Denominator of the slope of the buy price function
	/// @param _maxSupply Peak level of supply of the token to date
	/// @return Area under the sale price function in this scenario
	function _bothArea(uint _a, uint _b, uint _startingSupply, uint _endSupply, uint _mNumerator, uint _mDenominator, uint _maxSupply) internal pure returns (uint256) {
		//uint leftBase1 = ((_b/_a)*(_a-_endSupply)+_b);
		//uint leftBase1 = ((_b/_a)*(_endSupply-_a)+_b);
		uint leftBase1 = (_b-(_b/_a)*(_a-_endSupply));
		uint sharedBase = _b;
		uint leftHeight = _a-_endSupply;
		uint leftArea = (leftBase1 + sharedBase) * leftHeight / 2;
		uint rightBase2 = (_mNumerator*_maxSupply/_mDenominator-_b)/(_maxSupply-_a)*(_startingSupply-_a)+_b;
		uint rightHeight = _startingSupply-_a;
		uint rightArea = (sharedBase + rightBase2) * rightHeight / 2;
		return leftArea + rightArea;
	}

	/// @dev Computes _saleFunction scneario in which entire transaction occurs right of breakpoint
	/// @param _a x-coordinate of breakpoint
	/// @param _b y-coordinate of breakpoint
	/// @param _startingSupply Supply of token in circulation before the transaction
	/// @param _endSupply Supply of token in circulation after the transaction
	/// @param _mNumerator Numerator of the slope of the buy price function
	/// @param _mDenominator Denominator of the slope of the buy price function
	/// @param _maxSupply Peak level of supply of the token to date
	/// @return Area under the sale price function in this scenario
	function _rightArea(uint _a, uint _b, uint _startingSupply, uint _endSupply, uint _mNumerator, uint _mDenominator, uint _maxSupply) internal pure returns (uint256) {
		uint base1 = (((_mNumerator*_maxSupply/_mDenominator-_b)/(_maxSupply-_a))*(_endSupply-_a)+_b);
		uint base2 = (((_mNumerator*_maxSupply/_mDenominator-_b)/(_maxSupply-_a))*(_startingSupply-_a)+_b);
		uint height = _startingSupply-_endSupply;
		return (base1 + base2) * height / 2;
	}
}