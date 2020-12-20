import _ from 'lodash'
import chalk from 'chalk'

import {
  OrderSide,
  OrderTimeInForce,
} from '@master-chief/alpaca/types/entities'
import { getClient } from '../main.js'
import { PlaceOrder } from '@master-chief/alpaca'
import { Command } from './command.js'
import { default as Decimal } from 'decimal.js'

export default new Command(
  'buy',
  '<symbol> <qty> [tif] [limit_price]',
  ['b'],
  async (label, args) => await placeOrder(['buy', ...args]),
)

export async function placeOrder(args: string[]) {
  // make sure minimum arg length is met
  if (args.length < 3) {
    throw new Error('not enough args')
  }

  // fetch the asset from alpaca
  let asset = await getClient()
    .getAsset({
      asset_id_or_symbol: args[1].toUpperCase(),
    })
    .catch(() => undefined)

  if (!asset) {
    throw new Error(`symbol "${args[1]}" could not be found`)
  }

  // determine the amount
  let amount = parseInt(args[2].replace('$', ''))

  if (!_.isNumber(amount)) {
    throw new Error(`"${args[2]}" is not a number`)
  }

  let params: PlaceOrder = {
    symbol: asset.symbol,
    qty: Math.floor(
      args[2].includes('$')
        ? new Decimal(amount)
            .div(
              (await getClient().getLastTrade({ symbol: asset.symbol })).last
                .price,
            )
            .toNumber()
        : amount,
    ),
    side: args[0].toLowerCase() as OrderSide,
    type: args[4] ? 'limit' : 'market',
    time_in_force: (args[3] as OrderTimeInForce) ?? 'day',
  }

  if (params.type == 'limit') {
    params.limit_price = new Decimal(args[4]).toNumber()
  }

  // place the order
  await getClient()
    .placeOrder(params)
    .then((order) => console.log(`placed with ID ${order.id}`))
    .catch((error) => {
      throw error.message
    })
}
