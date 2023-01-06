const { ethers, network } = require("hardhat")
const {developmentChainIds} = require("../helper-hardhat.config")
const print = require("format-logging")

module.exports = async ({deployments, getNamedAccounts}) => {

    const {deployer} = await getNamedAccounts()
    const {deploy} = deployments

    print("Deploying NFT Market")
    await deploy("NftMarket", {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: 1
    })
    print("NFT Market deployed")

}

module.exports.tags = [
    "all", "nft-market"
]
