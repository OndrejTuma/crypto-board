import HmacSHA256 from 'crypto-js/hmac-sha256'
import Hex from 'crypto-js/enc-hex'
import getOr from 'lodash/fp/getOr'

import Socket from '../prototypes/Socket'
import fetchRequest from '../utils/fetchRequest'
import generateId from '../utils/generateId'

function BitStamp(apiKey, secretKey) {
  this.apiKey = apiKey
  this.secretKey = secretKey
  this.url = 'https://www.bitstamp.net/api/v2'

  this.socket = new Socket('wss://ws.bitstamp.net')
}

BitStamp.prototype._getNonce = function () {
  return generateId(36)
}
BitStamp.prototype._getSignature = function (nonce, url, method, timestamp) {
  const standardUrl = new URL(url)
  const stringToSign = `BITSTAMP ${this.apiKey}${method}${standardUrl.hostname}${standardUrl.pathname}${standardUrl.search}${nonce}${timestamp}v2`
  return HmacSHA256(stringToSign, this.secretKey).toString(Hex).toUpperCase()
}
BitStamp.prototype._getCurrencyPair = function (currency, mainCurrency) {
  return currency.toLocaleLowerCase() + mainCurrency.toLocaleLowerCase()
}
BitStamp.prototype._parseCurrencyPair = function (pair, mainCurrency) {
  return [pair.substr(0, pair.toUpperCase().indexOf(mainCurrency)).toUpperCase(), mainCurrency]
}


BitStamp.prototype.closeSocket = function () {
  this.socket?.close()
}
BitStamp.prototype.createSocket = function () {
  this.socket.close()
  this.socket.open()
}
BitStamp.prototype.subscribeToCurrencies = function (currencies, mainCurrency) {
  currencies.forEach(currency => this.subscribeToCurrency(currency, mainCurrency))
}
BitStamp.prototype.subscribeToCurrency = function (currency, mainCurrency) {
  const channel = `live_trades_${this._getCurrencyPair(currency, mainCurrency)}`

  this.socket.send({
    event: 'bts:subscribe',
    data: {
      channel,
    },
  })
}
BitStamp.prototype.unsubscribeFromCurrencies = function (currencies, mainCurrency) {
  currencies.forEach(currency => this.unsubscribeFromCurrency(currency, mainCurrency))
}
BitStamp.prototype.unsubscribeFromCurrency = function (currency, mainCurrency) {
  const channel = `live_trades_${this._getCurrencyPair(currency, mainCurrency)}`

  this.socket.send({
    event: 'bts:unsubscribe',
    data: {
      channel,
    },
  })
}
BitStamp.prototype.registerMessageHandler = function (handler, mainCurrency) {
  this.socket.message(e => {
    const { channel, data, event } = JSON.parse(e.data)

    if (event !== 'trade') {
      return
    }

    const pair = this._parseCurrencyPair(channel.split('_').pop(), mainCurrency)
    // const ask = getOr(0, 'asks[0][0]')(data)
    const bid = getOr(0, 'price')(data)

    handler?.({
      // ask: parseFloat(ask),
      bid: parseFloat(bid),
      pair,
    })
  })
}

BitStamp.prototype.getBalances = async function (currencies) {
  const request = new Request('/api/bitstamp/balances', {
    method: 'POST',
    body: JSON.stringify(currencies),
  })

  return await fetchRequest(request)
}
BitStamp.prototype.fetchBalances = async function (currencies) {
  const url = `${this.url}/balance/`
  const method = 'POST'
  const nonce = this._getNonce()
  const timestamp = new Date().getTime()
  const signature = this._getSignature(nonce, url, method, timestamp)

  const request = new Request(url, {
    method,
    headers: {
      'X-Auth': `BITSTAMP ${this.apiKey}`,
      'X-Auth-Signature': signature,
      'X-Auth-Nonce': nonce,
      'X-Auth-Timestamp': timestamp,
      'X-Auth-Version': 'v2',
    },
  })

  const balances = await fetchRequest(request)

  if (balances.error) {
    return balances
  }

  return Object.keys(balances)
    .map(key => {
      const [currency, type] = key.split('_')

      return {
        balance: balances[key],
        currency: currency.toUpperCase(),
        type,
      }
    })
    .filter(({ currency, type }) => type === 'balance' && currencies.indexOf(currency) > -1)
    .map(({ currency, balance }) => ({
      currency,
      balance: parseFloat(balance),
    }))
}
BitStamp.prototype.getCurrencyPairs = async function (currencies, mainCurrency) {
  const request = new Request('/api/bitstamp/pairs', {
    method: 'POST',
    body: JSON.stringify({
      currencies,
      mainCurrency,
    }),
  })

  return await fetchRequest(request)
}
BitStamp.prototype.fetchCurrencyPairs = async function (currencies, mainCurrency) {
  const pairs = []

  for (let currency of currencies) {
    const pair = await this.getCurrencyPair(this._getCurrencyPair(currency, mainCurrency))

    pairs.push({
      pair: [currency, mainCurrency],
      ...pair,
    })
  }

  return pairs.map(({ ask, bid, pair }) => ({
    ask: parseFloat(ask),
    bid: parseFloat(bid),
    pair,
  }))
}
BitStamp.prototype.getCurrencyPair = async function (pair) {
  const request = new Request(`${this.url}/ticker/${pair}`)

  return fetchRequest(request)
}


export default BitStamp