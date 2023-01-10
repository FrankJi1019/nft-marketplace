import {Box} from "@mui/material";
import {FC, useEffect, useState} from "react";
import {useCallTokenURI} from "../web3/nft";
import Image from "next/image";

interface NftCardProps {
  nftAddress: string
  tokenId: number
}

interface NftMetadata {
  name: string,
  description: string,
  image: string
}

const NftCard: FC<NftCardProps> = ({nftAddress, tokenId}) => {

  const getTokenUri = useCallTokenURI(nftAddress, tokenId)

  const [metadata, setMetadata] = useState<NftMetadata | null>(null)

  useEffect(() => {
    ;(async () => {
      const uri = (await getTokenUri()) as string
      const data = await (await fetch(uri)).json()
      setMetadata(data as NftMetadata)
    })()
  }, [getTokenUri])

  return metadata && (
    <Box>
      <Box>
        <Image src={metadata.image} alt={""} width={100} height={100} />
      </Box>
      <Box>
        {metadata.name}
      </Box>
      <Box>
        {metadata.description}
      </Box>
    </Box>
  )
}

export default NftCard
