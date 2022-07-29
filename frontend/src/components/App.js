// import * as dotenv from "dotenv";
import React, {useEffect, useState} from "react";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import WalletModal from "./WalletModal";
import ChainSelectorModal from "./ChainSelectorModal";
import NewChatModal from "./NewChatModal";
import MessagingPage from "./MessagingPage";
import CommAddressModal from "./CommAddressModal";

import gradientOne from "../assets/gradient-one.svg";
import gradientTwo from "../assets/gradient-two.svg";
import logo from "../assets/echooo.svg";

// dotenv.config();

export default function App() {
  const [connectedWallet, setConnectedWallet] = useState(false);
  const [chainSelect, setChainSelect] = useState(false);
  const [openModalConnect, setOpenModalConnect] = useState(false);
  const [openNewChatModal, setOpenNewChatModal] = useState(false);
  const [openCommAddressModal, setOpenCommAddressModal] = useState(false);
  const [communicationSetup, setCommunicationSetup] = useState(false);
  const [newChatAddress, setNewChatAddress] = useState("");
  const [activeReceiverAddress, setActiveReceiver] = useState("");
  const [chatAddresses, setChatAddresses] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [communicationAddress, setCommunicationAddress] = useState(
    JSON.parse(localStorage.getItem("public-communication-address")) || ""
  );
  
  const toggleOpenModalConnect = () => setOpenModalConnect(!openModalConnect);
  const toggleOpenModalChainSelect = () => setChainSelect(!chainSelect);
  const toggleOpenNewChatModal = () => setOpenNewChatModal(!openNewChatModal);
  const toggleOpenCommAddressModal = () => setOpenCommAddressModal(!openCommAddressModal)

  const toggleCommunicationSetup = () => setCommunicationSetup(!communicationSetup);
  const { chain } = useNetwork();
  const { chains, error, isLoading, pendingChainId, switchNetwork } = useSwitchNetwork();

  useAccount({
    onDisconnect() {
      setConnectedWallet(false);
    }
  });

  useAccount({
    onConnect() {
      setConnectedWallet(true);
      setOpenModalConnect(false);
      // if () {
      //   switchNetwork?.(chains[0].id);
      // }
    },
  });

  // successfully switched network
  useSwitchNetwork({
    onSuccess() {},
  });

  return (
    <div
      style={{
        backgroundImage: `url(${!connectedWallet ? gradientOne : gradientTwo})`,
        backgroundSize: "cover",
      }}
    >
      <ChainSelectorModal
        openModal={chainSelect}
        toggleOpenModal={toggleOpenModalChainSelect}
      />
      <WalletModal
        openModal={openModalConnect}
        toggleOpenModal={toggleOpenModalConnect}
      />
      <CommAddressModal
        openModal={openCommAddressModal}
        toggleOpenModal={toggleOpenCommAddressModal}
        setCommunicationAddress={setCommunicationAddress}
      />
      <NewChatModal
        openModal={openNewChatModal}
        toggleOpenModal={toggleOpenNewChatModal}
        toggleOpenNewChatModal={toggleOpenNewChatModal}
        communicationSetup={communicationSetup}
        toggleCommunicationSetup={toggleCommunicationSetup}
        newChatAddress={newChatAddress}
        setNewChatAddress={setNewChatAddress}
        chatAddresses={chatAddresses}
        setChatAddresses={setChatAddresses}
        setActiveReceiver={setActiveReceiver}
        setActiveIndex={setActiveIndex}
      />
      {!connectedWallet ? (
        <div className="flex justify-center items-center h-[100vh]">
          <div className="flex justify-center h-[290px] w-[630px] border-[4px] border-[#333333] rounded-2xl bg-white">
            <div className="flex flex-col justify-center items-center gap-7">
              <img className="w-[170px]" src={logo}></img>
              <code>Connect your wallet to start chatting, anon.</code>
              <button
                className="px-5 py-3 bg-gradient-to-r from-[#00FFD1] to-[#FF007A] via-[#9b649c] text-white font-bold rounded-[30px] border-[3px] border-[#333333]"
                onClick={toggleOpenModalConnect}
              >
                Connect Wallet
              </button>
            </div>
          </div>
        </div>
      ) : (
        <MessagingPage
          toggleOpenModalChainSelect={toggleOpenModalChainSelect}
          communicationSetup={communicationSetup}
          toggleCommunicationSetup={toggleCommunicationSetup}
          toggleOpenCommAddressModal={toggleOpenCommAddressModal}
          toggleOpenNewChatModal={toggleOpenNewChatModal}
          chatAddresses={chatAddresses}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          activeReceiverAddress={activeReceiverAddress}
          setActiveReceiver={setActiveReceiver}
        />
      )}
    </div>
  );
}
