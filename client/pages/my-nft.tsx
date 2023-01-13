import Page from "../src/containers/Page";
import {useFetchMyNft} from "../web3/nft";
import Title from "../src/components/Title";

const MyNftPage = () => {

  const {data, loading} = useFetchMyNft()

  return (
    <Page loading={loading || !data}>
      <Title text={"My NFT"} />
    </Page>
  );
};

export default MyNftPage
