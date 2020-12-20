export class Command {
  constructor(
    public label: string,
    public usage: string,
    public aliases: string[],
    public executor: (
      label: string,
      args: string[],
      caller?: any,
    ) => Promise<void>,
  ) {}
}
