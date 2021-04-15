const getTotal = (balances, pairs) => balances.reduce((acc, { balance, currency }) => {
  const pair = pairs.find(({ pair }) => pair[0] === currency)

  if (!pair) {
    return acc + balance
  }

  return acc + balance * (pair?.bid || 0)
}, 0)

export default getTotal