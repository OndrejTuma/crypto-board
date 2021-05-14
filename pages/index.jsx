import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import CoinMate from '../adapters/CoinMate'
import BitStamp from '../adapters/BitStamp'
import Binance from '../adapters/Binance'
import ExchangeBoard from '../features/ExchangeBoard/containers/ExchangeBoard'
import useAuth from '../hooks/useAuth'
import DataPresenter from '../components/DataPresenter'
import CNBRates from '../modules/CNBRates'

function Home({ binanceConnectionInfo, bitstampConnectionInfo, coinmateConnectionInfo, CZKUSDRate }) {
  const auth = useAuth()
  const [connections, setConnections] = useState({})

  const { publicKey, privateKey, clientId } = coinmateConnectionInfo
  const { apiKey, secretKey } = bitstampConnectionInfo
  const { apiKey: bApiKey, secretKey: bSecretKey } = binanceConnectionInfo

  useEffect(() => {
    setConnections({
      coinmate: new CoinMate(publicKey, privateKey, clientId),
      bitstamp: new BitStamp(apiKey, secretKey),
      binance: new Binance(bApiKey, bSecretKey)
    })
  }, [])

  return (
    <DataPresenter
      data={auth}
      isDataEmpty={({ isLoading }) => isLoading}
    >
      <Head>
        <title>Crypto Dashboard</title>
        <link rel="icon" href="/favicon.ico"/>
      </Head>
      {!auth.isLogged ? (
        <Box my={10}>
          <Grid container justify={'center'}>
            <Typography align={'center'} component={'div'}>
              <h1>Restricted area</h1>
              <p>Continue to <Link href={'/auth'}><a>login page</a></Link></p>
            </Typography>
          </Grid>
        </Box>
      ) : (
        <ExchangeBoard
          rate={CZKUSDRate}
          connections={connections}
        />
      )}
    </DataPresenter>
  )
}

export async function getStaticProps() {
  const coinmateConnectionInfo = {
    privateKey: process.env.COINMATE_PRIVATE_KEY,
    publicKey: process.env.COINMATE_PUBLIC_KEY,
    clientId: process.env.COINMATE_CLIENT_ID,
  }
  const bitstampConnectionInfo = {
    apiKey: process.env.BITSTAMP_API_KEY,
    secretKey: process.env.BITSTAMP_API_SECRET,
  }
  const binanceConnectionInfo = {
    apiKey: process.env.BINANCE_API_KEY,
    secretKey: process.env.BINANCE_SECRET_KEY,
  }

  const rates = new CNBRates()
  await rates.fetchCurrencyRates()

  return {
    props: {
      binanceConnectionInfo,
      bitstampConnectionInfo,
      coinmateConnectionInfo,
      CZKUSDRate: rates.getCurrencyRate('USD'),
    },
    revalidate: 60 * 60,
  }
}

export default Home