import {Box, Button} from "@mui/material";
import {FC, useState} from "react";
import Image from "next/image";
import {useMoralis} from "react-moralis";
import {truncateAddress} from "../../util";
import NftDetailModal from "./NftDetailModal";
import {NftState} from "../types/nft";

export interface NftTileProps {
  name: string
  tokenId: string
  image: string
  ownerAddress: string
  description: string
  price?: string
}

const NftTile: FC<NftTileProps> = ({name, tokenId, image, ownerAddress, price, description}) => {

  const {account} = useMoralis()
  const [showDetail, setShowDetail] = useState(false)

  return (
    <Box
      sx={{
        boxShadow: "2px 2px 7px 3px rgba(0,0,0,.3)",
        borderRadius: 3
      }}
    >
      <Box sx={{width: "100%", display: "flex", justifyContent: "center", overflow: "hidden"}}>
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
            onClick={() => setShowDetail(true)}
            sx={{width: "100%"}}
          >
            View
          </Button>
        </Box>
      </Box>
      <NftDetailModal
        open={showDetail}
        onClose={() => setShowDetail(false)}
        nftName={name}
        tokenId={tokenId}
        nftDescription={description}
        nftOwner={ownerAddress}
        nftImage={image}
        nftPrice={price}
        nftState={
          account === ownerAddress ?
            (price ? NftState.LISTED : NftState.OWNED) : NftState.NOT_OWNED
        }
      />
    </Box>
  )
}

export default NftTile
