import {useMoralis, useWeb3Contract} from "react-moralis";
import nftMarketplaceAbi from "../contracts/nft-marketplace-abi";
import contractAddresses from "../contracts/contract-addresses";
import {useUtil} from "../providers/UtilProvider";


export const useWithdrawProceedsHandler = () => {

  const {chainId} = useMoralis()
  const {notify} = useUtil()

  // @ts-ignore
  const {runContractFunction} = useWeb3Contract()

  const nftMarketplaceAddress = contractAddresses[String(Number(chainId!))]?.nftMarketplace

  return async () => {
    await runContractFunction({
      params: {
        abi: nftMarketplaceAbi,
        contractAddress: nftMarketplaceAddress,
        functionName: "withdraw",
        params: {}
      },
      onSuccess: async (tx: any) => {
        await tx.wait(1)
        notify("Proceeds withdrawn")
      },
      onError: err => console.log(err)
    })
  }
}