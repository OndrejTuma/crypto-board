import Head from 'next/head'

import ExchangeContainer from '../features/Exchange/containers/ExchangeContainer'
import CoinMate from '../adapters/CoinMate'

import styles from '../styles/Home.module.css'
import BitStamp from '../adapters/BitStamp'

export default function Home({ bitstampConnectionInfo, coinmateConnectionInfo }) {
  const { publicKey, privateKey, clientId } = coinmateConnectionInfo
  const { apiKey, secretKey, customerId } = bitstampConnectionInfo

  const bts = new BitStamp(apiKey, secretKey, customerId)

  const nonce = bts._getNonce()
  console.log(nonce, bts._getSignature(nonce), new Date().getTime())

  return (
    <div className={styles.container}>
      <Head>
        <title>Crypto Dashboard</title>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <main className={styles.main}>
        <ExchangeContainer
          connection={new CoinMate(publicKey, privateKey, clientId)}
          currencies={['BTC', 'LTC', 'DASH', 'ETH']}
          country={{
            currency: 'CZK',
            ISO: 'cs-CZ',
          }}
          name={'CoinMate'}
        />
        <button onClick={() => fetch('/api/bitstamp/balances')}>Test Bitstamp</button>
        {/*<ExchangeContainer*/}
        {/*  connection={new BitStamp(apiKey, secretKey, customerId)}*/}
        {/*  currencies={['BTC', 'LTC', 'ETH']}*/}
        {/*  country={{*/}
        {/*    currency: 'USD',*/}
        {/*    ISO: 'en-US',*/}
        {/*  }}*/}
        {/*  name={'BitStamp'}*/}
        {/*/>*/}
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
    customerId: process.env.BITSTAMP_CUSTOMER_ID,
  }

  return {
    props: {
      bitstampConnectionInfo,
      coinmateConnectionInfo,
    },
  }
}
