import Head from "next/head";
// import Image from "next/image";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
import { whitelistContractABI, whitelistContractAddress } from "../constants";

export default function Home() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [walletConnected, setWalletConnected] = useState(false);
  const [joinedWhitelist, setJoinedWhitelist] = useState(false);
  const [noOfWhitelistedAddresses, setNoOfWhitelistAddresses] = useState(0);

  const checkWalletConnected = async () => {
    const { ethereum } = window;
    if (ethereum) {
      console.log("Ethereum object found!");
    } else {
      console.log("Not found ethereum");
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (accounts.length !== 0) {
      console.log("Authorised account found", accounts[0]);
      setCurrentAccount(accounts[0]);
      setWalletConnected(true);
      checkJoinedWhitelist();
      getWhitelistedAddresses();
    } else {
      console.log("Account not authorised");
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get Metamask");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      setWalletConnected(true);
    } catch (e) {
      console.log(e);
    }
  };

  const checkJoinedWhitelist = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const accounts = await ethereum.request({ method: "eth_accounts" });
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          whitelistContractAddress,
          whitelistContractABI.abi,
          signer
        );
        const isJoinedWhitelist = await contract.whitelistedAddresses(
          accounts[0]
        );
        setJoinedWhitelist(isJoinedWhitelist);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const addToWhitelist = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          whitelistContractAddress,
          whitelistContractABI.abi,
          signer
        );

        let txn = await contract.addToWhitelist();
        console.log("Transaction started...");

        await txn.wait();
        console.log("Transaction done!");

        checkJoinedWhitelist();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getWhitelistedAddresses = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          whitelistContractAddress,
          whitelistContractABI.abi,
          signer
        );

        const noOfwhitlisted = await contract.numOfAddressesWhitelisted();
        setNoOfWhitelistAddresses(noOfwhitlisted.toNumber());
      }
    } catch (e) {
      console.log(e);
    }
  };

  const renderButton = () => {
    if (walletConnected) {
      if (joinedWhitelist) {
        return (
          <div>
            <p className={styles.description}>
              Thank you for joining whitelist!
            </p>
          </div>
        );
      } else {
        return (
          <div>
            <button onClick={addToWhitelist}>Join whitelist</button>
          </div>
        );
      }
    } else {
      return (
        <div>
          <button onClick={connectWallet}>Connect Wallet</button>
        </div>
      );
    }
  };

  useEffect(() => {
    checkWalletConnected();
  }, []);

  return (
    <div>
      <Head>
        <title>Whitelist Dapp</title>
        <meta name="description" content="Whitelist-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to Crypto Devs!</h1>
          <div className={styles.description}>
            Its an NFT collection for developers in Crypto.
          </div>
          <div className={styles.description}>
            {noOfWhitelistedAddresses} have already joined the Whitelist
          </div>
          {renderButton()}
        </div>
        <div>
          {/* <img className={styles.image} src="./crypto-devs.svg" /> */}
        </div>
      </div>

      <footer className={styles.footer}>
        Made with &#10084; by Crypto Devs
      </footer>
    </div>
  );
}
