import pkg from '../package.json';
import chalk from 'chalk';
import readline from 'readline';
import help from './help.js';
import authenticate from './authenticate.js';
import account from './account.js';
import buy from './buy.js';
import sell from './sell.js';
import close from './close.js';
import orders from './orders.js';
import positions from './positions.js';
import exit from './exit.js';
export const repl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
}), commands = Array.of(help, authenticate, account, buy, sell, close, orders, positions, exit);
async function waitForInput() {
    repl.question('> ', async (input) => {
        try {
            let args = input.toLowerCase().split(' '), command = commands.find((command) => command.aliases.includes(args[0]));
            if (command) {
                await command.execute(args);
            }
            else {
                console.log('command not found');
            }
        }
        finally {
            waitForInput();
        }
    });
}
console.log(`${chalk.yellowBright(pkg.name)} ${pkg.version}`);
console.log("Type 'help' or 'h' to list commands.");
waitForInput();
