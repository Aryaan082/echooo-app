// import '@rainbow-me/rainbowkit/styles.css'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ethers } from 'ethers';
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

const contract_abi = {
  "_format": "hh-sol-artifact-1",
  "contractName": "Echo",
  "sourceName": "contracts/Echo.sol",
  "abi": [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "communicationAddress",
          "type": "address"
        }
      ],
      "name": "Identity",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "reciever",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "message",
          "type": "string"
        }
      ],
      "name": "Message",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "communicationAddress_",
          "type": "address"
        }
      ],
      "name": "logIdentity",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "reciever_",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "message_",
          "type": "string"
        }
      ],
      "name": "logMessage",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ],
  "bytecode": "0x608060405234801561001057600080fd5b50610278806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c8063277f37f61461003b578063ec985cbf14610050575b600080fd5b61004e61004936600461011c565b610063565b005b61004e61005e3660046100fb565b6100a8565b816001600160a01b03167f811f7cff0a3374ff67cccc3726035d34ba70410e0256818a891e4d6acc01d88e8260405161009c91906101d9565b60405180910390a25050565b6040516001600160a01b038216907f5539daaa46b59a520a05bd9b6beef0b7e376dd7dedd3073653e7a68f34a2273790600090a250565b80356001600160a01b03811681146100f657600080fd5b919050565b60006020828403121561010c578081fd5b610115826100df565b9392505050565b6000806040838503121561012e578081fd5b610137836100df565b9150602083013567ffffffffffffffff80821115610153578283fd5b818501915085601f830112610166578283fd5b8135818111156101785761017861022c565b604051601f8201601f19908116603f011681019083821181831017156101a0576101a061022c565b816040528281528860208487010111156101b8578586fd5b82602086016020830137856020848301015280955050505050509250929050565b6000602080835283518082850152825b81811015610205578581018301518582016040015282016101e9565b818111156102165783604083870101525b50601f01601f1916929092016040019392505050565b634e487b7160e01b600052604160045260246000fdfea26469706673582212209ca7935a56c4a1669532f7300f61941d3554dc8225d5bdd4fc41c489aac7c30964736f6c63430008040033",
  "deployedBytecode": "0x608060405234801561001057600080fd5b50600436106100365760003560e01c8063277f37f61461003b578063ec985cbf14610050575b600080fd5b61004e61004936600461011c565b610063565b005b61004e61005e3660046100fb565b6100a8565b816001600160a01b03167f811f7cff0a3374ff67cccc3726035d34ba70410e0256818a891e4d6acc01d88e8260405161009c91906101d9565b60405180910390a25050565b6040516001600160a01b038216907f5539daaa46b59a520a05bd9b6beef0b7e376dd7dedd3073653e7a68f34a2273790600090a250565b80356001600160a01b03811681146100f657600080fd5b919050565b60006020828403121561010c578081fd5b610115826100df565b9392505050565b6000806040838503121561012e578081fd5b610137836100df565b9150602083013567ffffffffffffffff80821115610153578283fd5b818501915085601f830112610166578283fd5b8135818111156101785761017861022c565b604051601f8201601f19908116603f011681019083821181831017156101a0576101a061022c565b816040528281528860208487010111156101b8578586fd5b82602086016020830137856020848301015280955050505050509250929050565b6000602080835283518082850152825b81811015610205578581018301518582016040015282016101e9565b818111156102165783604083870101525b50601f01601f1916929092016040019392505050565b634e487b7160e01b600052604160045260246000fdfea26469706673582212209ca7935a56c4a1669532f7300f61941d3554dc8225d5bdd4fc41c489aac7c30964736f6c63430008040033",
  "linkReferences": {},
  "deployedLinkReferences": {}
};

export default async function App() {
  const API_KEY = process.env.API_KEY;
  const PRIVATE_KEY = process.env.PRIVATE_KEY;
  const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

  const alchemyProvider = new ethers.providers.AlchemyProvider(80001, API_KEY);
  const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, contract_abi, signer);
  

  


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