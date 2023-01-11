require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("dotenv").config();
require("solidity-coverage");

const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL;
const GOERLI_ACCOUNT = process.env.PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

module.exports = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: GOERLI_RPC_URL,
      accounts: [GOERLI_ACCOUNT],
      chainId: 5,
      gas: 2100000,
      gasPrice: 8000000000,
      allowUnlimitedContractSize: true
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    buyer: {
      default: 1,
    },
  },
  etherscan: {
    apiKey: {
      goerli: ETHERSCAN_API_KEY
    },
  },
};
