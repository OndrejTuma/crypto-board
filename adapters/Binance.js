import HmacSHA256 from 'crypto-js/hmac-sha256'
import Hex from 'crypto-js/enc-hex'

import Socket from '../prototypes/Socket'
import fetchRequest from '../utils/fetchRequest'

function Binance(apiKey, secretKey) {
  this.apiKey = apiKey
  this.secretKey = secretKey
  this.url = 'https://api.binance.com'
  this.websocketUrl = 'wss://stream.binance.com:9443'
}


Binance.prototype._getTimestamp = function () {
  return new Date().getTime()
}
Binance.prototype._getSignature = function (queryString = '', requestBody = '') {
  return HmacSHA256(`${queryString}${requestBody}`, this.secretKey).toString(Hex)
}


Binance.prototype.createSocket = function (currencies, mainCurrency) {
  if (this.socket) {
    this.socket.close()
  }

  const params = currencies.map(currency => `${currency.toLowerCase()}${mainCurrency.toLowerCase()}@ticker`)
  const socketUrl = `${this.websocketUrl}/stream?streams=${params.join('/')}`

  this.socket = new Socket(socketUrl)

  this.socket.open()
}
Binance.prototype.subscribeToCurrencies = function (currencies, mainCurrency) {
  const params = currencies.map(currency => `${currency.toLowerCase()}${mainCurrency.toLowerCase()}@ticker`)

  this.socket.send({
    method: 'SUBSCRIBE',
    params,
    id: 1,
  })
}
Binance.prototype.subscribeToCurrency = function (currency, mainCurrency) {
  this.subscribeToCurrencies([currency], mainCurrency)
}
Binance.prototype.unsubscribeFromCurrencies = function (currencies, mainCurrency) {
  const params = currencies.map(currency => `${currency.toLowerCase()}${mainCurrency.toLowerCase()}@ticker`)

  this.socket.send({
    method: 'UNSUBSCRIBE',
    params,
    id: 1,
  })
}
Binance.prototype.unsubscribeFromCurrency = function (currency, mainCurrency) {
  this.unsubscribeFromCurrencies([currency], mainCurrency)
}
Binance.prototype.registerMessageHandler = function (handler, mainCurrency) {
  this.socket.message(function (e) {
    const { data } = JSON.parse(e.data)

    if (!data) {
      return
    }

    const { a, b, c, s } = data
    const currency = s.substr(0, s.indexOf(mainCurrency))

    handler?.({
      // ask: parseFloat(a),
      bid: parseFloat(c),
      pair: [currency, mainCurrency],
    })
  })
}

Binance.prototype.getBalances = function (currencies) {
  const request = new Request('/api/binance/balances', {
    method: 'POST',
    body: JSON.stringify(currencies),
  })

  return fetchRequest(request)
}
Binance.prototype.fetchBalances = async function (currencies) {
  const queryString = `timestamp=${this._getTimestamp()}`
  const signature = this._getSignature(queryString)

  const request = new Request(`${this.url}/sapi/v1/capital/config/getall?${queryString}&signature=${signature}`, {
    method: 'GET',
    headers: {
      'X-MBX-APIKEY': this.apiKey,
    },
  })

  const balances = await fetchRequest(request)

  if (balances.error) {
    return balances
  }

  return balances
    .filter(({ coin }) => currencies.indexOf(coin) > -1)
    .map(({ coin: currency, free: balance }) => ({
      currency,
      balance: parseFloat(balance),
    }))
}
Binance.prototype.getCurrencyPairs = async function (currencies, mainCurrency) {
  const request = new Request('/api/binance/pairs', {
    method: 'POST',
    body: JSON.stringify({
      currencies,
      mainCurrency,
    }),
  })

  return await fetchRequest(request)
}
Binance.prototype.fetchCurrencyPairs = async function (currencies, mainCurrency) {
  const pairs = []

  for (let currency of currencies) {
    const pair = await this.getCurrencyPair(`${currency}${mainCurrency}`)
    if (!pair.error) {
      pairs.push({
        pair: [currency, mainCurrency],
        ...pair,
      })
    }
  }

  return pairs.map(({ askPrice: ask, bidPrice: bid, pair }) => ({
    ask,
    bid,
    pair,
  }))
}
Binance.prototype.getCurrencyPair = async function (pair) {
  const request = new Request(`${this.url}/api/v3/ticker/bookTicker?symbol=${pair}`)

  return fetchRequest(request)
}


export default Binance