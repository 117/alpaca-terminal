import _ from 'lodash'

import { getClient } from '../main.js'
import { Command } from './command.js'

export default new Command(
  'cancel',
  '<symbol|order_id|*>',
  ['ca'],
  async (label, args) => {
    // make sure minimum arg length is met
    if (args.length < 1) {
      throw new Error('not enough args')
    }

    let orders = await getClient().getOrders(),
      found =
        args[0] == '*' || args[0].toLowerCase() == 'all'
          ? orders
          : orders.filter(
              (order) =>
                order.id == args[0] || order.symbol == args[0].toUpperCase(),
            )

    if (_.isEmpty(found)) {
      throw new Error(`no orders found for "${args[0]}"`)
    }

    await Promise.allSettled(
      found.map(
        async (order) =>
          await getClient()
            .cancelOrder({
              order_id: order.id,
            })
            .then(() => console.log(`cancelled with ID ${order.id}`))
            .catch((error) => {
              throw new Error(error.message)
            }),
      ),
    )
  },
)
