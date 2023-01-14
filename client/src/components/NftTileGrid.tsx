import {Box, Grid} from "@mui/material";
import {FC} from "react";
import NftTile from "./NftTile";
import {NftTileProps} from "./NftTile";

interface NftTileGridProps {
  nftData: Array<NftTileProps>
}

const NftTileGrid: FC<NftTileGridProps> = ({nftData}) => {

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
            <NftTile {...nftData} />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default NftTileGrid
