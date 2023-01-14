export interface Nft {
  address: string
  tokenId: string
  owner: string
  price?: string
}

export interface NftMetadata {
  nftAddress: string
  tokenId: string
  name: string
  description: string
  image: string
}

export interface NftFullData {
  nftAddress: string
  tokenId: string
  ownerAddress: string
  name: string
  description: string
  image: string
  price?: string
}
