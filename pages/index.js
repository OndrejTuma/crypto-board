import Head from 'next/head'
import styles from '../styles/Home.module.css'
import ExchangeContainer from '../features/Exchange/containers/ExchangeContainer'
import CoinMate from '../adapters/CoinMate'


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
          currencies={['CZK', 'BTC', 'LTC', 'DASH']}
          country={{
            currency: 'CZK',
            ISO: 'cs-CZ',
          }}
          name={'CoinMate'}
        />
      </main>

      <footer className={styles.footer}>
        CoinMate
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
