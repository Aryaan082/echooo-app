import { expect } from "chai";
import { ethers } from "hardhat";

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    const Echo = await ethers.getContractFactory("Greeter");
    const echo = await Echo.deploy("Hello, world!");
    await echo.deployed();

    expect(await echo.greet()).to.equal("Hello, world!");

    const setGreetingTx = await echo.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await echo.greet()).to.equal("Hola, mundo!");
  });
});
