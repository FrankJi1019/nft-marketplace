import {useMoralis, useWeb3Contract} from "react-moralis";
import {gql, useQuery} from "@apollo/client";
import zodiacNftAbi from "../contracts/zodiac-nft-abi";
import nftMarketplaceAbi from "../contracts/nft-marketplace-abi";
import contractAddresses from "../contracts/contract-addresses";
import {useUtil} from "../providers/UtilProvider";
import {useMemo} from "react";

export const useFetchAllListings = () => {
  const query = gql`{
    listings(
      where: {
        buyer: "0x0000000000000000000000000000000000000000", 
        seller_not: "0x000000000000000000000000000000000000dead"
    }) {
      nftAddress
      tokenId
      seller
      price
    }
  }`
  const {data, loading} = useQuery(query)
  const listings = useMemo(() => data && (data as {listings: any}).listings, [data])
  return {
    data: listings as (undefined | Array<{nftAddress: string, tokenId: string, seller: string, price: string}>),
    loading
  }
}

export const useFetchMyListings = () => {

  const {account} = useMoralis()

  const query = gql`{
    listings(
      where: {buyer: "0x0000000000000000000000000000000000000000", seller: "${account}"}
    ) {
      nftAddress
      seller
      price
      tokenId
    }
  }`
  const {data, loading} = useQuery(query)
  const listings = useMemo(() => data && (data as {listings: any}).listings, [data])
  return {
    data: listings as (undefined | Array<{nftAddress: string, tokenId: string, seller: string, price: string}>),
    loading
  }
}

export const useListNftHandler = () => {

  const {chainId} = useMoralis()

  const nftMarketplaceAddress = contractAddresses[String(Number(chainId!))]?.nftMarketplace
  const {notify} = useUtil()

  // @ts-ignore
  const {runContractFunction} = useWeb3Contract()

  return async (nftAddress: string, tokenId: string, listingPrice: string) => {
    const approvedAddress = await runContractFunction({
      params: {
        abi: zodiacNftAbi,
        contractAddress: nftAddress,
        functionName: "getApproved",
        params: { tokenId }
      }
    })
    if (approvedAddress !== nftMarketplaceAddress) {
      await runContractFunction({
        params: {
          abi: zodiacNftAbi,
          contractAddress: nftAddress,
          functionName: "approve",
          params: { to: nftMarketplaceAddress, tokenId }
        },
        onSuccess: async (tx: any) => {
          await tx.wait(1)
          await runContractFunction({
            params: {
              abi: nftMarketplaceAbi,
              contractAddress: nftMarketplaceAddress,
              functionName: "listNft",
              params: { nftAddress, tokenId, price: BigInt(Number(listingPrice) * 1e18) }
            },
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
      await runContractFunction({
        params: {
          abi: nftMarketplaceAbi,
          contractAddress: nftMarketplaceAddress,
          functionName: "listNft",
          params: { nftAddress, tokenId, price: BigInt(Number(listingPrice) * 1e18) }
        },
        onSuccess: async (tx: any) => {
          await tx.wait(1)
          notify("NFT listed")
        },
        onError: (err) => console.log("error listing nft", err)
      })
    }
  }
}

export const useCancelListingHandler = () => {
  const {chainId} = useMoralis()
  const nftMarketplaceAddress = contractAddresses[String(Number(chainId!))]?.nftMarketplace
  const {notify} = useUtil()

  // @ts-ignore
  const {runContractFunction} = useWeb3Contract()

  return async (nftAddress: string, tokenId: string) => {
    await runContractFunction({
      params: {
        abi: nftMarketplaceAbi,
        contractAddress: nftMarketplaceAddress,
        functionName: "cancelListing",
        params: { nftAddress, tokenId }
      },
      onSuccess: async (tx: any) => {
        await tx.wait(1)
        notify("Listing canceled")
      },
      onError: err => console.log(err)
    })
  }
}

export const useBuyNftHandler = () => {
  const {chainId} = useMoralis()
  const nftMarketplaceAddress = contractAddresses[String(Number(chainId!))]?.nftMarketplace
  const {notify} = useUtil()

  // @ts-ignore
  const {runContractFunction} = useWeb3Contract()

  return async (nftAddress: string, tokenId: string, priceWei: string) => {
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


