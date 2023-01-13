import Page from "../src/containers/Page";
import {useFetchAllListings} from "../web3/listing";
import Title from "../src/components/Title";

const Home = () => {

  const {data, loading} = useFetchAllListings()

  return (
    <Page loading={Boolean(loading || !data)}>
      <Title text={"Welcome to NFT Marketplace"} />
    </Page>
  )
}

export default Home
