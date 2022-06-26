import {React, useState, useEffect} from "react";
import EchoJSON from "../../artifacts/contracts/Echo.sol/Echo.json";
import {Contract, ethers} from "ethers";
import EthCrypto from "eth-crypto";
import '@rainbow-me/rainbowkit/styles.css';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import {
  chain,
  configureChains,
  createClient,
  WagmiConfig,
  useAccount,
  useEnsAvatar,
  useEnsName,
  useConnect,
  useDisconnect
} from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

import logo from './assets/echooo.svg';
import textBubble from './assets/text-bubble.svg';
import matic from './assets/matic.svg';

const { chains, provider } = configureChains(
  [chain.mainnet, chain.polygon, chain.optimism],
  [
    alchemyProvider({ alchemyId: process.env.ALCHEMY_ID }),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

const contractAddress = "0xB149b57dD9EF08A9728612dAE867c2e602480D21";
const echoContract = new ethers.Contract(
  contractAddress,
  EchoJSON.abi,
  provider
);

const createCommunicationAddress = async (account) => {
  const ethWallet = EthCrypto.createIdentity();
  const tx = await echoContract
    .connect(account)
    .logIdentity(ethWallet.publicKey);
  await tx.wait();
  return ethWallet.privateKey;
}

const sendMessage = async (message, bIdentity) => {

}

const receiveMessage = async () => {

}
export default function App() {
  const [commPrivateKey, setCommPrivateKey] = useState(JSON.parse(localStorage.getItem("commPrivateKey") || ""));
  const { data: account } = useAccount();
  const { ensAvatar } = useEnsAvatar({ addressOrName: account?.address });
  const { data: ensName } = useEnsName({ address: account?.address });
  const { connect, connectors, error, isConnecting, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();
  
  useEffect(() => {
    // const newCommPrivateKey = generateCommunicationKeys(account);
    // setCommPrivateKey(newCommPrivateKey);
    localStorage.setItem("commPrivateKey", JSON.stringify(commPrivateKey));
  }, [commPrivateKey]);

  return (
    <div className='flex flex-row h-[100vh] bg-gradient-bg' style={{backgroundRepeat: "no-repeat"}}>
      <div className='flex flex-col w-[25%] border-r-[2px] border-slate-300'>
        
      </div>
      <div className='flex flex-row items-center justify-between px-[20px] py-[40px] h-[100px]'>
        <img className='h-[30px]' src={logo}>
        </img>
        <div className='flex flex-row gap-4'>
          <div className='flex flex-row gap-[10px] bg-sky-100 px-[15px] py-[10px] rounded-md text-black font-bold'>
            <img src={matic}>
            </img>
            Polygon
          </div>
          <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider chains={chains}>
              <ConnectButton />
            </RainbowKitProvider>
          </WagmiConfig>
          <div className='flex flex-row gap-[10px] bg-gradient-to-r from-cyan-500 to-pink-600 px-[15px] py-[10px] rounded-3xl text-white'>
            Start new chat
            <img src={textBubble}></img>
          </div>
        </div>
      </div>
      <div>
        {"test"}
      </div>
    </div>
  );
}