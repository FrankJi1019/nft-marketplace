import {Box, Grid} from "@mui/material";
import {FC} from "react";
import NftTile from "./NftTile";
import {NftTileProps} from "./NftTile";
import {NftFullData} from "../types/nft";

interface NftTileGridProps {
  nftData: Array<NftFullData>
  listNft: (nftAddress: string, tokenId: string, price: string) => void
  cancelListing: (nftAddress: string, tokenId: string) => void
  buyNft:(nftAddress: string, tokenId: string, price: string) => void
}

const NftTileGrid: FC<NftTileGridProps> = ({nftData, listNft, cancelListing, buyNft}) => {

  return (
    <Box>
      <Grid
        container
        sx={{width: "100%"}}
      >
        {nftData.map((nftData) => (
          <Grid
            item
            xs={3}
            sx={{p: 3}}
            key={`${Math.random()}`}
          >
            <NftTile
              {...nftData}
              listNft={(price: string) => listNft(nftData.nftAddress, nftData.tokenId, price)}
              cancelListing={() => cancelListing(nftData.nftAddress, nftData.tokenId)}
              buyNft={(price: string) => buyNft(nftData.nftAddress, nftData.tokenId, price)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default NftTileGrid
