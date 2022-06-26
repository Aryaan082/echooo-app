import {ethers} from "ethers";
import Web3Modal from "web3modal";
import {React, useState, useEffect } from 'react';
import WalletConnect from "@walletconnect/web3-provider";
// import MetaMask from "@metamask/web3-provider";
export default function App() {
    const [provider, setProvider] = useState();
    const [account, setAccount] = useState();
    const [error, setError] = useState("");
    const [chainId, setChainId] = useState();
    const [network, setNetwork] = useState();
    const [message, setMessage] = useState("");
    const [signedMessage, setSignedMessage] = useState("");
    const [verified, setVerified] = useState();
    
    const web3Modal = new Web3Modal({
        cacheProvider: false, // optional
        walletconnect: {
            package: WalletConnect, // required
            options: {
              infuraId: process.env.INFURA_KEY // required

            }
          },
        network: "mumbai"
      });

    const connectWallet = async () => {
      try {
        const provider = await web3Modal.connect();
        const library = new ethers.providers.Web3Provider(provider);
        const accounts = await library.listAccounts();
        const network = await library.getNetwork();
        setProvider(provider);
        if (accounts) setAccount(accounts[0]);
        setChainId(network.chainId);
      } catch (error) {
        setError(error);
      }
    };
  
    const refreshState = () => {
      setAccount();
      setChainId();
      setNetwork("");
      setMessage("");
      setVerified(undefined);
    };
  
    const disconnect = async () => {
      await web3Modal.clearCachedProvider();
      refreshState();
    };
  
    useEffect(() => {
      if (web3Modal.cachedProvider) {
        connectWallet();
      }
    }, []);
  
    useEffect(() => {
      if (provider?.on) {
        const handleAccountsChanged = (accounts) => {
          console.log("accountsChanged", accounts);
          if (accounts) setAccount(accounts[0]);
        };
  
        const handleChainChanged = (_hexChainId) => {
          setChainId(_hexChainId);
        };
  
        const handleDisconnect = () => {
          console.log("disconnect", error);
          disconnect();
        };
  
        provider.on("accountsChanged", handleAccountsChanged);
        provider.on("chainChanged", handleChainChanged);
        provider.on("disconnect", handleDisconnect);
  
        return () => {
          if (provider.removeListener) {
            provider.removeListener("accountsChanged", handleAccountsChanged);
            provider.removeListener("chainChanged", handleChainChanged);
            provider.removeListener("disconnect", handleDisconnect);
          }
        };
      }
    }, [provider]);
  
    return (
      <div>
        <div>
            {!account ? (
              <button onClick={connectWallet}>Connect Wallet</button>
            ) : (
              <button onClick={disconnect}>Disconnect</button>
            )}
          </div>
          <div>
              <div>{`Connection Status: `}</div>
              {account ? (
                <div>Logged In</div>
              ) : (
                <div>Logged Out</div>
              )}
            </div>
  
            <div label={account} placement="right">
              <div>{`Account: ${account}`}</div>
            </div>

      </div>
    );
  }
  