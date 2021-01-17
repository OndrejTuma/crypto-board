import fetch from 'node-fetch'

export default (req, res) => {
  const code = req.query.code

  if (!code) {
    res.status(400).send('<p><strong>! Code is missing</strong></p>')
  }

  const redirectUri = `http://${req.headers.host}/binance`
  const binanceUri = `https://accounts.binance.com/oauth/token?client_id=${process.env.BINANCE_CLIENT_ID}&client_secret=${process.env.BINANCE_SECRET_KEY}&grant_type=authorization_code&code=${code}&redirect_uri=${redirectUri}`

  fetch(binanceUri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  })
    .then(data => data.json())
    .then(data => res.status(200).send(`<p>Redirecting...</p><pre>${JSON.stringify(data,null,2)}</pre>`))
    .catch(e => res.status(400).send(`<p>${e.message}</p>`))
}
