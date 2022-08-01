import { useContract, useSigner } from "wagmi";

import EchoJSON from "./Echo.sol/Echo.json";

export default async function ContractInstances() {
  const { data: signer } = useSigner();
  const chainId = await parseInt(window.ethereum.networkVersion);

  const contractEchoAddress = {
    43113: "0x79DD6a9aF59dE8911E5Bd83835E960010Ff6887A",
    80001: "0x21e29E3038AeCC76173103A5cb9711Ced1D23C01",
  };

  const contractEcho = useContract({
    addressOrName: contractEchoAddress[chainId],
    contractInterface: EchoJSON.abi,
    signerOrProvider: signer,
  });

  return contractEcho;
}
