import * as dotenv from "dotenv";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Echo } from "../typechain";
import EchoJSON from "../artifacts/contracts/Echo.sol/Echo.json";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract, Wallet } from "ethers";
dotenv.config();

describe("Echo Contract", () => {
  let wallet: Wallet;
  let echoContract: Contract;
  beforeEach(async () => {
    const provider = new ethers.providers.JsonRpcProvider(`https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`);
    const privateKey = process.env.PRIVATE_KEY_MATIC || "";
    wallet = new ethers.Wallet(privateKey, provider);
    const contractAddress = "0xB149b57dD9EF08A9728612dAE867c2e602480D21";
    echoContract = await new ethers.Contract(contractAddress, EchoJSON.abi, provider);
  });

  it("Can log a message", async () => {
    const tx = await echoContract.connect(wallet).logMessage("0xcd3b766ccdd6ae721141f452c550ca635964ce71", "hello world");
    const txReceipt = await tx.wait();
    console.log(txReceipt);
    console.log(txReceipt.events);
  });
});
