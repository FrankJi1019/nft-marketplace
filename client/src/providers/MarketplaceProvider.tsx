import {createContext, FC, ReactNode, useCallback, useContext} from "react";
import {useBuyNftHandler, useCancelListingHandler, useListNftHandler} from "../web3/listing";

const context = createContext({} as {
  listNft: (nftAddress: string, tokenId: string, price: string) => void,
  cancelListing: (nftAddress: string, tokenId: string) => void,
  buyNft:(nftAddress: string, tokenId: string, price: string) => void
})

const MarketplaceProvider: FC<{children: ReactNode}> = ({children}) => {

  const listNftHandler = useListNftHandler()
  const cancelListingHandler = useCancelListingHandler()
  const buyNftHandler = useBuyNftHandler()

  const listNft = useCallback(async (nftAddress: string, tokenId: string, price: string) => {
    await listNftHandler(nftAddress, tokenId, price)
  }, [listNftHandler])

  const cancelListing = useCallback(async (nftAddress: string, tokenId: string) => {
    await cancelListingHandler(nftAddress, tokenId)
  }, [cancelListingHandler])

  const buyNft = useCallback(async (nftAddress: string, tokenId: string, price: string) => {
    console.log("buying nft")
    await buyNftHandler(nftAddress, tokenId, price)
  }, [buyNftHandler])

  return (
    <context.Provider value={{listNft, cancelListing, buyNft}}>
      {children}
    </context.Provider>
  )
}

export default MarketplaceProvider

export const useMarketplace = () => useContext(context)
