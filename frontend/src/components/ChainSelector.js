import { useConnect } from "wagmi";
import { Oval } from "react-loader-spinner";

import avalanche from "../assets/avalanche-icon.svg";
import optimism from "../assets/optimism-icon.svg";

export default function ChainSelector() {
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();

  return (
    <div>
      {!isLoading ? (
        <>
          <div className="font-medium text-left pb-[20px]">
            Select a blockchain
          </div>
          <div className="flex flex-col gap-[10px] items-center">
            <button className="flex flex-row justify-between border border-[#c7cad4] bg-[#edeef2] text-left w-[384px] py-4 px-4 rounded-xl font-medium">
              Avalanche
              <img className="flex items-center w-[25px]" src={avalanche}></img>
            </button>
            <button className="flex flex-row justify-between border border-[#c7cad4] bg-[#edeef2] text-left w-[384px] py-4 px-4 rounded-xl font-medium">
              Optimism
              <img className="flex items-center w-[25px]" src={optimism}></img>
            </button>
            {error && <div>{error.message}</div>}
          </div>
        </>
      ) : (
        <div className="flex flex-col w-[384px] items-center justify-center gap-[20px]">
          <Oval
            ariaLabel="loading-indicator"
            height={40}
            width={40}
            strokeWidth={3}
            strokeWidthSecondary={3}
            color="black"
            secondaryColor="white"
          />
          <div className="text-xl font-medium">Connecting...</div>
        </div>
      )}
    </div>
  );
}
