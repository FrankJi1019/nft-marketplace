import Page from "../src/containers/Page";
import {useFetchMyListings} from "../src/web3/listing";
import {useFetchNftMetadataHandler} from "../src/web3/nft";
import {useEffect, useMemo, useState} from "react";
import {NftFullData, NftMetadata} from "../src/types/nft";
import Title from "../src/components/Title";
import NftTileGrid from "../src/components/NftTileGrid";

const MyListing = () => {

  const {data: listings} = useFetchMyListings()
  const fetchMetadata = useFetchNftMetadataHandler()
  const [nftMetadata, setNftMetadata] = useState<Array<NftMetadata> | null>(null)

  useEffect(() => {
    if (!listings) return
      ;(async () => {
      const metadataFetchPromises = listings.map(({nftAddress, tokenId}) => {
        return fetchMetadata(nftAddress, tokenId)
      })
      setNftMetadata(await Promise.all(metadataFetchPromises))
    })()
  }, [fetchMetadata, listings])

  const nftFullData = useMemo(() => {
    if (!listings || !nftMetadata) return []
    return listings?.map((listing) => {
      const meta = nftMetadata?.find((nft) => nft.nftAddress === listing.nftAddress && nft.tokenId === listing.tokenId)
      return {
        ...listing,
        ...meta,
        ownerAddress: listing.seller
      } as NftFullData
    })
  }, [listings, nftMetadata])

  const loading = useMemo(() => !listings || !nftMetadata, [listings, nftMetadata])

  return (
    <Page loading={loading}>
      <Title text={"My Listings"} />
      <NftTileGrid
        nftData={nftFullData.map((listedNft) => ({...listedNft}))}
      />
    </Page>
  )
}

export default MyListing
