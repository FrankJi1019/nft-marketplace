import {FC, useState} from "react";
import {Box, Button, IconButton, Modal, TextField} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import Image from "next/image";
import {useMoralis} from "react-moralis";
import {truncateAddress} from "../../util";
import {NftState} from "../types/nft";

// components that relate to nft operation and are only used in the modal
const NotOwned: FC<{
  onBuyNow: () => void
}> = ({onBuyNow}) => {
  return (
    <Box sx={{display: "flex", justifyContent: "right"}}>
      <Button onClick={onBuyNow}>Buy Now</Button>
    </Box>
  )
}

const Owned: FC<{
  onCreateListing: (price: string) => void
}> = ({onCreateListing}) => {
  const [price, setPrice] = useState("")
  return (
    <Box sx={{display: "flex", justifyContent: "right"}}>
      <TextField
        value={price}
        onChange={({target}) => setPrice(target.value)}
        sx={{width: 100}}
      />
      <Button onClick={() => onCreateListing(price)}>Sell</Button>
    </Box>
  )
}

const Listed: FC<{
  onUpdatePrice: (newPrice: string) => void
  onCancelListing: () => void
}> = ({onCancelListing, onUpdatePrice}) => {
  const [price, setPrice] = useState("")
  return (
    <Box sx={{display: "flex", justifyContent: "right"}}>
        <TextField
          value={price}
          onChange={({target}) => setPrice(target.value)}
          sx={{width: 100}}
        />
        <Button onClick={() => onUpdatePrice(price)}>Update price</Button>
        <Button variant={"outlined"} onClick={onCancelListing}>Cancel</Button>
    </Box>
  )
}

interface NftDetailModalProps {
  open: boolean
  onClose: () => void
  nftName: string
  tokenId: string
  nftDescription: string
  nftOwner: string
  nftImage: string
  nftPrice?: string
  nftState: NftState
  listNft: (price: string) => void
  cancelListing: () => void
  buyNft:() => void
}

const NftDetailModal: FC<NftDetailModalProps> = ({onClose, open, nftDescription, nftImage, nftName, nftOwner, nftPrice, tokenId, nftState, listNft, cancelListing, buyNft}) => {

  const {account} = useMoralis()

  return (
    <Box>
      <Modal open={open}>
        <Box
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            borderRadius: 3,
            p: 3,
            backgroundColor: "white"
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 2,
              right: 2
            }}
          >
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box sx={{display: "flex"}}>
            <Box>
              <Image src={nftImage} alt={""} width={200} height={200} />
            </Box>
            <Box sx={{ml: 2, display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
              <Box>
                <Box sx={{textAlign: "center", fontSize: 20, fontWeight: "bold"}}>
                  {nftName} #{tokenId}
                </Box>
                <Box sx={{color: "grey", fontStyle: "italic"}}>
                  Owned by {account === nftOwner ? "you" : truncateAddress(nftOwner)}
                </Box>
                <Box sx={{textAlign: "right", visibility: nftPrice ? "visible" : "hidden"}}>
                  {Number(nftPrice) / 1e18} ETH
                </Box>
                <Box sx={{mt: 1}}>
                  {nftDescription}
                </Box>
              </Box>
              <Box>
                {nftState === NftState.NOT_OWNED ?
                  <NotOwned onBuyNow={buyNft} /> :
                  nftState === NftState.OWNED ?
                    <Owned onCreateListing={listNft} />:
                    <Listed onUpdatePrice={listNft} onCancelListing={cancelListing} />}
              </Box>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  )
}

export default NftDetailModal
