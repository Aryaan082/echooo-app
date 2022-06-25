import * as dotenv from "dotenv";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Echo } from "../typechain";
import EchoJSON from "../artifacts/contracts/Echo.sol/Echo.json";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract } from "ethers";
dotenv.config();

describe("Echo Contract", () => {
  let deployer: SignerWithAddress;
  let echoContract: Contract;
  beforeEach(async () => {
    [deployer] = await ethers.getSigners();
    const provider = new ethers.providers.JsonRpcProvider(`https://rpc-mumbai.maticvigil.com/v1/${process.env.ALCHEMY_API_KEY}`);
    const privateKey = process.env.PRIVATE_KEY_MATIC || "";
    const contractAddress = "0xB149b57dD9EF08A9728612dAE867c2e602480D21";
    echoContract = await new ethers.Contract(contractAddress, EchoJSON.abi, provider);
  });

  it("Can log a message", async () => {
    const tx = await echoContract.connect(deployer).logMessage("0xcd3b766ccdd6ae721141f452c550ca635964ce71", "hello world");
    const txReceipt = await tx.wait();
    console.log(txReceipt);
    console.log(txReceipt.events);
  });
});
