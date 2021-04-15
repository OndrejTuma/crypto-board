export type CurrencyPair = {
  ask: number,
  bid: number,
  pair: [string, string], // first is crypto currency, second is main currency, i.e.: ["BTC", "BUSD"]
}