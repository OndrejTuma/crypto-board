import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'

const useStyles = makeStyles((theme) => ({
  gridList: {
    overflow: 'auto',
    flexWrap: 'nowrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
  },
}))

import type {Balance as BalanceType} from '@/propTypes/Balance';
import type {CurrencyPair as CurrencyPairType} from '@/propTypes/CurrencyPair'

import CurrencyPair from './CurrencyPair'

type Props = {
  balances: BalanceType[],
  currencyPairs: CurrencyPairType[],
}

const CurrencyPairs = ({balances, currencyPairs}: Props) => {
  const classes = useStyles()

  return (
    <Box mb={3}>
      <Grid container spacing={2} className={classes.gridList}>
        {currencyPairs.map(({bid, pair}) => {
          const currency = pair[0]
          const balance = balances.find(({currency: balanceCurrency}) => balanceCurrency === currency)?.balance || 0

          return (
            <CurrencyPair key={currency} balance={balance} currency={currency} price={bid}/>
          )
        })}
      </Grid>
    </Box>
  )
}

export default CurrencyPairs