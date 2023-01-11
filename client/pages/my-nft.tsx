import {Box, Grid} from "@mui/material";
import Page from "../containers/Page";
import {useFetchMyNft} from "../web3/nft";
import NftCard from "../components/NftCard";
import Title from "../components/Title";

const MyNftPage = () => {

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
                  alert(`list ${tokenId} at ${nftAddress}`)
                }
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Page>
  );
};

export default MyNftPage
