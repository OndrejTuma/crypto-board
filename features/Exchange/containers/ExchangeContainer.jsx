import React, { useCallback, useEffect, useState } from 'react'
import find from 'lodash/fp/find'
import flow from 'lodash/fp/flow'
import getOr from 'lodash/fp/getOr'
import Typography from '@material-ui/core/Typography'

import DataPresenter from '../../../components/DataPresenter'
import Price from '../../../components/Price'

import getTotal from '../../../utils/getTotal'
import CurrencyPairs from '../components/CurrencyPairs'
import useCurrencies from '../hooks/useCurrencies'
import CurrenciesSelectorContainer from './CurrenciesSelectorContainer'
import CountryContext from '../../../contexts/CountryContext'


const ExchangeContainer = ({ afterTotalValueChange, connection, country, currencies: defaultCurrencies, mainCurrency, name }) => {
  const [mainCurrencyBalance, setMainCurrencyBalance] = useState(0)
  const [balances, setBalances] = useState([])
  const currencySelector = useCurrencies(name, defaultCurrencies)
  const [currencyPairs, setCurrencyPairs] = useState([])
  const [total, setTotal] = useState(0)
  const [currencies] = currencySelector

  const updateCurrencyPairs = useCallback(currencyPair => {
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
  }, [])
  const beforeCurrencyAddHandler = currency => setCurrencyPairs(pairs => ([
    ...pairs,
    { pair: [currency, mainCurrency] },
  ]))
  const beforeCurrencyDeleteHandler = currency => setCurrencyPairs(pairs => pairs.filter(({ pair }) => pair[0] !== currency))

  useEffect(() => {
    // getting balances to defined currencies
    connection.getBalances(currencies).then(res => Array.isArray(res) && setBalances(res))
    // getting balance of main currency (if there is any)
    connection.getBalances([mainCurrency]).then(res => {
      const mainBalance = flow(find(['currency', mainCurrency]), getOr(0, 'balance'))(res)

      setMainCurrencyBalance(mainBalance)
    })

    // Using websockets rather than rest api for currency pairs
    // connection.getCurrencyPairs(currencies, mainCurrency).then(res => setCurrencyPairs(res))
    connection?.createSocketForCurrencyPairs?.(currencies, mainCurrency)
    connection?.subscribeToCurrencyPairs?.(updateCurrencyPairs, mainCurrency)
  }, [currencies])
  useEffect(() => {
    if (balances.length === 0 || !currencyPairs) {
      return
    }

    setTotal(getTotal(balances, currencyPairs))
  }, [balances, currencyPairs])
  useEffect(() => {
    afterTotalValueChange?.(total + mainCurrencyBalance, country)
  }, [total, mainCurrencyBalance])

  return (
    <CountryContext.Provider value={country}>
      <div>
        <h2>{name} Exchange</h2>
        <CurrenciesSelectorContainer
          beforeAdd={beforeCurrencyAddHandler}
          beforeDelete={beforeCurrencyDeleteHandler}
          currencySelector={currencySelector}
        />
        <DataPresenter data={currencyPairs} isDataEmpty={data => data.length === 0}>
          {currencyPairs => (
            <>
              <CurrencyPairs balances={balances} currencyPairs={currencyPairs}/>
              {Math.round(mainCurrencyBalance) > 0 ? (
                <Typography variant={'h5'}>
                  Main currency: <Price value={mainCurrencyBalance}/>
                </Typography>
              ) : null}
              <Typography variant={'h4'}>
                Total: <Price value={total + mainCurrencyBalance}/>
              </Typography>
            </>
          )}
        </DataPresenter>
      </div>
    </CountryContext.Provider>
  )
}

export default ExchangeContainer