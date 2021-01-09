import React from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'

const Balances = ({ balances, mainCurrency, pairs, total }) => {
  return (
    <div>
      <Grid container spacing={2}>
        {balances.map(({ currency, balance }) => (
          <Grid item key={currency}>
            <Card variant={'outlined'}>
              <CardHeader title={currency}/>
              <CardContent>
                <Typography paragraph>{balance}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Typography variant={'h4'}>Total: {total} {mainCurrency}</Typography>
    </div>
  )
}

export default Balances