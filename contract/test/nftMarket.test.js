const { expect } = require("chai")
const { network, deployments, getNamedAccounts, ethers } = require("hardhat")
const { developmentChainIds } = require("../helper-hardhat.config")

const chainId = network.config.chainId

developmentChainIds.includes(chainId) && describe("NftMarket contract tests", () => {

    let deployer, buyer, nftMarket, nft

    beforeEach(async () => {
        await deployments.fixture(["all"])
        deployer = (await getNamedAccounts()).deployer
        buyer = (await getNamedAccounts()).buyer
        nftMarket = await ethers.getContract("NftMarket", deployer)
        nft = await ethers.getContract("Nft", deployer)
    })

    describe("Create listing tests", () => {

        beforeEach(async () => {
            await nft.mintNft()
        })

        it("should revert with error as price is less than 0", async () => {
            await nft.approve(nftMarket.address, 0)
            await expect(
                nftMarket.createListing(nft.address, "0", "0")
            ).to.be.revertedWithCustomError(nftMarket, "NftMarket__PriceTooLow")
        })

        it("should revert with error as caller is not the owner of the NFT", async () => {
            await nft.approve(nftMarket.address, 0)
            const buyerSigner = await ethers.getSigner(buyer)
            const nftMarketBuyer = await nftMarket.connect(buyerSigner)
            await expect(
                nftMarketBuyer.createListing(nft.address, "0", ethers.utils.parseEther("1"))
            ).to.be.revertedWithCustomError(nftMarket, "NftMarket__NotOwner")
        })

        it("should revert with error as NFT is already listed", async () => {
            await nft.approve(nftMarket.address, 0)
            await nftMarket.createListing(nft.address, "0", ethers.utils.parseEther("1"))
            await expect(
                nftMarket.createListing(nft.address, "0", ethers.utils.parseEther("1"))
            ).to.be.revertedWithCustomError(nftMarket, "NftMarket__NftAlreadyListed")
        })

        it("should emit NftListed event", async () => {
            await expect(
                nftMarket.createListing(nft.address, "0", ethers.utils.parseEther("1"))
            ).to.be.revertedWithCustomError(nftMarket, "NftMarket__UnapprovedNft")
        })

        it("should emit NftListed event", async () => {
            await nft.approve(nftMarket.address, 0)
            await expect(
                nftMarket.createListing(nft.address, "0", ethers.utils.parseEther("1"))
            ).to.emit(nftMarket, "NftListed")
        })

    })

})
