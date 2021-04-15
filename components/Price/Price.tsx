import React, {useContext} from 'react'

import formatNumber from '../../utils/formatNumber'
import CountryContext from '../../contexts/CountryContext'

const Price = ({value}) => {
  const {ISO, currency} = useContext(CountryContext)

  return <span>{formatNumber(ISO, currency)(value)}</span>
}

export default Price