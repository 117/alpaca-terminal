import chalk from 'chalk';
import { AlpacaClient } from '@master-chief/alpaca';
export var client;
export default {
    aliases: ['authenticate', 'auth'],
    usage: '<key_id> <secret>',
    description: 'authenticate with alpaca',
    execute: async (args) => {
        if (args.length < 2) {
            throw new Error('not enough args');
        }
        let _ = new AlpacaClient({
            credentials: {
                key: args[0],
                secret: args[1],
            },
            rate_limit: true,
        });
        if (!(await _.isAuthenticated())) {
            throw new Error('failed authentication');
        }
        client = _;
        console.log(chalk.green('success!'), 'you can now trade');
        return;
    },
};
