import HmacSHA256 from 'crypto-js/hmac-sha256'
import Hex from 'crypto-js/enc-hex'

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


CoinMate.prototype.createWebSocket = function (channels = []) {
  this.socket = new WebSocket(this.websocketUrl)

  this.socket.addEventListener('open', () => {
    channels.forEach(channel => this._subscribeToChannel(channel))
  })
  this.socket.addEventListener('message', function (event) {
    console.log('Message from server ', JSON.parse(event.data))
  })

  return this.socket
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
        ...pair.data
      })
    }
  }

  return pairs.map(({ amount, ask, bid, pair }) => ({
    amount,
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