import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import Skeleton from '@material-ui/lab/Skeleton'
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box'

import DataPresenter from '../../../components/DataPresenter'

const useStyles = makeStyles((theme) => ({
  gridList: {
    overflow: 'auto',
    flexWrap: 'nowrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
  },
  center: {
    textAlign: 'center',
  }
}));


const Balances = ({ balances, currencyPairs, formatNumber }) => {
  const classes = useStyles()

  return (
    <Box mb={3}>
      <Grid container spacing={2} className={classes.gridList}>
        {balances.map(({ currency, balance }) => {
          const currencyPair = currencyPairs && currencyPairs.find(({ pair }) => pair[0] === currency)

          return (
            <Grid item key={currency}>
              <Card variant={'outlined'}>
                <CardHeader
                  title={currency}
                  subheader={balance}
                  classes={{
                    title: classes.center,
                    subheader: classes.center,
                  }}
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
    </Box>
  )
}

export default Balances