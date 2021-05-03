import Store from "./store";

it("sampole", () => {
  const store = new Store();
  const obs = createObserver(store.onIncrement);
  expect(obs.value).toBe(0);
  store.increment();
  expect(obs.value).toBe(1);
});

//test utils which maybe can be used at render
type Subject<T> = {
  subscribe: (cb: Action<T>) => () => void;
};

type Observer<T> = {
  readonly value: T;
};

const createObserver = <T>(subject: Subject<T>): Observer<T> => {
  //@ts-expect-error
  let value: T = undefined;

  subject.subscribe((val) => (value = val));
  return {
    get value(): T {
      return value;
    },
  };
};
