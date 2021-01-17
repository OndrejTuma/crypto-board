import React, { useState } from 'react'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { useRouter } from 'next/router'

export default function Binance({ binanceConnectionInfo }) {
  const [exchangeFetch, setExchangeFetch] = useState(false)
  const { query: { access_token } } = useRouter()

  const { clientId } = binanceConnectionInfo

  const redirectToAuth = () => {
    const apiUrl = `${window.location.origin}/api/binance/exchange-code`
    location.href = `https://accounts.binance.com/en/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${apiUrl}&scope=user:email,user:address`
  }

  return (
    <div>
      <Typography variant={'h2'}>Binance oAuth</Typography>
      <pre>{access_token}</pre>
      <Button onClick={redirectToAuth}>Get Access Token</Button>
    </div>
  )
}

export async function getStaticProps() {
  const binanceConnectionInfo = {
    apiKey: process.env.BINANCE_API_KEY,
    secretKey: process.env.BINANCE_SECRET_KEY,
    clientId: process.env.BINANCE_CLIENT_ID,
  }

  return {
    props: {
      binanceConnectionInfo,
    },
  }
}