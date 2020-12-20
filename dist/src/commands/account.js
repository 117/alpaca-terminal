"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const pretty_table_js_1 = __importDefault(require("../pretty_table.js"));
const fuse_js_1 = __importDefault(require("fuse.js"));
const main_js_1 = require("../main.js");
const command_js_1 = require("./command.js");
exports.default = new command_js_1.Command('account', '[field]', ['acc', 'a'], async (label, args) => {
    let account = await main_js_1.getClient()
        .getAccount()
        .catch((error) => {
        throw new Error('message' in error ? error.message : error);
    });
    let data = new Array();
    if (args.length == 1) {
        let results = new fuse_js_1.default(Object.keys(account), {
            threshold: 0.2,
        }).search(args[0]);
        if (results.length < 1) {
            throw new Error(`could not find a field for "${args[0]}"`);
        }
        results.forEach((result) => data.push({
            key: result.item,
            value: account[result.item],
        }));
        console.log(pretty_table_js_1.default(data, { enabled: false }));
        return;
    }
    for (let [key, value] of Object.entries(account)) {
        if (!lodash_1.default.isFunction(value)) {
            data.push({ key: key, value: value });
        }
    }
    console.log(pretty_table_js_1.default(data, { enabled: false }));
});
