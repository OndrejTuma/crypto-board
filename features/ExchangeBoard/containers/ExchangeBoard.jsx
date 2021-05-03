import React, { useState } from 'react'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'

import Binance from '../../../adapters/Binance'
import BitStamp from '../../../adapters/BitStamp'
import CoinMate from '../../../adapters/CoinMate'
import SignOutButtonContainer from '../../../containers/SignOutButtonContainer'
import TotalValue from '../../Exchange/components/TotalValue'
import ExchangeContainer from '../../Exchange/containers/ExchangeContainer'

import styles from './ExchangeBoard.module.css'

const ExchangeBoard = ({ connections, rate }) => {
  const [totalValues, setTotalValue] = useState(new Map())

  const handleAfterTotalValueChangeFactory = id => (amount, country) => {
    setTotalValue(new Map([...totalValues.set(id, { amount, country })]))
  }

  return (
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
              connection={connections.coinmate}
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
              connection={connections.bitstamp}
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
              connection={connections.binance}
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
      <TotalValue totalValues={totalValues} czkUsdRate={rate}/>
      <footer className={styles.footer}>
        Exchange aggregator
      </footer>
    </>
  )
}

export default ExchangeBoard