import Typography from "@material-ui/core/Typography";
import React from 'react'
import Chip from '@material-ui/core/Chip'
import Box from '@material-ui/core/Box'
import AccountBalanceIcon from '@material-ui/icons/AccountBalance'

import formatNumber from '../../../utils/formatNumber'

const TotalValue = ({czkUsdRate, totalValues}) => {
  const totalValue = [...totalValues.values()].reduce((acc, {amount, country}) => {
    const czkAmount = country.currency === 'USD' ? amount * czkUsdRate : amount

    return acc + czkAmount
  }, 0)

  return (
    <Box p={5}>
      <Typography align={'center'}>
        <Chip
          icon={<AccountBalanceIcon style={{fontSize: 18}}/>}
          label={formatNumber('cs-CZ', 'CZK')(totalValue)}
          color={'secondary'}
          size={'medium'}
          variant={'outlined'}
        />
      </Typography>
    </Box>
  )
}

export default TotalValue