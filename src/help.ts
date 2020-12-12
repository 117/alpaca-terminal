import chalk from 'chalk'

import { commands } from './main.js'

export default {
  aliases: ['help', 'h', '?'],
  usage: '[command]',
  description: 'view help',
  execute: async () =>
    commands.forEach((command) =>
      console.log(
        `${chalk
          .yellowBright(command.aliases[1])
          .concat(command.aliases[0].slice(command.aliases[1].length))
          .padEnd(24)} ${command.usage.padEnd(38)} ${command.description}`,
      ),
    ),
}
