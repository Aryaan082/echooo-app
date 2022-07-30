import Modal from "react-modal";
import React from "react";
import EthCrypto from "eth-crypto";
import { ethers } from "ethers";
import EchoJSON from "../contracts/Echo.sol/Echo.json";

import { ChainLogoMetadata } from "../utils/ChainLogoMetadata.js";

const modalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    borderColor: "#333333",
    borderWidth: "4px",
    borderRadius: "1.5rem",
  },
};

const initConnection = async () => {
  let contractAddress;
  const chainID = parseInt(window.ethereum.networkVersion);
  if (ChainLogoMetadata[chainID].name === "Avalanche Fuji") {
    contractAddress = "0x79DD6a9aF59dE8911E5Bd83835E960010Ff6887A";
  } else {
    contractAddress = "0x21e29E3038AeCC76173103A5cb9711Ced1D23C01";
  }
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const echoContract = await new ethers.Contract(
    contractAddress,
    EchoJSON.abi,
    provider
  );
  return echoContract;
};

const createCommunicationAddress = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const echoContract = await initConnection();
  const ethWallet = EthCrypto.createIdentity();
  const publicKey = ethWallet.publicKey;
  const privateKey = ethWallet.privateKey;
  const tx = await echoContract.connect(signer).logIdentity(publicKey);
  await tx.wait();

  const signerAddress = await signer.getAddress();
  let localPublicKeys = JSON.parse(
    localStorage.getItem("public-communication-address")
  );
  let localPrivateKeys = JSON.parse(
    localStorage.getItem("private-communication-address")
  );
  // console.log("initial public keys >>>", localPublicKeys);
  // console.log("initial private keys >>>", localPrivateKeys);

  if (localPublicKeys === null || localPrivateKeys === null) {
    localPublicKeys = {};
    localPrivateKeys = {};
  }

  const newLocalPublicKeys = Object.assign({}, localPublicKeys, {
    [signerAddress]: publicKey,
  });
  const newLocalPrivateKeys = Object.assign({}, localPrivateKeys, {
    [signerAddress]: privateKey,
  });
  console.log("new public local key", newLocalPublicKeys);
  localStorage.setItem(
    "public-communication-address",
    JSON.stringify(newLocalPublicKeys)
  );
  localStorage.setItem(
    "private-communication-address",
    JSON.stringify(newLocalPrivateKeys)
  );
  return;
};

export default function NewCommAddressModal({
  openModal,
  toggleOpenModal,
  setCommunicationAddress,
}) {
  const handleSetCommunicationAddress = async (e) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const signerAddress = await signer.getAddress();
    createCommunicationAddress();
    const localPublicKeys = JSON.parse(
      localStorage.getItem("public-communication-address")
    );
    console.log("local address >>>", signerAddress);
    const signerPublicKey = localPublicKeys[signerAddress];
    setCommunicationAddress(signerPublicKey);
    toggleOpenModal();
  };

  return (
    <Modal
      isOpen={openModal}
      onRequestClose={toggleOpenModal}
      style={modalStyles}
    >
      <div className="flex flex-col py-4 px-4 gap-6">
        <code className="text-2xl font-bold text-left">
          Create a new communication address.
        </code>
        <code className="text-md text-gray-500 w-[450px]">
          A new communication address will make your messages safer.
        </code>
        <div className="flex flex-col gap-2">
          <button
            className="w-full flex text-lg justify-center items-center px-5 py-3 bg-[rgb(44,156,218)] via-[#9b649c] text-white font-bold rounded-[8px] border-[3px] border-[#333333]"
            onClick={handleSetCommunicationAddress}
          >
            <code>Create new address</code>
          </button>
          <button
            className="w-full flex text-lg justify-center items-center bg-white-500 text-[rgb(46,128,236)] font-bold px-5 py-3"
            onClick={toggleOpenModal}
          >
            <code>Not now</code>
          </button>
        </div>
      </div>
    </Modal>
  );
}
