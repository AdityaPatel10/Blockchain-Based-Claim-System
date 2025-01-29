/* eslint-disable @typescript-eslint/no-require-imports */
require("@nomicfoundation/hardhat-toolbox");

const infuraProjectId = "46774284d91340bcb320d96207b81db8";
const PRIVATE_KEY =
  "ae01353949a41c233aaa8130ca12477d7a761ba0a180d8601cdc1790ba9a70f1";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "localhost",
  networks: {
    hardhat: {},
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${infuraProjectId}`,
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
    },
    zksyncSepolia: {
      url: "https://sepolia.era.zksync.dev",
      accounts: [PRIVATE_KEY],
      chainId: 300,
      gasPrice: "auto",
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${infuraProjectId}`,
      accounts: [PRIVATE_KEY],
      chainId: 5,
    },
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${infuraProjectId}`,
      accounts: [PRIVATE_KEY],
      chainId: 80001,
      gasPrice: "auto",
    },
    "arbitrum-goerli": {
      url: `https://arbitrum-goerli.infura.io/v3/${infuraProjectId}`,
      accounts: [PRIVATE_KEY],
      chainId: 421613,
    },
    "optimism-goerli": {
      url: `https://optimism-goerli.infura.io/v3/${infuraProjectId}`,
      accounts: [PRIVATE_KEY],
      chainId: 420,
    },
    "base-goerli": {
      url: "https://goerli.base.org",
      accounts: [PRIVATE_KEY],
      chainId: 84531,
      gasPrice: "auto",
    },
  },
  solidity: "0.8.28",
};
