"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const pretty_table_js_1 = __importDefault(require("../pretty_table.js"));
const main_js_1 = require("../main.js");
const command_js_1 = require("./command.js");
exports.default = new command_js_1.Command('positions', '', ['pos', 'p'], async (label) => {
    // fetch the positions
    await main_js_1.getClient()
        .getPositions()
        .then((positions) => {
        if (lodash_1.default.isEmpty(positions)) {
            console.log('none');
            return;
        }
        pretty_table_js_1.default(positions.map((position) => ({
            symbol: position.symbol,
            price: `$${position.current_price.toLocaleString()}`,
            qty: position.qty.toLocaleString(),
            market_value: `$${position.market_value.toLocaleString()}`,
            pnl: position.unrealized_pl > 0
                ? `+$${position.unrealized_pl.toLocaleString()}`
                : `-$${Math.abs(position.unrealized_pl).toLocaleString()}`,
        })));
    })
        .catch((error) => {
        throw new Error(error.message);
    });
});
