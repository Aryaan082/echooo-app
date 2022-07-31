import Modal from "react-modal";
import React from "react";

import "../../styles/receivers.css";

import continueIcon from "../../assets/continue-icon.svg";

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

export default function NewChatModal({
  openModal,
  toggleOpenModal,
  communicationSetup,
  toggleCommunicationSetup,
  newChatAddress,
  setNewChatAddress,
  chatAddresses,
  setChatAddresses,
  setActiveReceiver,
  setActiveIndex,
}) {
  const handleChatInputChange = (e) => setNewChatAddress(e.target.value);

  return (
    <Modal
      isOpen={openModal}
      onRequestClose={toggleOpenModal}
      style={modalStyles}
    >
      <div className="flex flex-col py-4 px-4 gap-4">
        <code className="text-2xl">Start a new anon chat.</code>
        <div className="flex flex-row gap-3">
          <input
            placeholder="Type address or ENS"
            onChange={handleChatInputChange}
            className="code w-[450px] px-4 py-3 rounded-[8px] bg-[#f2f2f2]"
          ></input>
          <button
            className="flex flex-row justify-center text-lg items-center gap-[15px] px-5 py-3 bg-[#555555] text-white font-bold rounded-[8px] border-[3px] border-[#333333] disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={
              // communication is setup when at least 1 chat is open
              communicationSetup
                ? () => {
                    toggleOpenModal();
                    setChatAddresses([...chatAddresses, newChatAddress]);
                    setActiveReceiver(newChatAddress);
                    setActiveIndex(chatAddresses.length);
                    setNewChatAddress("");
                  }
                : () => {
                    toggleCommunicationSetup();
                    toggleOpenModal();
                    setChatAddresses([...chatAddresses, newChatAddress]);
                    setActiveReceiver(newChatAddress);
                    setActiveIndex(chatAddresses.length);
                    setNewChatAddress("");
                  }
            }
            disabled={
              newChatAddress.length !== 42 ||
              chatAddresses.includes(newChatAddress)
            }
          >
            Start
            <img src={continueIcon}></img>
          </button>
        </div>
        {chatAddresses.includes(newChatAddress) ? (
          <div className="text-lg text-red-500 text-center">
            Chatter already exists.
          </div>
        ) : (
          <></>
        )}
      </div>
    </Modal>
  );
}
