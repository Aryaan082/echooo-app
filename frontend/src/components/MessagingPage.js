import React, { useEffect, useState } from "react";
import { useAccount, useDisconnect, useNetwork, useSigner, useSwitchNetwork } from "wagmi";
import EthCrypto from "eth-crypto";
import { createClient } from "urql";
import 'isomorphic-unfetch'; // required for urql: https://github.com/FormidableLabs/urql/issues/283


import logout from "../assets/logout-icon.svg";
import textBubble from "../assets/text-bubble-icon.svg";
import selectedAddressEllipse from "../assets/selected-address-ellipse.png";
import continueIconColor from "../assets/continue-icon-color.svg";
import continueIcon from "../assets/continue-icon.svg";
import dropdown from "../assets/dropdown-icon.svg";
// import identity from "../assets/identity-card.svg";
import logo from "../assets/echooo.svg";
import errorIcon from "../assets/error-icon.svg";
import avalanche from "../assets/avalanche-icon.svg";
import "../styles/receivers.css";


const GRAPH_API_URL = "https://api.thegraph.com/subgraphs/name/mtwichan/echo";
const graphClient = createClient({
  url: GRAPH_API_URL,
});

const ChatBox = ({ receiverAddress }) => {
  return (
    <>
      {/* Reciever */}
      <div className="w-full" style={{ height: "calc(5vh - 100px}" }}>
        <div className="flex justify-center align-center">
          <div className="shadow-md flex flex-wrap rounded-[10px] border-[1px] p-5 bg-[rgba(241,245,249,0.5)] text-center text-md break-words">
            {receiverAddress}
          </div>
        </div>
      </div>

      {/* Chat box */}
      <div className="w-full overflow-scroll pt-4" style={{ height: "calc(82.5vh - 100px)" }}>
        {/* Sender */}
        <div className="pl-3">
          <div className="flex flex-row gap-4">
            <div className="bg-gray-50 p-4 rounded-lg border-[2px] border-[rgba(241,245,249)]">Your anon chats</div>
          </div>
          <div className="pt-3 text-xs text-gray-500 italic">
            {`${receiverAddress.substring(0, 4)}...${receiverAddress.substring(38)}, 04:20 am`}
          </div>
        </div>

        {/* Reciever */}
        <div>
          <div className="pr-3">
            <div className="flex flex-row justify-end gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border-[2px] border-[rgba(241,245,249)]">gm!</div>
            </div>
            <div className="flex flex-row justify-end gap-4 pt-3 text-xs text-gray-500 italic">
              You, 04:21 am
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const SendMessages = ({receiverAddress}) => {
  // [receiverCommAddress, setReceiverCommAddress] = useState("");
  // const send
  // const handleSendMessage = async () => {

  // }
  // useEffect(() => {

  // })
  // const message = "this is a very very secret message ...";
  //   const BIdentity = wallet.address;
  //   const identitiesQuery = `
  //     query {
  //       identities(where: {from: "${BIdentity}"}, first: 1, orderBy: timestamp, orderDirection: desc) {
  //         communicationAddress,
  //         timestamp     
  //       }
  //     }
  //   `
  //   const data = await graphClient.query(identitiesQuery).toPromise();
  //   const communicationAddress = data.data.identities[0].communicationAddress;
  //   console.log("communication address >>>", communicationAddress);
  //   const messageEncrypted = await EthCrypto.encryptWithPublicKey(
  //     communicationAddress,
  //     message
  //   );
  //   const messageEncryptedString = await EthCrypto.cipher.stringify(
  //     messageEncrypted
  //   );
    // console.log("message encrypted >>>", messageEncryptedString);
    // await echoContract.connect(wallet).logMessage(BIdentity, messageEncryptedString);

  return (
    <>
      {/* Send message */}
      <form className="flex flex-row align-center justify-center w-full gap-4" style={{ height: "calc(15vh - 100px}" }}>
        <div className="ml-2 w-[85%]">
          <input type="text" id="sender_message" class="shadow-md bg-gray-50 border-[1px] rounded-[20px] border-[rgba(241,245,249,0.7)] text-gray-900 text-md focus:ring-blue-200 focus:border-blue-200 w-full p-4" placeholder="Type your message..." required />
        </div>
        <div className="mr-2 w-[15%]">
          <button type="button" class="shadow-md h-full text-white bg-blue-500 border-[1px] rounded-[20px] border-[rgba(241,245,249,0.7)] hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-md w-full px-3 py-2.5 text-center">Send ✉️</button>
        </div>
      </form>
    </>
  )
}

export default function MessagingPage({
  toggleOpenModalChainSelect,
  communicationSetup,
  toggleOpenCommAddressModal,
  toggleOpenNewChatModal,
  chatAddresses,
  activeReceiverAddress,
  setActiveReceiver,
  activeIndex,
  setActiveIndex
}) {
  const { address } = useAccount();
  const { signer } = useSigner();
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();
  const { chains, error, isLoading, pendingChainId, switchNetwork } = useSwitchNetwork();

  const handleActiveReciever = (e, index, address) => {
    setActiveIndex(index);
    setActiveReceiver(address);
  }

  return (
    <div
      className="flex flex-row h-[100vh] w-[100vw] bg-gradient-bg"
      style={{ backgroundRepeat: "round" }}
    >
      {communicationSetup ? (
        <>
          <div className="border-r-[3px] border-[#333333] border-opacity-10 w-[30%] pt-[4vh]">
            <code className="text-xl font-semibold pl-[2vw]">Your anon chats</code>
            <ul className="Receivers">
              {chatAddresses.map((address, index) => {
                return (
                  <button
                    className="w-[80%] flex flex-row justify-between items-center px-4 py-4 font-bold rounded-[50px]"
                    key={index}
                    id={index === activeIndex ? "active" : "inactive"}
                    onClick={event => handleActiveReciever(event, index, address)}
                  >
                    {console.log("index", index)}
                    <code className="flex flex-row items-center gap-4">
                      <img src={selectedAddressEllipse}></img>
                      {`${address.substring(0, 4)}...${address.substring(38)}`}
                    </code>
                    <img src={continueIconColor}></img>
                  </button>
                );
              })}
            </ul>
          </div>
        </>
      ) : (
        <div className="flex flex-col justify-center text-center border-r-[3px] border-[#333333] border-opacity-10 w-[30%]">
          <code>
            You have no chats, anon <br />
            ¯\_(ツ)_/¯
          </code>
        </div>
      )}
      <div className="w-[70%]">
        <div className="flex flex-row justify-between items-center px-[20px] py-[40px] h-[100px]">
          <img className="h-[30px]" src={logo}></img>
          <div className="flex flex-row gap-4">
            <button
              className="flex flex-row justify-center items-center gap-[15px] px-5 py-3 bg-white text-black font-bold rounded-[30px] border-[3px] border-[#333333]"
              onClick={toggleOpenModalChainSelect}
            >
              {!chains.map((value) => value.id).includes(chain.id) ? (
                <>
                  <img className="w-[25px]" src={errorIcon}></img>
                  Unsupported Chain
                  <img src={dropdown}></img>
                </>
              ) : (
                <>
                  <img className="w-[25px]" src={avalanche}></img>
                  Avalanche
                  <img src={dropdown}></img>
                </>
              )}
            </button>
            <button
              className="flex flex-row justify-center items-center gap-[15px] px-5 py-3 bg-white text-black font-bold rounded-[30px] border-[3px] border-[#333333]"
              onClick={() => disconnect()}
            >
              {`${address.substring(0, 4)}...${address.substring(38)}`}
              <img src={logout}></img>
            </button>
            <button
              className="flex flex-row justify-center items-center gap-[15px] px-5 py-3 bg-[rgb(44,157,218)] text-white font-bold rounded-[30px] border-[3px] border-[#333333]"
              onClick={toggleOpenCommAddressModal}
            >
              Change keys
              {/* <img className="h-[20px] w-[20px]" src={identity}></img> */}
            </button>   
            <button
              className="flex flex-row justify-center items-center gap-[15px] px-5 py-3 bg-gradient-to-r from-[#00FFD1] to-[#FF007A] via-[#9b649c] text-white font-bold rounded-[30px] border-[3px] border-[#333333]"
              onClick={toggleOpenNewChatModal}
            >
              Start new chat
              <img src={textBubble}></img>
            </button>         
          </div>
        </div>
        {/* Chat */}
        {
          chatAddresses.length > 0 ? <div className="flex flex-col w-full mt-5">
            <ChatBox receiverAddress={activeReceiverAddress} />
            <SendMessages />
          </div> : ""
        }
      </div>
    </div>
  );
}
