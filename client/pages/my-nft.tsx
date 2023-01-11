import {Box, Grid} from "@mui/material";
import Page from "../containers/Page";
import {useFetchMyNft} from "../web3/nft";
import NftCard from "../components/NftCard";
import Title from "../components/Title";
import ListingModal from "../components/ListingModal";
import {useState} from "react";

const MyNftPage = () => {

  const [listingCreationOption, setListingCreationOption] =
    useState<{nftAddress: string, tokenId: string} | null>(null)

  const {data, loading} = useFetchMyNft()

  if (loading || !data) return <Page>Loading...</Page>

  return (
    <Page>
      <Title text={"My NFT"} />
      <Grid container sx={{width: "100%"}}>
        {data.map(({address, tokenId, owner}) => (
          <Grid
            item
            key={`${address}${tokenId}`}
            md={3}
            sx={{padding: 2}}
          >
            <NftCard
              nftAddress={address}
              tokenId={Number(tokenId)}
              owner={owner}
              buttonOptions={{
                text: "List",
                handler: ({nftAddress, tokenId}) => {
                  setListingCreationOption({nftAddress, tokenId})
                }
              }}
            />
          </Grid>
        ))}
      </Grid>
      {listingCreationOption && (
        <ListingModal
          open
          onClose={() => setListingCreationOption(null)}
          nftAddress={listingCreationOption.nftAddress}
          tokenId={listingCreationOption.tokenId}
        />
      )}
    </Page>
  );
};

export default MyNftPage
