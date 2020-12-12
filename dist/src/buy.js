export default {
    aliases: ['buy', 'b'],
    usage: '<amount> <symbol> [tif] [limit_price]',
    description: 'buy a stock',
    execute: async (args) => {
        console.log('buy');
    },
};
