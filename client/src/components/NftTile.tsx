import {Box, Button} from "@mui/material";
import {FC} from "react";
import Image from "next/image";
import {useMoralis} from "react-moralis";
import {truncateAddress} from "../../util";

export interface NftTileProps {
  name: string
  tokenId: string
  image: string
  ownerAddress: string
  price?: string
}

const NftTile: FC<NftTileProps> = ({name, tokenId, image, ownerAddress, price}) => {

  const {account} = useMoralis()

  return (
    <Box
      sx={{
        boxShadow: "2px 2px 7px 3px rgba(0,0,0,.3)",
        borderRadius: 3
      }}
    >
      <Box sx={{textAlign: "center", width: "100%"}}>
        <Image
          src={image}
          alt={""}
          width={260}
          height={260}
        />
      </Box>
      <Box sx={{p: 2}}>
        <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
          <Box sx={{fontWeight: "bold", fontSize: 20}}>
            {name}#{tokenId}
          </Box>
          <Box
            sx={{
              textAlign: "right",
              visibility: price ? "visible" : "hidden"
            }}
          >
            {Number(price) / 1e18} ETH
          </Box>
        </Box>
        <Box
          sx={{
            fontStyle: "italic",
            color: "grey"
          }}
        >
          Owned by {account === ownerAddress ? "you" : truncateAddress(ownerAddress)}
        </Box>
        <Box sx={{pt: 2}}>
          <Button
            sx={{width: "100%"}}
          >
            View
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default NftTile
