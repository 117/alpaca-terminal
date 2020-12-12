import _ from 'lodash';
import chalk from 'chalk';
import { client } from './authenticate.js';
export default {
    aliases: ['buy', 'b'],
    usage: '<amount> <symbol> [tif] [limit_price]',
    description: 'buy a stock',
    execute: async (args) => {
        // check if min arg length has been met
        if (args.length < 2) {
            throw new Error('not enough args');
        }
        let amount = parseInt(args[0].replace('$', '')), isAmountInUSD = args[0].includes('$');
        // check if the amount is a number, replace $
        if (!_.isNumber(amount)) {
            throw new Error('amount must be a number');
        }
        let asset = await client
            .getAsset({
            asset_id_or_symbol: args[1],
        })
            .catch(() => undefined);
        if (!asset) {
            throw new Error('asset not found');
        }
        let last = await client.getLastTrade({
            symbol: asset.symbol,
        });
        await client
            .placeOrder({
            symbol: asset.symbol,
            qty: Math.floor(isAmountInUSD ? amount / last.last.price : amount),
            side: 'buy',
            type: 'market',
            time_in_force: 'day',
        })
            .then((order) => console.log(chalk.green('success!'), `order ID is ${order.id}`))
            .catch((reason) => {
            throw new Error(reason);
        });
    },
};
