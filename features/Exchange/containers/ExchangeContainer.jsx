import React, { useEffect, useState } from 'react'
import getOr from 'lodash/fp/getOr'

import DataPresenter from '../../../components/DataPresenter'
import Balances from '../components/Balances'

import formatNumberFactory from '../../../utils/formatNumber'
import getTotal from '../../../utils/getTotal'
import Typography from '@material-ui/core/Typography'


const ExchangeContainer = ({ connection, country, currencies, mainCurrency, name }) => {
  const { currency, ISO } = country
  const [mainCurrencyBalance, setMainCurrencyBalance] = useState(0)
  const [balances, setBalances] = useState([])
  const [currencyPairs, setCurrencyPairs] = useState([])
  const [total, setTotal] = useState(0)

  const formatNumber = formatNumberFactory(ISO, currency)
  const updateCurrencyPairs = currencyPair => {
    setCurrencyPairs(currencyPairs => {
      if (currencyPairs.find(({ pair }) => pair[0] === currencyPair.pair[0])) {
        return currencyPairs.map(stateCurrencyPair => (
          stateCurrencyPair.pair[0] === currencyPair.pair[0] ? currencyPair : stateCurrencyPair
        ))
      }
      return [
        ...currencyPairs,
        currencyPair,
      ]
    })
  }

  useEffect(() => {
    connection.getBalances(currencies).then(res => Array.isArray(res) && setBalances(res))
    connection.getBalances(mainCurrency).then(res => {
      const mainBalance = getOr(0, '[0].balance')(res)

      if (mainBalance) {
        setMainCurrencyBalance(mainBalance)
      }
    })
    connection.getCurrencyPairs(currencies, mainCurrency).then(res => setCurrencyPairs(res))

    if (connection.createSocketForCurrencyPairs && connection.subscribeToCurrencyPairs) {
      connection.createSocketForCurrencyPairs(currencies, mainCurrency)
      connection.subscribeToCurrencyPairs(updateCurrencyPairs, mainCurrency)
    }
  }, [])
  useEffect(() => {
    if (balances.length === 0 || !currencyPairs) {
      return
    }

    setTotal(getTotal(balances, currencyPairs))
  }, [balances, currencyPairs])

  return (
    <div>
      <h2>{name} Exchange</h2>
      <DataPresenter data={balances} isDataEmpty={data => data.length === 0}>
        {balances => (
          <>
            <Balances
              balances={balances}
              currencyPairs={currencyPairs}
              formatNumber={formatNumber}
            />
            {Math.round(mainCurrencyBalance) > 0 ? (
              <Typography variant={'h5'}>Main currency: {formatNumber(mainCurrencyBalance)}</Typography>
            ) : null}
            <Typography variant={'h4'}>Total: {formatNumber(total + mainCurrencyBalance)}</Typography>
          </>
        )}
      </DataPresenter>
    </div>
  )
}

export default ExchangeContainer