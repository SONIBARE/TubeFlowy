type Callback<T> = T extends void ? () => void : (param: T) => void;

class Events<T = Record<string, any>> {
  events: Record<keyof T, Action<any>[]> = {} as any;

  public trigger = <TKey extends keyof T>(
    eventName: TKey,
    payload: T[TKey]
  ) => {
    const callbacks = this.events[eventName];

    if (callbacks) callbacks.forEach((cb) => cb(payload));
  };

  public on<TKey extends keyof T>(eventName: TKey, cb: Callback<T[TKey]>) {
    if (!this.events[eventName]) this.events[eventName] = [];

    this.events[eventName].push(cb);
  }

  public off<TKey extends keyof T>(eventName: TKey, cb: Callback<T[TKey]>) {
    const callbacks = this.events[eventName];

    if (callbacks) this.events[eventName] = callbacks.filter((c) => c != cb);
  }

  private listeningTo: ListeningTo[] = [];
  public listenTo<TOther, TKey extends keyof TOther>(
    other: Events<TOther>,
    eventName: TKey,
    cb: Callback<TOther[TKey]>
  ) {
    other.on(eventName, cb);
    const info: ListeningInfo = { cb, eventName: eventName as string };

    const alreadyListeningToThisEvent = this.getListeningInfo(other);
    if (alreadyListeningToThisEvent)
      alreadyListeningToThisEvent.listenening.push(info);
    else this.listeningTo.push({ listenening: [info], event: other });
  }

  public stopListening(other: Events) {
    const alreadyListeningToThisEvent = this.getListeningInfo(other);

    if (alreadyListeningToThisEvent)
      alreadyListeningToThisEvent.listenening.forEach((info) =>
        alreadyListeningToThisEvent.event.off(info.eventName, info.cb)
      );
  }
  private getListeningInfo = (other: Events) =>
    this.listeningTo.find(({ event }) => event == other);
}

type ListeningTo = {
  event: Events;

  listenening: ListeningInfo[];
};

type ListeningInfo = {
  eventName: string;
  cb: Action<any>;
};

export default Events;
