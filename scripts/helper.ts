import * as dotenv from "dotenv";
import { ethers } from "hardhat";
import { Contract, Wallet } from "ethers";
import EchoJSON from "../artifacts/contracts/Echo.sol/Echo.json";
import EthCrypto from "eth-crypto";
import { Address } from "@web3-onboard/core/dist/types";

dotenv.config();

const provider = new ethers.providers.JsonRpcProvider(`https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`);
const privateKey: Address = process.env.PRIVATE_KEY_MATIC || "";
const wallet: Wallet = new ethers.Wallet(privateKey, provider);
const contractAddress: Address = "0xB149b57dD9EF08A9728612dAE867c2e602480D21";
const echoContract: Contract = new ethers.Contract(
  contractAddress,
  EchoJSON.abi,
  provider
);
const LOCAL_STORAGE_NAMES: Object = {
  PRIVATE_KEY: "PRIVATE_KEY",
}

const createCommunicationAddress = async () => {
    const ethWallet = EthCrypto.createIdentity(); // create a pair of communication addresses
    const tx = await echoContract.connect(wallet).logIdentity(ethWallet.address);
    await tx.wait();
    localStorage.setItem(LOCAL_STORAGE_NAMES["PRIVATE_KEY"], ethWallet.privateKey);
};
// const sendMessage = async (message, BIdentity) => {};
// const receiveMessage = async () => {};

async function main() {
    createCommunicationAddress();
}
  
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
  