export class EventsHandler<EventPayload> {
  events: EventsContainer<EventPayload> = {};

  addEventListener = (eventName: string, callback: Func<EventPayload>) => {
    if (!this.events[eventName]) this.events[eventName] = [];

    this.events[eventName].push(callback);
  };

  removeEventListener = (eventName: string, callback: Func<EventPayload>) => {
    if (this.events[eventName]) {
      this.events[eventName] = this.events[eventName].filter(
        (cb) => cb != callback
      );
      if (this.events[eventName].length === 0) delete this.events[eventName];
    }
  };

  dispatchEvent = (eventType: string, item: EventPayload) => {
    if (this.events[eventType])
      this.events[eventType].forEach((cb) => cb(item));
  };
}

type EventsContainer<TCallback> = {
  [key: string]: Func<TCallback>[];
};
