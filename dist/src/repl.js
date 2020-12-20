"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.REPL = void 0;
const chalk_1 = __importDefault(require("chalk"));
const readline_1 = __importDefault(require("readline"));
class REPL {
    constructor(parameters) {
        this.parameters = parameters;
        this.interface = readline_1.default.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
    }
    async loop() {
        if ('welcomeMessage' in this.parameters) {
            console.log(this.parameters.welcomeMessage);
            delete this.parameters.welcomeMessage;
        }
        this.interface.question(this.parameters.prompt, async (input) => {
            try {
                let label = input.split(' ')[0].toLowerCase(), args = input.split(' ').slice(1), command = this.parameters.commands.find((value) => value.label == label || value.aliases.includes(label));
                if (!command) {
                    throw new Error(`command "${args[0]}" not found`);
                }
                await command.executor(label, args, this).catch((error) => {
                    throw error;
                });
            }
            catch (error) {
                console.error(chalk_1.default.redBright(error));
            }
            finally {
                this.loop();
            }
        });
    }
}
exports.REPL = REPL;
