export type IProcessGetter = ((res: () => void) => void) | (() => Promise<void>);
