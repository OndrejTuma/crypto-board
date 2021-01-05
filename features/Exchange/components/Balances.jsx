import React from 'react'
import get from 'lodash/fp/get'
import getOr from 'lodash/fp/getOr'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'

const Balances = ({ balances, pairs }) => {
  const totalCZK = Object.keys(balances).reduce((acc, key) => {
    const { currency, balance } = getOr({}, `[${key}]`)(balances)
    const pairInfo = get(currency)(pairs)

    if (pairInfo) {
      return acc + Math.round(pairInfo.bid * balance)
    }

    return acc
  }, 0)

  return (
    <div>
      <Grid container spacing={2}>
        {Object.keys(balances).map(key => {
          const { currency, balance } = getOr({}, `[${key}]`)(balances)
          const pairInfo = get(currency)(pairs)

          return (
            <Grid item key={currency}>
              <Card variant={'outlined'}>
                <CardHeader title={currency}/>
                <CardContent>
                  <Typography paragraph>{balance}</Typography>
                  <strong><small>{pairInfo ? Math.round(pairInfo.bid * balance) : 0} CZK</small></strong>
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>
      <Typography variant={'h4'}>Total: {totalCZK} CZK</Typography>
    </div>
  )
}

export default Balances