import {Grid} from '@mui/material'
import Page from "../containers/Page";
import {useBuyNftHandler, useFetchListings} from "../web3/listing";
import Title from "../components/Title";
import NftCard from "../components/NftCard";

const Home = () => {

  const {data, loading} = useFetchListings()
  const buyHandler = useBuyNftHandler()

  if (loading || !data) return <Page>Loading...</Page>

  console.log(data)

  return (
    <Page>
      <Title text={"Welcome to NFT Marketplace"} />
      <Grid container sx={{width: "100%"}}>
        {data.map(({nftAddress, tokenId, seller, price}) => (
          <Grid
            item
            key={`${nftAddress}${tokenId}`}
            xs={12}
            sm={6}
            md={3}
            sx={{padding: 2}}
          >
            <NftCard
              nftAddress={nftAddress}
              tokenId={Number(tokenId)}
              owner={seller}
              price={Number(price) / 1e18}
              buttonOptions={{
                text: "Buy now",
                handler: ({nftAddress, tokenId}) => {
                  buyHandler.run(nftAddress, tokenId, price).then(() => {})
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
