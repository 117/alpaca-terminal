export class Command {
    constructor(aliases, usage, desc) {
        this.aliases = aliases;
        this.usage = usage;
        this.desc = desc;
    }
    async execute(args) {
        return;
    }
}
