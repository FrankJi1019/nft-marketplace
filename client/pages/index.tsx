import {Box, Grid} from '@mui/material'
import Page from "../containers/Page";
import {useFetchListings} from "../web3/listing";
import Title from "../components/Title";
import NftCard from "../components/NftCard";

const Home = () => {

  const {data, loading} = useFetchListings()

  if (loading || !data) return <Page>Loading...</Page>

  console.log(data)

  return (
    <Page>
      <Title text={"My NFT"} />
      <Grid container sx={{width: "100%"}}>
        {data.map(({nftAddress, tokenId, seller, price}) => (
          <Grid
            item
            key={`${nftAddress}${tokenId}`}
            md={3}
            sx={{padding: 2}}
          >
            <NftCard
              nftAddress={nftAddress}
              tokenId={Number(tokenId)}
              owner={seller}
              price={(BigInt(price) / BigInt("1" + "0".repeat(18))).toString()}
              buttonOptions={{
                text: "Buy now",
                handler: ({nftAddress, tokenId}) => {
                  alert(`Buy ${tokenId} at ${nftAddress}`)
                }
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Page>
  )
}

export default Home
