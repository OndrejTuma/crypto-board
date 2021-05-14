import HmacSHA256 from 'crypto-js/hmac-sha256'
import Hex from 'crypto-js/enc-hex'
import getOr from 'lodash/fp/getOr'

import Socket from '../prototypes/Socket'
import fetchRequest from '../utils/fetchRequest'

function CoinMate(publicKey, privateKey, clientId) {
  this.publicKey = publicKey
  this.privateKey = privateKey
  this.clientId = parseInt(clientId)
  this.url = 'https://coinmate.io/api'

  this.socket = new Socket('wss://coinmate.io/api/websocket')
}


CoinMate.prototype._getNonce = function () {
  return new Date().getTime()
}
CoinMate.prototype._getSignature = function (nonce) {
  return HmacSHA256(`${nonce}${this.clientId}${this.publicKey}`, this.privateKey).toString(Hex).toUpperCase()
}


CoinMate.prototype.createSocket = function () {
  this.socket.close()
  this.socket.open()
}
CoinMate.prototype.subscribeToCurrencies = function (currencies, mainCurrency) {
  currencies.forEach(currency => this.subscribeToCurrency(currency, mainCurrency))
}
CoinMate.prototype.subscribeToCurrency = function (currency, mainCurrency) {
  const channel = `order_book-${currency}_${mainCurrency}`
  const nonce = this._getNonce()
  const signature = this._getSignature(nonce)

  this.socket.send({
    event: 'subscribe',
    data: {
      channel: channel,
      clientId: this.clientId,
      publicKey: this.publicKey,
      signature,
      nonce,
    },
  })
}
CoinMate.prototype.unsubscribeFromCurrencies = function (currencies, mainCurrency) {
  currencies.forEach(currency => this.unsubscribeFromCurrency(currency, mainCurrency))
}
CoinMate.prototype.unsubscribeFromCurrency = function (currency, mainCurrency) {
  const channel = `order_book-${currency}_${mainCurrency}`
  const nonce = this._getNonce()
  const signature = this._getSignature(nonce)

  this.socket.send({
    event: 'unsubscribe',
    data: {
      channel: channel,
      clientId: this.clientId,
      publicKey: this.publicKey,
      signature,
      nonce,
    },
  })
}
CoinMate.prototype.registerMessageHandler = function (pairMessage) {
  this.socket.message(function (e) {
    const { channel, event, payload } = JSON.parse(e.data)

    if (event !== 'data') {
      return
    }

    const [type, currencyPair] = channel.split('-')

    if (type !== 'order_book') {
      return
    }

    const bids = getOr([], 'bids')(payload)
    const asks = getOr([], 'asks')(payload)

    const pair = currencyPair.split('_')
    const ask = getOr(0, '[0].price')(asks)
    const bid = getOr(0, '[0].price')(bids)

    pairMessage?.({
      ask,
      bid,
      pair,
    })
  })
}

CoinMate.prototype.getBalances = async function (currencies) {
  const nonce = this._getNonce()
  const signature = this._getSignature(nonce)

  const request = new Request(`${this.url}/balances`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `clientId=${this.clientId}&publicKey=${this.publicKey}&nonce=${nonce}&signature=${signature}`,
  })

  const balances = await fetchRequest(request)

  if (balances.error) {
    return balances
  }

  return Object.keys(balances.data)
    .map(key => balances.data[key])
    .filter(({ currency }) => currencies.indexOf(currency) > -1)
    .map(({ currency, balance }) => ({
      currency,
      balance,
    }))
}
CoinMate.prototype.getCurrencyPairs = async function (currencies, mainCurrency) {
  const pairs = []

  for (let currency of currencies) {
    const pair = await this.getCurrencyPair(`${currency}_${mainCurrency}`)
    if (!pair.error) {
      pairs.push({
        pair: [currency, mainCurrency],
        ...pair.data,
      })
    }
  }

  return pairs.map(({ ask, bid, pair }) => ({
    ask,
    bid,
    pair,
  }))
}
CoinMate.prototype.getCurrencyPair = async function (pair) {
  const request = new Request(`${this.url}/ticker?currencyPair=${pair}`)

  return fetchRequest(request)
}


export default CoinMate