import _ from 'lodash'
import prettyTable from '../pretty_table.js'

import { getClient } from '../main.js'
import { Command } from './command.js'

export default new Command('positions', '', ['pos', 'p'], async (label) => {
  // fetch the positions
  await getClient()
    .getPositions()
    .then((positions) => {
      if (_.isEmpty(positions)) {
        console.log('none')
        return
      }

      console.log(
        prettyTable(
          positions.map((position) => ({
            symbol: position.symbol,
            price: `$${position.current_price.toLocaleString()}`,
            qty: position.qty.toLocaleString(),
            market_value: `$${position.market_value.toLocaleString()}`,
            pnl:
              position.unrealized_pl > 0
                ? `+$${position.unrealized_pl.toLocaleString()}`
                : `-$${Math.abs(position.unrealized_pl).toLocaleString()}`,
          })),
        ),
      )
    })
    .catch((error) => {
      throw new Error(error.message)
    })
})
