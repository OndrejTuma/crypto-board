import HmacSHA256 from 'crypto-js/hmac-sha256'
import Hex from 'crypto-js/enc-hex'
import getOr from 'lodash/fp/getOr'

import fetchRequest from '../utils/fetchRequest'

function CoinMate(publicKey, privateKey, clientId) {
  this.publicKey = publicKey
  this.privateKey = privateKey
  this.clientId = parseInt(clientId)
  this.url = 'https://coinmate.io/api'
  this.websocketUrl = 'wss://coinmate.io/api/websocket'
}


CoinMate.prototype._getNonce = function () {
  return new Date().getTime()
}
CoinMate.prototype._getSignature = function (nonce) {
  return HmacSHA256(`${nonce}${this.clientId}${this.publicKey}`, this.privateKey).toString(Hex).toUpperCase()
}
CoinMate.prototype._subscribeToChannel = function (channel) {
  const nonce = this._getNonce()
  const signature = this._getSignature(nonce)

  this.socket.send(JSON.stringify({
    event: 'subscribe',
    data: {
      channel: channel,
      clientId: this.clientId,
      publicKey: this.publicKey,
      signature,
      nonce,
    },
  }))
}


CoinMate.prototype.createSocketForCurrencyPairs = function (currencies, mainCurrency) {
  if (this.socket) {
    this.socket.close()
  }

  this.socket = new WebSocket(this.websocketUrl)

  this.socket.addEventListener('open', () => {
    currencies.forEach(currency => this._subscribeToChannel(`order_book-${currency}_${mainCurrency}`))
  })

  return this.socket
}
CoinMate.prototype.subscribeToCurrencyPairs = function (pairMessage) {
  if (typeof pairMessage !== 'function') {
    return
  }

  this.socket.addEventListener('message', function (e) {
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
    // const bid = bids.reduce((acc, { price }) => acc + price, 0) / bids.length
    // const ask = asks.reduce((acc, { price }) => acc + price, 0) / asks.length
    const ask = getOr(0, '[0].price')(asks)
    const bid = getOr(0, '[0].price')(bids)

    pairMessage({
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