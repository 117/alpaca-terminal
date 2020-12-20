#!/bin/sh 
':' //# comment; exec /usr/bin/env node "$0" "$@"
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClient = void 0;
const package_json_1 = __importDefault(require("../package.json"));
const account_js_1 = __importDefault(require("./commands/account.js"));
const buy_js_1 = __importDefault(require("./commands/buy.js"));
const close_js_1 = __importDefault(require("./commands/close.js"));
const cancel_js_1 = __importDefault(require("./commands/cancel.js"));
const help_js_1 = __importDefault(require("./commands/help.js"));
const orders_js_1 = __importDefault(require("./commands/orders.js"));
const positions_js_1 = __importDefault(require("./commands/positions.js"));
const quit_js_1 = __importDefault(require("./commands/quit.js"));
const sell_js_1 = __importDefault(require("./commands/sell.js"));
const config_js_1 = __importStar(require("./commands/config.js"));
const alpaca_1 = require("@master-chief/alpaca");
const repl_js_1 = require("./repl.js");
const client = new alpaca_1.AlpacaClient({
    credentials: {
        key: config_js_1.getConfig().credentials.key,
        secret: config_js_1.getConfig().credentials.secret,
    },
    rate_limit: true,
});
exports.getClient = () => client;
new repl_js_1.REPL({
    prompt: '> ',
    welcomeMessage: `${package_json_1.default.name} ${package_json_1.default.version}\ntype help or ? to view commands`,
    commands: Array.of(help_js_1.default, config_js_1.default, account_js_1.default, buy_js_1.default, sell_js_1.default, cancel_js_1.default, close_js_1.default, orders_js_1.default, positions_js_1.default, quit_js_1.default),
}).loop();
