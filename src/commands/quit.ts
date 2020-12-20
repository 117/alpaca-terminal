import { Command } from './command.js'

export default new Command('quit', '', ['exit', 'bye', 'e', 'q'], async () => {
  console.log('goodbye')
  process.exit()
})
