const parse = require('csv-parse/lib/sync')

function CNBRates(fromDate = new Date()) {
  this.fromDate = fromDate
  this.ratesUrl = 'https://www.cnb.cz/cs/financni-trhy/devizovy-trh/kurzy-devizoveho-trhu/kurzy-devizoveho-trhu/denni_kurz.txt?date='
}

CNBRates.prototype.fetchCurrencyRates = async function () {
  const response = await fetch(this.ratesUrl + this._getHumanReadableDate(this.fromDate))
  const rawData = await response.text()

  this.rates = parse(rawData, {
    columns: true,
    skip_empty_lines: true,
    delimiter: '|',
    from_line: 2,
  })
}
CNBRates.prototype.getCurrencyRate = function (currency) {
  if (!this.rates) {
    throw new Error('Cannot get currency rate before "fetchCurrencyRates" is called')
  }

  currency = currency.toUpperCase()

  return this.rates.find(rate => rate['kód'] === currency)?.kurz
}
CNBRates.prototype._getHumanReadableDate = function (date = new Date()) {
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  return `${day}.${(month > 9 ? '' : '0') + month}.${year}`
}

export default CNBRates