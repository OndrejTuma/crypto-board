import React, { useEffect, useState } from 'react'

import DataPresenter from '../../../components/DataPresenter'
import Balances from '../components/Balances'

const getTotal = (balances, pairs) => balances.reduce((acc, {balance, currency}) => {
  const pair = pairs.find(({pair}) => pair[0] === currency)

  if (!pair) {
    return acc + balance
  }

  return acc + balance * pair.bid
}, 0)

const ExchangeContainer = ({ connection, currencies, mainCurrency, name }) => {
  const [balances, setBalances] = useState()
  const [pairs, setPairs] = useState()
  const [total, setTotal] = useState(0)

  useEffect(() => {
    connection.getBalances(currencies).then(res => setBalances(res))
    connection.getCurrencyPairs(currencies.filter(currency => currency !== mainCurrency), mainCurrency).then(res => setPairs(res))

    connection.createWebSocket([])
  }, [])
  useEffect(() => {
    if (!balances || !pairs) {
      return
    }

    setTotal(getTotal(balances, pairs))
  }, [balances, pairs])

  return (
    <div>
      <h2>{name} Exchange</h2>
      <DataPresenter data={balances}>
        {balances => (
          <Balances
            balances={balances}
            pairs={pairs}
            total={total}
            mainCurrency={mainCurrency}
          />
        )}
      </DataPresenter>
    </div>
  )
}

export default ExchangeContainer