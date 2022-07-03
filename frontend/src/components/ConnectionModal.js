import { WagmiConfig, createClient } from "wagmi";
import Modal from "react-modal";
import React from "react";

import WalletOptions from "./WalletOptions";

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

export default function ConnectionModal({
  openModalConnect,
  toggleOpenModalConnect,
}) {
  return (
    <Modal
      isOpen={openModalConnect}
      onRequestClose={toggleOpenModalConnect}
      style={modalStyles}
    >
      <div className="flex flex-col gap-4">
        <WalletOptions />
      </div>
    </Modal>
  );
}
