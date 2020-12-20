import _ from 'lodash'
import prettyTable from '../pretty_table.js'

import { getClient } from '../main.js'
import { Command } from './command.js'

export default new Command(
  'orders',
  '[status]',
  ['or', 'o'],
  async (label, args) => {
    // fetch the orders
    await getClient()
      .getOrders({
        // @ts-ignore
        status: args[0] ? args[0] : 'open',
      })
      .then((orders) => {
        if (_.isEmpty(orders)) {
          console.log('none')
          return
        }

        console.log(
          prettyTable(
            orders.map((order) => ({
              symbol: order.symbol,
              side: order.side,
              qty: order.qty.toLocaleString(),
              price: order.filled_avg_price
                ? order.filled_avg_price.toString()
                : '-',
              status: order.status,
              id: order.id,
            })),
          ),
        )
      })
      .catch((error) => {
        throw new Error(error.message)
      })
  },
)
