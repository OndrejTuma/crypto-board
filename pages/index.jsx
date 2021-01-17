import Head from 'next/head'

import ExchangeContainer from '../features/Exchange/containers/ExchangeContainer'
import CoinMate from '../adapters/CoinMate'

import styles from '../styles/Home.module.css'

export default function Home({ coinmateConnectionInfo }) {
  const { publicKey, privateKey, clientId } = coinmateConnectionInfo

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

  return {
    props: {
      coinmateConnectionInfo,
    },
  }
}
