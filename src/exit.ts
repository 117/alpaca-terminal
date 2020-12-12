export default {
  aliases: ['exit', 'e'],
  usage: '',
  desc: 'close the terminal',
  execute: async () => {
    console.log('goodbye')
    process.exit()
  },
}
