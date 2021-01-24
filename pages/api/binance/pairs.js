import Binance from '../../../adapters/Binance'

export default async (req, res) => {
  const { currencies, mainCurrency } = JSON.parse(req.body)

  const binance = new Binance(process.env.BINANCE_API_KEY, process.env.BINANCE_SECRET_KEY)

  const data = await binance.fetchCurrencyPairs(currencies, mainCurrency)

  res.status(200).json(data)
}
