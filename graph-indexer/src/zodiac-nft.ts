import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
  Approval as ApprovalEvent,
  ApprovalForAll as ApprovalForAllEvent,
  NftMinted as NftMintedEvent,
  Transfer as TransferEvent,
} from "../generated/ZodiacNft/ZodiacNft";
import { Nft } from "../generated/schema";

// nft id: nftAddress_tokenId
const getId = (nftAddress: Address, tokenId: BigInt): string => {
  return `${nftAddress.toHexString()}_${tokenId.toHexString()}`;
};

// when nft minted, add the entity to the graph
export function handleNftMinted(event: NftMintedEvent): void {
  const nftAddress = event.address;
  const tokenId = event.params.tokenId;

  let entity = new Nft(getId(nftAddress, tokenId));
  entity.address = nftAddress;
  entity.tokenId = tokenId;
  entity.owner = event.params.owner;

  entity.save();
}

export function handleApproval(event: ApprovalEvent): void {}

export function handleApprovalForAll(event: ApprovalForAllEvent): void {}

export function handleTransfer(event: TransferEvent): void {}
