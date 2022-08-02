import { useContract, useNetwork, useSigner } from "wagmi";

import EchoJSON from "./Echo.sol/Echo.json";

const contractEchoAddress = {
  43113: "0x79DD6a9aF59dE8911E5Bd83835E960010Ff6887A", // AVAX FUJI
  80001: "0xb1b7467ae050C9CF91C71d8cb51c6Acc672D5157", // POLYGON MUMBAI
};

export default function ContractInstances() {
  const { data: signer } = useSigner();
  const { chain } = useNetwork();

  const contractEcho = useContract({
    addressOrName: contractEchoAddress[chain.id],
    contractInterface: EchoJSON.abi,
    signerOrProvider: signer,
  });

  return contractEcho;
}
