export class SimpleEventListener<TPayload> {
  listeners: Action<TPayload>[] = [];
  constructor(public getPayload: Func0<TPayload>) {}

  subscribe = (cb: Action<TPayload>) => {
    this.listeners.push(cb);
    cb(this.getPayload());
    return () => this.unsubscribe(cb);
  };

  unsubscribe = (cb: Action<TPayload>) =>
    (this.listeners = this.listeners.filter((c) => c != cb));

  notify = () => this.listeners.forEach((c) => c(this.getPayload()));
}

export class KeyedEventListener<TPayload> {
  listeners: Record<string, Action<TPayload>[]> = {};
  add = (key: string, cb: Action<TPayload>) => {
    if (!this.listeners[key]) this.listeners[key] = [];
    this.listeners[key].push(cb);
    return () => this.remove(key, cb);
  };

  remove = (key: string, cb: Action<TPayload>) => {
    this.listeners[key] = this.listeners[key].filter((c) => c != cb);
    if (this.listeners[key].length == 0) delete this.listeners[key];
  };

  call = (key: string, value: TPayload) => {
    this.listeners[key] && this.listeners[key].forEach((c) => c(value));
  };
}
