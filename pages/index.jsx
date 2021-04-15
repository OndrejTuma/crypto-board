import React, { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import ExchangeContainer from '../features/Exchange/containers/ExchangeContainer'
import CoinMate from '../adapters/CoinMate'
import BitStamp from '../adapters/BitStamp'
import Binance from '../adapters/Binance'
import SignOutButtonContainer from '../containers/SignOutButtonContainer'
import useAuth from '../hooks/useAuth'
import DataPresenter from '../components/DataPresenter'
import CNBRates from '../modules/CNBRates'
import TotalValue from '../features/Exchange/components/TotalValue'

import styles from '../styles/Home.module.css'

export default function Home({ binanceConnectionInfo, bitstampConnectionInfo, coinmateConnectionInfo, CZKUSDRate }) {
  const auth = useAuth()
  const [totalValues, setTotalValue] = useState(new Map())

  const { publicKey, privateKey, clientId } = coinmateConnectionInfo
  const { apiKey, secretKey } = bitstampConnectionInfo
  const { apiKey: bApiKey, secretKey: bSecretKey } = binanceConnectionInfo

  const handleAfterTotalValueChangeFactory = id => (amount, country) => {
    setTotalValue(new Map([...totalValues.set(id, { amount, country })]))
  }

  return (
    <DataPresenter
      data={auth}
      isDataEmpty={({isLoading}) => isLoading}
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
        <>
          <Grid container justify={'flex-end'}>
            <Box p={5}>
              <SignOutButtonContainer/>
            </Box>
          </Grid>
          <Box my={7} px={5}>
            <Grid container justify={'space-around'} spacing={3}>
              <Grid item xs={12} md={4}>
                <ExchangeContainer
                  connection={new CoinMate(publicKey, privateKey, clientId)}
                  currencies={['BTC', 'ETH']}
                  mainCurrency={'CZK'}
                  country={{
                    currency: 'CZK',
                    ISO: 'cs-CZ',
                  }}
                  name={'CoinMate'}
                  afterTotalValueChange={handleAfterTotalValueChangeFactory(0)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <ExchangeContainer
                  connection={new BitStamp(apiKey, secretKey)}
                  currencies={['BTC', 'ETH']}
                  mainCurrency={'USD'}
                  country={{
                    currency: 'USD',
                    ISO: 'en-US',
                  }}
                  name={'BitStamp'}
                  afterTotalValueChange={handleAfterTotalValueChangeFactory(1)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <ExchangeContainer
                  connection={new Binance(bApiKey, bSecretKey)}
                  currencies={['BTC', 'ETH']}
                  mainCurrency={'BUSD'}
                  country={{
                    currency: 'USD',
                    ISO: 'en-US',
                  }}
                  name={'Binance'}
                  afterTotalValueChange={handleAfterTotalValueChangeFactory(2)}
                />
              </Grid>
            </Grid>
          </Box>
          <TotalValue totalValues={totalValues} czkUsdRate={CZKUSDRate}/>
          <footer className={styles.footer}>
            Exchange aggregator
          </footer>
        </>
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
