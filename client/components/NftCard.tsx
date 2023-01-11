import {Box, Button} from "@mui/material";
import {FC, useEffect, useState} from "react";
import {useFetchNftMetadata} from "../web3/nft";
import Image from "next/image";
import {truncateAddress} from "../util";
import {useMoralis} from "react-moralis";
import {NftMetadata} from "../types/nft";

interface NftCardProps {
  nftAddress: string
  tokenId: number
  owner: string
  price?: number | string
  buttonOptions?: {
    text: string,
    handler: (data?: any) => void
  }
}


const NftCard: FC<NftCardProps> = ({nftAddress, tokenId, owner, price, buttonOptions}) => {

  const metadata = useFetchNftMetadata(nftAddress, tokenId)
  const {account} = useMoralis()

  return metadata && (
    <Box
      sx={{
        width: "100%",
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: "2px 2px 7px 3px rgba(0,0,0,.3)"
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: 300,
          position: "relative"
        }}
      >
        <Image src={metadata.image} alt={""} objectFit="cover" fill />
      </Box>
      <Box
        sx={{
          paddingX: 2,
          paddingY: 1,
          pb: 3
        }}
      >
        <Box
          sx={{
            pt: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <Box sx={{fontWeight: "bold"}}>
            {metadata.name} - {tokenId}
          </Box>
          {price && (<Box>{price} ETH</Box>)}
        </Box>
        <Box
          sx={{
            textAlign: "right",
            fontStyle: "italic",
            color: "grey.A700"
          }}
        >
          Owned by {account === owner ? "you" : truncateAddress(owner)}
        </Box>
        {buttonOptions && (
          <Box sx={{pt: 2}}>
            <Button
              onClick={() => buttonOptions.handler({nftAddress, tokenId})}
              sx={{width: "100%"}}
            >
              {buttonOptions.text}
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default NftCard
