"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.REPL = void 0;
const readline_1 = __importDefault(require("readline"));
class REPL {
    constructor(parameters) {
        this.parameters = parameters;
        this.interface = readline_1.default.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
    }
    loop() {
        if (!('welcome' in this)) {
            console.log(this.parameters.welcomeMessage);
            Object.assign(this, { welcome: true });
        }
        this.interface.question(this.parameters.prompt, async (input) => {
            try {
                let args = input.split(' '), label = args[0].toLowerCase();
                // map any aliases
                if (this.parameters.aliases) {
                    if (label in this.parameters.aliases) {
                        label = this.parameters.aliases[label];
                    }
                }
                if (label in this) {
                    // @ts-ignore
                    await this[label](...args.slice(1)).catch((error) => console.log(error));
                }
                else {
                    console.log(`command not found`);
                }
            }
            catch (error) {
                console.log(error);
            }
            finally {
                this.loop();
            }
        });
    }
}
exports.REPL = REPL;
