export default {
  aliases: ['quit', 'q'],
  usage: '',
  description: 'close the terminal',
  execute: async () => {
    console.log('goodbye')
    process.exit()
  },
}
