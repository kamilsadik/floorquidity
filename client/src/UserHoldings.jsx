import React from "react";
// These imports are needed to implement Web3, and to connect the React client to the Ethereum server
import Web3 from './web3';
import { ABI } from './ABI';
import { contractAddr } from './Address';

const web3 = new Web3(Web3.givenProvider);
// Contract address is provided by Truffle migration
const ContractInstance = new web3.eth.Contract(ABI, contractAddr);

async function handleCreatorTokenCount() {
	const creatorTokenCount = await ContractInstance.methods.getCreatorTokenCount().call();
	console.log(creatorTokenCount);
	return(creatorTokenCount)
}

async function handleUserHoldingMapping(qty) {
	// Initialize empty array of Creator Tokens
	let userHoldings = [];
	const accounts = await window.ethereum.enable();
	const account = accounts[0];
	for (let i=0; i<qty; i++) {
		const holdings = await ContractInstance.methods.userToHoldings(account, i).call();
		userHoldings.push(holdings);
	}
	return(userHoldings);
}

async function handleUserHoldings(){
	return(await handleUserHoldingMapping(await handleCreatorTokenCount()));
}

const UserHoldings = () => {
	return (
		null
	);
};

const userHoldings = handleUserHoldings();

export default UserHoldings;
export { userHoldings };