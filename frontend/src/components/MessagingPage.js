import React, { useEffect, useState } from "react";
import { useAccount, useDisconnect, useNetwork, useSigner, useSwitchNetwork } from "wagmi";
import {ethers} from "ethers";
import EthCrypto from "eth-crypto";
import { createClient } from "urql";
import EchoJSON from "../artifacts/contracts/Echo.sol/Echo.json";

import 'isomorphic-unfetch'; // required for urql: https://github.com/FormidableLabs/urql/issues/283

import logout from "../assets/logout-icon.svg";
import textBubble from "../assets/text-bubble-icon.svg";
import selectedAddressEllipse from "../assets/selected-address-ellipse.png";
import continueIconColor from "../assets/continue-icon-color.svg";
import continueIcon from "../assets/continue-icon.svg";
import dropdown from "../assets/dropdown-icon.svg";
import logo from "../assets/echooo.svg";
import errorIcon from "../assets/error-icon.svg";
import avalanche from "../assets/avalanche-icon.svg";
import ethereum from "../assets/ethereum-icon.svg";
import polygon from "../assets/polygon-icon.svg";
import changeKeysIcon from "../assets/change-keys-icon.svg";
import sendMessagesIcon from "../assets/send-icon.svg";
import "../styles/receivers.css";


const GRAPH_API_URL = "https://api.thegraph.com/subgraphs/name/mtwichan/echo";
const graphClient = createClient({
  url: GRAPH_API_URL,
});

const initConnection = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contractAddress = "0x9BAcd26D33175987B5807107a73bb8D6f69225d9";
  const echoContract = await new ethers.Contract(
    contractAddress,
    EchoJSON.abi,
    provider
  );
  return echoContract;
}

const ChatBox = ({ receiverAddress, messages, setMessages}) => {
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

const SendMessages = ({receiverAddress, messages, setMessages}) => {
  // TODO: convert this to backend API call b/c the promises can block the thread not good
  const [message, setMessage] = useState("");

  const handleSubmitMessage = async (e) => {
    e.preventDefault();

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const echoContract = await initConnection();
    const senderMessage = message;
    const BIdentity = receiverAddress;

    // TODO: If user has no communication address, need to create it on the fly for them... 
    const identitiesQuery = `
      query {
        identities(where: {from: "${BIdentity}"}, first: 1, orderBy: timestamp, orderDirection: desc) {
          communicationAddress,
          timestamp     
        }
      }
    `
    const data = await graphClient.query(identitiesQuery).toPromise();
    const communicationAddress = data.data.identities[0].communicationAddress;
    
    const messageEncrypted = await EthCrypto.encryptWithPublicKey(
      communicationAddress,
      senderMessage
    );
    const messageEncryptedString = EthCrypto.cipher.stringify(
      messageEncrypted
    );
    
    await echoContract.connect(signer).logMessage(BIdentity, messageEncryptedString);
    const newMessage = {from: signer.address, to: receiverAddress, message: senderMessage}
    const newMessages = [...messages, newMessage]
    setMessages(newMessages)
    setMessage("");
  }

  return (
    <>
      <form onSubmit={handleSubmitMessage} className="flex flex-row align-center justify-center w-full gap-4" style={{ height: "calc(15vh - 100px}" }}>
        <div className="ml-2 w-[85%]">
          <input onChange={e => setMessage(e.target.value)} value={message} type="text" id="sender_message" class="shadow-md bg-gray-50 border-[1px] rounded-[20px] border-[rgba(241,245,249,0.7)] text-gray-900 text-md focus:ring-blue-200 focus:border-blue-200 w-full p-4" placeholder="Type your message..." required />
        </div>
        <div className="mr-2 w-[15%]">
          <button type="submit" class="flex flex-row justify-center items-center gap-[10px] shadow-md h-full text-white bg-blue-500 border-[1px] rounded-[20px] border-[rgba(241,245,249,0.7)] hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-md w-full px-3 py-2.5 text-center">Send 
            <img className="h-[15px] w-[15px]" src={sendMessagesIcon}></img>
          </button>
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
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();
  const { chains, error, isLoading, pendingChainId, switchNetwork } = useSwitchNetwork();
  const [messages, setMessages] = useState([])
  // TODO: move header into it's own component, move chainLogos with it
  const chainLogoMetadata = {
    43113: {logo: avalanche, name: "Avalanche Fuji"},
    80001: {logo: polygon, name: "Polygon Mumbai"},
    3: {logo: ethereum, name: "Ethereum Ropsten"}
  }
  const handleActiveReciever = (e, index, address) => {
    setActiveIndex(index);
    setActiveReceiver(address);
  }
  
  useEffect(() => {
    // TODO: cache messages
    const getMessagesAsync = async () => {
      const provider = await new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner();
       
      const BPublicCommuncationAddress = signer.address;
      const BPrivateCommunicationAddress = JSON.parse(localStorage.getItem("private-communication-address"));
      const identitiesTimestampQuery = `
        query {
          identities(
            from: "${BPublicCommuncationAddress}"
            first: 1
            orderBy: timestamp
            orderDirection: desc
          ) {
            communicationAddress
            timestamp
          }
        }
      `
      const dataIdentity = await graphClient.query(identitiesTimestampQuery).toPromise();
      const dataIdentityTimestamp = dataIdentity.data.identities[0].timestamp;
      const dataIdentityCommAddress = dataIdentity.data.identities[0].communicationAddress; // TODO: Use this to check that this address matches our comm address
      
      const messagesQuery = `
        query {
          messages(where: {timestamp_gte: "${dataIdentityTimestamp}"}, from: "${BPrivateCommunicationAddress}", orderBy: timestamp, orderDirection: desc) {
            message,
            timestamp,
            reciever     
          }
        }
      `
      const dataMessages = await graphClient.query(messagesQuery).toPromise();
      // const dataMessagesParsed = dataMessages.data.messages;
      console.log("dataMessages", dataMessages)
      let messages = []
      for (let idx = 0; idx < dataMessages.length; idx++) {
        let message = await dataMessages[idx].message;
        await message.push({from: BPublicCommuncationAddress});
        console.log(message)
        await messages.push(message);
        // const decryptedMessage = await EthCrypto.decryptWithPrivateKey(
        //   BPrivateCommunicationAddress,
        //   EthCrypto.cipher.parse(message)
        // );
        // console.log(`Decrypted message ${idx} >>>`, decryptedMessage);
      }
      console.log("fetched messages", await messages); 
      setMessages(messages);
      return await messages
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
          {/* Header */}
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
                  <img className="w-[25px]" src={chainLogoMetadata[chain.id].logo}></img>
                  {chainLogoMetadata[chain.id].name}
                  <img src={dropdown}></img>
                </>
              )}
            </button>
            <button
              className="flex flex-row justify-center items-center gap-[10px] px-5 py-3 bg-white text-black font-bold rounded-[30px] border-[3px] border-[#333333]"
              onClick={() => disconnect()}
            >
              {`${address.substring(0, 4)}...${address.substring(38)}`}
              <img src={logout}></img>
            </button>
            <button
              className="flex flex-row justify-center items-center gap-[10px] px-5 py-3 bg-[rgb(44,157,218)] text-white font-bold rounded-[30px] border-[3px] border-[#333333]"
              onClick={toggleOpenCommAddressModal}
            >
              Change keys
              <img className="h-[20px] w-[20px]" src={changeKeysIcon}></img>
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
            <ChatBox messages={messages} setMessages={setMessages} receiverAddress={activeReceiverAddress} />
            <SendMessages messages={messages} setMessages={setMessages} receiverAddress={activeReceiverAddress} />
          </div> : ""
        }
      </div>
    </div>
  );
}
