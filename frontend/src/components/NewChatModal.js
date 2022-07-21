import Modal from "react-modal";
import React from "react";

import continueIcon from "../assets/continue-icon.svg";

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

export default function NewChatModal({
  openModal,
  toggleOpenModal,
  communicationSetup,
  toggleCommunicationSetup,
  newChatAddress,
  setNewChatAddress,
  chatAddresses,
  setChatAddresses,
}) {
  const handleChatInputChange = (e) => setNewChatAddress(e.target.value);

  return (
    <Modal
      isOpen={openModal}
      onRequestClose={toggleOpenModal}
      style={modalStyles}
    >
      <div className="flex flex-col gap-10">
        <code className="text-xl">Start a new anon chat.</code>
        <div className="flex flex-row gap-3">
          <input
            placeholder="Type address or ENS"
            onChange={handleChatInputChange}
            className="w-[450px] px-4 py-3 font-semibold rounded-[30px] border-[3px] border-[#333333]"
          ></input>
          <button
            className="flex flex-row justify-center items-center gap-[15px] px-5 py-3 bg-gradient-to-r from-[#00FFD1] to-[#FF007A] via-[#9b649c] text-white font-bold rounded-[30px] border-[3px] border-[#333333] disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={
              communicationSetup
                ? () => {
                    toggleOpenModal();
                    setChatAddresses([...chatAddresses, newChatAddress]);
                  }
                : () => {
                    toggleCommunicationSetup();
                    toggleOpenModal();
                    setChatAddresses([...chatAddresses, newChatAddress]);
                  }
            }
            disabled={newChatAddress.length !== 42}
          >
            Start
            <img src={continueIcon}></img>
          </button>
        </div>
      </div>
    </Modal>
  );
}
