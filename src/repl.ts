import chalk from 'chalk'
import readline from 'readline'
import clean from 'clean-stack'

import { Command } from './commands/command.js'

export class REPL {
  public interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  constructor(
    public parameters: {
      prompt: string
      welcomeMessage?: string
      commands: Command[]
    },
  ) {}

  async loop() {
    if ('welcomeMessage' in this.parameters) {
      console.log(this.parameters.welcomeMessage)
      delete this.parameters.welcomeMessage
    }

    this.interface.question(this.parameters.prompt, async (input) => {
      try {
        let label = input.split(' ')[0].toLowerCase(),
          args = input.split(' ').slice(1),
          command = this.parameters.commands.find(
            (value) => value.label == label || value.aliases.includes(label),
          )

        if (!command) {
          throw new Error(`command "${args[0]}" not found`)
        }

        await command.executor(label, args, this).catch((error) => {
          throw error
        })
      } catch (error) {
        console.error(chalk.redBright(error))
      } finally {
        this.loop()
      }
    })
  }
}
