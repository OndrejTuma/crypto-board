import React from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import CardActions from '@material-ui/core/CardActions'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
import CurrencyPairExchange from './CurrencyPairExchange'

const Balances = ({ balances, mainCurrency, pairs, total }) => {
  return (
    <div>
      <Grid container spacing={2}>
        {balances.map(({ currency, balance }) => {
          const pair = pairs && pairs.find(({ pair }) => pair[0] === currency)

          return (
            <Grid item key={currency}>
              <Card variant={'outlined'}>
                <CardHeader style={{textAlign: 'center'}} title={currency}/>
                <Divider/>
                <CardContent>
                  <Typography paragraph>amount: {balance}</Typography>
                  {pair && (
                    <Typography>price: {pair.bid} {mainCurrency}</Typography>
                  )}
                </CardContent>
                {pair && (
                  <>
                    <Divider/>
                    <Typography paragraph style={{textAlign: 'center', marginTop: 16}}>
                      <CurrencyPairExchange
                        balance={balance}
                        pair={pair}
                      />
                    </Typography>
                  </>
                )}
              </Card>
            </Grid>
          )
        })}
      </Grid>
      <Typography variant={'h4'}>Total: {Math.floor(total)} {mainCurrency}</Typography>
    </div>
  )
}

export default Balances