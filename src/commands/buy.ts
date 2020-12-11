export default {
  aliases: ['buy', 'b'],
  usage: '<amount> <symbol>',
  desc: 'buy a stock',
  execute: async (args: string[]) => {
    console.log('buy')
  },
}
