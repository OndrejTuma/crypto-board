import BitStamp from '../../../adapters/BitStamp'

export default async (req, res) => {
  const currencies = req.body
  const bitstamp = new BitStamp(process.env.BITSTAMP_API_KEY, process.env.BITSTAMP_API_SECRET)

  const data = await bitstamp.fetchBalances(currencies)

  res.status(200).json(data)
}
