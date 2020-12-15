import _ from 'lodash'
import chalk from 'chalk'
import os from 'os'
import fs from 'fs'
import path from 'path'
import dot from 'dot-prop'
import pkg from '../package.json'
import readline from 'readline'

import {
  OrderSide,
  OrderTimeInForce,
} from '@master-chief/alpaca/types/entities'

import { read as config, write } from './config.js'
import { AlpacaClient, PlaceOrder } from '@master-chief/alpaca'
import { default as Decimal } from 'decimal.js'
import { allowedNodeEnvironmentFlags } from 'process'

new (class {
  private interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  private client: AlpacaClient = new AlpacaClient({
    credentials: {
      key: config().credentials.key,
      secret: config().credentials.secret,
    },
    rate_limit: true,
  })

  constructor(
    protected parameters: {
      prompt: string
      welcomeMessage: string
      commandMap: { [key: string]: string }
    },
  ) {}

  async loop() {
    if (!('welcome' in this)) {
      console.log(this.parameters.welcomeMessage)
      Object.assign(this, { welcome: true })
    }

    this.interface.question(this.parameters.prompt, async (input) => {
      try {
        let args = input.split(' '),
          label = args[0].toLowerCase()

        // map any aliases
        if (this.parameters.commandMap) {
          if (label in this.parameters.commandMap) {
            label = this.parameters.commandMap[label]
          }
        }

        if (label in this.parameters.commandMap) {
          // @ts-ignore
          await this[label](...args.slice(1)).catch((error) =>
            console.log(error),
          )
        } else {
          console.log(`command not found`)
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.loop()
      }
    })
  }

  async help() {
    ;`help          [command]
account       [field]
config        [key] [value]
buy           <symbol> <amount> [tif] [limit_price]
sell          <symbol> <amount> [tif] [limit_price]
close         <symbol|*>
cancel        <symbol|order_id|*>
orders        [status]
positions
quit`
      .split('\n')
      .forEach((line) => console.log(line))
  }

  async config(...args: Array<string>) {
    let key = _.isUndefined(dot.get(config(), args[0])) ? undefined : args[0],
      value = dot.get(config(), args[0])

    if (args.length == 1) {
      // make sure field exists
      if (!key) {
        throw `key "${args[0]}" not found in config`
      }

      // @ts-ignore
      console.log(value)
    } else if (args.length > 1) {
      // make sure field exists
      if (!key) {
        throw `key "${args[0]}" not found in config`
      }

      // @ts-ignore
      let fieldType = typeof value

      try {
        args[1] = JSON.parse(args[1])
      } catch {}

      // make sure type is the same
      if (typeof args[1] != fieldType) {
        throw `wrong type, key "${args[0]}" is of type ${fieldType}`
      }

      // @ts-ignore
      write(dot.set(config(), key, args[1]))
      console.log(args[1])

      // @ts-ignore
      this.client['options']['credentials']['key'] = config().credentials.key
      // @ts-ignore
      this.client['options']['credentials'][
        'secret'
      ] = config().credentials.secret
    } else {
      // print entire config
      for (let [key_a, value_a] of Object.entries(config())) {
        // skip functions
        if (_.isFunction(value_a)) {
          continue
        }

        // print nested object as dot path
        if (_.isObject(value_a)) {
          for (let [key_b, value_b] of Object.entries(value_a))
            console.log(`${key_a}.${key_b}`.padEnd(24), value_b)
          continue
        }

        console.log(`${key_a}`.padEnd(24), value_a)
      }
    }
  }

  async account(...args: Array<string>) {
    // make sure client has been setup
    if (!this.client) {
      throw 'not authenticated'
    }

    // fetch the account
    let account = await this.client.getAccount().catch((error) => {
      throw error.message
    })

    if (args.length == 1) {
      if (!(args[0] in account)) {
        throw `field "${args[0]}" not present in account`
      }

      console.log((account as any)[args[0]])
      return
    }

    for (let [key, value] of Object.entries(account)) {
      if (!_.isFunction(value)) {
        console.log(key.padEnd(24), value)
      }
    }
  }

  async buy(...args: Array<string>) {
    await this.order('buy', ...args)
  }

  async sell(...args: Array<string>) {
    await this.order('sell', ...args)
  }

  async order(...args: Array<string>) {
    // make sure client has been setup
    if (!this.client) {
      throw 'not authenticated'
    }

    // make sure minimum arg length is met
    if (args.length < 3) {
      throw 'not enough args'
    }

    // determine the side
    let side = args[0].toLowerCase()

    if (side == 'b' || side == 'buy') {
      side = 'buy'
    } else if (side == 's' || side == 'sell') {
      side = 'sell'
    } else {
      throw `"${args[0]}" is not a side, must be buy or sell`
    }

    // fetch the asset from alpaca
    let asset = await this.client
      .getAsset({
        asset_id_or_symbol: args[1].toUpperCase(),
      })
      .catch(() => undefined)

    if (!asset) {
      throw `symbol "${args[1]}" could not be found`
    }

    // determine the amount
    let amount = parseInt(args[2].replace('$', ''))

    if (!_.isNumber(amount)) {
      throw `"${args[2]}" is not a number`
    }

    let params: PlaceOrder = {
      symbol: asset.symbol,
      qty: Math.floor(
        config().parse_amount_as_shares
          ? amount
          : new Decimal(amount)
              .div(
                (
                  await this.client.getLastTrade({
                    symbol: asset.symbol,
                  })
                ).last.price,
              )
              .toNumber(),
      ),
      side: side as OrderSide,
      type: args[4] ? 'limit' : 'market',
      time_in_force: (args[3] as OrderTimeInForce) ?? 'day',
    }

    if (params.type == 'limit') {
      params.limit_price = new Decimal(args[4]).toNumber()
    }

    // place the order
    await this.client
      .placeOrder(params)
      .then((order) => console.log(`order placed with ID ${order.id}`))
      .catch((error) => {
        throw error.message
      })
  }

  async orders(...args: Array<string>) {
    // make sure client has been setup
    if (!this.client) {
      throw 'not authenticated'
    }

    // fetch the orders
    await this.client
      .getOrders({
        // @ts-ignore
        status: args[0] ? args[0] : 'open',
      })
      .then((orders) => {
        if (_.isEmpty(orders)) {
          console.log('no orders found')
          return
        }

        console.log(
          'symbol'.padEnd(8),
          'side'.padEnd(6),
          'qty'.padEnd(8),
          'price'.padEnd(8),
          'status'.padEnd(12),
          'id'.padEnd(36),
        )

        orders.forEach((order) => {
          console.log(
            order.symbol.padEnd(8),
            order.side.padEnd(6),
            order.qty.toString().padEnd(8),
            (order.filled_avg_price
              ? order.filled_avg_price.toString()
              : '-'
            ).padEnd(8),
            order.status.padEnd(12),
            order.id.padEnd(36),
          )
        })
      })
      .catch((error) => {
        throw error.message
      })
  }

  async cancel(...args: Array<string>) {
    // make sure client has been setup
    if (!this.client) {
      throw 'not authenticated'
    }

    // make sure minimum arg length is met
    if (args.length < 1) {
      throw 'not enough args'
    }

    let orders = await this.client.getOrders(),
      found =
        args[0] == '*' || args[0].toLowerCase() == 'all'
          ? orders
          : orders.filter(
              (order) =>
                order.id == args[0] || order.symbol == args[0].toUpperCase(),
            )

    if (_.isEmpty(found)) {
      console.log(`no orders found for "${args[0]}"`)
    }

    await Promise.allSettled(
      found.map(
        async (order) =>
          // @ts-ignore
          await this.client
            .cancelOrder({
              order_id: order.id,
            })
            .then(() => console.log(`order cancelled with ID ${order.id}`))
            .catch((error) => {
              throw error.message
            }),
        this,
      ),
    )
  }

  async positions() {
    // make sure client has been setup
    if (!this.client) {
      throw 'not authenticated'
    }

    // fetch the positions
    await this.client
      .getPositions()
      .then((positions) => {
        if (_.isEmpty(positions)) {
          console.log('no positions found')
          return
        }

        console.log(
          'symbol'.padEnd(8),
          'price'.padEnd(10),
          'qty'.padEnd(10),
          'market_value'.padEnd(14),
          'profit'.padEnd(8),
        )

        positions.forEach((position) =>
          console.log(
            position.symbol.padEnd(8),
            `$${position.current_price.toLocaleString()}`.padEnd(10),
            position.qty.toLocaleString().padEnd(10),
            `${position.market_value.toLocaleString().padEnd(14)}`,
            `${
              position.unrealized_pl > 0
                ? color(
                    chalk.green,
                    `+$${position.unrealized_pl.toLocaleString()}`,
                  )
                : color(
                    chalk.red,
                    `-$${Math.abs(position.unrealized_pl).toLocaleString()}`,
                  )
            }`,
          ),
        )
      })
      .catch((error) => {
        throw error.message
      })
  }

  async close(...args: Array<string>) {
    // make sure client has been setup
    if (!this.client) {
      throw 'not authenticated'
    }

    // make sure minimum arg length is met
    if (args.length < 1) {
      throw 'not enough args'
    }

    // check if a wildcard was provided
    if (args[0] == '*' || args[0].toLowerCase() == 'all') {
      await this.client
        .closePositions()
        .then((orders) => console.log(`${orders.length} position(s) closed`))
        .catch((error) => {
          throw error.message
        })
      return
    }

    // close the one position
    await this.client
      .closePosition({
        symbol: args[0].toUpperCase(),
      })
      .then((order) =>
        console.log(`position on ${order.symbol} has been closed`),
      )
      .catch((error) => {
        throw error.message
      })
  }

  async quit() {
    console.log('goodbye')
    process.exit()
  }
})({
  prompt: '> ',
  welcomeMessage: `${pkg.name} ${pkg.version}\ntype "help" or "h" to view commands`,
  commandMap: {
    'help': 'help',
    'h': 'help',
    '?': 'help',
    'conf': 'config',
    'config': 'config',
    'a': 'account',
    'acc': 'account',
    'account': 'account',
    'b': 'buy',
    'buy': 'buy',
    's': 'sell',
    'sell': 'sell',
    'o': 'orders',
    'or': 'orders',
    'orders': 'orders',
    'c': 'close',
    'close': 'close',
    'ca': 'cancel',
    'cancel': 'cancel',
    'p': 'positions',
    'ps': 'positions',
    'po': 'positions',
    'pos': 'positions',
    'positions': 'positions',
    'q': 'quit',
    'e': 'quit',
    'exit': 'quit',
    'quit': 'quit',
  },
}).loop()

function color(chalk: chalk.Chalk, input: string): string {
  return config().colors ? chalk(input) : input
}
