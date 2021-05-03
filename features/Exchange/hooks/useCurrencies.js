import useLocalStorage from '../../../hooks/useLocalStorage'

const localStorageKey = 'exchange_currencies'

const useCurrencies = (key, defaultCurrencies = []) => {
  const [currencies, setCurrencies] = useLocalStorage(`${localStorageKey}_${key.toLowerCase()}`, defaultCurrencies)

  return [currencies, setCurrencies]
}

export default useCurrencies