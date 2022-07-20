import { useAccount, useDisconnect, useNetwork } from "wagmi";
import logout from "../assets/logout-icon.svg";
import textBubble from "../assets/text-bubble-icon.svg";
import logo from "../assets/echooo.svg";
import avalancheSVG from "../assets/avalanche-icon.svg";

// shadow-[-5px_5px__0px_#333333]

export default function MessagingPage({ toggleOpenModalChainSelect }) {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const reciever = "0xE8F6EcAa58DCd56013C1013Fd167Edf4dB3e5C96";
  return (
    <div
      className="flex flex-row h-[100vh] w-[100vw] bg-gradient-bg"
      style={{ backgroundRepeat: "round" }}
    >
      {/* Left Column */}
      <div className="flex flex-col justify-center text-center border-r-[3px] border-[#333333] border-opacity-10 w-[30%]">
        <code>
          You have no chats, anon <br />
          ¯\_(ツ)_/¯
        </code>
      </div>
      {/* Right Column */}
      <div className="w-[70%]">
        {/* Header */}
        <div className="flex flex-row justify-between items-center px-[20px] py-[40px] h-[100px] w-full">
          <img className="h-[30px]" src={logo}></img>
          <div className="flex flex-row gap-4">
            <button
              className="flex flex-row gap-[15px] px-5 py-3 bg-white text-black font-bold rounded-[30px] border-[3px] border-[#333333]"
              onClick={toggleOpenModalChainSelect}
            >
              <img src={avalancheSVG}></img>
              Avalanche
            </button>
            <button
              className="flex flex-row gap-[15px] px-5 py-3 bg-white text-black font-bold rounded-[30px] border-[3px] border-[#333333]"
              onClick={() => disconnect()}
            >
              {`${address.substring(0, 4)}...${address.substring(38)}`}
              <img src={logout}></img>
            </button>
            <button className="flex flex-row gap-[15px] px-5 py-3 bg-gradient-to-r from-[#00FFD1] to-[#FF007A] via-[#9b649c] text-white font-bold rounded-[30px] border-[3px] border-[#333333]">
              Start new chat
              <img src={textBubble}></img>
            </button>
          </div>
        </div>
        {/* Chat */}
        <div className="flex flex-col w-full mt-5">
          {/* Reciever */}
          <div className="w-full" style={{ height: "calc(5vh - 100px}" }}>
            <div className="flex justify-center align-center">
              <div className="shadow-md flex flex-wrap rounded-[10px] border-[1px] p-5 bg-[rgba(241,245,249,0.5)] text-center text-md break-words">
                {reciever}
              </div>
            </div>
          </div>
          {/* Chat box */}
          <div className="w-full overflow-scroll" style={{ height: "calc(82.5vh - 100px)" }}>
            {/* Sender */}
            <div className="pl-3">
              <div className="flex flex-row gap-4">
                <div className="bg-gray-100 p-4 rounded-lg border-[2px] border-[rgba(241,245,249)]">sup, anon!</div>
              </div>
              <div className="pt-3 text-xs text-gray-500 italic">
                {`${reciever.substring(0, 4)}...${reciever.substring(38)}, 04:20 am`}
              </div>
            </div>

            {/* Reciever */}
            <div>
              <div className="pr-3">
                <div className="flex flex-row justify-end gap-4">
                  <div className="bg-gray-100 p-4 rounded-lg border-[2px] border-[rgba(241,245,249)]">gm!</div>
                </div>
                <div className="flex flex-row justify-end gap-4 pt-3 text-xs text-gray-500 italic">
                  {`${address.substring(0, 4)}...${address.substring(38)}, 04:21 am`}
                </div>
              </div>
            </div>
          </div>
          {/* Send message */}
          <form className="flex flex-row align-center justify-center w-full gap-4" style={{ height: "calc(15vh - 100px}" }}>
            <div className="ml-2 w-[85%]">
              <input type="text" id="sender_message" class="shadow-md bg-gray-50 border-[1px] rounded-[20px] border-[rgba(241,245,249,0.7)] text-gray-900 text-md focus:ring-blue-200 focus:border-blue-200 w-full p-4" placeholder="Type your message..." required />
            </div>
            <div className="mr-2 w-[15%]">
              <button type="button" class="shadow-md h-full text-white bg-blue-500 border-[1px] rounded-[20px] border-[rgba(241,245,249,0.7)] hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-md w-full px-3 py-2.5 text-center">Send ✉️</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
