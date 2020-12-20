import { placeOrder } from './buy.js'
import { Command } from './command.js'

export default new Command(
  'sell',
  '<symbol> <qty> [tif] [limit_price]',
  ['s'],
  async (label, args) => await placeOrder(['sell', ...args]),
)
