import { Command } from './command.js';
export default new (class extends Command {
    constructor() {
        super(['sell', 's'], '<qty> <symbol> [tif] [limit_price]', 'sell a stock');
    }
    async execute(args) {
        console.log('sell');
    }
})();
