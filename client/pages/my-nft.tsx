import Page from "../src/containers/Page";
import Title from "../src/components/Title";
import {useFetchMyNft, useFetchNftMetadataHandler} from "../src/web3/nft";
import {useEffect, useMemo, useState} from "react";
import {NftFullData, NftMetadata} from "../src/types/nft";
import NftTileGrid from "../src/components/NftTileGrid";

const MyNft = () => {

  const {data: nfts} = useFetchMyNft()
  const fetchNftMetadata = useFetchNftMetadataHandler()
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
    if (!nfts || !nftMetadata) return []
    return nfts.map((nft) => {
      const metadata = nftMetadata.find(({nftAddress, tokenId}) => 
        nft.address === nftAddress && nft.tokenId === tokenId)
      return {
        ...nft,
        ...metadata,
        ownerAddress: nft.owner
      } as NftFullData
    })
  }, [nftMetadata, nfts])
  
  const loading = useMemo(() => !nfts || !nftMetadata, [nftMetadata, nfts])

  return (
    <Page loading={loading}>
      <Title text={"My Listings"} />
      <NftTileGrid
        nftData={nftFullData.map((listedNft) => ({...listedNft}))}
      />
    </Page>
  );
};

export default MyNft
