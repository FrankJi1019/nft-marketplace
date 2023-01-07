const { expect } = require("chai")
const { network, deployments, getNamedAccounts, ethers } = require("hardhat")
const { developmentChainIds } = require("../helper-hardhat.config")
const print = require("format-logging")

const chainId = network.config.chainId

developmentChainIds.includes(chainId) && describe("ZodiacNft contract tests", () => {

    let deployer, zodiacNft
    let tokenId = 2000
    let startYear, endYear

    const nftUri = "data:application/json;base64,eyJuYW1lIjoiWm9kaWFjIiwiZGVzY3JpcHRpb24iOiJab2RpYWMgc2VyaWVzIHRva2VuLCAyMDAwOiB5ZWFyIG9mIGRyYWdvbiIsImltYWdlIjoiaXBmczovL1FtVm1UOVFqTFFGSGdHV3FKRXY0aE05UHRKd2IzZlp3cGp2ZEdlSlF2Y3lTTlEifQ=="

    beforeEach(async () => {
        await deployments.fixture(["zodiac-nft"])
        deployer = (await getNamedAccounts()).deployer
        zodiacNft = await ethers.getContract("ZodiacNft", deployer)
        startYear = String(await zodiacNft.getStartYear())
        endYear = String(await zodiacNft.getEndYear())
    })

    describe("Mint NFT", () => {

        beforeEach(async () => {
        })

        it("should revert as the year is out of range", async () => {
            await zodiacNft.mintNft(tokenId)
            await expect(
                zodiacNft.mintNft(Number(startYear) - 1)
            ).to.be.revertedWithCustomError(zodiacNft, "ZodiacNft__YearOutOfRange")
            await expect(
                zodiacNft.mintNft(Number(endYear) + 1)
            ).to.be.revertedWithCustomError(zodiacNft, "ZodiacNft__YearOutOfRange")
        })

        it("should revert as the token id exists", async () => {
            await zodiacNft.mintNft(tokenId)
            await expect(
                zodiacNft.mintNft(tokenId)
            ).to.be.revertedWithCustomError(zodiacNft, "ZodiacNft__NftAlreadyExist")
        })

        it("should mint the NFT", async () => {
            let tokenCouter = String(await zodiacNft.getTokenCounter())
            expect(tokenCouter).to.be.equal("0")
            await zodiacNft.mintNft(tokenId)
            tokenCouter = String(await zodiacNft.getTokenCounter())
            expect(tokenCouter).to.be.equal("1")
        })

    })

    describe("get nft uri tests", async () => {

        beforeEach(async () => {
            await zodiacNft.mintNft(tokenId)
        })

        it("should revert as the token does not exist", async () => {
            expect(
                zodiacNft.tokenURI(tokenId + 1)
            ).to.be.revertedWithCustomError(zodiacNft, "ZodiacNft__NftNotExist")
        })

        it("should return encoded uri", async () => {
            const actualUri = await zodiacNft.tokenURI(tokenId)
            expect(actualUri).to.be.equal(nftUri)
        })

    })

})
