import {FC, useState} from "react";
import {Box, Button, IconButton, Modal, TextField} from "@mui/material";
import {useFetchNftMetadata} from "../web3/nft";
import Image from "next/image";
import {useListNftHandler} from "../web3/listing";
import CloseIcon from '@mui/icons-material/Close';
import {useUtil} from "../providers/UtilProvider";

interface ListingModalProps {
  open: boolean
  onClose: () => void
  nftAddress: string
  tokenId: string
}

const ListingModal: FC<ListingModalProps> = ({open, onClose, nftAddress, tokenId}) => {

  const metadata = useFetchNftMetadata(nftAddress, tokenId)
  const [price, setPrice] = useState("")
  const listNft = useListNftHandler(nftAddress, tokenId, price)

  const {notify} = useUtil()

  return metadata && (
    <Box>
      <Modal open={open}>
        <Box
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            borderRadius: 3,
            p: 4,
            pt: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              top: 3,
              right: 3
            }}
          >
            <CloseIcon />
          </IconButton>
          <Box sx={{fontWeight: "bold", pb: 1}}>
            You are listing NO.{tokenId} of {metadata.name} NFT
          </Box>
          <Box
            sx={{
              width: 200,
              display: "flex",
              justifyContent: "center",
              height: 200,
              position: "relative"
            }}
          >
            <Image src={metadata.image} alt={""} objectFit="cover" fill />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              pt: 4,
              width: "100%"
            }}
          >
            <TextField
              focused
              label={"Listing Price (ETH)"}
              type={"number"}
              value={price}
              onChange={e => setPrice(e.target.value)}
            />
            <Button
              onClick={async () => {
                await listNft()
                onClose()
              }}
            >
              List
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  )
}

export default ListingModal
