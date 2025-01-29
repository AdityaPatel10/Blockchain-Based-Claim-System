async function main() {
  const ClaimSystem = await ethers.getContractFactory("ClaimSystem");
  console.log("Deploying ClaimSystem...");
  const claimSystem = await ClaimSystem.deploy(); // Deploy the contract
  await claimSystem.waitForDeployment(); // Use waitForDeployment instead of deployed()

  // Get the contract address using getAddress()
  const claimSystemAddress = await claimSystem.getAddress();
  console.log("ClaimSystem deployed to:", claimSystemAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error during deployment:", error);
    process.exit(1);
  });
