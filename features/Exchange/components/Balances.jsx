import React from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
import CurrencyPairExchange from './CurrencyPairExchange'

const Balances = ({ balances, mainCurrency, currencyPairs, total }) => {
  return (
    <div>
      <Grid container spacing={2}>
        {balances.map(({ currency, balance }) => {
          const currencyPair = currencyPairs && currencyPairs.find(({ pair }) => pair[0] === currency)

          return (
            <Grid item key={currency}>
              <Card variant={'outlined'}>
                <CardHeader style={{textAlign: 'center'}} title={currency}/>
                <Divider/>
                <CardContent>
                  <Typography paragraph>amount: {balance}</Typography>
                  {currencyPair && (
                    <Typography>price: {parseFloat(currencyPair.bid).toFixed(2)} {mainCurrency}</Typography>
                  )}
                </CardContent>
                {currencyPair && (
                  <>
                    <Divider/>
                    <Typography paragraph style={{textAlign: 'center', marginTop: 16}}>
                      <CurrencyPairExchange
                        balance={balance}
                        pair={currencyPair}
                      />
                    </Typography>
                  </>
                )}
              </Card>
            </Grid>
          )
        })}
      </Grid>
      <Typography variant={'h4'}>Total: {parseFloat(total).toFixed(2)} {mainCurrency}</Typography>
    </div>
  )
}

export default Balances