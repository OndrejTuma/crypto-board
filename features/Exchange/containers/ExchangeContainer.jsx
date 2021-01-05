import React, {useEffect, useState} from 'react'
import get from 'lodash/fp/get'

import DataPresenter from '../../../components/DataPresenter'
import Balances from '../components/Balances'

const ExchangeContainer = ({ connection, name }) => {
  const [balances, setBalances] = useState()
  const [ltcPair, setLtcPair] = useState()
  const [dashPair, setDashPair] = useState()

  const pairs = {
    LTC: get('data')(ltcPair),
    DASH: get('data')(dashPair),
  }

  useEffect(() => {
    connection.getBalances().then(res => setBalances(res))
    connection.getCurrencyPair('LTC_CZK').then(res => setLtcPair(res))
    connection.getCurrencyPair('DASH_CZK').then(res => setDashPair(res))
  }, [])

  return (
    <div>
      <h2>{name} Exchange</h2>
      <DataPresenter data={balances} transformData={get('data')}>
        {balances => <Balances balances={balances} pairs={pairs}/> }
      </DataPresenter>
    </div>
  )
}

export default ExchangeContainer