import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const Echo = await ethers.getContractFactory("Echo");
  const echo = await Echo.deploy();

  await echo.deployed();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());
  console.log("Echo deployed to:", echo.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
