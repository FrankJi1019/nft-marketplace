import Page from "../src/containers/Page";
import Title from "../src/components/Title";
import {useFetchMyNft, useFetchNftMetadataHandler} from "../src/web3/nft";
import {useEffect, useMemo, useState} from "react";
import {NftFullData, NftMetadata} from "../src/types/nft";
import NftTileGrid from "../src/components/NftTileGrid";
import {useFetchMyListings} from "../src/web3/listing";
import {useMarketplace} from "../src/providers/MarketplaceProvider";

const MyNft = () => {

  const {listNft, cancelListing, buyNft} = useMarketplace()

  const {data: nfts} = useFetchMyNft()
  const fetchNftMetadata = useFetchNftMetadataHandler()
  const {data: listings} = useFetchMyListings()
  const [nftMetadata, setNftMetadata] = useState<Array<NftMetadata> | null>(null)
  
  useEffect(() => {
    if (!nfts) return
    ;(async () => {
      const fetchMetadataPromises = nfts.map(({address, tokenId}) => {
        return fetchNftMetadata(address, tokenId)
      })
      setNftMetadata(await Promise.all(fetchMetadataPromises))
    })()
  }, [fetchNftMetadata, nfts])

  const nftFullData = useMemo(() => {
    if (!nfts || !nftMetadata || !listings) return []
    return nfts.map((nft) => {
      const metadata = nftMetadata.find(({nftAddress, tokenId}) => 
        nft.address === nftAddress && nft.tokenId === tokenId)
      const price = listings.find(({nftAddress, tokenId}) => 
        nft.address === nftAddress && nft.tokenId === tokenId)?.price
      return {
        ...nft,
        ...metadata,
        ownerAddress: nft.owner,
        price
      } as NftFullData
    })
  }, [listings, nftMetadata, nfts])
  
  const loading = useMemo(() => !nfts || !nftMetadata || !listings, [listings, nftMetadata, nfts])

  return (
    <Page loading={loading}>
      <Title text={"My Listings"} />
      <NftTileGrid
        nftData={nftFullData}
        listNft={listNft}
        cancelListing={cancelListing}
        buyNft={buyNft}
      />
    </Page>
  );
};

export default MyNft
