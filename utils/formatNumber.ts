const formatNumber = (ISO: string, currency: string) => (number: number): string => (
  new Intl.NumberFormat(ISO, { style: 'currency', currency }).format(number)
)

export default formatNumber