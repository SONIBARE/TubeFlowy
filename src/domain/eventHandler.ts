export class EventsHandler<TypeDefinitions> {
  events: EventsContainer<TypeDefinitions> = {} as any;

  addEventListener = <T extends keyof TypeDefinitions>(
    eventName: T,
    callback: (value: TypeDefinitions[T]) => void
  ): EmptyFunc => {
    this.addEventCb(eventName, callback);
    return () => this.removeEventCb(eventName, callback);
  };

  addCompoundEventListener = <T extends keyof TypeDefinitions>(
    eventName: T,
    entityId: string,
    callback: (value: TypeDefinitions[T]) => void
  ): EmptyFunc => {
    this.addEventCb(eventName, callback, entityId);
    return () => this.removeEventCb(eventName, callback, entityId);
  };

  dispatchEvent = <T extends keyof TypeDefinitions>(
    eventType: T,
    item: TypeDefinitions[T]
  ) => {
    this.getEventCbs(eventType).forEach((cb) => cb(item));
  };

  dispatchCompundEvent = <T extends keyof TypeDefinitions>(
    eventType: T,
    entityId: string,
    item: TypeDefinitions[T]
  ) => {
    this.getEventCbs(eventType, entityId).forEach((cb) => cb(item));

    this.dispatchEvent(eventType, item);
  };

  private getEventCbs = <T extends keyof TypeDefinitions>(
    eventType: T,
    entityId = general
  ): ((value: TypeDefinitions[T]) => void)[] =>
    (this.events[eventType] && this.events[eventType][entityId]) || [];

  private addEventCb = (
    eventName: keyof TypeDefinitions,
    cb: Func<any>,
    entityId = general
  ) => {
    if (!this.events[eventName]) this.events[eventName] = {};
    if (!this.events[eventName][entityId])
      //@ts-expect-error
      this.events[eventName][entityId] = [];

    this.events[eventName][entityId].push(cb);
  };

  private removeEventCb = <T extends keyof TypeDefinitions>(
    eventName: T,
    callback: (value: TypeDefinitions[T]) => void,
    entityId = general
  ) => {
    const callbacks = this.getEventCbs(eventName, entityId);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      callbacks.splice(index, 1);

      if (callbacks.length === 0) delete this.events[eventName][entityId];

      if (Object.keys(this.events[eventName]).length === 0)
        delete this.events[eventName];
    }
  };
}
//"kudos" for symbols as indexes https://github.com/microsoft/TypeScript/issues/1863
let general: string = (Symbol("GENERAL_EVENT") as unknown) as string;

type EventDefinition<TEvent> = Record<symbol | string, Func<TEvent>[]>;

type EventsContainer<TCallback> = Record<keyof TCallback, EventDefinition<any>>;
