import { useConnect } from "wagmi";
import metamask from "../assets/metamask-wallet-logo.png";
import coinbase from "../assets/coinbase-wallet-logo.svg";
import walletConnect from "../assets/wallet-connect-wallet-logo.svg";

export default function WalletOptions() {
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();

  const walletOptionLogos = {
    metaMask: metamask,
    coinbaseWallet: coinbase,
    walletConnect: walletConnect,
    injected: "",
  };

  return (
    <div className="flex flex-col gap-[10px] items-center">
      {connectors.map((connector) => (
        <button
          disabled={!connector.ready}
          key={connector.id}
          onClick={() => connect({ connector })}
          className="flex flex-row justify-between border border-[#c7cad4] bg-[#edeef2] text-left w-[384px] py-4 px-4 rounded-xl font-medium"
        >
          {connector.name}
          {/* {!connector.ready && " (unsupported)"} */}
          {/* {isLoading &&
            connector.id === pendingConnector?.id &&
            " (connecting)"} */}
          {console.log(connector.id)}
          <img
            className="flex items-center w-[25px]"
            src={walletOptionLogos[connector.id]}
          ></img>
        </button>
      ))}

      {error && <div>{error.message}</div>}
    </div>
  );
}
