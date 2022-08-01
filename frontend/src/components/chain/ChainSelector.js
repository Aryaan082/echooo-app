import { useConnect, useNetwork, useSwitchNetwork } from "wagmi";
import { Oval } from "react-loader-spinner";

import ChainSelectorButton from "./ChainSelectorButton.js";

import avalanche from "../../assets/avalanche-icon.svg";
import ethereum from "../../assets/ethereum-icon.svg";
import polygon from "../../assets/polygon-icon.svg";

export default function ChainSelector() {
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { chain } = useNetwork();
  const { chains, pendingChainId, switchNetwork } = useSwitchNetwork();

  return (
    <div>
      {!isLoading ? (
        <>
          <div className="font-medium text-left pb-[20px]">
            Select a blockchain
          </div>
          <div className="flex flex-col gap-[10px] items-center">
            <ChainSelectorButton
              name="Avalanche Fuji"
              logo={avalanche}
              chainId={chains[0].id}
              selectedChainId={chain.id}
              switchNetwork={switchNetwork}
            />
            <ChainSelectorButton
              name="Polygon Mumbai"
              logo={polygon}
              chainId={chains[1].id}
              selectedChainId={chain.id}
              switchNetwork={switchNetwork}
            />
            <ChainSelectorButton
              name="Ethereum Ropsten"
              logo={ethereum}
              chainId={chains[2].id}
              selectedChainId={chain.id}
              switchNetwork={switchNetwork}
            />
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
