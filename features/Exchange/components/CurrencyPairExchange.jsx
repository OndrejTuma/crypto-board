import React from 'react'

const CurrencyPairExchange = ({ balance, pair }) => {
  if (!pair) {
    return null
  }

  const { pair: currencies, bid } = pair

  return `${parseFloat((balance * bid).toString()).toFixed(2)} ${currencies[1]}`
}

export default CurrencyPairExchange