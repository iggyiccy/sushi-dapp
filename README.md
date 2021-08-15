# 🏗 scaffold-eth: Uniswapper

> a component for swapping erc20s on Uniswap (plus tokenlists + local forks of mainnet!)

Read the [medium article](https://azfuller20.medium.com/swap-with-uniswap-wip-f15923349b3d)!

---

## quickstart

```bash
git clone -b uniswapper https://github.com/austintgriffith/scaffold-eth.git uniswapper-scaffold

cd uniswapper-scaffold
```

```bash

yarn install

```

```bash

yarn start

```

- In a second terminal window run:

```bash

yarn fork

```
This branch uses a local fork of mainnet, which is easy to do with Hardhat ([see here to learn more](https://hardhat.org/guides/mainnet-forking.html)). The template configuration uses an Infura node, however this is not a full archive node, so it will only work for an hour or so. To get a long-lasting fork...
- Go to alchemyapi.io and get an API key for mainnet
- Replace the Infura URL with an Alchemy URL with your API key (i.e. https://eth-mainnet.alchemyapi.io/v2/<API_KEY_HERE>) into the `fork` script on line 28 of /packages/hardhat/package.json

📱 Open http://localhost:3000 to see the app

Notes:
- This widget uses [tokenlists](https://tokenlists.org/) to import the erc20s of your choice


Iggy's Notes: 

Reference - https://azfuller20.medium.com/swap-with-uniswap-wip-f15923349b3d

1. replaced package.json API key
2. yarn add @sushiswap/sdk
3. copy swap.jsx as sushiswap.jsx
4. change route address to 0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F
5. change token list to https://github.com/sushiswap/default-token-list/blob/master/tokens/mainnet.json
6. npm i @sushiswap/default-token-list 
7. change 'https://gateway.ipfs.io/ipns/tokens.uniswap.org' to '@sushiswap/default-token-list/build/sushiswap-default.tokenlist.json'
8. from line 360 change everything into sushiswap logo, name, etc
9. updated index.js link to Sushiswap function
10. updated App.js script add-on Sushiswap 
11. use "yarn cache clean --all" to clear old yarn files, then repeat steps above 
