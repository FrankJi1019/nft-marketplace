const { run } = require("hardhat")

const verify = async (contract, constructorArguments) => {
    try {
        await run("verify:verify", {
            address: contract.address,
            constructorArguments
        })
    } catch(e) {
        console.error(e)
    }
}

module.exports = {
    verify
}
