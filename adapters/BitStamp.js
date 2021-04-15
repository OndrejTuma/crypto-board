import HmacSHA256 from 'crypto-js/hmac-sha256'
import Hex from 'crypto-js/enc-hex'
import getOr from 'lodash/fp/getOr'

import fetchRequest from '../utils/fetchRequest'
import generateId from '../utils/generateId'

function BitStamp(apiKey, secretKey) {
  this.apiKey = apiKey
  this.secretKey = secretKey
  this.url = 'https://www.bitstamp.net/api/v2'
  this.websocketUrl = 'wss://ws.bitstamp.net'
}

BitStamp.prototype._getNonce = function () {
  return generateId(36)
}
BitStamp.prototype._getSignature = function (nonce, url, method, timestamp) {
  const standardUrl = new URL(url)
  const stringToSign = `BITSTAMP ${this.apiKey}${method}${standardUrl.hostname}${standardUrl.pathname}${standardUrl.search}${nonce}${timestamp}v2`
  return HmacSHA256(stringToSign, this.secretKey).toString(Hex).toUpperCase()
}
BitStamp.prototype._subscribeToChannel = function (channel) {
  this.socket.send(JSON.stringify({
    event: 'bts:subscribe',
    data: {
      channel,
    },
  }))
}
BitStamp.prototype._getCurrencyPair = function (currency, mainCurrency) {
  return currency.toLocaleLowerCase() + mainCurrency.toLocaleLowerCase()
}
BitStamp.prototype._parseCurrencyPair = function (pair, mainCurrency) {
  return [pair.substr(0, pair.toUpperCase().indexOf(mainCurrency)).toUpperCase(), mainCurrency]
}


BitStamp.prototype.closeSocketForCurrencyPairs = function () {
  this.socket?.close()
}
BitStamp.prototype.createSocketForCurrencyPairs = function (currencies, mainCurrency) {
  this.closeSocketForCurrencyPairs()

  this.socket = new WebSocket(this.websocketUrl)

  this.socket.addEventListener('open', () => {
    currencies.forEach(currency => this._subscribeToChannel(`order_book_${this._getCurrencyPair(currency, mainCurrency)}`))
  })

  return this.socket
}
BitStamp.prototype.subscribeToCurrencyPairs = function (pairMessage, mainCurrency) {
  if (typeof pairMessage !== 'function') {
    return
  }

  this.socket.addEventListener('message', e => {
    const { channel, data, event } = JSON.parse(e.data)

    if (event !== 'data') {
      return
    }

    const pair = this._parseCurrencyPair(channel.split('_').pop(), mainCurrency)
    const ask = getOr(0, 'asks[0][0]')(data)
    const bid = getOr(0, 'bids[0][0]')(data)

    pairMessage({
      ask,
      bid,
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