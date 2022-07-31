import { useContract, useSigner } from "wagmi";

import EchoJSON from "./Echo.sol/Echo.json";

export default function ContractInstances() {
  const { data: signer } = useSigner();

  const contractEcho = useContract({
    addressOrName: "0xf6F4A6c6F1b6189251C4eb729bf02E89D536391d",
    contractInterface: EchoJSON.abi,
    signerOrProvider: signer,
  });

  return contractEcho;
}
