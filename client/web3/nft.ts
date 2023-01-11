import {useMoralis, useWeb3Contract} from "react-moralis";
import {gql, useQuery} from "@apollo/client";
import zodiacNftAbi from "../contracts/zodiac-nft-abi";

export const useFetchMyNft = () => {
  const {account} = useMoralis()
  const query = gql`{
    nfts(where: {owner: "${account}"}) {
      id
      owner
      tokenId
      address
    }
  }`
  const {data, loading} = useQuery(query)
  const nfts = data && (data as {nfts: any}).nfts
  return {
    data: nfts as (undefined | Array<{address: string, owner: string, tokenId: string}>),
    loading
  }
}

export const useFetchNftMetadataHandler = (nftAddress: string, tokenId: number | string) => {

  const {runContractFunction} = useWeb3Contract({
    abi: zodiacNftAbi,
    contractAddress: nftAddress,
    functionName: "tokenURI",
    params: { year: tokenId }
  })

  return runContractFunction
}