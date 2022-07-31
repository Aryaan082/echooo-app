import Modal from "react-modal";
import React from "react";

import WalletConnector from "./WalletConnector";

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

export default function WalletModal({ openModal, toggleOpenModal }) {
  return (
    <Modal
      isOpen={openModal}
      onRequestClose={toggleOpenModal}
      style={modalStyles}
    >
      <div className="flex flex-col gap-4">
        <WalletConnector />
      </div>
    </Modal>
  );
}
