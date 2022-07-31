import React, { useEffect, useState } from "react";
import {
  useAccount,
  useDisconnect,
  useNetwork,
  useSigner,
  useSwitchNetwork,
} from "wagmi";
import { ethers } from "ethers";
import EthCrypto from "eth-crypto";
import { createClient } from "urql";
import EchoJSON from "../contracts/Echo.sol/Echo.json";
import "isomorphic-unfetch"; // required for urql: https://github.com/FormidableLabs/urql/issues/283

import ContractInstances from "../contracts/ContractInstances";
import ChatBox from "./ChatBox";

import { ChainLogoMetadata } from "../utils/ChainLogoMetadata.js";

// TODO: create an index.js file that allows for multi imports in one line
import logout from "../assets/logout-icon.svg";
import textBubble from "../assets/text-bubble-icon.svg";
import selectedAddressEllipse from "../assets/selected-address-ellipse.png";
import continueIconColor from "../assets/continue-icon-color.svg";
import continueIcon from "../assets/continue-icon.svg";
import dropdown from "../assets/dropdown-icon.svg";
import logo from "../assets/echooo.svg";
import errorIcon from "../assets/error-icon.svg";
import plusIcon from "../assets/plus-icon.svg";
import avalanche from "../assets/avalanche-icon.svg";
import ethereum from "../assets/ethereum-icon.svg";
import polygon from "../assets/polygon-icon.svg";
import changeKeysIcon from "../assets/change-keys-icon.svg";
import sendMessagesIcon from "../assets/send-message-icon.svg";
import "../styles/receivers.css";

// TODO: change init code so object is only instantiated once & make constants
const initGraphClient = async () => {
  const chainID = parseInt(window.ethereum.networkVersion);
  let graphApiUrl;

  if (ChainLogoMetadata[chainID].name === "Avalanche Fuji") {
    graphApiUrl = "https://api.thegraph.com/subgraphs/name/mtwichan/echofuji";
  } else {
    graphApiUrl = "https://api.thegraph.com/subgraphs/name/mtwichan/echo";
  }
  const graphClient = createClient({
    url: graphApiUrl,
  });
  return graphClient;
};

// TODO: make into own component once backend logic is complete
const SendMessages = ({ receiverAddress, messages, setMessages }) => {
  const [message, setMessage] = useState("");

  const { address } = useAccount();

  const echoContract = ContractInstances();

  const handleSubmitMessage = async (e) => {
    e.preventDefault();

    const senderMessage = message;
    const BIdentity = receiverAddress;

    // TODO: If user has no communication address, need to create it on the fly for them... Check if public key exists within cache
    // TODO: sanitize graphQL queries b/c currently dynamic and exposes injection vulnerability
    const identitiesQuery = `
      query {
        identities(where: {from: "${BIdentity}"}, first: 1, orderBy: timestamp, orderDirection: desc) {
          communicationAddress,
          timestamp     
        }
      }
    `;
    const graphClient = await initGraphClient();
    const data = await graphClient.query(identitiesQuery).toPromise();
    const communicationAddress = data.data.identities[0].communicationAddress;

    const messageEncrypted = await EthCrypto.encryptWithPublicKey(
      communicationAddress,
      senderMessage
    );
    const messageEncryptedString = EthCrypto.cipher.stringify(messageEncrypted);

    await echoContract.logMessage(BIdentity, messageEncryptedString);
    const newMessage = {
      from: address,
      to: receiverAddress,
      message: senderMessage,
    };
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setMessage("");
  };

  return (
    <>
      <form
        onSubmit={handleSubmitMessage}
        className="flex flex-row align-center justify-center w-full gap-2 px-4 py-4"
      >
        <input
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          id="sender_message"
          class="drop-shadow-md bg-gray-50 rounded-[30px] text-gray-900 text-md w-full p-4"
          placeholder="Type your message..."
          required
        />
        <button
          type="submit"
          class="flex flex-row justify-center items-center gap-[10px] text-white text-lg bg-[#333333] rounded-[30px] hover:bg-[#555555] font-medium px-[13.1px]"
        >
          <img height="35" width="35" src={plusIcon}></img>
        </button>
        <button
          type="submit"
          class="flex flex-row justify-center items-center gap-[10px] text-white text-lg bg-[#333333] rounded-[30px] hover:bg-[#555555] font-medium px-6"
        >
          Send
          <img className="h-[25px]" src={sendMessagesIcon}></img>
        </button>
      </form>
    </>
  );
};

export default function MessagingPage({
  toggleOpenModalChainSelect,
  communicationSetup,
  toggleOpenCommAddressModal,
  toggleOpenNewChatModal,
  chatAddresses,
  activeReceiverAddress,
  setActiveReceiver,
  activeIndex,
  setActiveIndex,
}) {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();
  const { chains, error, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork();
  const [messages, setMessages] = useState([]);

  const handleActiveReceiver = (e, index, address) => {
    setActiveIndex(index);
    setActiveReceiver(address);
  };

  useEffect(() => {
    // TODO: cache messages
    const getMessagesAsync = async () => {
      const provider = await new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner();
      const localPrivateKey = JSON.parse(
        localStorage.getItem("private-communication-address")
      );
      const BPublicCommuncationAddress = await signer.getAddress();
      const BPrivateCommunicationAddress =
        localPrivateKey[BPublicCommuncationAddress];
      console.log("BPrivateComm >>", BPrivateCommunicationAddress);
      const identitiesTimestampQuery = `
        query {
          identities(
            where: {from: "${BPublicCommuncationAddress}"}
            first: 1
            orderBy: timestamp
            orderDirection: desc
          ) {
            communicationAddress
            timestamp
          }
        }
      `;
      const graphClient = await initGraphClient();
      const dataIdentity = await graphClient
        .query(identitiesTimestampQuery)
        .toPromise();
      const dataIdentityTimestamp = dataIdentity.data.identities[0].timestamp;
      const dataIdentityCommAddress =
        dataIdentity.data.identities[0].communicationAddress; // TODO: Use this to check that this address matches our comm address
      console.log("data timestamp >>>", dataIdentityTimestamp);
      const messagesQuery = `
        query {
          messages(            
            orderBy: timestamp
            orderDirection: desc
            where: {
              from_in: ["${BPublicCommuncationAddress}", "${activeReceiverAddress}"],
              receiver_in: ["${BPublicCommuncationAddress}", "${activeReceiverAddress}"]
              timestamp_gte: "${dataIdentityTimestamp}"
            }
        
          ) {
            from
            message
            receiver
            timestamp
          }
        }
      `;
      const dataMessages = await graphClient.query(messagesQuery).toPromise();
      // console.log("data messages >>>", dataMessages);
      // const message = dataMessages.data.messages[0].message;
      // console.log("message >>>", message)
      // const decryptedMessage = await EthCrypto.decryptWithPrivateKey(
      //   BPrivateCommunicationAddress,
      //   EthCrypto.cipher.parse(message)
      // );
      // console.log("decryptedMessage >>>", decryptedMessage)
      const dataMessagesParsed = dataMessages.data.messages;
      console.log("data messages parsed >>>", dataMessagesParsed);
      let messages = [];
      for (let idx = 0; idx < dataMessagesParsed.length; idx++) {
        let message = await dataMessagesParsed[idx].message;
        // await message.push({ from: BPublicCommuncationAddress });
        console.log(message);
        // await messages.push(message);
        const decryptedMessage = await EthCrypto.decryptWithPrivateKey(
          BPrivateCommunicationAddress,
          EthCrypto.cipher.parse(message)
        );
        console.log(`Decrypted message ${idx} >>>`, decryptedMessage);
      }
      // console.log("fetched messages", await messages);
      // setMessages(messages);
      // return await messages
    };
    if (activeReceiverAddress !== "") {
      getMessagesAsync();
    }
  }, [activeReceiverAddress]);

  return (
    <div
      className="flex flex-row h-[100vh] w-[100vw] bg-gradient-bg"
      style={{ backgroundRepeat: "round" }}
    >
      {communicationSetup ? (
        <>
          <div className="border-r-[3px] border-[#333333] border-opacity-10 w-[30%] pt-[4vh]">
            <code className="text-xl font-semibold pl-[2vw]">
              Your anon chats
            </code>
            <ul className="Receivers">
              {chatAddresses.map((address, index) => {
                return (
                  <button
                    className="w-[80%] flex flex-row justify-between items-center px-4 py-4 font-bold rounded-[50px]"
                    key={index}
                    id={index === activeIndex ? "active" : "inactive"}
                    onClick={(event) =>
                      handleActiveReceiver(event, index, address)
                    }
                  >
                    {console.log("index", index)}
                    <code className="flex flex-row items-center gap-4 text-lg">
                      <img src={selectedAddressEllipse} alt=""></img>
                      {`${address.substring(0, 4)}...${address.substring(38)}`}
                    </code>
                    <img src={continueIconColor} alt=""></img>
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
      {/* Header */}
      <div className="w-[70%] flex flex-col justify-between">
        <div>
          <div className="flex flex-row justify-between items-center px-[20px] py-[40px] h-[100px]">
            {/* Logo */}
            <img className="h-[30px]" src={logo} alt=""></img>
            {/* Buttons
          1. Chain Selector - Displays Chain
          2. Disconnect - Displays Address
          3. Change Comm Key
          4. Start New Chat
          */}
            <div className="flex flex-row gap-4">
              <button
                className="flex flex-row justify-center items-center gap-[15px] px-5 py-3 bg-white text-black font-bold rounded-[30px] border-[3px] border-[#333333]"
                onClick={toggleOpenModalChainSelect}
              >
                {!chains.map((value) => value.id).includes(chain.id) ? (
                  <>
                    <img className="w-[25px]" src={errorIcon} alt=""></img>
                    Unsupported Chain
                    <img src={dropdown} alt=""></img>
                  </>
                ) : (
                  <>
                    <img
                      className="w-[25px]"
                      src={ChainLogoMetadata[chain.id].logo}
                      alt=""
                    ></img>
                    {ChainLogoMetadata[chain.id].name}
                    <img src={dropdown} alt=""></img>
                  </>
                )}
              </button>
              <button
                className="flex flex-row justify-center items-center gap-[10px] px-5 py-3 bg-white text-black font-bold rounded-[30px] border-[3px] border-[#333333]"
                onClick={() => disconnect()}
              >
                {`${address.substring(0, 4)}...${address.substring(38)}`}
                <img src={logout} alt=""></img>
              </button>
              <button
                className="flex flex-row justify-center items-center gap-[10px] px-5 py-3 bg-[rgb(44,157,218)] text-white font-bold rounded-[30px] border-[3px] border-[#333333]"
                onClick={toggleOpenCommAddressModal}
              >
                Change keys
                <img
                  className="h-[20px] w-[20px]"
                  src={changeKeysIcon}
                  alt=""
                ></img>
              </button>
              <button
                className="flex flex-row justify-center items-center gap-[15px] px-5 py-3 bg-gradient-to-r from-[#00FFD1] to-[#FF007A] via-[#9b649c] text-white font-bold rounded-[30px] border-[3px] border-[#333333]"
                onClick={toggleOpenNewChatModal}
              >
                Start new chat
                <img src={textBubble} alt=""></img>
              </button>
            </div>
          </div>
          {/* Reciever */}
          {chatAddresses.length > 0 ? (
            <div className="w-full" style={{ height: "calc(5vh - 100px}" }}>
              <div className="flex justify-center align-center">
                <div className="shadow-md flex flex-wrap rounded-[10px] border-[1px] p-5 bg-[rgba(241,245,249,0.5)] text-center text-md break-words">
                  {activeReceiverAddress}
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>

        {/* Chat */}
        {chatAddresses.length > 0 ? (
          <div className="flex flex-col">
            <ChatBox
              messages={messages}
              setMessages={setMessages}
              receiverAddress={activeReceiverAddress}
            />
            <SendMessages
              messages={messages}
              setMessages={setMessages}
              receiverAddress={activeReceiverAddress}
            />
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
