import "../styles/global.css"
import type { AppProps } from 'next/app'
import { ThemeProvider } from "@mui/material"
import theme from '../theme'
import {ApolloProvider, ApolloClient, InMemoryCache} from "@apollo/client"
import {MoralisProvider} from "react-moralis"
import UtilProvider from "../src/providers/UtilProvider";
import MarketplaceProvider from "../src/providers/MarketplaceProvider";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: process.env.NEXT_THE_GRAPH_URL
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MoralisProvider initializeOnMount={false}>
      <ApolloProvider client={client}>
        <ThemeProvider theme={theme}>
          <UtilProvider>
            <MarketplaceProvider>
              <Component {...pageProps} />
            </MarketplaceProvider>
          </UtilProvider>
        </ThemeProvider>
      </ApolloProvider>
    </MoralisProvider>
  )
}
