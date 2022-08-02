import React, { useCallback, useEffect, useState } from "react";
import {
  useAccount,
  useDisconnect,
  useNetwork,
  useSigner,
  useSwitchNetwork,
} from "wagmi";
import EthCrypto from "eth-crypto";
import { createClient } from "urql";
import { Oval } from "react-loader-spinner";
import moment from "moment";
import "isomorphic-unfetch"; // required for urql: https://github.com/FormidableLabs/urql/issues/283

import ContractInstances from "../../contracts/ContractInstances";
import ChatBox from "./ChatBox";

import { ChainLogoMetadata } from "../../utils/ChainLogoMetadata.js";

// TODO: create an index.js file that allows for multi imports in one line
import logout from "../../assets/logout-icon.svg";
import textBubble from "../../assets/text-bubble-icon.svg";
import selectedAddressEllipse from "../../assets/selected-address-ellipse.png";
import continueIconColor from "../../assets/continue-icon-color.svg";
import dropdown from "../../assets/dropdown-icon.svg";
import logo from "../../assets/echooo.svg";
import errorIcon from "../../assets/error-icon.svg";
import plusIcon from "../../assets/plus-icon.svg";
import resetIcon from "../../assets/reset-icon.svg";
import changeKeysIcon from "../../assets/change-keys-icon.svg";
import sendMessagesIcon from "../../assets/send-message-icon.svg";
import "../../styles/receivers.css";

// TODO: move to util functions
// A promise that has a time out -> used for tx.wait() since it doesn't throw an error
const promiseTimeout = (millis, promise) => {
  const timeout = new Promise((resolve, reject) =>
      setTimeout(
          () => reject(`Timed out after ${millis} ms.`),
          millis));
  return Promise.race([
      promise,
      timeout
  ]);
};

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
const SendMessagesInterface = ({ receiverAddress, messages, setMessageLog, messagesState, setMessagesState }) => {
  const [senderMessage, setSenderMessage] = useState("");
  const { address } = useAccount();
  const echoContract = ContractInstances();  
  const handleSubmitMessage = async (e) => {
    e.preventDefault();
    setMessagesState({ [receiverAddress]: true })

    let senderPublicKey = JSON.parse(localStorage.getItem("public-communication-address"))
    senderPublicKey = senderPublicKey[address]

    // TODO: break up into smaller functions
    const sendMessage = async (receiverAddress, messages) => {
      // TODO: If user has no communication address, need to create it on the fly for them... Check if public key exists within cache
      // TODO: sanitize graphQL queries b/c currently dynamic and exposes injection vulnerability
      const identitiesQuery = `
      query {
        identities(where: {from: "${receiverAddress}"}, first: 1, orderBy: timestamp, orderDirection: desc) {
          communicationAddress,
          timestamp     
        }
      }
    `;
      const graphClient = await initGraphClient();
      const data = await graphClient.query(identitiesQuery).toPromise();
      const receieverPublicKey = data.data.identities[0].communicationAddress;

      let messageEncryptedSender = await EthCrypto.encryptWithPublicKey(
        senderPublicKey,
        senderMessage
      );
      let messageEncryptedReceiver = await EthCrypto.encryptWithPublicKey(
        receieverPublicKey,
        senderMessage
      );
      messageEncryptedSender = EthCrypto.cipher.stringify(messageEncryptedSender);
      messageEncryptedReceiver = EthCrypto.cipher.stringify(messageEncryptedReceiver);

      const tx = await echoContract.logMessage(receiverAddress, messageEncryptedSender, messageEncryptedReceiver);
      await tx.wait();
      // await promiseTimeout(60 * 1000, );
      
    }

    const newMessageState = { ...messagesState, [receiverAddress]: false }
    sendMessage(receiverAddress, messages).then(() => {
      const newReceiverMessageLog = [...messages[receiverAddress], {
        from: address,        
        message: senderMessage,
        timestamp: `${moment().unix()}`
      }]    
      
      const newMessageLog = messages
      newMessageLog[receiverAddress] = newReceiverMessageLog   
      setMessageLog(newMessageLog);      
      setMessagesState(newMessageState)
      
    }).catch((err) => {
      console.log("Sending Message Error:", err)
      // TODO: make message indicative of error by changing color 
      const newReceiverMessageLog = [...messages[receiverAddress], {
        from: address,        
        message: "Error: Message failed please try again ...",
        timestamp: `${moment().unix()}`
      }]    
      
      const newMessageLog = messages
      newMessageLog[receiverAddress] = newReceiverMessageLog   
      setMessageLog(newMessageLog);      
      setMessagesState(newMessageState)      
    })
    setSenderMessage("");
  };

  return (
    <>
      <form
        onSubmit={handleSubmitMessage}
        className="flex flex-row align-center justify-center w-full gap-2 px-4 py-4"
      >
        <input
          onChange={(event) => setSenderMessage(event.target.value)}
          value={senderMessage}
          id="sender_message"
          class="drop-shadow-md bg-gray-50 rounded-[30px] text-gray-900 text-md w-full p-4"
          placeholder="Type your message..."
          required
        />
        <button
          class="flex flex-row justify-center items-center gap-[10px] text-white text-lg bg-[#333333] rounded-[30px] hover:bg-[#555555] font-medium px-[13.1px] disabled:opacity-25"
          disabled={true}
        >
          <img height="35" width="35" src={plusIcon}></img>
        </button>
        {messagesState[receiverAddress] ?
          <div className="flex flex-row w-[384px] items-center justify-center gap-[20px]">
            <Oval
              ariaLabel="loading-indicator"
              height={40}
              width={40}
              strokeWidth={3}
              strokeWidthSecondary={3}
              color="black"
              secondaryColor="white"
            />
            <div className="text-xl font-medium">Sending message...</div>
          </div>
          : <button
            type="submit"
            class="flex flex-row justify-center items-center gap-[10px] text-white text-lg bg-[#333333] rounded-[30px] hover:bg-[#555555] font-medium px-6"
          >
            Send
            <img className="h-[25px]" src={sendMessagesIcon}></img>
          </button>}

      </form>
    </>
  );
};
export default function MessagingPage({
  toggleOpenModalChainSelect,
  toggleOpenCommAddressModal,
  toggleOpenNewChatModal,
  chatAddresses,
  activeReceiverAddress,
  setActiveReceiver,
  activeIndex,
  setActiveIndex,
  communicationAddress,
  setChatAddresses,
  messagesState,
  setMessagesState
}) {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();
  const { chains } = useSwitchNetwork();
  const [messages, setMessageLog] = useState({});

  const handleActiveReceiver = (e, index, address) => {
    setActiveIndex(index);
    setActiveReceiver(address);
  };

  // const getRecentMessages = useCallback(async () => {
  //   try {

  //   } catch (err) {
  //     console.log("Error getRecentMessages:", err)
  //   }
  // })
  useEffect(() => {
    // TODO: cache messages
    // TODO: if messages already populates check if there's new messages, if so append state with new messages, else do not continue
    if (activeReceiverAddress === "0x0000000000000000000000000000000000000000") {
      return;
    }
    const getMessagesAsync = async () => {
      const senderAddress = address.toLowerCase();
      let senderPrivateKey = JSON.parse(
        localStorage.getItem("private-communication-address")
      );
      senderPrivateKey = senderPrivateKey[address];
      if (messages[activeReceiverAddress] == null) {                      
        console.log("local private key >>", senderPrivateKey);

        // TODO: query validation using native library to prevent query injection vulnerability
        const identitiesTimestampQuery = `
          query {
            identities(
              where: {from: "${senderAddress}"}
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
        const dataIdentityCommAddress = dataIdentity.data.identities[0].communicationAddress; // TODO: Use this to check that this address matches our comm address

        const messagesQuery = `
          query {
            messages(            
              orderBy: timestamp
              orderDirection: asc
              where: {
                from_in: ["${senderAddress}", "${activeReceiverAddress}"],
                receiver_in: ["${senderAddress}", "${activeReceiverAddress}"]
                timestamp_gte: "${dataIdentityTimestamp}"
              }
          
            ) {
              from
              senderMessage
              receiverMessage
              timestamp
            }
          }
        `;
        const dataMessages = await graphClient.query(messagesQuery).toPromise();
        const dataMessagesParsed = dataMessages.data.messages;
        console.log("data messages parsed >>>", dataMessages);
        const messageLog = dataMessagesParsed;
        for (let idx = 0; idx < dataMessagesParsed.length; idx++) {
          let metaDataMessages = await dataMessagesParsed[idx];
          let message = "";

          // Decrypt sender message
          if (metaDataMessages.from === senderAddress) {
            message = metaDataMessages.senderMessage;
          } else {
            // Decrypt receiver message
            message = metaDataMessages.receiverMessage;
          }

          const decryptedMessage = await EthCrypto.decryptWithPrivateKey(
            senderPrivateKey,
            EthCrypto.cipher.parse(message)
          );
          messageLog[idx].message = decryptedMessage;

          console.log(`Decrypted message ${idx} >>>`, decryptedMessage);
        }
        const newMessageLog = { ...messages, [activeReceiverAddress]: messageLog }     
        setMessageLog(newMessageLog);
        const interval = setInterval(async (newMessage, activeReceiverAddress) => {
          console.log("messages >>>", newMessage)
          console.log(activeReceiverAddress)
          const mostRecentMessageMeta = newMessage[activeReceiverAddress].at(-1);
          console.log(mostRecentMessageMeta)
          const messagesQuery = `
          query {
            messages(            
              orderBy: timestamp
              orderDirection: asc
              where: {
                from_in: ["${senderAddress}", "${activeReceiverAddress}"],
                receiver_in: ["${senderAddress}", "${activeReceiverAddress}"]
                timestamp_gte: "${mostRecentMessageMeta.timestamp}"
              }
          
            ) {
              from
              senderMessage
              receiverMessage
              timestamp
            }
          }
        `;
        const graphClient = await initGraphClient();
        const dataMessages = await graphClient.query(messagesQuery).toPromise();
        const dataMessagesParsed = dataMessages.data.messages;
        console.log("data messages parsed >>>", dataMessages);
        const messageLog = dataMessagesParsed;
        console.log("message log >>>", messageLog)
        for (let idx = 0; idx < dataMessagesParsed.length; idx++) {
          let metaDataMessages = await dataMessagesParsed[idx];
          let message = "";
  
          // Decrypt sender message
          if (metaDataMessages.from === senderAddress) {
            message = metaDataMessages.senderMessage;
          } else {
            // Decrypt receiver message
            message = metaDataMessages.receiverMessage;
          }
  
          const decryptedMessage = await EthCrypto.decryptWithPrivateKey(
            senderPrivateKey,
            EthCrypto.cipher.parse(message)
          );
          messageLog[idx].message = decryptedMessage;
  
          console.log(`Decrypted message ${idx} >>>`, decryptedMessage);
        }
        const newReceiverMessages = [...newMessage[activeReceiverAddress], ...messageLog]
        const newMessageLog = { ...newMessage, [activeReceiverAddress]: newReceiverMessages }
        setMessageLog(newMessageLog);
        console.log("running")
          }, 5 * 1000, newMessageLog, activeReceiverAddress);
          return () => clearInterval(interval)
      }         
      }
      
    if (activeReceiverAddress !== "") {
      getMessagesAsync();
    }
  }, [activeReceiverAddress]);

  // TODO: Break this up into a bunch of components, way too much code here
  // - could do left column, header, and right column as a component
  return (
    <div
      className="flex flex-row h-[100vh] w-[100vw] bg-gradient-bg"
      style={{ backgroundRepeat: "round" }}
    >
      {console.log(chatAddresses.length)}
      {chatAddresses.length > 0 ? (
        <>
          <div className="border-r-[3px] border-[#333333] border-opacity-10 w-[30%] pt-[4vh]">
            <div className="flex flex-row justify-between items-center px-[2vw]">
              <code className="text-xl font-semibold">Your anon chats</code>
              <img
                className="h-[25px] hover:cursor-pointer"
                src={resetIcon}
                alt=""
                onClick={() => setChatAddresses([])}
              ></img>
            </div>
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
              {communicationAddress ? (
                <>
                  <button
                    className="flex flex-row justify-center items-center gap-[15px] px-5 py-3 bg-gradient-to-r from-[#00FFD1] to-[#FF007A] via-[#9b649c] text-white font-bold rounded-[30px] border-[3px] border-[#333333]"
                    onClick={toggleOpenNewChatModal}
                  >
                    Start new chat
                    <img src={textBubble} alt=""></img>
                  </button>
                </>
              ) : (
                <></>
              )}
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
          <div className="flex flex-col overflow-y-auto">
            <div className="overflow-y-auto">
              <ChatBox              
                messages={messages}
                setMessageLog={setMessageLog}
                receiverAddress={activeReceiverAddress}
              />
            </div>            
            <SendMessagesInterface
              messages={messages}
              setMessageLog={setMessageLog}
              receiverAddress={activeReceiverAddress}
              messagesState={messagesState}
              setMessagesState={setMessagesState}
            />
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
