const { ethers, network } = require("hardhat");
const { developmentChainIds } = require("../helper-hardhat.config");
const print = require("format-logging");
const { verify } = require("../util");

module.exports = async ({ deployments, getNamedAccounts }) => {
  const chainId = network.config.chainId;

  print("On development chain, deploy NFT");

  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;

  print("Deploying Zodiac NFT");
  const zodiacNft = await deploy("ZodiacNft", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: developmentChainIds.includes(chainId) ? 1 : 6
  });
  print("Zodiac NFT deployed");

  if (!developmentChainIds.includes(chainId) && process.env.ETHERSCAN_API_KEY) {
    print("Verifying Zodiac NFT");
    await verify(zodiacNft, []);
    print("Zodiac NFT verified");
  }
};

module.exports.tags = ["all", "zodiac-nft", "nft"];
