import {useMoralis} from "react-moralis";
import {gql, useQuery} from "@apollo/client";

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