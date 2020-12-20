import _ from 'lodash'
import pkg from '../package.json'
import chalk from 'chalk'
import account from './commands/account.js'
import buy from './commands/buy.js'
import close from './commands/close.js'
import cancel from './commands/cancel.js'
import help from './commands/help.js'
import orders from './commands/orders.js'
import positions from './commands/positions.js'
import quit from './commands/quit.js'
import sell from './commands/sell.js'
import config, { getConfig } from './commands/config.js'

import { AlpacaClient } from '@master-chief/alpaca'
import { REPL } from './repl.js'

const client = new AlpacaClient({
  credentials: {
    key: getConfig().credentials.key,
    secret: getConfig().credentials.secret,
  },
  rate_limit: true,
})

export let getClient = (): AlpacaClient => client

new REPL({
  prompt: '> ',
  welcomeMessage: `${pkg.name} ${pkg.version}\ntype help or ? to view commands`,
  commands: Array.of(
    help,
    config,
    account,
    buy,
    sell,
    cancel,
    close,
    orders,
    positions,
    quit,
  ),
}).loop()
