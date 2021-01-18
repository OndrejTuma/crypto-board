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
BitStamp.prototype._getSignature = function (nonce) {
  return HmacSHA256(`${nonce}${this.customerId}${this.apiKey}`, this.secretKey).toString(Hex).toUpperCase()
}

BitStamp.prototype.getBalances = async function (currencies) {
  const nonce = this._getNonce()
  const signature = this._getSignature(nonce)

  const request = new Request(`${this.url}/balance/`, {
    method: 'POST',
    headers: {
      'X-Auth': `BITSTAMP ${this.apiKey}`,
      'X-Auth-Signature': signature,
      'X-Auth-Nonce': nonce,
      'X-Auth-Timestamp': new Date().getTime(),
      'X-Auth-Version': 'v2',
    },
  })

  let balances
  try {
    balances = await fetchRequest(request)
  } catch (e) {
    return {
      error: true,
      errorMessage: e.message,
    }
  }

  if (balances.error) {
    return balances
  }

  return Object.keys(balances.data)
    .map(key => {
      const [currency, type] = balances.data[key].split('_')
      return {
        balance: balances.data[key],
        currency,
        type,
      }
    })
    .filter(({ currency, type }) => type === 'balance' && currencies.indexOf(currency) > -1)
    .map(({ currency, balance }) => ({
      currency,
      balance,
    }))
}
BitStamp.prototype.getCurrencyPairs = async function (currencies, mainCurrency) {
  const pairs = []

  for (let currency of currencies) {
    const pair = await this.getCurrencyPair(`${currency.toLocaleLowerCase()}${mainCurrency.toLocaleLowerCase()}`)

    pairs.push({
      pair: [currency, mainCurrency],
      ...pair,
    })
  }

  return pairs.map(({ ask, bid, pair }) => ({
    ask,
    bid,
    pair,
  }))
}
BitStamp.prototype.getCurrencyPair = async function (pair) {
  const request = new Request(`${this.url}/ticker/${pair}`)

  return fetchRequest(request)
}


export default BitStamp