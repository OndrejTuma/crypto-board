import React, {useEffect, useState} from 'react'

const ExchangeContainer = ({ connections, name }) => {
  const [balances, setBalances] = useState({})

  useEffect(() => {
    connections.getBalances().then(res => setBalances(res))
  }, [])

  return (
    <div>
      <h2>{name} Exchange</h2>
      <pre>{JSON.stringify(balances, null, 2)}</pre>
    </div>
  )
}

export default ExchangeContainer