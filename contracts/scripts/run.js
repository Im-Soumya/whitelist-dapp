const main = async () => {
  const whitelistFactory = await hre.ethers.getContractFactory("Whitelist");
  const whitelistContract = await whitelistFactory.deploy(10);
  await whitelistContract.deployed();
  console.log("Contract deployed at: ", whitelistContract.address);

  const txn = await whitelistContract.addToWhitelist();
  await txn.wait();
  console.log("Added to whitelist", txn);
};

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
