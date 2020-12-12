import readline from 'readline';
import messages from './messages.js';
export class REPL {
    constructor(parameters) {
        this.parameters = parameters;
        this.interface = readline.createInterface({
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
                if (label in this) {
                    // @ts-ignore
                    await this[label](...args.slice(1)).catch((exception) => console.log(messages.ERROR_PREFIX, exception));
                }
                else {
                    console.log(messages.ERROR_PREFIX, messages.ERROR_COMMAND_NOT_FOUND);
                }
            }
            catch (exception) {
                console.log(messages.ERROR_PREFIX, exception);
            }
            finally {
                this.loop();
            }
        });
    }
}
