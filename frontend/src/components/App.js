import React from "react";
import { useConnect, useAccount } from "wagmi";

import ConnectionModal from "./ConnectionModal";

import gradientOne from "../assets/gradient-one.svg";
import logo from "../assets/echooo.svg";
import textBubble from "../assets/text-bubble.svg";
import matic from "../assets/matic.svg";
import "../App.css";

export default function App() {
  const [connectedWallet, setConnectedWallet] = React.useState(false);
  const [openModalConnect, setOpenModalConnect] = React.useState(false);

  const toggleOpenModalConnect = () => setOpenModalConnect(!openModalConnect);

  useAccount({
    onDisconnect() {
      setConnectedWallet(false);
    },
  });

  useAccount({
    onConnect() {
      setConnectedWallet(true);
      setOpenModalConnect(false);
    },
  });

  return (
    <div
      style={{
        backgroundImage: `url(${gradientOne})`,
        backgroundSize: "cover",
      }}
    >
      {" "}
      <ConnectionModal
        openModalConnect={openModalConnect}
        toggleOpenModalConnect={toggleOpenModalConnect}
      />
      {!connectedWallet ? (
        <div className="flex justify-center items-center h-[100vh]">
          <div className="flex justify-center h-[290px] w-[630px] border-[4px] border-[#333333] rounded-2xl shadow-[-5px_5px__0px_#333333] bg-white">
            <div className="flex flex-col justify-center items-center gap-7">
              <img className="w-[170px]" src={logo}></img>
              <code>Connect your wallet to start chatting, anon.</code>
              <button
                className="px-5 py-3 bg-gradient-to-r from-[#00FFD1] to-[#FF007A] via-[#9b649c] text-white font-bold rounded-[30px] border-[3px] border-[#333333] shadow-[-5px_5px__0px_#333333]"
                onClick={toggleOpenModalConnect}
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
              <button onClick={toggleOpenModalConnect}>Connect Wallet</button>
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
