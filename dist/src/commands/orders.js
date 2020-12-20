"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const pretty_table_js_1 = __importDefault(require("../pretty_table.js"));
const main_js_1 = require("../main.js");
const command_js_1 = require("./command.js");
exports.default = new command_js_1.Command('orders', '[status]', ['or', 'o'], async (label, args) => {
    // fetch the orders
    await main_js_1.getClient()
        .getOrders({
        // @ts-ignore
        status: args[0] ? args[0] : 'open',
    })
        .then((orders) => {
        if (lodash_1.default.isEmpty(orders)) {
            console.log('none');
            return;
        }
        console.log(pretty_table_js_1.default(orders.map((order) => ({
            symbol: order.symbol,
            side: order.side,
            qty: order.qty.toLocaleString(),
            price: order.filled_avg_price
                ? order.filled_avg_price.toString()
                : '-',
            status: order.status,
            id: order.id,
        }))));
    })
        .catch((error) => {
        throw new Error(error.message);
    });
});
