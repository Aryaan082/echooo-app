import { WagmiConfig, createClient, defaultChains } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { getDefaultProvider } from "ethers";

import Profile from "./Profile";

const alchemyId = process.env.ALCHEMY_ID;

console.log(defaultChains[80001]);

// const { chains, provider } = configureChains(defaultChains, [
//   alchemyProvider({ alchemyId }),
//   publicProvider(),
// ]);

const client = createClient({
  autoConnect: true,
  provider: getDefaultProvider(),
});

// const wagmiClient = createClient({
//   autoConnect: true,
//   connectors: [new InjectedConnector({ chains })],
//   provider,
// });

export default function App() {
  return (
    <WagmiConfig client={client}>
      <Profile />
    </WagmiConfig>
  );
}
