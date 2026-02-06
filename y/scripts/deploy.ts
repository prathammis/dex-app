import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with:", deployer.address);

  // Deploy Token A
  const Token = await ethers.getContractFactory("TestToken");

  const tokenA = await Token.deploy(
    "Token A",
    "TKA",
    ethers.parseEther("1000000")
  );
  await tokenA.waitForDeployment();

  const tokenB = await Token.deploy(
    "Token B",
    "TKB",
    ethers.parseEther("1000000")
  );
  await tokenB.waitForDeployment();

  console.log("Token A deployed to:", await tokenA.getAddress());
  console.log("Token B deployed to:", await tokenB.getAddress());

  // Deploy DEX
  const DEX = await ethers.getContractFactory("SimpleDEX");
  const dex = await DEX.deploy(
    await tokenA.getAddress(),
    await tokenB.getAddress()
  );
  await dex.waitForDeployment();

  console.log("DEX deployed to:", await dex.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
