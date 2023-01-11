const { ethers } = require("hardhat");
const print = require("format-logging")

const main = async () => {
    print("Listing Zodiac NFT")

    const years = [1999]
    const prices = [1]

    const zodiacNft = await ethers.getContractAt("ZodiacNft", "0xEd0424CE925364c8823263691cEd862001201bC3")
    const nftMarket = await ethers.getContract("NftMarket")

    for (let i = 0; i < years.length; i++) {
        const year = years[i]
        const price = prices[i]
        print(`Listing year ${year}`)
        try {
            await nftMarket.createListing(zodiacNft.address, year, ethers.utils.parseEther(String(price)))
            print(`Year ${year} listed`)
        } catch(e) {
            print(`Error with listing year ${year}`)
            console.log(e)
        }
    }

    print("Listing complete")

}

main().then(() => {
    process.exit(0);
})
