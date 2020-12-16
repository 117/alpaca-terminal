"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.write = exports.read = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
class Config {
    constructor() {
        this.colors = true;
        this.credentials = {
            key: '******',
            secret: '************',
        };
    }
}
const CONFIG_DIR = path_1.default.join(os_1.default.homedir(), '.alpaca-terminal'), CONFIG_PATH = path_1.default.join(CONFIG_DIR, 'config.json');
function read() {
    let config;
    try {
        return JSON.parse(fs_1.default.readFileSync(CONFIG_PATH).toString());
    }
    catch {
        write((config = new Config()));
        return config;
    }
}
exports.read = read;
function write(config) {
    if (!fs_1.default.existsSync(CONFIG_DIR)) {
        fs_1.default.mkdirSync(CONFIG_DIR);
    }
    fs_1.default.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, ' '));
}
exports.write = write;
