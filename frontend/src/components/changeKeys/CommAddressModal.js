import Modal from "react-modal";
import React from "react";
import EthCrypto from "eth-crypto";
import { useAccount } from "wagmi";
import { Oval } from "react-loader-spinner";

import ContractInstances from "../../contracts/ContractInstances";

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

const createCommunicationAddress = async (echoContract, address) => {
  const ethWallet = EthCrypto.createIdentity();
  const publicKey = ethWallet.publicKey;
  const privateKey = ethWallet.privateKey;
  const tx = await echoContract.logIdentity(publicKey);
  await tx.wait();

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
    [address]: publicKey,
  });
  const newLocalPrivateKeys = Object.assign({}, localPrivateKeys, {
    [address]: privateKey,
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

export default function CommAddressModal({
  openModal,
  toggleOpenModal,
  toggleKeysSetup,
  setCommunicationAddress,
}) {
  const [isLoading, setLoading] = React.useState(false);

  const { address } = useAccount();

  const echoContract = ContractInstances();

  const handleSetCommunicationAddress = (e) => {
    setLoading(true);
    createCommunicationAddress(echoContract, address)
      .then(() => {
        const localPublicKeys = JSON.parse(
          localStorage.getItem("public-communication-address")
        );
        console.log("local address >>>", address);
        const signerPublicKey = localPublicKeys[address];
        setCommunicationAddress(signerPublicKey);
        setLoading(false);
        toggleOpenModal();
        toggleKeysSetup();
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <Modal
      isOpen={openModal}
      onRequestClose={toggleOpenModal}
      style={modalStyles}
    >
      {isLoading ? (
        <div className="flex flex-col w-[384px] items-center justify-center gap-[20px]">
          <Oval
            ariaLabel="loading-indicator"
            height={40}
            width={40}
            strokeWidth={3}
            strokeWidthSecondary={3}
            color="black"
            secondaryColor="white"
          />
          <div className="text-xl font-medium">Broadcasting...</div>
        </div>
      ) : (
        <div className="flex flex-col py-4 px-4 gap-6">
          <code className="text-2xl font-bold text-left">
            Create a new communication address.
          </code>
          <code className="text-md text-gray-500 w-[450px]">
            Get your new communication public and private keys to keep your
            messages safe.
          </code>
          <div className="flex flex-col gap-2">
            <button
              className="w-full flex text-lg justify-center items-center px-5 py-3 bg-[rgb(44,156,218)] via-[#9b649c] text-white font-bold rounded-[8px] border-[3px] border-[#333333]"
              onClick={handleSetCommunicationAddress}
            >
              <code>Get your keys</code>
            </button>
            <button
              className="w-full flex text-lg justify-center items-center bg-white-500 text-[rgb(46,128,236)] font-bold px-5 py-3"
              onClick={toggleOpenModal}
            >
              <code>Not now</code>
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
