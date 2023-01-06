const { ethers, network } = require("hardhat")
const {developmentChainIds} = require("../helper-hardhat.config")
const print = require("format-logging")

module.exports = async ({deployments, getNamedAccounts}) => {
    
    const chainId = network.config.chainId
    if (!developmentChainIds.includes(chainId)) {
        return
    }

    print("On development chain, deploy NFT")


    const {deployer} = await getNamedAccounts()
    const {deploy} = deployments

    print("Deploying NFT")
    await deploy("Nft", {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: 1
    })
    print("NFT deployed")

}

module.exports.tags = [
    "all", "nft"
]
