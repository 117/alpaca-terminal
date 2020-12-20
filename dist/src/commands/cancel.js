"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const main_js_1 = require("../main.js");
const command_js_1 = require("./command.js");
exports.default = new command_js_1.Command('cancel', '<symbol|order_id|*>', ['ca'], async (label, args) => {
    // make sure minimum arg length is met
    if (args.length < 1) {
        throw new Error('not enough args');
    }
    let orders = await main_js_1.getClient().getOrders(), found = args[0] == '*' || args[0].toLowerCase() == 'all'
        ? orders
        : orders.filter((order) => order.id == args[0] || order.symbol == args[0].toUpperCase());
    if (lodash_1.default.isEmpty(found)) {
        throw new Error(`no orders found for "${args[0]}"`);
    }
    await Promise.allSettled(found.map(async (order) => await main_js_1.getClient()
        .cancelOrder({
        order_id: order.id,
    })
        .then(() => console.log(`cancelled with ID ${order.id}`))
        .catch((error) => {
        throw new Error(error.message);
    })));
});
