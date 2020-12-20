import _ from 'lodash'
import dot from 'dot-prop'
import path from 'path'
import fs from 'fs'
import os from 'os'
import prettyTable from '../pretty_table.js'

import { getClient } from '../main.js'
import { Command } from './command.js'

class Config {
  credentials = {
    key: 'xxxxxxxxxxxx',
    secret: 'xxxxxxxxxxxxxxxxxxxxxxxx',
  }
}

const configDir = path.join(os.homedir(), '.alpaca-terminal'),
  configPath = path.join(configDir, 'config.json')

export function getConfig(): Config {
  let config: Config
  try {
    return JSON.parse(fs.readFileSync(configPath).toString())
  } catch {
    writeConfig((config = new Config()))
    return config
  }
}

export function writeConfig(config: Config) {
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir)
  }

  fs.writeFileSync(configPath, JSON.stringify(config, null, ' '))
}

export default new Command(
  'config',
  '[key] [value]',
  ['conf', 'cfg'],
  async (label, args) => {
    let key = _.isUndefined(dot.get(getConfig(), args[0]))
        ? undefined
        : args[0],
      value = dot.get(getConfig(), args[0])

    if (args.length == 1) {
      // make sure field exists
      if (!key) {
        throw new Error(`key "${args[0]}" not found in config`)
      }

      // @ts-ignore
      console.log(args[0], value)
      return
    }

    if (args.length > 1) {
      // make sure field exists
      if (!key) {
        throw new Error(`key "${args[0]}" not found in config`)
      }

      // @ts-ignore
      let fieldType = typeof value

      try {
        args[1] = JSON.parse(args[1])
      } catch {}

      // make sure type is the same
      if (typeof key != fieldType) {
        throw new Error(`wrong type, key "${args[0]}" is of type ${fieldType}`)
      }

      writeConfig(dot.set(getConfig(), key, args[1]))

      console.log(args[0], args[1])

      dot.set(
        getClient(),
        'params.credentials.key',
        getConfig().credentials.key,
      )
      dot.set(
        getClient(),
        'params.credentials.secret',
        getConfig().credentials.secret,
      )
      return
    }
    let data = new Array<{ key: string; value: any }>()

    for (let [keyA, valueA] of Object.entries(getConfig())) {
      if (_.isFunction(keyA)) {
        continue
      }

      if (_.isObject(valueA)) {
        for (let [keyB, valueB] of Object.entries(valueA)) {
          data.push({ key: `${keyA}.${keyB}`, value: valueB })
        }

        continue
      }

      data.push({ key: keyA, value: valueA })
    }

    console.log(prettyTable(data, { enabled: false }))
  },
)
