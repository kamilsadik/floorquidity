async function main() {
  // We get the contract to deploy
  const LiquidityFactory = await ethers.getContractFactory("LiquidityFactory");
  const liquidityFactory = await LiquidityFactory.deploy();

  console.log("LiquidityFactory deployed to:", liquidityFactory.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });