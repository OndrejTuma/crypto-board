import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import Skeleton from '@material-ui/lab/Skeleton'
import Grid from '@material-ui/core/Grid'

import Price from '@/components/Price';
import DataPresenter from '../../../components/DataPresenter'

const useStyles = makeStyles(() => ({
  center: {
    textAlign: 'center',
  }
}))

type Props = {
  currency: string, // crypto currency name
  balance: number, // account balance in crypto currency
  price: number, // current crypto currency price
}

const CurrencyPair = ({currency, balance, price}: Props) => {
  const classes = useStyles()

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
          <DataPresenter data={price} loader={<Skeleton variant={'text'} animation={'wave'}/>}>
            {price => (
              <Typography align={'center'}><Price value={price}/></Typography>
            )}
          </DataPresenter>
        </CardContent>
        <Divider/>
        <CardContent>
          <DataPresenter data={price} loader={<Skeleton variant={'text'} animation={'wave'}/>}>
            {price => (
              <Typography align={'center'}>
                <strong><Price value={balance * price}/></strong>
              </Typography>
            )}
          </DataPresenter>
        </CardContent>
      </Card>
    </Grid>
  )
}

export default CurrencyPair