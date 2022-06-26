import '@rainbow-me/rainbowkit/styles.css'
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
} from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

import logo from './assets/echooo.svg';
import textBubble from './assets/text-bubble.svg';
import matic from './assets/matic.svg';

const { chains, provider } = configureChains(
  [chain.polygon, chain.optimism],
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

export default function App() {
  return (
    <div className='flex flex-row h-[100vh] w-[100vw] bg-gradient-bg' style={{backgroundRepeat: "round"}}>
      <div className='flex flex-col justify-center text-center w-[30%] border-r-[2px] border-slate-300'>
        <code>
        You have no chats, anon <br/>
              ¯\_(ツ)_/¯
        </code>
      </div>
      <div className='flex flex-row justify-between items-center px-[20px] py-[40px] h-[100px] w-full'>
        <img className='h-[30px]' src={logo}>
        </img>
        <div className='flex flex-row gap-4'>
          <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider chains={chains}>
              <ConnectButton />
            </RainbowKitProvider>
          </WagmiConfig>
          <div className='flex flex-row gap-[10px] bg-gradient-to-r from-cyan-500 to-pink-600 px-[20px] py-[10px] rounded-3xl text-white'>
            Start new chat
            <img src={textBubble}></img>
          </div>
        </div>
      </div>
    </div>
  );
}