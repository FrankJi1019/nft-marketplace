import {AppBar, Box, Button, CssBaseline, IconButton, Toolbar, useTheme} from "@mui/material";
import Head from "next/head";
import {FC, ReactNode} from "react";
import {PROJECT_NAME, DESCRIPTION, APP_TITLE} from "../../constants";
import Link from "next/link";
import {useMoralis} from "react-moralis";
import {ConnectButton} from "web3uikit";
import ReactLoading from "react-loading";
import HomeIcon from '@mui/icons-material/Home';
import TokenIcon from '@mui/icons-material/Token';
import {useRouter} from "next/router";
import StorefrontIcon from '@mui/icons-material/Storefront';

const appBarOptions: Array<{
  text: string,
  icon: ReactNode,
  href: string
}> = [
  {
    text: "Home",
    icon: <HomeIcon />,
    href: "/"
  },
  {
    text: "My NFT",
    icon: <TokenIcon />,
    href: "/my-nft"
  },
  {
    text: "My Listing",
    icon: <StorefrontIcon />,
    href: "/my-listing"
  }
]

interface PageProps {
  title?: string
  description?: string
  children: ReactNode
  loading?: boolean
}

const Page: FC<PageProps> = ({title, description, children, loading}) => {

  const {isWeb3Enabled} = useMoralis()
  const theme = useTheme()
  const {pathname} = useRouter()

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
              <Box sx={{mr: 15}}>
                {/*{PROJECT_NAME}*/}
              </Box>
              <Box sx={{display: "flex", height: "100%"}}>
                {appBarOptions.map(({text, icon, href}) => (
                  <Link key={href} href={href}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mr: 5,
                        color: pathname === href ? "black" : "grey",
                        "&:hover": {
                          textDecoration: "underline"
                        }
                      }}
                    >
                      <IconButton
                        sx={{
                          color: "inherit",
                          "&:hover": {backgroundColor: "transparent"}
                        }}
                      >
                        {icon}
                      </IconButton>
                      <Box>
                        {text}
                      </Box>
                    </Box>
                  </Link>
                ))}
              </Box>
            </Box>
            <Box sx={{display: "flex", alignItems: "center"}}>
              <ConnectButton />
              <Button color={"secondary"}>
                Withdraw Proceeds
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
        <Box
          sx={{
            width: "100%",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "left"
          }}
        >
          <Toolbar />
          {loading? (
            <Box
              sx={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <ReactLoading type='bars' color={theme.palette.primary.main} />
            </Box>
          ): (
            <Box
              sx={{
                paddingX: 20,
                paddingY: 1
              }}
            >
              {isWeb3Enabled ? children : <Box>Please connect your wallet</Box>}
            </Box>
          )}
        </Box>
      </Box>
    </>
  )
}

export default Page
