import { ethers } from "ethers";
import { DEX_ADDRESS, TOKEN_A_ADDRESS, TOKEN_B_ADDRESS, loadABI } from "../config/contracts";

// Get ERC20 contract instance
export async function getERC20(address: string, signerOrProvider: ethers.Signer | ethers.Provider) {
  const abi = await loadABI("TestToken");
  return new ethers.Contract(address, abi, signerOrProvider);
}

// Get DEX contract instance
export async function getDEX(signerOrProvider: ethers.Signer | ethers.Provider) {
  const abi = await loadABI("SimpleDEX");
  return new ethers.Contract(DEX_ADDRESS, abi, signerOrProvider);
}
