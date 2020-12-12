import _ from 'lodash'

import { client } from './authenticate.js'

export default {
  aliases: ['account', 'a'],
  usage: '[field]',
  description: 'view account',
  execute: async (args: string[]) => {
    let account = await client.getAccount()

    if (args.length == 1) {
      if (!(args[0] in account)) {
        throw new Error('field not present in account')
      }

      console.log((account as any)[args[0]])
      return
    }

    for (let [key, value] of Object.entries(account)) {
      if (!_.isFunction(value)) {
        console.log(key.padEnd(24), value)
      }
    }
  },
}
