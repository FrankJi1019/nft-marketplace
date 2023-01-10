import {Box} from "@mui/material";
import {ConnectButton} from "web3uikit";
import {useMoralis} from "react-moralis";
import {useRouter} from "next/router";
import Page from "../containers/Page";


const ConnectWalletPage = () => {

  const {isWeb3Enabled} = useMoralis()
  const router = useRouter()

  if (isWeb3Enabled) {
    router.push("/").then(() => {})
  }

  return (
    <Page>
      <Box>
        Please connect your wallet
      </Box>
    </Page>
  )
}

export default ConnectWalletPage
