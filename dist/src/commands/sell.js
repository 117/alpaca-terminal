"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const buy_js_1 = require("./buy.js");
const command_js_1 = require("./command.js");
exports.default = new command_js_1.Command('sell', '<symbol> <qty> [tif] [limit_price]', ['s'], async (label, args) => await buy_js_1.placeOrder(['sell', ...args]));
