import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import "antd/dist/antd.css";
import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import "./App.css";
import { Row, Col, Button, Menu, Input, Typography } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useUserAddress } from "eth-hooks";
// eslint-disable-next-line
import { useExchangePrice, useGasPrice, useUserProvider } from "./hooks";
// eslint-disable-next-line
import { Header, Account, Faucet, Ramp, Contract, GasGauge, Swap, Sushiswap } from "./components";
import { Transactor } from "./helpers";
// eslint-disable-next-line
import { formatEther, parseEther } from "@ethersproject/units";
//import Hints from "./Hints";
// eslint-disable-next-line
import { Hints } from "./views";

// eslint-disable-next-line
import { INFURA_ID, DAI_ADDRESS, DAI_ABI } from "./constants";
const { Text, Title, Paragraph } = Typography;

// 😬 Sorry for all the console logging 🤡
const DEBUG = true;

// 🔭 block explorer URL
const blockExplorer = "https://etherscan.io/"; // for xdai: "https://blockscout.com/poa/xdai/"

// 🛰 providers
if (DEBUG) console.log("📡 Connecting to Mainnet Ethereum");
//const mainnetProvider = getDefaultProvider("mainnet", { infura: INFURA_ID, etherscan: ETHERSCAN_KEY, quorum: 1 });
// const mainnetProvider = new InfuraProvider("mainnet",INFURA_ID);
const mainnetProvider = new JsonRpcProvider("https://mainnet.infura.io/v3/" + INFURA_ID);
// ( ⚠️ Getting "failed to meet quorum" errors? Check your INFURA_ID)

// 🏠 Your local provider is usually pointed at your local blockchain
const localProviderUrl = "http://localhost:8545"; // for xdai: https://dai.poa.network
// as you deploy to other networks you can set REACT_APP_PROVIDER=https://dai.poa.network in packages/react-app/.env
const localProviderUrlFromEnv = process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : localProviderUrl;
if (DEBUG) console.log("🏠 Connecting to provider:", localProviderUrlFromEnv);
const localProvider = new JsonRpcProvider(localProviderUrlFromEnv);

function App(props) {
  const [injectedProvider, setInjectedProvider] = useState();
  /* 💵 this hook will get the price of ETH from 🦄 Uniswap: */
  const price = useExchangePrice(mainnetProvider); //1 for xdai

  /* 🔥 this hook will get the price of Gas from ⛽️ EtherGasStation */
  const gasPrice = useGasPrice("fast"); //1000000000 for xdai

  // For more hooks, check out 🔗eth-hooks at: https://www.npmjs.com/package/eth-hooks

  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userProvider = useUserProvider(injectedProvider, localProvider);
  const address = useUserAddress(userProvider);

  // The transactor wraps transactions and provides notificiations
  // eslint-disable-next-line
  const tx = Transactor(userProvider, gasPrice);

  // eslint-disable-next-line
  const [showNetworkWarning, setShowNetworkWarning] = useState(false);

  if (window.ethereum) {
    window.ethereum.autoRefreshOnNetworkChange = false;
  }

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();

    const newInjectedNetwork = async chainId => {
      let localNetwork = await localProvider.getNetwork();
      if (localNetwork.chainId === chainId) {
        setShowNetworkWarning(false);
        return true;
      } else {
        setShowNetworkWarning(true);
        return false;
      }
    };

    const newWeb3Provider = async () => {
      let newWeb3Provider = new Web3Provider(provider);
      let newNetwork = await newWeb3Provider.getNetwork();
      newInjectedNetwork(newNetwork.chainId);
      setInjectedProvider(newWeb3Provider);
    };

    newWeb3Provider();

    provider.on("chainChanged", chainId => {
      let knownNetwork = newInjectedNetwork(chainId);
      if (knownNetwork) newWeb3Provider();
    });

    provider.on("accountsChanged", (accounts: string[]) => {
      console.log(accounts);
      newWeb3Provider();
    });
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  const [route, setRoute] = useState();
  useEffect(() => {
    setRoute(window.location.pathname);
  }, [setRoute]);

  const [tokenListURI, setTokenListURI] = useState(
    "@sushiswap/default-token-list/build/sushiswap-default.tokenlist.json",
  );

  let onLocalChain =
    localProvider &&
    localProvider.connection &&
    localProvider.connection.url &&
    localProvider.connection.url.indexOf("localhost") >= 0 &&
    !process.env.REACT_APP_PROVIDER;

  return (
    <div className="App">
      <div class="ocean">
        <div class="wave"></div>
        <div class="wave"></div>
      </div>
      {/* ✏️ Edit the header and change the title to your project name */}
      <Header />

      <BrowserRouter>
        <Menu style={{ textAlign: "center" }} selectedKeys={[route]} mode="horizontal">
          <Menu.Item key="/">
            <Link
              onClick={() => {
                setRoute("/");
              }}
              to="/"
            >
              Uniswap
            </Link>
          </Menu.Item>
          <Menu.Item key="/sushiswap">
            <Link
              onClick={() => {
                setRoute("/sushiswap");
              }}
              to="/sushiswap"
            >
              Sushiswap
            </Link>
          </Menu.Item>
          <Menu.Item key="/hints">
            <Link
              onClick={() => {
                setRoute("/hints");
              }}
              to="/hints"
            >
              Hints
            </Link>
          </Menu.Item>
        </Menu>

        <Switch>
          <Route exact path="/">
            <Row justify="center">
              <Swap selectedProvider={userProvider} tokenListURI={tokenListURI} />
            </Row>
          </Route>
          <Route path="/sushiswap">
            <Row justify="center">
              <Sushiswap selectedProvider={userProvider} tokenListURI={tokenListURI} />
            </Row>
          </Route>
          <Route path="/hints">
            <Title level={3}>Using the Uniswapper</Title>
            <Paragraph>
              <Text code>{`<Swap/>`}</Text> is a minimal Uniswap interface, requiring an{" "}
              <a href="https://docs.ethers.io/v5/" target="_blank" rel="noopener noreferrer">
                ethers.js
              </a>{" "}
              Provider.
            </Paragraph>
            <Paragraph>
              Click the <SettingOutlined /> on the Swapper widget to view more detailed settings (slippage tolerance,
              time limit) and other calculations.
            </Paragraph>
            {onLocalChain ? (
              <Paragraph>
                Add an{" "}
                <a href="https://alchemyapi.io/" target="_blank" rel="noopener noreferrer">
                  Alchemy API URL
                </a>{" "}
                to the fork script at <Text code>/packages/hardhat/package.json</Text> to avoid{" "}
                <Text code>archive node</Text> errors
              </Paragraph>
            ) : null}
            <Input
              placeholder="Enter tokenlist URL"
              value={tokenListURI}
              onChange={e => {
                console.log(e);
                setTokenListURI(e.target.value);
              }}
              style={{ width: 400 }}
            />
            <Paragraph>
              Enter the token list URI you would like to use (an optional parameter). Go to{" "}
              <a href="https://tokenlists.org/" target="_blank" rel="noopener noreferrer">
                tokenlists.org
              </a>{" "}
              to learn more
            </Paragraph>
          </Route>
        </Switch>
      </BrowserRouter>

      {/* 👨‍💼 Your account is in the top right with a wallet at connect options */}
      <div style={{ position: "fixed", textAlign: "right", right: 0, top: 0, padding: 10 }}>
        <Account
          address={address}
          localProvider={localProvider}
          userProvider={userProvider}
          mainnetProvider={mainnetProvider}
          price={price}
          web3Modal={web3Modal}
          loadWeb3Modal={loadWeb3Modal}
          logoutOfWeb3Modal={logoutOfWeb3Modal}
          blockExplorer={blockExplorer}
        />
      </div>

      {/* 🗺 Extra UI like gas price, eth price, faucet, and support: */}
      <div style={{ position: "fixed", textAlign: "left", left: 0, bottom: 20, padding: 10 }}>
        <Row align="middle" gutter={[4, 4]}>
          <Col span={8}>
            <Ramp price={price} address={address} />
          </Col>

          <Col span={8} style={{ textAlign: "center", opacity: 0.8 }}>
            <GasGauge gasPrice={gasPrice} />
          </Col>
          <Col span={8} style={{ textAlign: "center", opacity: 1 }}>
            <Button
              onClick={() => {
                window.open("https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA");
              }}
              size="large"
              shape="round"
            >
              <span style={{ marginRight: 8 }} role="img" aria-label="support">
                💬
              </span>
              Support
            </Button>
          </Col>
        </Row>

        <Row align="middle" gutter={[4, 4]}>
          <Col span={24}>
            {
              /*  if the local provider has a signer, let's show the faucet:  */
              onLocalChain && price > 1 ? (
                <Faucet localProvider={localProvider} price={price} ensProvider={mainnetProvider} />
              ) : (
                ""
              )
            }
          </Col>
        </Row>
      </div>
    </div>
  );
}

/*
  Web3 modal helps us "connect" external wallets:
*/
const web3Modal = new Web3Modal({
  // network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: INFURA_ID,
      },
    },
  },
});

const logoutOfWeb3Modal = async () => {
  await web3Modal.clearCachedProvider();
  setTimeout(() => {
    window.location.reload();
  }, 1);
};

export default App;
