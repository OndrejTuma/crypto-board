import { useState } from 'react'

const useCurrencies = (defaultCurrencies) => {
  const [currencies, setCurrencies] = useState([...defaultCurrencies])

  return [currencies, setCurrencies]
}

export default useCurrencies