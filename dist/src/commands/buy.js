"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.placeOrder = void 0;
const lodash_1 = __importDefault(require("lodash"));
const main_js_1 = require("../main.js");
const command_js_1 = require("./command.js");
const decimal_js_1 = __importDefault(require("decimal.js"));
exports.default = new command_js_1.Command('buy', '<symbol> <qty> [tif] [limit_price]', ['b'], async (label, args) => await placeOrder(['buy', ...args]));
async function placeOrder(args) {
    // make sure minimum arg length is met
    if (args.length < 3) {
        throw new Error('not enough args');
    }
    // fetch the asset from alpaca
    let asset = await main_js_1.getClient()
        .getAsset({
        asset_id_or_symbol: args[1].toUpperCase(),
    })
        .catch(() => undefined);
    if (!asset) {
        throw new Error(`symbol "${args[1]}" could not be found`);
    }
    // determine the amount
    let amount = parseInt(args[2].replace('$', ''));
    if (!lodash_1.default.isNumber(amount)) {
        throw new Error(`"${args[2]}" is not a number`);
    }
    let params = {
        symbol: asset.symbol,
        qty: Math.floor(args[2].includes('$')
            ? new decimal_js_1.default(amount)
                .div((await main_js_1.getClient().getLastTrade({ symbol: asset.symbol })).last
                .price)
                .toNumber()
            : amount),
        side: args[0].toLowerCase(),
        type: args[4] ? 'limit' : 'market',
        time_in_force: args[3] ?? 'day',
    };
    if (params.type == 'limit') {
        params.limit_price = new decimal_js_1.default(args[4]).toNumber();
    }
    // place the order
    await main_js_1.getClient()
        .placeOrder(params)
        .then((order) => console.log(`placed with ID ${order.id}`))
        .catch((error) => {
        throw error.message;
    });
}
exports.placeOrder = placeOrder;
