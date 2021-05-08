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

    change: () => listeners.forEach((cb) => cb(getter())),
  };
};

export type KeyedSource<T> = {
  change: (key: string) => void;
  bind: (key: string, cb: Action<T>) => Subscription<T>;
};

type Subscription<T> = {
  unsub: Action<void>;
  source: Source<T>;
};

//TODO: idea is good, implementation is bad
//rethink implementation
export const keyedSource = <T>(getter: Func1<string, T>): KeyedSource<T> => {
  const listeners: Record<string, Source<T>[] | undefined> = {};

  return {
    bind: (key, cb) => {
      if (!listeners[key]) listeners[key] = [];

      const array = listeners[key]!;
      const src = source(() => getter(key));
      const unsub = src.bind(cb);
      array.push(src);
      return {
        source: src,
        unsub: () => {
          unsub();
          listeners[key] = listeners[key]?.filter((c) => c != src);
        },
      };
    },

    change: (key: string) =>
      listeners[key] && listeners[key]!.forEach((src) => src.change()),
  };
};
