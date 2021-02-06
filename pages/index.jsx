import { useContext } from 'react'
import Head from 'next/head'
import Link from 'next/link'

import ExchangeContainer from '../features/Exchange/containers/ExchangeContainer'
import CoinMate from '../adapters/CoinMate'
import BitStamp from '../adapters/BitStamp'
import Binance from '../adapters/Binance'

import { AuthContext } from '../store/AuthContext'

import styles from '../styles/Home.module.css'

export default function Home({ binanceConnectionInfo, bitstampConnectionInfo, coinmateConnectionInfo }) {
  const auth = useContext(AuthContext)
  const { publicKey, privateKey, clientId } = coinmateConnectionInfo
  const { apiKey, secretKey } = bitstampConnectionInfo
  const { apiKey: bApiKey, secretKey: bSecretKey } = binanceConnectionInfo

  if (!auth.isLogged) {
    return (
      <div>
        <h1>Restricted area</h1>
        <p>Continue to <Link href={'/auth'}><a>login page</a></Link></p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Crypto Dashboard</title>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <main className={styles.main}>
        <div className={styles.exchanges}>
          <ExchangeContainer
            connection={new CoinMate(publicKey, privateKey, clientId)}
            currencies={['BTC', 'LTC', 'ETH']}
            mainCurrency={'CZK'}
            country={{
              currency: 'CZK',
              ISO: 'cs-CZ',
            }}
            name={'CoinMate'}
          />
          <ExchangeContainer
            connection={new BitStamp(apiKey, secretKey)}
            currencies={['BTC', 'LTC', 'ETH']}
            mainCurrency={'USD'}
            country={{
              currency: 'USD',
              ISO: 'en-US',
            }}
            name={'BitStamp'}
          />
          <ExchangeContainer
            connection={new Binance(bApiKey, bSecretKey)}
            currencies={['BTC', 'LTC', 'ETH']}
            mainCurrency={'USDT'}
            country={{
              currency: 'USD',
              ISO: 'en-US',
            }}
            name={'Binance'}
          />
        </div>
      </main>

      <footer className={styles.footer}>
        Exchange aggregator
      </footer>
    </div>
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

  return {
    props: {
      binanceConnectionInfo,
      bitstampConnectionInfo,
      coinmateConnectionInfo,
    },
  }
}
