import * as dotenv from "dotenv";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Echo } from "../typechain";
import EchoJSON from "../artifacts/contracts/Echo.sol/Echo.json";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract, Wallet } from "ethers";
import { generateWallet, Currency } from "@tatumio/tatum";
import EthCrypto from "eth-crypto";

dotenv.config();

describe("Echo Contract", () => {
  let wallet: Wallet;
  let echoContract: Contract;
  let message: string;
  let byteMessage: Uint8Array;
  let originalMessage: string;

  beforeEach(async () => {
    const provider = new ethers.providers.JsonRpcProvider(`https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`);
    const privateKey = process.env.PRIVATE_KEY_MATIC || "";
    wallet = new ethers.Wallet(privateKey, provider);
    const contractAddress = "0xB149b57dD9EF08A9728612dAE867c2e602480D21";
    echoContract = await new ethers.Contract(
      contractAddress,
      EchoJSON.abi,
      provider
    );
  });

  it("Can log a message", async () => {
    const tx = await echoContract
      .connect(wallet)
      .logMessage("0xcd3b766ccdd6ae721141f452c550ca635964ce71", "hello world", { gasLimit: 10000000 });
    const txReceipt = await tx.wait();
    console.log(txReceipt);
    console.log(txReceipt.events);
  });

  it("Can log a identity", async () => {
    const tx = await echoContract
      .connect(wallet)
      .logIdentity("0xcd3b766ccdd6ae721141f452c550ca635964ce71", { gasLimit: 10000000 });
    const txReceipt = await tx.wait();
    console.log(txReceipt);
    console.log(txReceipt.events);
  });

  it("Test utf8byte decryption", async function () {
    message = "Hi im person one";

    byteMessage = ethers.utils.toUtf8Bytes(message);

    originalMessage = ethers.utils.toUtf8String(byteMessage);

    expect(message).equals(originalMessage);
  });

  it("Test encrypting then decrypting messages", async function () {
    const ethWallet: any = await generateWallet(Currency.ETH, true);

    const ethWallet2 = EthCrypto.createIdentity();

    const messageEncrypted = await EthCrypto.encryptWithPublicKey(
      ethWallet2.publicKey,
      message
    );

    const messageEncryptedString = await EthCrypto.cipher.stringify(
      messageEncrypted
    );

    expect(
      await EthCrypto.decryptWithPrivateKey(
        ethWallet2.privateKey,
        EthCrypto.cipher.parse(messageEncryptedString)
      )
    ).equals(message);
  });
});
