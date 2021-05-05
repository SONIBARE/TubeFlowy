export type Source<T> = ReadonlySource<T> & {
  change: (value: T) => void;
};

export type ReadonlySource<T> = {
  bind: (cb: Action<T>) => Action<void>;
};

export const mapSource = <TSource, TDestination>(
  source: Source<TSource>,
  mapper: Func1<TSource, TDestination>
): ReadonlySource<TDestination> => {
  return {
    bind: (cb: Action<TDestination>) => {
      return source.bind((v) => cb(mapper(v)));
    },
  };
};

export const source = <T>(initialValue?: T): Source<T> => {
  const listeners: Action<T>[] = [];

  let currentValue: T = initialValue!;
  return {
    bind: (cb) => {
      listeners.push(cb);
      if (typeof currentValue !== "undefined") cb(currentValue);
      return () => listeners.splice(listeners.indexOf(cb), 1);
    },

    change: (newVal: T) => {
      currentValue = newVal;
      listeners.forEach((cb) => cb(newVal));
    },
  };
};

//used only for testing
type Observer<T> = {
  readonly value: T;
  unbind: () => void;
};
export const observer = <T>(subject: Source<T>): Observer<T> => {
  //@ts-expect-error
  let value: T = undefined;

  const unbind = subject.bind((val) => (value = val));
  return {
    get value(): T {
      return value;
    },
    unbind,
  };
};
