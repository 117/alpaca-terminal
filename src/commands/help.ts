import chalk from 'chalk'

import { Command } from './command.js'

export default new Command(
  'help',
  '[command]',
  ['h', '?'],
  async (label, args, caller) => {
    let commands = caller.parameters.commands as Command[],
      labelPadEnd = commands
        .map((value) => value.label)
        .reduce((a, b) => (a.length > b.length ? a : b)).length

    commands.forEach((command) => {
      console.log(command.label.padEnd(labelPadEnd), command.usage)
    })
  },
)
