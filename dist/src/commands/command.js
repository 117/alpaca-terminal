"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
class Command {
    constructor(label, usage, aliases, executor) {
        this.label = label;
        this.usage = usage;
        this.aliases = aliases;
        this.executor = executor;
    }
}
exports.Command = Command;
