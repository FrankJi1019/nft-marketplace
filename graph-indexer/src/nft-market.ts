import { Address, BigInt } from "@graphprotocol/graph-ts"
import {
  ListingDeleted as ListingDeletedEvent,
  NftBought as NftBoughtEvent,
  NftListed as NftListedEvent
} from "../generated/NftMarket/NftMarket"
import { Listing, Nft } from "../generated/schema"

// listing id: nftAddress_tokenId
const getId = (nftAddress: Address, tokenId: BigInt): string => {
  return `${nftAddress.toHexString()}_${tokenId.toHexString()}`
}

export function handleListingDeleted(event: ListingDeletedEvent): void {
  const nftAddress = event.params.nftAddress
  const tokenId = event.params.tokenId

  let listing = Listing.load(getId(nftAddress, tokenId))

  listing!.seller = Address.fromString("0x000000000000000000000000000000000000dEaD")

  listing!.save()

}

export function handleNftBought(event: NftBoughtEvent): void {
  const nftAddress = event.params.nftAddress
  const tokenId = event.params.tokenId

  let listing = Listing.load(getId(nftAddress, tokenId))
  let nft = Nft.load(getId(nftAddress, tokenId))

  listing!.seller = Address.fromString("0x000000000000000000000000000000000000dEaD")
  listing!.buyer = event.params.buyer
  listing!.price = event.params.price

  nft!.owner = event.params.buyer

  listing!.save()
  nft!.save()
}

export function handleNftListed(event: NftListedEvent): void {

  const nftAddress = event.params.nftAddress
  const tokenId = event.params.tokenId

  let listing = Listing.load(getId(nftAddress, tokenId))

  if (!listing) {
    listing = new Listing(getId(nftAddress, tokenId))
  }

  listing.nftAddress = nftAddress
  listing.tokenId = tokenId
  listing.seller = event.params.seller
  listing.buyer = Address.fromString("0x0000000000000000000000000000000000000000")
  listing.price = event.params.price

  listing.save()

}
