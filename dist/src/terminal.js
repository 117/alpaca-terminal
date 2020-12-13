#!/bin/sh 
':' //# comment; exec /usr/bin/env node "$0" "$@"
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const package_json_1 = __importDefault(require("../package.json"));
const repl_js_1 = require("./repl.js");
const alpaca_1 = require("@master-chief/alpaca");
const decimal_js_1 = __importDefault(require("decimal.js"));
new (class extends repl_js_1.REPL {
    constructor() {
        super({
            prompt: '> ',
            welcomeMessage: `${package_json_1.default.name} ${package_json_1.default.version}\ntype "help" or "h" to view commands`,
            aliases: {
                'h': 'help',
                '?': 'help',
                'u': 'use',
                'auth': 'use',
                'login': 'use',
                'a': 'account',
                'acc': 'account',
                'b': 'buy',
                's': 'sell',
                'o': 'orders',
                'or': 'orders',
                'ord': 'orders',
                'c': 'close',
                'ca': 'cancel',
                'cl': 'cancel',
                'os': 'orders',
                'ol': 'orders',
                'ords': 'orders',
                'p': 'positions',
                'ps': 'positions',
                'po': 'positions',
                'pos': 'positions',
                'q': 'quit',
                'e': 'quit',
                'exit': 'quit',
                'leave': 'quit',
            },
        });
        (async () => {
            let _log = console.log;
            // null route console.log
            console.log = () => null;
            try {
                this.use(process.env['ALPACA_KEY'] ?? '', process.env['ALPACA_SECRET'] ?? '');
            }
            catch { }
            // re-route console.log
            console.log = _log;
        })();
    }
    async help() {
        ;
        `help           [command]
use            <key> <secret>
account        [field]
buy            <symbol> <amount> [tif] [limit_price]
sell           <symbol> <amount> [tif] [limit_price]
close          <symbol|all|*>
cancel         <symbol|order_id|all|*>
orders         [status]
positions
quit`
            .split('\n')
            .forEach((line) => console.log(line));
    }
    async use(...args) {
        // make sure minimum arg length is met
        if (args.length < 2) {
            throw 'not enough args';
        }
        let newClient = new alpaca_1.AlpacaClient({
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
            if (!lodash_1.default.isFunction(value)) {
                console.log(key.padEnd(24), value);
            }
        }
    }
    async buy(...args) {
        await this.order('buy', ...args);
    }
    async sell(...args) {
        await this.order('sell', ...args);
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
        // fetch the asset from alpaca
        let asset = await this.client
            .getAsset({
            asset_id_or_symbol: args[1].toUpperCase(),
        })
            .catch(() => undefined);
        if (!asset) {
            throw `symbol "${args[1]}" could not be found`;
        }
        // determine the amount
        let amount = parseInt(args[2].replace('$', ''));
        if (!lodash_1.default.isNumber(amount)) {
            throw `"${args[2]}" is not a number`;
        }
        // place the order
        await this.client
            .placeOrder({
            symbol: asset.symbol,
            qty: Math.floor(args[2].includes('$')
                ? new decimal_js_1.default(amount)
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
            if (lodash_1.default.isEmpty(orders)) {
                console.log('no orders found');
                return;
            }
            console.log('symbol'.padEnd(8), 'side'.padEnd(6), 'qty'.padEnd(8), 'price'.padEnd(8), 'status'.padEnd(12), 'id'.padEnd(36));
            orders.forEach((order) => {
                console.log(order.symbol.padEnd(8), order.side.padEnd(6), order.qty.toString().padEnd(8), (order.filled_avg_price
                    ? order.filled_avg_price.toString()
                    : '-').padEnd(8), order.status.padEnd(12), order.id.padEnd(36));
            });
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
        if (lodash_1.default.isEmpty(found)) {
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
            if (lodash_1.default.isEmpty(positions)) {
                console.log('no positions found');
                return;
            }
            console.log('symbol'.padEnd(8), 'price'.padEnd(8), 'qty'.padEnd(8), 'market_value'.padEnd(14), 'profit'.padEnd(8));
            positions.forEach((position) => console.log(position.symbol.padEnd(8), `$${position.current_price.toLocaleString()}`.padEnd(8), position.qty.toLocaleString().padEnd(8), `${position.market_value.toLocaleString().padEnd(14)}`, `${position.unrealized_pl > 0
                ? `+$${position.unrealized_pl.toLocaleString()}`
                : `-$${position.unrealized_pl.toLocaleString()}`}`));
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
})().loop();
