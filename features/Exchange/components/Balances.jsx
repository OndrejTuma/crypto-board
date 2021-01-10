import React from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
import Skeleton from '@material-ui/lab/Skeleton'

import DataPresenter from '../../../components/DataPresenter'

const Balances = ({ balances, currencyPairs, formatNumber }) => {
  return (
    <Typography component={'div'} paragraph>
      <Grid container spacing={2}>
        {balances.map(({ currency, balance }) => {
          const currencyPair = currencyPairs && currencyPairs.find(({ pair }) => pair[0] === currency)

          return (
            <Grid item key={currency}>
              <Card variant={'outlined'}>
                <CardHeader
                  title={currency}
                  subheader={balance}
                />
                <Divider/>
                <CardContent>
                  <DataPresenter data={currencyPair} loader={<Skeleton variant={'text'} animation={'wave'}/>}>
                    {currencyPair => (
                      <Typography align={'center'}>{formatNumber(currencyPair.bid)}</Typography>
                    )}
                  </DataPresenter>
                </CardContent>
                <Divider />
                <CardContent>
                  <DataPresenter data={currencyPair} loader={<Skeleton variant={'text'} animation={'wave'}/>}>
                    {currencyPair => (
                      <Typography align={'center'}>
                        <strong>{formatNumber(balance * currencyPair.bid)}</strong>
                      </Typography>
                    )}
                  </DataPresenter>
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>
    </Typography>
  )
}

export default Balances