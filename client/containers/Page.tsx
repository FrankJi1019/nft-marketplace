import {AppBar, Box, CssBaseline, Toolbar} from "@mui/material";
import Head from "next/head";
import {FC, ReactNode} from "react";
import {PROJECT_NAME, DESCRIPTION, APP_TITLE} from "../constants";
import Link from "next/link";
import {useMoralis} from "react-moralis";
import {ConnectButton} from "web3uikit";
import bg from "../public/bg.jpg"

const appBarOptions = [
  {
    name: "Home",
    href: "/"
  },
  {
    name: "My NFT",
    href: "/my-nft"
  }
]

interface PageProps {
  title?: string
  description?: string
  children: ReactNode
}

const Page: FC<PageProps> = ({title, description, children}) => {

  const {isWeb3Enabled} = useMoralis()

  return (
    <>
      <Head>
        <title>{title || APP_TITLE}</title>
        <meta name="description" content={description || DESCRIPTION} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box sx={{display: "flex"}}>
        <CssBaseline />
        <AppBar>
          <Toolbar sx={{display: "flex", justifyContent: "space-between"}}>
            <Box sx={{display: "flex"}}>
              <Box sx={{mr: "10px"}}>
                {PROJECT_NAME}
              </Box>
              <Box sx={{display: "flex", height: "100%"}}>
                {appBarOptions.map(option => (
                  <Link key={option.href} href={option.href}>
                    <Box
                      sx={{
                        mr: "10px",
                        height: "100%",
                        "&:hover": {
                          textDecoration: "underline"
                        }
                      }}
                    >
                      {option.name}
                    </Box>
                  </Link>
                ))}
              </Box>
            </Box>
            <Box>
              <ConnectButton />
            </Box>
          </Toolbar>
        </AppBar>
        <Box
          sx={{
            width: "100%",
            backgroundImage: `url('../public/bg.jpg')`
          }}
        >
          <Toolbar />
          <Box
            sx={{
              paddingX: 20,
              paddingY: 1
            }}
          >
            {isWeb3Enabled ? children : <Box>Please connect your wallet</Box>}
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default Page
