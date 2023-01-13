export interface NftMetadata {
  name: string,
  description: string,
  image: string
}

export interface NftData {
  nftAddress: string
  tokenId: string | number
  owner: string
}
