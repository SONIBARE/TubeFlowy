export type Source<T> = ReadonlySource<T> & {
  change: () => void;
  hasAnyListeners: () => boolean;
};

export type ReadonlySource<T> = {
  bind: (cb: Action<T>) => Action<void>;
  onChange: (cb: Action<T>) => Action<void>;
};

export const mapSource = <TSource, TDestination>(
  source: Source<TSource>,
  mapper: Func1<TSource, TDestination>
): ReadonlySource<TDestination> => ({
  bind: (cb: Action<TDestination>) => {
    return source.bind((v) => cb(mapper(v)));
  },
  onChange: (cb: Action<TDestination>) => {
    return source.onChange((v) => cb(mapper(v)));
  },
});

export const source = <T>(getter: Func0<T>): Source<T> => {
  const listeners: Action<T>[] = [];

  const res: Source<T> = {
    bind: (cb) => {
      cb(getter());
      return res.onChange(cb);
    },
    onChange: (cb) => {
      listeners.push(cb);
      return () => listeners.splice(listeners.indexOf(cb), 1);
    },
    change: () => listeners.forEach((cb) => cb(getter())),
    hasAnyListeners: () => listeners.length > 0,
  };
  return res;
};

export type KeyedSource<T> = {
  change: (key: string) => void;
  bind: (key: string, cb: Action<T>) => Subscription<T>;
  onChange: (key: string, cb: Action<T>) => Subscription<T>;
};

type Subscription<T> = {
  unsub: Action<void>;
  source: Source<T>;
};

//TODO: idea is good, implementation is not
//rethink implementation
export const keyedSource = <T>(getter: Func1<string, T>): KeyedSource<T> => {
  const listeners: Record<string, Source<T> | undefined> = {};

  return {
    bind: (key, cb) => {
      if (!listeners[key]) listeners[key] = source(() => getter(key));

      const src = listeners[key]!;
      const unsub = src.bind(cb);
      return {
        source: src,
        unsub,
      };
    },
    onChange: (key, cb) => {
      if (!listeners[key]) listeners[key] = source(() => getter(key));

      const src = listeners[key]!;
      const unsub = src.onChange(cb);
      return {
        source: src,
        unsub,
      };
    },

    change: (key: string) => listeners[key]?.change(),
  };
};
