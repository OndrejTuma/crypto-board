import BitStamp from '../../../adapters/BitStamp'

export default async (req, res) => {
  const bitstamp = new BitStamp(process.env.BITSTAMP_API_KEY, process.env.BITSTAMP_API_SECRET, process.env.BITSTAMP_CUSTOMER_ID)

  const data = await bitstamp.getBalances(['ETH'])

  res.status(200).json(data)
}
