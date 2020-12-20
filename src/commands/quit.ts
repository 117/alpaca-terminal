import { Command } from './command.js'

export default new Command('quit', '', ['q'], async () => {
  console.log('goodbye')
  process.exit()
})
