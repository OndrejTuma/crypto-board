const formatNumber = (ISO, currency) => number => (
  new Intl.NumberFormat(ISO, { style: 'currency', currency: currency }).format(number)
)

export default formatNumber