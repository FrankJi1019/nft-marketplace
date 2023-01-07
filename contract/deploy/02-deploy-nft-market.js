const { network } = require("hardhat")
const {developmentChainIds} = require("../helper-hardhat.config")
const print = require("format-logging")
const { verify } = require("../util");

module.exports = async ({deployments, getNamedAccounts}) => {
    const chainId = network.config.chainId;

    const {deployer} = await getNamedAccounts()
    const {deploy} = deployments

    print("Deploying NFT Market")
    const nftMarket = await deploy("NftMarket", {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: developmentChainIds.includes(chainId) ? 1 : 6
    })
    print("NFT Market deployed")

    if (!developmentChainIds.includes(chainId) && process.env.ETHERSCAN_API_KEY) {
        print("Verifying NFT Market");
        await verify(nftMarket, []);
        print("Zodiac NFT Market");
      }

}

module.exports.tags = [
    "all", "nft-market"
]
