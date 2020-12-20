import _ from 'lodash'
import prettyTable from '../pretty_table.js'

import Fuse from 'fuse.js'

import { getClient } from '../main.js'
import { Command } from './command.js'

export default new Command(
  'account',
  '[field]',
  ['acc', 'a'],
  async (label, args) => {
    let account = await getClient()
      .getAccount()
      .catch((error) => {
        throw new Error('message' in error ? error.message : error)
      })

    let data = new Array<{ key: string; value: any }>()

    if (args.length == 1) {
      let results = new Fuse(Object.keys(account), {
        threshold: 0.2,
      }).search(args[0])

      if (results.length < 1) {
        throw new Error(`could not find a field for "${args[0]}"`)
      }

      results.forEach((result) =>
        data.push({
          key: result.item,
          value: (account as any)[result.item],
        }),
      )

      console.log(prettyTable(data, { enabled: false }))
      return
    }

    for (let [key, value] of Object.entries(account)) {
      if (!_.isFunction(value)) {
        data.push({ key: key, value: value })
      }
    }

    console.log(prettyTable(data, { enabled: false }))
  },
)
