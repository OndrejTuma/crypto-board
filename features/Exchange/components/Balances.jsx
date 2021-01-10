import React from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'

const Balances = ({ balances, currencyPairs, formatNumber, total }) => {
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
                    <Typography>price: {formatNumber(currencyPair.bid)}</Typography>
                  )}
                </CardContent>
                {currencyPair && (
                  <>
                    <Divider/>
                    <Typography paragraph style={{textAlign: 'center', marginTop: 16}}>
                      {formatNumber(balance * currencyPair.bid)}
                    </Typography>
                  </>
                )}
              </Card>
            </Grid>
          )
        })}
      </Grid>
      <Typography variant={'h4'}>Total: {formatNumber(total)}</Typography>
    </div>
  )
}

export default Balances