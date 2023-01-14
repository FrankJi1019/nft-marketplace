import {createContext, FC, ReactNode, useCallback, useContext} from "react";
import {useCancelListingHandler, useListNftHandler} from "../web3/listing";

const context = createContext({} as {
  listNft: (nftAddress: string, tokenId: string, price: string) => void,
  cancelListing: (nftAddress: string, tokenId: string) => void,
  buyNft:(nftAddress: string, tokenId: string) => void
})

const MarketplaceProvider: FC<{children: ReactNode}> = ({children}) => {

  const listNftHandler = useListNftHandler()
  const cancelListingHandler = useCancelListingHandler()

  const listNft = useCallback(async (nftAddress: string, tokenId: string, price: string) => {
    console.log("Listing NFT")
    await listNftHandler(nftAddress, tokenId, price)
  }, [listNftHandler])

  const cancelListing = useCallback(async (nftAddress: string, tokenId: string) => {
    console.log("cancel nft")
    await cancelListingHandler(nftAddress, tokenId)
  }, [cancelListingHandler])

  const buyNft = useCallback((nftAddress: string, tokenId: string) => {
    alert("buy nft")
  }, [])

  return (
    <context.Provider value={{listNft, cancelListing, buyNft}}>
      {children}
    </context.Provider>
  )
}

export default MarketplaceProvider

export const useMarketplace = () => useContext(context)
