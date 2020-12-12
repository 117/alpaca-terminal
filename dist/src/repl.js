import readline from 'readline';
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
