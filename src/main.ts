import pkg from '../package.json'
import chalk from 'chalk'
import readline from 'readline'
import help from './help.js'
import authenticate from './authenticate.js'
import account from './account.js'
import buy from './buy.js'
import sell from './sell.js'
import close from './close.js'
import orders from './orders.js'
import positions from './positions.js'
import quit from './quit.js'

import { client } from './authenticate.js'

export const repl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  }),
  commands: Array<{
    aliases: string[]
    usage: string
    description: string
    execute: (args: string[]) => Promise<void>
  }> = Array.of(
    help,
    authenticate,
    account,
    buy,
    sell,
    close,
    orders,
    positions,
    quit,
  )

async function next() {
  repl.question('> ', async (input) => {
    try {
      let args = input.split(' '),
        command = commands.find((command) =>
          command.aliases.includes(args[0].toLowerCase()),
        )

      if (command) {
        // if the command is not authenticate
        if (
          command.aliases[0] != 'authenticate' &&
          command.aliases[0] != 'help' &&
          command.aliases[0] != 'quit'
        ) {
          // check if the client is authenticated
          if (!client || !(await client.isAuthenticated())) {
            throw new Error('not authenticated')
          }
        }

        // execute the command with the provided args
        await command
          .execute(args.slice(1))
          .catch((error) => console.log(chalk.red(error)))
      } else {
        console.log(chalk.red(new Error('command not found')))
      }
    } catch (error) {
      console.log(chalk.red(error))
    } finally {
      next()
    }
  })
}

console.log(`${chalk.yellowBright(pkg.name)} ${pkg.version}`)
console.log("Type 'help' or 'h' to list commands.")

next()
