import {useMoralis, useWeb3Contract} from "react-moralis";
import {gql, useQuery} from "@apollo/client";
import zodiacNftAbi from "../contracts/zodiac-nft-abi";
import nftMarketplaceAbi from "../contracts/nft-marketplace-abi";
import contractAddresses from "../contracts/contract-addresses";
import {useEffect} from "react";

export const useFetchListings = () => {
  const query = gql`{
    listings(where: {buyer: "0x0000000000000000000000000000000000000000"}) {
      nftAddress
      price
      seller
      tokenId
    }
  }`
  const {data, loading} = useQuery(query)
  const listings = data && (data as {listings: any}).listings
  return {
    data: listings as (undefined | Array<{nftAddress: string, tokenId: string, seller: string, price: string}>),
    loading
  }
}

export const useListNftHandler = (nftAddress: string, tokenId: string | number, listingPrice: string | number) => {

  const {chainId} = useMoralis()
  const nftMarketplaceAddress = contractAddresses[String(Number(chainId!))].nftMarketplace
  const price = BigInt(listingPrice) * BigInt("1" + "0".repeat(18))

  const {runContractFunction: approveNft} = useWeb3Contract({
    abi: zodiacNftAbi,
    contractAddress: nftAddress,
    functionName: "approve",
    params: { to: nftMarketplaceAddress, tokenId }
  })

  const {runContractFunction: listNft} = useWeb3Contract({
    abi: nftMarketplaceAbi,
    contractAddress: nftMarketplaceAddress,
    functionName: "listNft",
    params: { nftAddress, tokenId, price }
  })

  return async () => {
    await approveNft({
      onSuccess: async (tx: any) => await tx.wait(1),
      onError: (err) => console.log("error approving nft", err)
    })
    await listNft({
      onSuccess: async (tx: any) => await tx.wait(1),
      onError: (err) => console.log("error listing nft", err)
    })
  }

}
