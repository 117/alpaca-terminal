"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_js_1 = require("../main.js");
const command_js_1 = require("./command.js");
exports.default = new command_js_1.Command('close', '<symbol|*>', ['c'], async (label, args) => {
    // make sure minimum arg length is met
    if (args.length < 1) {
        throw new Error('not enough args');
    }
    // check if a wildcard was provided
    if (args[0] == '*' || args[0].toLowerCase() == 'all') {
        await main_js_1.getClient()
            .closePositions()
            .then((orders) => console.log(`${orders.length} position(s) closed`))
            .catch((error) => {
            throw new Error(error.message);
        });
        return;
    }
    // close the one position
    await main_js_1.getClient()
        .closePosition({
        symbol: args[0].toUpperCase(),
    })
        .then((order) => console.log(`position on ${order.symbol} has been closed`))
        .catch((error) => {
        throw new Error(error.message);
    });
});
