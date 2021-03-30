export function compose<T>(f1: (a: T) => T, f2: (a: T) => T): (a: T) => T;
export function compose(f1: () => void, f2: () => void): () => void;
export function compose<T>(...fn: ((a: T) => T)[]): (a: T) => T {
  return (a: T) => {
    let res = a;
    fn.reverse().forEach((f) => {
      res = f(res);
    });
    return res;
  };
}
