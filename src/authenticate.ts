import chalk from 'chalk'

import { AlpacaClient } from '@master-chief/alpaca'

export var client: AlpacaClient

export default {
  aliases: ['authenticate', 'auth'],
  usage: '<key_id> <secret>',
  description: 'authenticate with alpaca',
  execute: async (args: string[]) => {
    if (args.length < 2) {
      throw new Error('not enough arguments')
    }

    let _ = new AlpacaClient({
      credentials: {
        key: args[0],
        secret: args[1],
      },
      rate_limit: true,
    })

    if (!(await _.isAuthenticated())) {
      throw new Error('failed to authenticate with alpaca')
    }

    client = _
    console.log(`${chalk.green('success!')} authenticated with alpaca`)
    return
  },
}
