import {
  WagmiConfig,
  createClient,
  defaultChains,
  configureChains,
} from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";

import Modal from "react-modal";

import CloseButton from "react-bootstrap/CloseButton";

import React from "react";

import WalletOptions from "./WalletOptions";

import gradientOne from "../assets/gradient-one.svg";
import logo from "../assets/echooo.svg";
import textBubble from "../assets/text-bubble.svg";
import matic from "../assets/matic.svg";
import "../App.css";

const alchemyId = process.env.ALCHEMY_ID;

// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const { chains, provider, webSocketProvider } = configureChains(defaultChains, [
  alchemyProvider({ alchemyId }),
  publicProvider(),
]);

const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "wagmi",
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: "Injected",
        shimDisconnect: true,
      },
    }),
  ],
  provider,
  webSocketProvider,
});

const modalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    borderColor: "#333333",
    borderWidth: "4px",
    borderRadius: "5%",
    paddingBottom: "25px",
  },
};

// Pass client to React Context Provider
export default function App() {
  const [connectedWallet, setConnectedWallet] = React.useState(false);
  const [connectingWallet, setConnectingWallet] = React.useState(false);

  const toggleConnectWalletModal = () => setConnectingWallet(!connectingWallet);

  return (
    <div
      style={{
        backgroundImage: `url(${gradientOne})`,
        backgroundSize: "cover",
      }}
    >
      <Modal
        isOpen={connectingWallet}
        onRequestClose={toggleConnectWalletModal}
        style={modalStyles}
      >
        <div className="flex flex-col gap-4">
          <div className="font-medium">
            Connect a wallet
            <CloseButton />
          </div>
          <WagmiConfig client={client}>
            <WalletOptions />
          </WagmiConfig>
        </div>
      </Modal>
      {!connectedWallet ? (
        <div className="flex justify-center items-center h-[100vh]">
          <div className="flex justify-center h-[290px] w-[630px] border-[4px] border-[#333333] rounded-2xl shadow-[-5px_5px__0px_#333333] bg-white">
            <div className="flex flex-col justify-center items-center gap-7">
              <img className="w-[170px]" src={logo}></img>
              <code>Connect your wallet to start chatting, anon.</code>
              <button
                className="px-5 py-3 bg-gradient-to-r from-[#00FFD1] to-[#FF007A] via-[#9b649c] text-white font-bold rounded-[30px] border-[3px] border-[#333333] shadow-[-5px_5px__0px_#333333]"
                onClick={toggleConnectWalletModal}
              >
                Connect Wallet
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="flex flex-row h-[100vh] w-[100vw] bg-gradient-bg"
          style={{ backgroundRepeat: "round" }}
        >
          <div className="flex flex-col justify-center text-center w-[30%] border-r-[2px] border-slate-300">
            <code>
              You have no chats, anon <br />
              ¯\_(ツ)_/¯
            </code>
          </div>
          <div className="flex flex-row justify-between items-center px-[20px] py-[40px] h-[100px] w-full">
            <img className="h-[30px]" src={logo}></img>
            <div className="flex flex-row gap-4">
              <button onClick={toggleConnectWalletModal}>Connect Wallet</button>
              <div className="flex flex-row gap-[10px] bg-gradient-to-r from-cyan-500 to-pink-600 px-[20px] py-[10px] rounded-3xl text-white">
                Start new chat
                <img src={textBubble}></img>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
