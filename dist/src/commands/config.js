"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeConfig = exports.getConfig = void 0;
const lodash_1 = __importDefault(require("lodash"));
const dot_prop_1 = __importDefault(require("dot-prop"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const pretty_table_js_1 = __importDefault(require("../pretty_table.js"));
const main_js_1 = require("../main.js");
const command_js_1 = require("./command.js");
class Config {
    constructor() {
        this.credentials = {
            key: 'xxxxxxxxxxxx',
            secret: 'xxxxxxxxxxxxxxxxxxxxxxxx',
        };
    }
}
const configDir = path_1.default.join(os_1.default.homedir(), '.alpaca-terminal'), configPath = path_1.default.join(configDir, 'config.json');
function getConfig() {
    let config;
    try {
        return JSON.parse(fs_1.default.readFileSync(configPath).toString());
    }
    catch {
        writeConfig((config = new Config()));
        return config;
    }
}
exports.getConfig = getConfig;
function writeConfig(config) {
    if (!fs_1.default.existsSync(configDir)) {
        fs_1.default.mkdirSync(configDir);
    }
    fs_1.default.writeFileSync(configPath, JSON.stringify(config, null, ' '));
}
exports.writeConfig = writeConfig;
exports.default = new command_js_1.Command('config', '[key] [value]', ['conf', 'cfg'], async (label, args) => {
    let key = lodash_1.default.isUndefined(dot_prop_1.default.get(getConfig(), args[0]))
        ? undefined
        : args[0], value = dot_prop_1.default.get(getConfig(), args[0]);
    if (args.length == 1) {
        // make sure field exists
        if (!key) {
            throw new Error(`key "${args[0]}" not found in config`);
        }
        // @ts-ignore
        console.log(args[0], value);
        return;
    }
    if (args.length > 1) {
        // make sure field exists
        if (!key) {
            throw new Error(`key "${args[0]}" not found in config`);
        }
        // @ts-ignore
        let fieldType = typeof value;
        try {
            args[1] = JSON.parse(args[1]);
        }
        catch { }
        // make sure type is the same
        if (typeof key != fieldType) {
            throw new Error(`wrong type, key "${args[0]}" is of type ${fieldType}`);
        }
        writeConfig(dot_prop_1.default.set(getConfig(), key, args[1]));
        console.log(args[0], args[1]);
        dot_prop_1.default.set(main_js_1.getClient(), 'params.credentials.key', getConfig().credentials.key);
        dot_prop_1.default.set(main_js_1.getClient(), 'params.credentials.secret', getConfig().credentials.secret);
        return;
    }
    let data = new Array();
    for (let [keyA, valueA] of Object.entries(getConfig())) {
        if (lodash_1.default.isFunction(keyA)) {
            continue;
        }
        if (lodash_1.default.isObject(valueA)) {
            for (let [keyB, valueB] of Object.entries(valueA)) {
                data.push({ key: `${keyA}.${keyB}`, value: valueB });
            }
            continue;
        }
        data.push({ key: keyA, value: valueA });
    }
    console.log(pretty_table_js_1.default(data, { enabled: false }));
});
