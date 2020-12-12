export class Command {
  constructor(
    public aliases: string[],
    public usage: string,
    public desc: string,
  ) {}
  async execute(args: string[]): Promise<void> {
    return
  }
}
