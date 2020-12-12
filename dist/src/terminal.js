import _ from 'lodash';
import pkg from '../package.json';
import chalk from 'chalk';
import { REPL } from './repl.js';
import { AlpacaClient } from '@master-chief/alpaca';
import { default as Decimal } from 'decimal.js';
export class Terminal extends REPL {
    constructor() {
        super({
            prompt: '> ',
            welcomeMessage: `${pkg.name} ${pkg.version}\ntype "help" or "h" to list commands`,
        });
    }
    async help() {
        ;
        `help           [command]                                      view help
authenticate   <key_id> <secret>                              authenticate with alpaca
account        [field]                                        view account
order          <side> <symbol> <amount> [tif] [limit_price]   buy a stock
close          <symbol|all|*>                                 close one or many positions
cancel         <symbol|order_id|all|*>                        cancel one or many orders
orders         [status]                                       view recent orders
positions                                                     view positions
quit                                                          close the terminal`
            .split('\n')
            .forEach((line) => console.log(line));
    }
    async authenticate(...args) {
        // make sure minimum arg length is met
        if (args.length < 2) {
            throw 'not enough args';
        }
        let newClient = new AlpacaClient({
            credentials: {
                key: args[0],
                secret: args[1],
            },
            rate_limit: true,
        });
        // we weren't able to authenticate with alpaca
        if (!(await newClient.isAuthenticated())) {
            throw 'failed to authenticate';
        }
        this.client = newClient;
        console.log(`using account with number ${(await this.client.getAccount()).account_number}`);
    }
    async account(...args) {
        // make sure client has been setup
        if (!this.client) {
            throw 'not authenticated';
        }
        // fetch the account
        let account = await this.client.getAccount();
        if (args.length == 1) {
            if (!(args[0] in account)) {
                throw `field "${args[0]}" not present in account`;
            }
            console.log(account[args[0]]);
            return;
        }
        for (let [key, value] of Object.entries(account)) {
            if (!_.isFunction(value)) {
                console.log(key.padEnd(24), value);
            }
        }
    }
    async order(...args) {
        // make sure client has been setup
        if (!this.client) {
            throw 'not authenticated';
        }
        // make sure minimum arg length is met
        if (args.length < 3) {
            throw 'not enough args';
        }
        // determine the side
        let side = args[0].toLowerCase();
        if (side == 'b' || side == 'buy') {
            side = 'buy';
        }
        else if (side == 's' || side == 'sell') {
            side = 'sell';
        }
        else {
            throw `"${args[0]}" is not a side, must be buy or sell`;
        }
        // determine the amount
        let amount = parseInt(args[1].replace('$', ''));
        if (!_.isNumber(amount)) {
            throw `"${args[1]}" is not a number`;
        }
        // fetch the asset from alpaca
        let asset = await this.client
            .getAsset({
            asset_id_or_symbol: args[2].toUpperCase(),
        })
            .catch(() => undefined);
        if (!asset) {
            throw `symbol "${args[2]}" could not be found`;
        }
        // place the order
        await this.client
            .placeOrder({
            symbol: asset.symbol,
            qty: Math.floor(args[1].includes('$')
                ? new Decimal(amount)
                    .div((await this.client.getLastTrade({
                    symbol: asset.symbol,
                })).last.price)
                    .toNumber()
                : amount),
            side: side,
            type: 'market',
            time_in_force: 'day',
        })
            .then((order) => console.log(`order placed with ID ${order.id}`))
            .catch((error) => {
            throw error.message;
        });
    }
    async orders(...args) {
        // make sure client has been setup
        if (!this.client) {
            throw 'not authenticated';
        }
        // fetch the orders
        await this.client
            .getOrders({
            // @ts-ignore
            status: args[0] ? args[0] : 'open',
        })
            .then((orders) => {
            orders.forEach((order) => console.log(order.symbol.padEnd(8), order.side.padEnd(6), order.qty.toString().padEnd(8), order.filled_avg_price
                ? order.filled_avg_price.toString().padEnd(8)
                : '-', order.status.padEnd(16), order.id.padEnd(36)));
        })
            .catch((error) => {
            throw error.message;
        });
    }
    async cancel(...args) {
        // make sure client has been setup
        if (!this.client) {
            throw 'not authenticated';
        }
        // make sure minimum arg length is met
        if (args.length < 1) {
            throw 'not enough args';
        }
        let orders = await this.client.getOrders(), found = args[0] == '*' || args[0].toLowerCase() == 'all'
            ? orders
            : orders.filter((order) => order.id == args[0] || order.symbol == args[0].toUpperCase());
        if (_.isEmpty(found)) {
            console.log(`no orders found for "${args[0]}"`);
        }
        await Promise.allSettled(found.map(async (order) => 
        // @ts-ignore
        await this.client
            .cancelOrder({
            order_id: order.id,
        })
            .then(() => console.log(`order cancelled with ID ${order.id}`))
            .catch((error) => {
            throw error.message;
        }), this));
    }
    async positions() {
        // make sure client has been setup
        if (!this.client) {
            throw 'not authenticated';
        }
        // fetch the positions
        await this.client
            .getPositions()
            .then((positions) => {
            console.log('symbol'.padEnd(8), 'price'.padEnd(8), 'qty'.padEnd(8), 'market_value'.padEnd(14), 'pnl'.padEnd(8));
            positions
                .concat({
                symbol: 'ACB',
                current_price: 19.7,
                qty: 7,
                market_value: 137.9,
                unrealized_pl: 9.48,
            })
                .forEach((position) => console.log(position.symbol.padEnd(8), `$${position.current_price.toLocaleString()}`.padEnd(8), position.qty.toLocaleString().padEnd(8), `${position.market_value.toLocaleString().padEnd(14)}`, `${position.unrealized_pl > 0
                ? chalk.green(`+$${position.unrealized_pl.toLocaleString()}`)
                : chalk.red(`-$${position.unrealized_pl.toLocaleString()}`)}`));
        })
            .catch((error) => {
            throw error.message;
        });
    }
    async close(...args) {
        // make sure client has been setup
        if (!this.client) {
            throw 'not authenticated';
        }
        // make sure minimum arg length is met
        if (args.length < 3) {
            throw 'not enough args';
        }
        // check if a wildcard was provided
        if (args[0] == '*' || args[0].toLowerCase() == 'all') {
            await this.client
                .closePositions()
                .then((orders) => console.log(`${orders.length} position(s) closed`))
                .catch((error) => {
                throw error.message;
            });
            return;
        }
        // close the one position
        await this.client
            .closePosition({
            symbol: args[0].toUpperCase(),
        })
            .then((order) => console.log(`position on ${order.symbol} has been closed`))
            .catch((error) => {
            throw error.message;
        });
    }
    async quit() {
        console.log('goodbye');
        process.exit();
    }
}
