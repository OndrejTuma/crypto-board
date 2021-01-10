import React from 'react'

const CurrencyPairExchange = ({ balance, pair }) => {
  if (!pair) {
    return null
  }

  const { pair: currencies, bid } = pair

  return `${Math.floor(balance * bid)} ${currencies[1]}`
}

export default CurrencyPairExchange