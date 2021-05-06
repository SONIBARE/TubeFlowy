export const identity = <T>(a: T) => a;

export function compose(...f1: (() => void)[]): () => void;
export function compose<T>(...fn: ((a: T) => T)[]): (a: T) => T {
  return (a: T) => {
    let res = a;
    fn.reverse().forEach((f) => {
      res = f(res);
    });
    return res;
  };
}
