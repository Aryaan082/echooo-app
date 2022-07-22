import Modal from "react-modal";
import React from "react";
import EthCrypto from "eth-crypto";
import {ethers} from "ethers";
import EchoJSON from "../artifacts/contracts/Echo.sol/Echo.json";

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
    paddingBottom: "25px",
  },
};


const initConnection = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contractAddress = "0x9BAcd26D33175987B5807107a73bb8D6f69225d9";
  const echoContract = await new ethers.Contract(
    contractAddress,
    EchoJSON.abi,
    provider
  );
  return echoContract;
}

const createCommunicationAddress = async (connectedAddress) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const echoContract = await initConnection();
  const ethWallet = EthCrypto.createIdentity(); 
  const publicKey = ethWallet.publicKey;
  const privateKey = ethWallet.privateKey;
  const tx = await echoContract.connect(signer).logIdentity(publicKey);
  await tx.wait();
  localStorage.setItem("private-communication-address", JSON.stringify(privateKey));
  localStorage.setItem("public-communication-address", JSON.stringify(publicKey));
  return publicKey;
}

export default function NewCommAddressModal({
  openModal,
  toggleOpenModal,
  setCommunicationAddress
}) {
  const handleSetCommunicationAddress = (e) => {
    const publicKey = createCommunicationAddress();
    setCommunicationAddress(publicKey);
    toggleOpenModal();
  }

  return (
    <Modal
      isOpen={openModal}
      onRequestClose={toggleOpenModal}
      style={modalStyles}
    >
      <div className="flex flex-col gap-10">
        <code className="text-xl text-center m-auto">Create a new communication address.</code>
        <code className="break-all text-md text-gray-500 m-auto">A new communication address will make your messages safer.</code>
        <div>
          <button
            className="w-full flex justify-center items-center px-5 py-3 bg-[rgb(44,156,218)] via-[#9b649c] text-white font-bold rounded-[30px] border-[3px] border-[#333333]"
            onClick={handleSetCommunicationAddress}              
          >
            Create new address             
          </button>
          <button
            className="w-full flex justify-center items-center bg-white-500 text-[rgb(46,128,236)] font-bold px-5 py-3"
            onClick={toggleOpenModal}              
          >
            Not now           
          </button>
        </div>
      </div>
    </Modal>
  );
}
