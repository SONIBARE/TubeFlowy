import { EventsHandler } from "./eventHandler";

type TypeDefinitions = {
  "item-selected": number;
  "item-removed": string;
};

it("subscribing to an event and dispatching it should call subscriber", () => {
  const events = new EventsHandler<TypeDefinitions>();
  const fn = jest.fn();
  events.addEventListener("item-selected", fn);
  events.dispatchEvent("item-selected", 42);
  expect(fn).toHaveBeenCalledWith(42);
});

it("subscribing to an event then unsubscribing and dispatching it should call subscriber", () => {
  const events = new EventsHandler<TypeDefinitions>();
  const fn = jest.fn();
  const unsub = events.addEventListener("item-selected", fn);
  unsub();
  events.dispatchEvent("item-selected", 42);
  expect(fn).not.toHaveBeenCalled();
});

it("subscribing to an event then unsubscribing and dispatching it should remove all events listeners", () => {
  const events = new EventsHandler<TypeDefinitions>();
  const fn = jest.fn();
  const unsub = events.addEventListener("item-selected", fn);
  unsub();
  expect(JSON.stringify(events.events)).toEqual("{}");
});

it("subscribing to an event and dispatching compound event should trigger both general and specific events", () => {
  const events = new EventsHandler<TypeDefinitions>();
  const fn = jest.fn();
  const fn1 = jest.fn();
  events.addEventListener("item-selected", fn);
  events.addCompoundEventListener("item-selected", "id1", fn1);
  events.dispatchCompundEvent("item-selected", "id1", 42);
  expect(fn1).toHaveBeenCalledWith(42);
  expect(fn).toHaveBeenCalledWith(42);
});

it("subscribing to an event and dispatching compound event should trigger both general and specific events", () => {
  const events = new EventsHandler<TypeDefinitions>();
  const selectedCallback = jest.fn();
  const removedCallback = jest.fn();
  events.addEventListener("item-selected", selectedCallback);
  events.addEventListener("item-removed", removedCallback);
  events.dispatchEvent("item-removed", "42");
  expect(removedCallback).toHaveBeenCalledWith("42");
  expect(selectedCallback).not.toHaveBeenCalled();
});
