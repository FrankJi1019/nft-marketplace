const { expect, assert } = require("chai")
const { network, deployments, getNamedAccounts, ethers } = require("hardhat")
const { developmentChainIds } = require("../helper-hardhat.config")
const print = require("format-logging")

const chainId = network.config.chainId

developmentChainIds.includes(chainId) && describe("NftMarket contract tests", () => {

    let deployer, buyer, nftMarket, zodiacNft
    let tokenId = 2000
    let nftPrice = "1"

    beforeEach(async () => {
        await deployments.fixture(["all"])
        deployer = (await getNamedAccounts()).deployer
        buyer = (await getNamedAccounts()).buyer
        nftMarket = await ethers.getContract("NftMarket", deployer)
        zodiacNft = await ethers.getContract("ZodiacNft", deployer)
    })

    describe("List NFT tests", () => {

        beforeEach(async () => {
            await zodiacNft.mintNft(tokenId)
        })

        it("should revert with error as price is less than 0", async () => {
            await zodiacNft.approve(nftMarket.address, tokenId)
            await expect(
                nftMarket.listNft(zodiacNft.address, tokenId, 0)
            ).to.be.revertedWithCustomError(nftMarket, "NftMarket__PriceTooLow")
        })

        it("should revert with error as caller is not the owner of the NFT", async () => {
            await zodiacNft.approve(nftMarket.address, tokenId)
            const buyerSigner = await ethers.getSigner(buyer)
            const nftMarketBuyer = await nftMarket.connect(buyerSigner)
            await expect(
                nftMarketBuyer.listNft(zodiacNft.address, tokenId, ethers.utils.parseEther(nftPrice))
            ).to.be.revertedWithCustomError(nftMarket, "NftMarket__NotOwner")
        })

        it("should revert with error as the nft has not been approved", async () => {
            await expect(
                nftMarket.listNft(zodiacNft.address, tokenId, ethers.utils.parseEther(nftPrice))
            ).to.be.revertedWithCustomError(nftMarket, "NftMarket__UnapprovedNft")
        })

        it("should emit NftListed event (nft not listed)", async () => {
            await zodiacNft.approve(nftMarket.address, tokenId)
            await expect(
                nftMarket.listNft(zodiacNft.address, tokenId, ethers.utils.parseEther(nftPrice))
            ).to.emit(nftMarket, "NftListed")
        })

        it("should emit NftListed event (nft listed)", async () => {
            await zodiacNft.approve(nftMarket.address, tokenId)
            nftMarket.listNft(zodiacNft.address, tokenId, ethers.utils.parseEther(nftPrice))
            await expect(
                nftMarket.listNft(zodiacNft.address, tokenId, ethers.utils.parseEther(nftPrice))
            ).to.emit(nftMarket, "NftListed")
        })

    })

    describe("buy item tests", () => {

        beforeEach(async () => {
            await zodiacNft.mintNft(tokenId)
            await zodiacNft.mintNft(tokenId + 1)
            await zodiacNft.approve(nftMarket.address, tokenId)
            await zodiacNft.approve(nftMarket.address, tokenId + 1)
            await nftMarket.listNft(zodiacNft.address, tokenId, ethers.utils.parseEther(nftPrice))
        })

        it("should revert as the nft is not listed", async () => {
            await expect(
                nftMarket.buyItem(zodiacNft.address, tokenId + 1, { value: ethers.utils.parseEther(nftPrice) })
            ).to.be.revertedWithCustomError(nftMarket, "NftMarket__NftNotListed")
        })

        it("should revert as fund is not enough", async () => {
            await expect(
                nftMarket.buyItem(
                    zodiacNft.address, 
                    tokenId, 
                    { value: ethers.utils.parseEther(String(Number(nftPrice) / 2)) }
                )
            ).to.be.revertedWithCustomError(nftMarket, "NftMarket__NotEnoughFund")
        })

        it("should emit NftBought event", async () => {
            await expect(
                nftMarket.buyItem(zodiacNft.address, tokenId, { value: ethers.utils.parseEther(nftPrice) })
            ).to.emit(nftMarket, "NftBought")
        })

    })

    describe("cancel listing tests", () => {

        beforeEach(async () => {
            await zodiacNft.mintNft(tokenId)
            await zodiacNft.mintNft(tokenId + 1)
            await zodiacNft.approve(nftMarket.address, tokenId)
            await zodiacNft.approve(nftMarket.address, tokenId + 1)
            await nftMarket.listNft(zodiacNft.address, tokenId, ethers.utils.parseEther(nftPrice))
        })

        it("should revert as NFT is not listed", async () => {
            await expect(
                nftMarket.cancelListing(zodiacNft.address, tokenId + 1)
            ).to.be.revertedWithCustomError(nftMarket, "NftMarket__NftNotListed")
        })

        it("should revert as caller is not the owner of the NFT", async () => {
            const buyerSigner = await ethers.getSigner(buyer)
            const nftMarketBuyer = await nftMarket.connect(buyerSigner)
            await expect(
                nftMarketBuyer.cancelListing(zodiacNft.address, tokenId)
            ).to.be.revertedWithCustomError(nftMarket, "NftMarket__NotOwner")
        })

        it("should emit ListingDeleted event", async () => {
            await expect(
                nftMarket.cancelListing(zodiacNft.address, tokenId)
            ).to.emit(nftMarket, "ListingDeleted")
        })

    })

    describe("withdraw proceeds tests", () => {
    
        beforeEach(async () => {
            await zodiacNft.mintNft(tokenId)
            await zodiacNft.approve(nftMarket.address, tokenId)
            await nftMarket.listNft(zodiacNft.address, tokenId, ethers.utils.parseEther(nftPrice))
            const buyerSigner = await ethers.getSigner(buyer)
            const nftMarketBuyer = await nftMarket.connect(buyerSigner)
            nftMarketBuyer.buyItem(zodiacNft.address, tokenId, { value: ethers.utils.parseEther(nftPrice) })
        })

        it("should revert as the caller does not have any proceed", async () => {
            const buyerSigner = await ethers.getSigner(buyer)
            const nftMarketBuyer = await nftMarket.connect(buyerSigner)
            await expect(
                nftMarketBuyer.withdraw()
            ).to.be.revertedWithCustomError(nftMarket, "NftMarket__NoProceeds")
        })

        it("should transfer the fund to the caller's account", async () => {

            const startingFund = await nftMarket.provider.getBalance(deployer)
            
            const tx = await nftMarket.withdraw()
            const receipt = await tx.wait(1)
            const { gasUsed, effectiveGasPrice } = receipt
            const gasCost = gasUsed.mul(effectiveGasPrice)

            const endingFund = await nftMarket.provider.getBalance(deployer)

            const actual = startingFund.add(ethers.utils.parseEther(nftPrice))
            const expected = endingFund.add(gasCost)

            expect(actual).to.be.equal(expected)

        })

    })

})
