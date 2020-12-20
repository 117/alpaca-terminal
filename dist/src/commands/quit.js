"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_js_1 = require("./command.js");
exports.default = new command_js_1.Command('quit', '', ['exit', 'bye', 'e', 'q'], async () => {
    console.log('goodbye');
    process.exit();
});
