import { Box } from "@mui/material";
import Page from "../containers/Page";
import {useFetchMyNft} from "../web3/nft";
import NftCard from "../components/NftCard";

const MyNftPage = () => {

  const {data, loading} = useFetchMyNft()

  if (loading || !data) return <Page>Loading...</Page>

  console.log(data)

  return (
    <Page>
      <Box>
        My NFT
      </Box>
      <Box>
        {data.map(({address, tokenId}) => (
          <NftCard
            key={`${address}${tokenId}`}
            nftAddress={address}
            tokenId={Number(tokenId)}
          />
        ))}
      </Box>
    </Page>
  );
};

export default MyNftPage
