import * as dotenv from "dotenv";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Echo } from "../typechain";
import {EchoJSON} from "../artifacts/contracts/Echo.sol/Echo.json";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract } from "ethers";
dotenv.config();

describe("Echo Contract", () => {
  let deployer: SignerWithAddress;
  let echoContract: Contract;
  beforeEach(async () => {
    [deployer] = await ethers.getSigners();
    const provider = ethers.getDefaultProvider('mumbai');
    const privateKey = process.env.PRIVATE_KEY_MATIC || "";
    const wallet = new ethers.Wallet(privateKey, provider);
    const contractAddress = "0x377b233AFDA8669f33Cb4af7A8562e5d7f353A19";
    echoContract = await new ethers.Contract(contractAddress, EchoJSON, provider);
  });

  it("Can log a message", async () => {
    const tx = await echoContract.connect(deployer).logMessage("0x123", "hello world");
    const txReceipt = await tx.wait();
    console.log(txReceipt);
  });
});
