import { useConnect } from "wagmi";
import { Oval } from "react-loader-spinner";

import metamask from "../../assets/metamask-wallet-logo.png";
import coinbase from "../../assets/coinbase-wallet-logo.svg";
import walletConnect from "../../assets/wallet-connect-wallet-logo.svg";

export default function WalletConnector() {
  const { connect, connectors, error, isLoading } = useConnect();

  const walletOptionLogos = {
    metaMask: metamask,
    coinbaseWallet: coinbase,
    walletConnect: walletConnect,
    injected: "",
  };

  return (
    <div>
      {isLoading ? (
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
      ) : (
        <>
          <div className="font-medium text-left pb-[20px]">
            Connect a wallet
          </div>
          <div className="flex flex-col gap-[10px] items-center">
            {connectors.map((connector) => (
              <button
                disabled={!connector.ready}
                key={connector.id}
                onClick={() => connect({ connector })}
                className="flex flex-row justify-between border border-[#c7cad4] bg-[#edeef2] text-left w-[384px] py-4 px-4 rounded-xl font-medium"
              >
                {connector.name}
                <img
                  className="flex items-center w-[25px]"
                  src={walletOptionLogos[connector.id]}
                  alt=""
                ></img>
              </button>
            ))}

            {error && <div>{error.message}</div>}
          </div>
        </>
      )}
    </div>
  );
}
