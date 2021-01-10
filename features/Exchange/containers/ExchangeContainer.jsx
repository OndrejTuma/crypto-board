import React, { useEffect, useState } from 'react'

import DataPresenter from '../../../components/DataPresenter'
import Balances from '../components/Balances'

const getTotal = (balances, pairs) => balances.reduce((acc, { balance, currency }) => {
  const pair = pairs.find(({ pair }) => pair[0] === currency)

  if (!pair) {
    return acc + balance
  }

  return acc + balance * pair.bid
}, 0)

const ExchangeContainer = ({ connection, currencies, mainCurrency, name }) => {
  const [balances, setBalances] = useState()
  const [currencyPairs, setCurrencyPairs] = useState([])
  const [total, setTotal] = useState(0)

  useEffect(() => {
    connection.getBalances(currencies).then(res => setBalances(res))

    connection.createSocketForCurrencyPairs(currencies, mainCurrency)
    connection.subscribeToCurrencyPairs(currencyPair => {
      setCurrencyPairs(currencyPairs => {
        if (currencyPairs.find(({ pair }) => pair[0] === currencyPair.pair[0])) {
          return currencyPairs.map(stateCurrencyPair => stateCurrencyPair.pair[0] === currencyPair.pair[0] ? currencyPair : stateCurrencyPair)
        } else {
          return [
            ...currencyPairs,
            currencyPair,
          ]
        }
      })
    })
  }, [])
  useEffect(() => {
    if (!balances || !currencyPairs) {
      return
    }

    setTotal(getTotal(balances, currencyPairs))
  }, [balances, currencyPairs])

  return (
    <div>
      <h2>{name} Exchange</h2>
      <DataPresenter data={balances}>
        {balances => (
          <Balances
            balances={balances}
            currencyPairs={currencyPairs}
            total={total}
            mainCurrency={mainCurrency}
          />
        )}
      </DataPresenter>
    </div>
  )
}

export default ExchangeContainer