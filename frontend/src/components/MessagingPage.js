import { useAccount, useDisconnect, useNetwork, useSwitchNetwork } from "wagmi";
import logout from "../assets/logout-icon.svg";
import textBubble from "../assets/text-bubble-icon.svg";
import selectedAddressEllipse from "../assets/selected-address-ellipse.png";
import continueIconColor from "../assets/continue-icon-color.svg";
import continueIcon from "../assets/continue-icon.svg";
import dropdown from "../assets/dropdown-icon.svg";
import logo from "../assets/echooo.svg";
import errorIcon from "../assets/error-icon.svg";
import avalanche from "../assets/avalanche-icon.svg";

import "../styles/receivers.css";

// shadow-[-5px_5px__0px_#333333]

export default function MessagingPage({
  toggleOpenModalChainSelect,
  communicationSetup,
  toggleOpenNewChatModal,
  chatAddresses,
  activeReceiver,
}) {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();
  const { chains, error, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork();

  return (
    <div
      className="flex flex-row h-[100vh] w-[100vw] bg-gradient-bg"
      style={{ backgroundRepeat: "round" }}
    >
      {communicationSetup ? (
        <>
          <div className="border-r-[3px] border-[#333333] border-opacity-10 w-[30%] pt-[4vh]">
            <code className="text-xl font-semibold pl-[2vw]">Chats list</code>
            <ul className="Receivers">
              {chatAddresses.map((item, index) => {
                return (
                  <button
                    className="w-[80%] flex flex-row justify-between items-center px-4 py-4 font-bold rounded-[50px]"
                    key={index}
                    id={activeReceiver === index ? "active" : "inactive"}
                  >
                    {console.log(activeReceiver)}
                    {console.log(index)}
                    <code className="flex flex-row items-center gap-4">
                      <img src={selectedAddressEllipse}></img>
                      {`${item.substring(0, 4)}...${item.substring(38)}`}
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
      <div className="flex flex-row justify-between items-center px-[20px] py-[40px] h-[100px] w-full">
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
            className="flex flex-row justify-center items-center gap-[15px] px-5 py-3 bg-gradient-to-r from-[#00FFD1] to-[#FF007A] via-[#9b649c] text-white font-bold rounded-[30px] border-[3px] border-[#333333]"
            onClick={toggleOpenNewChatModal}
          >
            Start new chat
            <img src={textBubble}></img>
          </button>
        </div>
      </div>
    </div>
  );
}
