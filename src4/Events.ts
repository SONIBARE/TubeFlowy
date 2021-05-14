class Events {
  private events: Record<string, Action<void>[]> = {};

  public trigger(eventName: string) {
    const callbacks = this.events[eventName];

    if (callbacks) callbacks.forEach((cb) => cb());
  }

  public on(eventName: string, cb: Action<void>) {
    if (!this.events[eventName]) this.events[eventName] = [];

    this.events[eventName].push(cb);
  }

  public off(eventName: string, cb: Action<void>) {
    const callbacks = this.events[eventName];

    if (callbacks) this.events[eventName] = callbacks.filter((c) => c != cb);
  }

  private listeningTo: ListeningTo[] = [];
  public listenTo(other: Events, eventName: string, cb: Action<void>) {
    other.on(eventName, cb);
    const alreadyListeningToThisEvent = this.getListeningInfo(other);

    const info: ListeningDev = { cb, eventName };
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

  listenening: ListeningDev[];
};

type ListeningDev = {
  eventName: string;
  cb: Action<void>;
};

export default Events;
