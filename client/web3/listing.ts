import {useMoralis, useWeb3Contract} from "react-moralis";
import {gql, useQuery} from "@apollo/client";
import zodiacNftAbi from "../src/contracts/zodiac-nft-abi";
import nftMarketplaceAbi from "../src/contracts/nft-marketplace-abi";
import contractAddresses from "../src/contracts/contract-addresses";
import {useUtil} from "../src/providers/UtilProvider";

export const useFetchAllListings = () => {
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
  const price = BigInt(Number(listingPrice) * 1e18)
  const {notify} = useUtil()

  const {runContractFunction: approveNft} = useWeb3Contract({
    abi: zodiacNftAbi,
    contractAddress: nftAddress,
    functionName: "approve",
    params: { to: nftMarketplaceAddress, tokenId }
  })

  const {runContractFunction: getApprovedAddress} = useWeb3Contract({
    abi: zodiacNftAbi,
    contractAddress: nftAddress,
    functionName: "getApproved",
    params: { tokenId }
  })

  const {runContractFunction: listNft} = useWeb3Contract({
    abi: nftMarketplaceAbi,
    contractAddress: nftMarketplaceAddress,
    functionName: "listNft",
    params: { nftAddress, tokenId, price }
  })

  return async () => {
    const approvedAddress = await getApprovedAddress()
    if (approvedAddress !== nftMarketplaceAddress) {
      await approveNft({
        onSuccess: async (tx: any) => {
          await tx.wait(1)
          await listNft({
            onSuccess: async (tx: any) => {
              await tx.wait(1)
              notify("NFT listed")
            },
            onError: (err) => console.log("error listing nft", err)
          })
        },
        onError: (err) => console.log("error approving nft", err)
      })
    } else {
      await listNft({
        onSuccess: async (tx: any) => {
          await tx.wait(1)
          notify("NFT listed")
        },
        onError: (err) => console.log("error listing nft", err)
      })
    }
  }
}

export const useBuyNftHandler = () => {
  const {chainId} = useMoralis()
  const nftMarketplaceAddress = contractAddresses[String(Number(chainId!))]?.nftMarketplace
  const {notify} = useUtil()

  // @ts-ignore
  const {runContractFunction} = useWeb3Contract()

  return {
    run: async (nftAddress: string, tokenId: string, priceWei: string | number) => {
      await runContractFunction({
        params: {
          abi: nftMarketplaceAbi,
          contractAddress: nftMarketplaceAddress,
          functionName: "buyItem",
          params: { nftAddress, tokenId },
          msgValue: priceWei
        },
        onSuccess: async (tx: any) => {
          await tx.wait(1)
          notify("NFT bought")
        },
        onError: err => console.log(err)
      })
    }
  }
}

export const useFetchNftListing = (nftAddress: string, tokenId: string | number) => {
  const query = gql`{
    listings(where: {nftAddress: "${nftAddress}", tokenId: "${tokenId}"}) {
      price
      nftAddress
      tokenId
      seller
    }
  }`
  const {data, loading} = useQuery(query)
  const listings = data && (data as {listings: any}).listings
  return {
    data: listings as (undefined | Array<{nftAddress: string, tokenId: string, seller: string, price: string}>),
    loading
  }
}
