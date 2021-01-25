import BitStamp from '../../../adapters/BitStamp'

export default async (req, res) => {
  const { currencies, mainCurrency } = JSON.parse(req.body)

  const bitstamp = new BitStamp(process.env.BITSTAMP_API_KEY, process.env.BITSTAMP_API_SECRET)

  const data = await bitstamp.fetchCurrencyPairs(currencies, mainCurrency)

  res.status(200).json(data)
}
