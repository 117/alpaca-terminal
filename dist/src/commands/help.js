"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_js_1 = require("./command.js");
exports.default = new command_js_1.Command('help', '[command]', ['h', '?'], async (label, args, caller) => {
    let commands = caller.parameters.commands, labelPadEnd = commands
        .map((value) => value.label)
        .reduce((a, b) => (a.length > b.length ? a : b)).length;
    commands.forEach((command) => {
        console.log(command.label.padEnd(labelPadEnd), command.usage);
    });
});
