it.todo("to be integrated");
// import { EventsHandler } from "./eventHandler";

// type TypeDefinitions = {
//   "item-selected": number;
//   "item-removed": string;
// };

// describe("subscribing to an event", () => {
//   let events: EventsHandler<TypeDefinitions>;
//   let itemSelectedCallback: (e: number) => void;
//   let itemItemRemovedCallback: (e: string) => void;
//   beforeEach(() => {
//     events = new EventsHandler<TypeDefinitions>();
//     itemSelectedCallback = jest.fn();
//     itemItemRemovedCallback = jest.fn();
//   });
//   it("dispatching item-selected it should call corresponding callback", () => {
//     events.addEventListener("item-selected", itemSelectedCallback);
//     events.dispatchEvent("item-selected", 42);
//     expect(itemSelectedCallback).toHaveBeenCalledWith(42);
//   });

//   it("unsubscribing and then dispatching selected event should not call callback", () => {
//     const unsub = events.addEventListener(
//       "item-selected",
//       itemSelectedCallback
//     );
//     unsub();
//     events.dispatchEvent("item-selected", 42);
//     expect(itemSelectedCallback).not.toHaveBeenCalled();
//   });

//   it("unsubscribing should remove all events listeners", () => {
//     const unsub = events.addEventListener(
//       "item-selected",
//       itemSelectedCallback
//     );
//     unsub();
//     expect(JSON.stringify(events.events)).toEqual("{}");
//   });

//   it("subscribing to an event and dispatching compound event should trigger both general and specific events", () => {
//     const itemWithId1SelectedCallback = jest.fn();
//     events.addEventListener("item-selected", itemSelectedCallback);
//     events.addCompoundEventListener(
//       "item-selected",
//       "id1",
//       itemWithId1SelectedCallback
//     );
//     events.dispatchCompundEvent("item-selected", "id1", 42);
//     expect(itemSelectedCallback).toHaveBeenCalledWith(42);
//     expect(itemWithId1SelectedCallback).toHaveBeenCalledWith(42);
//   });

//   it("subscribing to an event and dispatching compound event should not trigger other events", () => {
//     const removedCallback = jest.fn();
//     events.addEventListener("item-selected", itemSelectedCallback);
//     events.addEventListener("item-removed", removedCallback);
//     events.dispatchEvent("item-removed", "42");
//     expect(removedCallback).toHaveBeenCalledWith("42");
//     expect(itemSelectedCallback).not.toHaveBeenCalled();
//   });
// });
