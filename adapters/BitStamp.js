import HmacSHA256 from 'crypto-js/hmac-sha256'
import Hex from 'crypto-js/enc-hex'
import getOr from 'lodash/fp/getOr'

import fetchRequest from '../utils/fetchRequest'
import generateId from '../utils/generateId'

function BitStamp(apiKey, secretKey, customerId) {
  this.apiKey = apiKey
  this.secretKey = secretKey
  this.customerId = parseInt(customerId)
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


BitStamp.prototype.getBalances = async function (currencies) {
  const request = new Request('/api/bitstamp/balances', {
    method: 'POST',
    body: JSON.stringify(currencies)
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
    })
  })

  return await fetchRequest(request)
}
BitStamp.prototype.fetchCurrencyPairs = async function (currencies, mainCurrency) {
  const pairs = []

  for (let currency of currencies) {
    const pair = await this.getCurrencyPair(`${currency.toLocaleLowerCase()}${mainCurrency.toLocaleLowerCase()}`)

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