export type Source<T> = ReadonlySource<T> & {
  change: () => void;
};

export type ReadonlySource<T> = {
  bind: (cb: Action<T>) => Action<void>;
};

export const mapSource = <TSource, TDestination>(
  source: Source<TSource>,
  mapper: Func1<TSource, TDestination>
): ReadonlySource<TDestination> => ({
  bind: (cb: Action<TDestination>) => {
    return source.bind((v) => cb(mapper(v)));
  },
});

export const source = <T>(getter: Func0<T>): Source<T> => {
  const listeners: Action<T>[] = [];

  return {
    bind: (cb) => {
      listeners.push(cb);
      cb(getter());
      return () => listeners.splice(listeners.indexOf(cb), 1);
    },

    change: () => {
      listeners.forEach((cb) => cb(getter()));
    },
  };
};
