import {useMoralis, useWeb3Contract} from "react-moralis";
import {gql, useQuery} from "@apollo/client";
import zodiacNftAbi from "../contracts/zodiac-nft-abi";
import {useCallback, useMemo} from "react";
import {Nft} from "../types/nft";

export const useFetchMyNft = () => {
  const {account} = useMoralis()
  const query = useMemo(() => gql`{
    nfts(where: {owner: "${account}"}) {
      owner
      tokenId
      address
    }
  }`, [account])
  const {data, loading} = useQuery(query)
  const nfts = useMemo(() => data && (data as {nfts: any}).nfts, [data])
  return {
    data: nfts as (undefined | Array<Nft>),
    loading
  }
}

export const useFetchNftMetadataHandler = () => {

  // @ts-ignore
  const {runContractFunction} = useWeb3Contract()

  return useCallback(async (nftAddress: string, tokenId: string) => {
    const params = {
      abi: zodiacNftAbi,
      contractAddress: nftAddress,
      functionName: "tokenURI",
      params: {year: tokenId}
    }

    const uri = await runContractFunction({
      params
    }) as string
    const data = await (await fetch(uri)).json()

    return {...data, nftAddress, tokenId}

  }, [runContractFunction])
}
