export type Source<T> = {
  bind: (cb: Action<T>) => Binding;
  change: (value: T) => void;
};

export type Binding = {
  unbind: Action<void>;
};

export const source = <T>(): Source<T> => {
  const listeners: Action<T>[] = [];

  let currentValue: T;
  return {
    bind: (cb) => {
      listeners.push(cb);
      if (currentValue) cb(currentValue);
      return {
        unbind: () => listeners.splice(listeners.indexOf(cb), 1),
      };
    },

    change: (newVal: T) => {
      currentValue = newVal;
      listeners.forEach((cb) => cb(newVal));
    },
  };
};

export const map = <T, T2>(
  src: Source<T>,
  mapper: Func1<T, T2>
): { subject: Source<T2>; subscription: Binding } => {
  const newSource = source<T2>();
  const subscription = src.bind((val) => newSource.change(mapper(val)));
  return { subject: newSource, subscription };
};

//used only for testing
type Observer<T> = {
  readonly value: T;
  unbind: () => void;
};
export const observer = <T>(subject: Source<T>): Observer<T> => {
  //@ts-expect-error
  let value: T = undefined;

  const subscription = subject.bind((val) => (value = val));
  return {
    get value(): T {
      return value;
    },
    unbind: subscription.unbind,
  };
};
