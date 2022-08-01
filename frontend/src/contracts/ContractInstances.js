import { useContract, useNetwork, useSigner } from "wagmi";

import EchoJSON from "./Echo.sol/Echo.json";

const contractEchoAddress = {
  43113: "0x79DD6a9aF59dE8911E5Bd83835E960010Ff6887A",
  80001: "0x21e29E3038AeCC76173103A5cb9711Ced1D23C01",
};

export default async function ContractInstances() {
  const { data: signer } = useSigner();
  const { chain } = useNetwork();

  const contractEcho = useContract({
    addressOrName: contractEchoAddress[chain.id],
    contractInterface: EchoJSON.abi,
    signerOrProvider: signer,
  });

  return contractEcho;
}
