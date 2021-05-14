import Backbone from "backbone";
import Events from "./Events";

describe("Events with subscription to a EventName", () => {
  const callback = jest.fn();
  let events: Events;

  beforeEach(() => {
    callback.mockReset();
    events = new Events();
    events.on("EventName", callback);
  });

  it("callback should not be called without a trigger", () =>
    expect(callback).toHaveBeenCalledTimes(0));

  describe("triggering EventName", () => {
    beforeEach(() => events.trigger("EventName"));

    it("calls a callback", () => expect(callback).toHaveBeenCalledTimes(1));
  });

  describe("triggering NonExistingEventName", () => {
    beforeEach(() => events.trigger("NonExistingEventName"));

    it("does not call a callback", () =>
      expect(callback).toHaveBeenCalledTimes(0));
  });

  describe("when offing from a EventName", () => {
    beforeEach(() => events.off("EventName", callback));

    it("triggering EventName does not call a callback", () => {
      events.trigger("EventName");
      expect(callback).toHaveBeenCalledTimes(0);
    });
  });
});

describe("Having two events a and b", () => {
  const callback = jest.fn();
  const callbackForAnother = jest.fn();
  let a: Events;
  let b: Events;
  beforeEach(() => {
    callback.mockReset();
    callbackForAnother.mockReset();
    a = new Events();
    b = new Events();
  });

  describe("when b listens to a's event 'EventName'", () => {
    beforeEach(() => b.listenTo(a, "EventName", callback));

    it("callback is not yet to be called", () =>
      expect(callback).not.toHaveBeenCalled());

    describe("triggering EventName on a", () => {
      beforeEach(() => a.trigger("EventName"));
      it("triggers callback", () => expect(callback).toHaveBeenCalled());
    });

    describe("triggering AnotherEventName on a", () => {
      beforeEach(() => a.trigger("AnotherEventName"));
      it("does not trigger callback", () =>
        expect(callback).not.toHaveBeenCalled());
    });

    describe("after b stops listen to a", () => {
      beforeEach(() => b.stopListening(a));

      describe("triggering EventName on a", () => {
        beforeEach(() => a.trigger("EventName"));
        it("does not triggers callback", () =>
          expect(callback).not.toHaveBeenCalled());
      });
    });

    describe("when b listens to a's another event 'AnotherEventName'", () => {
      beforeEach(() => b.listenTo(a, "AnotherEventName", callbackForAnother));

      describe("triggering EventName on a", () => {
        beforeEach(() => a.trigger("EventName"));
        it("triggers callback", () =>
          expect(callback).toHaveBeenCalledTimes(1));
      });

      describe("triggering AnotherEventName on a", () => {
        beforeEach(() => a.trigger("AnotherEventName"));
        it("trigger callback", () =>
          expect(callbackForAnother).toHaveBeenCalledTimes(1));
      });
    });
  });
});
