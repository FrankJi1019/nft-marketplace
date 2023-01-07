const { ethers } = require("hardhat");
const print = require("format-logging")

const main = async () => {
    print("Minting Zodiac NFT")

    const years = [1971, 1973]

    const zodiacNft = await ethers.getContract("ZodiacNft")

    for (let i = 0; i < years.length; i++) {
        const year = years[i]
        print(`Minting year ${year}`)
        try {
            await zodiacNft.mintNft(year)
            print(`Year ${year} minted`)
        } catch(e) {
            print(`Error with minting year ${year}`)
        }
    }

    print("Minting complete")

}

main().then(() => {
    process.exit(0);
})
