export const repeat = <T>(times: number, func: () => T): T[] =>
  Array.from(new Array(times)).map(func);

export const lastArrayItem = <T>(array: T[]): T => array[array.length - 1];
