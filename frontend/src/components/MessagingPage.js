import { useAccount, useDisconnect, useNetwork } from "wagmi";

import logout from "../assets/logout-icon.svg";
import textBubble from "../assets/text-bubble-icon.svg";
import logo from "../assets/echooo.svg";
import avalanche from "../assets/avalanche-icon.svg";

// shadow-[-5px_5px__0px_#333333]

export default function MessagingPage({ toggleOpenModalChainSelect }) {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <div
      className="flex flex-row h-[100vh] w-[100vw] bg-gradient-bg"
      style={{ backgroundRepeat: "round" }}
    >
      <div className="flex flex-col justify-center text-center border-r-[3px] border-[#333333] border-opacity-10 w-[30%]">
        <code>
          You have no chats, anon <br />
          ¯\_(ツ)_/¯
        </code>
      </div>
      <div className="flex flex-row justify-between items-center px-[20px] py-[40px] h-[100px] w-full">
        <img className="h-[30px]" src={logo}></img>
        <div className="flex flex-row gap-4">
          <button
            className="flex flex-row gap-[15px] px-5 py-3 bg-white text-black font-bold rounded-[30px] border-[3px] border-[#333333]"
            onClick={toggleOpenModalChainSelect}
          >
            <img src={avalanche}></img>
            Avalanche
          </button>
          <button
            className="flex flex-row gap-[15px] px-5 py-3 bg-white text-black font-bold rounded-[30px] border-[3px] border-[#333333]"
            onClick={() => disconnect()}
          >
            {`${address.substring(0, 4)}...${address.substring(38)}`}
            <img src={logout}></img>
          </button>
          <button className="flex flex-row gap-[15px] px-5 py-3 bg-gradient-to-r from-[#00FFD1] to-[#FF007A] via-[#9b649c] text-white font-bold rounded-[30px] border-[3px] border-[#333333] ">
            Start new chat
            <img src={textBubble}></img>
          </button>
        </div>
      </div>
    </div>
  );
}
