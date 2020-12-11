// tsc && node --experimental-json-modules --no-warnings dist/src/main.js
/**
 * l : Lists your current portfolio
b <symbol> <quantity> <price> : Submits a limit order to buy stocks of at
s <symbol> <quantity> <price> : Submits a limit order to sell stocks of at
q <symbol> : Get quote (current price) for symbol
q <symbol> <call/put> <strike_price> <(optional) expiration_date YYYY-mm-dd> : Get quote for option, all expiration dates if none specified
o : Lists all open orders
c <id> : Cancel an open order identified by [ of a open order can be got from output of o]
bye : Exit the shell
 */
import account from './commands/account.js';
import buy from './commands/buy.js';
import chalk from 'chalk';
import exit from './commands/exit.js';
import help from './commands/help.js';
import pkg from '../package.json';
import readline from 'readline';
import sell from './commands/sell.js';
import authenticate from './commands/authenticate.js';
export const REPL = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
}), commands = Array.of(help, authenticate, account, buy, sell, exit);
async function loop() {
    REPL.question('> ', async (input) => {
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
            loop();
        }
    });
}
console.log(`${chalk.yellow(pkg.name)} ${pkg.version}`);
console.log("Type 'help' or 'h' to list commands.");
loop();
