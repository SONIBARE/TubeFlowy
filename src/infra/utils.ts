export const repeat = <T>(times: number, func: () => T): T[] =>
  Array.from(new Array(times)).map(func);
