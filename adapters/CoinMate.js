import HmacSHA256 from 'crypto-js/hmac-sha256'
import Hex from 'crypto-js/enc-hex'

import fetchRequest from '../utils/fetchRequest'

function CoinMate(publicKey, privateKey, clientId) {
  this.publicKey = publicKey
  this.privateKey = privateKey
  this.clientId = parseInt(clientId)
  this.url = 'https://coinmate.io/api'
}

CoinMate.prototype.getBalances = async function () {
  const nonce = new Date().getTime()
  const request = new Request(`${this.url}/balances`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `clientId=${this.clientId}&publicKey=${this.publicKey}&nonce=${nonce}&signature=${HmacSHA256(`${nonce}${this.clientId}${this.publicKey}`, this.privateKey).toString(Hex).toUpperCase()}`,
  })

  return fetchRequest(request)
}
CoinMate.prototype.getCurrencyPair = async function (pair) {
  const request = new Request(`${this.url}/ticker?currencyPair=${pair}`)

  return fetchRequest(request)
}

export default CoinMate